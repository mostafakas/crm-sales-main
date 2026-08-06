"use client";

/**
 * Fixed-sheet paginator.
 *
 * Turns the section list from {@link buildProposalSections} into an ordered
 * array of FIXED-size physical sheets (1240×698 PowerPoint / 1240×1754 A4).
 * Flow-section blocks are measured in a hidden container and greedily packed
 * onto sheets, breaking only at block boundaries. A section's heading is
 * repeated at the top of every sheet it spans.
 *
 *  - Landscape: Step-2 length caps keep each section to one sheet (Service
 *    Details may add a continuation sheet).
 *  - Portrait: blocks flow across as many sheets as the content needs.
 */

import * as React from "react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  pageHeightFor,
  pageAspectFor,
  isLandscape,
  directionFor,
  primaryVariant,
  PAGE_WIDTH,
  type ProposalLangVariant,
} from "@/lib/proposal-layout";
import type { ProposalDraft } from "@/lib/types/proposal-draft";
import { resolveDraftForVariant } from "@/lib/proposal-variant";
import {
  buildProposalSections,
  TopBar,
  FooterBar,
  SectionTitle,
  type SectionDef,
  type SectionBlock,
} from "./pages";

export interface PhysicalSheet {
  id: string;
  node: React.ReactNode;
}

interface Geometry {
  landscape: boolean;
  sheetH: number;
  pad: number;
  contentWidth: number;
  contentStart: number; // top bar + gap before content
  footerReserve: number;
  contentPadTop: number;
  gapAfterTitle: number;
  blockGap: number;
}

function geometryFor(draft?: ProposalDraft): Geometry {
  const landscape = isLandscape(draft?.dimensions);
  const sheetH = pageHeightFor(draft?.dimensions);
  const pad = landscape ? 56 : 64;
  return {
    landscape,
    sheetH,
    pad,
    contentWidth: PAGE_WIDTH - pad * 2,
    contentStart: landscape ? 100 : 136,
    footerReserve: landscape ? 80 : 96,
    contentPadTop: landscape ? 26 : 44,
    gapAfterTitle: landscape ? 24 : 28,
    blockGap: landscape ? 16 : 20,
  };
}

/* ─── Cover/heading content derived from the draft ─────────────────── */

function coverProps(draft: ProposalDraft, variant: ProposalLangVariant) {
  const arOverrides = draft.arOverrides ?? {};
  const pick = (path: string, base: string) =>
    variant === "arabic" ? arOverrides[path]?.trim() || base : base;
  const today = format(new Date(), "MMMM dd, yyyy");
  const validTill = format(addDays(new Date(), draft.validityDays || 14), "MMMM dd, yyyy");
  return {
    headline: pick("headline", draft.headline) || "Website Project Proposal",
    subtitle:
      pick("shortDescription", draft.shortDescription) ||
      "Development of a new full website for client's real-estate company",
    client: draft.client?.name || "Client Name",
    date: today,
    validTill: `${validTill} · ${draft.validityDays || 14} Days`,
    aspect: pageAspectFor(draft.dimensions),
  };
}

/* ─── The single fixed sheet ───────────────────────────────────────── */

function Sheet({
  geo,
  pageNumber,
  total,
  hero,
  title,
  titleNode,
  blocks,
}: {
  geo: Geometry;
  pageNumber: number;
  total: number;
  hero?: React.ReactNode;
  title?: string;
  titleNode?: React.ReactNode;
  blocks?: SectionBlock[];
}) {
  const { landscape, sheetH, pad, contentPadTop, gapAfterTitle, blockGap, footerReserve } = geo;

  if (hero) {
    return (
      <div style={{ width: PAGE_WIDTH, height: sheetH, overflow: "hidden", background: "white" }}>
        {hero}
      </div>
    );
  }

  const heading = titleNode ?? (title ? <SectionTitle landscape={landscape}>{title}</SectionTitle> : null);

  /* Landscape sections are one section per sheet and should fill the sheet
   * vertically (matching the Figma references, where cards/columns stretch to
   * the footer). Portrait pages flow their blocks from the top. */
  const fill = landscape;

  return (
    <div
      className="relative flex flex-col"
      style={{ width: PAGE_WIDTH, height: sheetH, overflow: "hidden", background: "white" }}>
      <TopBar landscape={landscape} />
      <div
        className="flex flex-col flex-1 min-h-0"
        style={{
          paddingLeft: pad,
          paddingRight: pad,
          paddingTop: contentPadTop,
          paddingBottom: footerReserve,
        }}>
        {heading ? <div style={{ marginBottom: gapAfterTitle }}>{heading}</div> : null}
        <div
          className={cn("flex flex-col", fill && "flex-1 min-h-0 overflow-hidden")}
          style={{ gap: blockGap }}>
          {blocks?.map((b) => (
            <div key={b.key} className={cn(fill && "flex-1 min-h-0 flex flex-col")}>
              {b.node}
            </div>
          ))}
        </div>
      </div>
      <FooterBar page={pageNumber} total={total} landscape={landscape} />
    </div>
  );
}

/* ─── Height measurer (hidden) ─────────────────────────────────────── */

interface MeasureItem {
  id: string;
  node: React.ReactNode;
}

function HeightMeasurer({
  items,
  width,
  onMeasured,
}: {
  items: MeasureItem[];
  width: number;
  onMeasured: (heights: Record<string, number>) => void;
}) {
  const refs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  React.useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, number> = {};
      refs.current.forEach((el, id) => {
        next[id] = el.offsetHeight;
      });
      onMeasured(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
    // `items` is memoised by the caller (stable until the draft changes).
  }, [items, width, onMeasured]);

  return (
    /* A zero-size, clipped containing block so the (very tall) absolutely
     * positioned measurer never contributes to the page's scroll height. */
    <div
      aria-hidden
      style={{ position: "relative", width: 0, height: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width,
          visibility: "hidden",
          pointerEvents: "none",
        }}>
        {items.map((it) => (
          <div
            key={it.id}
            ref={(el) => {
              if (el) refs.current.set(it.id, el);
              else refs.current.delete(it.id);
            }}>
            {it.node}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Packing ──────────────────────────────────────────────────────── */

interface PackedPage {
  sectionId: string;
  hero?: React.ReactNode;
  title?: string;
  titleNode?: React.ReactNode;
  blocks?: SectionBlock[];
}

function packSections(
  sections: SectionDef[],
  heights: Record<string, number>,
  geo: Geometry,
): PackedPage[] {
  const bodyHeight = geo.sheetH - geo.contentStart - geo.footerReserve;
  const pages: PackedPage[] = [];

  for (const sec of sections) {
    if (sec.hero) {
      pages.push({ sectionId: sec.id, hero: sec.hero });
      continue;
    }
    const blocks = sec.blocks ?? [];
    const hasHeading = !!(sec.title || sec.titleNode);
    const titleH = hasHeading ? heights[`title:${sec.id}`] ?? 0 : 0;
    const avail = bodyHeight - (hasHeading ? titleH + geo.gapAfterTitle : 0);

    let cur: SectionBlock[] = [];
    let used = 0;
    const flush = () => {
      pages.push({
        sectionId: sec.id,
        title: sec.title,
        titleNode: sec.titleNode,
        blocks: cur,
      });
      cur = [];
      used = 0;
    };

    for (const block of blocks) {
      const h = heights[`${sec.id}:${block.key}`] ?? 0;
      const needed = (cur.length ? geo.blockGap : 0) + h;
      if (cur.length && used + needed > avail) flush();
      cur.push(block);
      used += cur.length === 1 ? h : geo.blockGap + h;
    }
    /* Always emit at least one page per section (even before measurement). */
    flush();
  }

  return pages;
}

/* ─── Public hook ──────────────────────────────────────────────────── */

/**
 * Measures + packs a draft into fixed-size sheets.
 *
 * Returns the sheet array plus a `measurer` node that MUST be rendered
 * somewhere in the tree (it is visually hidden) so block heights stay in
 * sync with fonts/content.
 */
export function useProposalSheets(
  draft?: ProposalDraft,
  variant?: ProposalLangVariant,
): { sheets: PhysicalSheet[]; measurer: React.ReactNode } {
  const resolvedVariant = variant ?? primaryVariant(draft?.language);
  const geo = React.useMemo(() => geometryFor(draft), [draft]);
  const dir = directionFor(resolvedVariant);

  /* Localize the draft for the rendered variant so the Arabic proposal
   * shows Arabic copy (and the English one shows English). */
  const localized = React.useMemo(
    () => (draft ? resolveDraftForVariant(draft, resolvedVariant) : undefined),
    [draft, resolvedVariant],
  );

  const sections = React.useMemo(
    () =>
      localized
        ? buildProposalSections(localized, {
            landscape: geo.landscape,
            cover: coverProps(localized, resolvedVariant),
          })
        : [],
    [localized, geo.landscape, resolvedVariant],
  );

  /* Flat list of every measurable node (block + heading). */
  const measureItems = React.useMemo<MeasureItem[]>(() => {
    const items: MeasureItem[] = [];
    for (const sec of sections) {
      if (sec.hero) continue;
      if (sec.title || sec.titleNode) {
        items.push({
          id: `title:${sec.id}`,
          node: sec.titleNode ?? <SectionTitle landscape={geo.landscape}>{sec.title}</SectionTitle>,
        });
      }
      for (const b of sec.blocks ?? []) {
        items.push({ id: `${sec.id}:${b.key}`, node: b.node });
      }
    }
    return items;
  }, [sections, geo.landscape]);

  const [heights, setHeights] = React.useState<Record<string, number>>({});

  const handleMeasured = React.useCallback((next: Record<string, number>) => {
    setHeights((prev) => {
      const keys = Object.keys(next);
      let changed = keys.length !== Object.keys(prev).length;
      if (!changed) {
        for (const k of keys) {
          if (Math.abs((prev[k] ?? -1) - next[k]!) > 0.5) {
            changed = true;
            break;
          }
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const packed = React.useMemo(() => packSections(sections, heights, geo), [sections, heights, geo]);
  const total = packed.length;

  const sheets = React.useMemo<PhysicalSheet[]>(
    () =>
      packed.map((pg, i) => ({
        id: `${pg.sectionId}-${i}`,
        node: (
          <div dir={dir}>
            <Sheet
              geo={geo}
              pageNumber={i + 1}
              total={total}
              hero={pg.hero}
              title={pg.title}
              titleNode={pg.titleNode}
              blocks={pg.blocks}
            />
          </div>
        ),
      })),
    [packed, geo, dir, total],
  );

  const measurer = (
    <HeightMeasurer items={measureItems} width={geo.contentWidth} onMeasured={handleMeasured} />
  );

  return { sheets, measurer };
}
