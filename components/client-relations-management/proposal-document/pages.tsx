"use client";

/**
 * Proposal sections — pixel-match the Figma reference designs in
 * `figma-references/proposal-sections/{landscape,protrait}`.
 *
 * Every page renders onto a FIXED-size sheet (1240×698 for PowerPoint /
 * 1240×1754 for A4). Instead of returning whole pages, each section now
 * exposes an ordered list of "blocks". The paginator
 * ({@link useProposalPages}) measures those blocks and packs them onto as
 * many fixed sheets as needed, breaking only at block boundaries:
 *
 *  - Landscape: Step-2 length caps keep each section to a single block that
 *    fits one sheet. Service Details may add a "What We Deliver"
 *    continuation block when it overflows.
 *  - Portrait: there are no caps — every section's blocks flow across as
 *    many A4 sheets as the content needs.
 *
 * This file owns the visual building blocks and the section builder; the
 * page chrome (top bar, footer, section title) and the measuring/packing
 * live in `proposal-paginator.tsx`.
 */

import * as React from "react";
import {
  Award,
  Sparkles,
  Clock,
  Globe,
  Users2,
  Rocket,
  RefreshCcw,
  Activity,
  BarChart3,
  UserCog,
  Mail,
  Phone,
  Check,
  ArrowUpRight,
  ArrowRight,
  Quote,
  Star,
  Hourglass,
  Info,
  Box,
  HelpCircle,
  Calendar as CalendarIcon,
  Ticket,
  Headphones,
  PenSquare,
  ThumbsUp,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProposalDraft } from "@/lib/types/proposal-draft";

/* ─── Brand palette ────────────────────────────────────────────────── */

export const BLUE = "#0047FF";
const GREEN = "#0AA92A";
const RED = "#F60F13";
const ORANGE = "#F6960F";

export const FOOTER_ADDRESS =
  "ALmaster Rise Adress: Riyadh, Thumamah Road, Al Yasmin District, Phone: +966582700000,";
export const FOOTER_CONTACT =
  "CR No: 7050123798, Email: saudi@almaster.tech, Website: almaster.tech";

/* ─── Section-def contract (consumed by the paginator) ─────────────── */

export interface SectionBlock {
  key: string;
  node: React.ReactNode;
}

export interface SectionDef {
  id: string;
  /** Full-bleed hero sheet (cover / thank-you); not paginated. */
  hero?: React.ReactNode;
  /** Heading shown at the top of every page of a flow section. */
  title?: string;
  /** Custom heading node (overrides {@link title}); repeats per page. */
  titleNode?: React.ReactNode;
  /** Ordered, individually-breakable blocks. */
  blocks?: SectionBlock[];
}

/* ─── Brand marks ──────────────────────────────────────────────────── */

/** The AlMaster "A" mark (recoloured copy of `almaster-min-log.svg`). */
export function AMark({
  size = 26,
  color = BLUE,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.80664 0.0714681C5.80664 0.11828 6.06299 0.97129 6.38101 1.94839C8.18065 7.56428 8.99502 10.078 9.79379 12.5679C10.2827 14.0882 10.756 15.4613 10.8489 15.6084C11.0659 15.9651 11.5548 16.3373 11.9583 16.4614C12.3305 16.5699 16.1237 16.7096 16.1237 16.6086C16.1237 16.5543 12.8195 6.26099 11.5778 2.45217C11.1045 1.00918 10.8875 0.659957 10.2203 0.318901C9.75515 0.0863301 9.61546 0.0707258 7.4978 0.0164839C6.18708 -0.0139807 5.80664 -0.00580801 5.80664 0.0714681Z"
        fill={color}
      />
      <path
        d="M2.37804 9.70652C0.330219 10.428 -0.577032 12.7084 0.384461 14.6945C0.617033 15.1679 1.47821 16.0365 1.92775 16.2534C4.37904 17.4245 7.12532 15.7571 7.12532 13.1044C7.12532 12.0575 6.8385 11.3278 6.14822 10.6063C5.42673 9.85364 4.62796 9.52002 3.5186 9.52002C3.06832 9.52002 2.75773 9.57426 2.37804 9.70652Z"
        fill={color}
      />
    </svg>
  );
}

/** Logo lockup for the dark hero pages: A mark + ALMASTER wordmark. */
function BrandLockup({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2 text-white">
      <AMark size={size} color="#FFFFFF" />
      <span
        className="font-bold tracking-[0.18em]"
        style={{ fontSize: size * 0.72 }}>
        ALMASTER
      </span>
    </div>
  );
}

export function Vision2030({ size = 40 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/proposal-assets/2030-vision.svg"
      alt="Vision 2030"
      style={{ height: size, width: "auto" }}
    />
  );
}

/** Approximation of the Saudi Riyal symbol used in the quotation. */
function Riyal({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block -translate-y-px", className)}>
      <path d="M7 4v10.5a3.5 3.5 0 0 0 3.5 3.5" />
      <path d="M14 3v11" />
      <path d="M4.5 12 20 8.6" />
      <path d="M5.5 16 21 12.6" />
    </svg>
  );
}

/* ─── Page chrome (used by the paginator) ──────────────────────────── */

export function TopBar({ landscape }: { landscape: boolean }) {
  const pad = landscape ? 56 : 64;
  return (
    <div
      className="flex items-center gap-4"
      style={{
        paddingLeft: pad,
        paddingRight: pad,
        paddingTop: landscape ? 36 : 48,
      }}>
      <AMark size={landscape ? 26 : 30} />
      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#0047FF]/10 via-[#0047FF] to-[#0047FF]/10" />
      <Vision2030 size={landscape ? 38 : 44} />
    </div>
  );
}

export function FooterBar({
  page,
  total,
  landscape,
}: {
  page: number;
  total: number;
  landscape: boolean;
}) {
  const pad = landscape ? 56 : 64;
  return (
    <div
      className="absolute bottom-7 inset-x-0"
      style={{ paddingLeft: pad, paddingRight: pad }}>
      <div
        className="h-px bg-[#E5E9EF] w-full"
        style={{ marginBottom: landscape ? 14 : 16 }}
      />
      <div className="flex items-end justify-between">
        <div
          className="flex flex-col gap-0.5 text-[#707070] leading-tight"
          style={{ fontSize: landscape ? 11 : 12 }}>
          <span>{FOOTER_ADDRESS}</span>
          <span>{FOOTER_CONTACT}</span>
        </div>
        <span
          className="font-bold text-[#0047FF]"
          style={{ fontSize: landscape ? 12 : 14 }}>
          {String(page).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function SectionTitle({
  children,
  landscape,
}: {
  children: React.ReactNode;
  landscape: boolean;
}) {
  return (
    <div className={cn("flex flex-col", landscape ? "gap-2" : "gap-2.5")}>
      <h2
        className="font-bold text-[#0047FF] tracking-tight leading-none"
        style={{ fontSize: landscape ? 30 : 40 }}>
        {children}
      </h2>
      <div
        className="h-0.5 bg-gradient-to-r from-[#0047FF]/10 via-[#0047FF] to-[#0047FF]/10 rounded-full"
        style={{ width: landscape ? 150 : 200 }}
      />
    </div>
  );
}

/* ─── Prose helpers ────────────────────────────────────────────────── */

/**
 * Renders authored rich-text HTML from the TipTap editor. Inline styles the
 * editor emits (text color via `<span style="color">`, alignment via
 * `style="text-align"`) are preserved by the browser; everything else
 * (headings, lists, blockquote, marks) is styled here so the proposal matches
 * the editor's read-mode exactly.
 */
function HtmlBody({
  html,
  className,
  size,
}: {
  html: string;
  className?: string;
  size: number;
}) {
  return (
    <div
      className={cn(
        "text-[#707070] leading-[1.7]",
        "[&_strong]:font-bold [&_strong]:text-[#343434] [&_b]:font-bold [&_b]:text-[#343434]",
        "[&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through",
        "[&_h1]:font-bold [&_h1]:text-[#343434] [&_h1]:text-[1.5em] [&_h1]:leading-tight [&_h1]:my-1",
        "[&_h2]:font-bold [&_h2]:text-[#343434] [&_h2]:text-[1.25em] [&_h2]:leading-tight [&_h2]:my-1",
        "[&_h3]:font-bold [&_h3]:text-[#343434] [&_h3]:text-[1.1em] [&_h3]:leading-tight [&_h3]:my-0.5",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-0.5 [&_li]:marker:text-[#707070]",
        "[&_a]:text-[#0047ff] [&_a]:underline",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-[#0047ff]/40 [&_blockquote]:pl-3 [&_blockquote]:italic",
        "[&_p]:mb-1 [&_p:last-child]:mb-0",
        className,
      )}
      style={{ fontSize: size }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Body({
  text,
  className,
  size = 12,
}: {
  text: string;
  className?: string;
  size?: number;
}) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  if (isHtml) return <HtmlBody html={text} className={className} size={size} />;
  return (
    <p
      className={cn(
        "text-[#707070] leading-[1.7] whitespace-pre-line",
        className,
      )}
      style={{ fontSize: size }}>
      {text}
    </p>
  );
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function Bullets({
  items,
  size = 12,
  gap = "gap-1.5",
}: {
  items: string[];
  size?: number;
  gap?: string;
}) {
  return (
    <ul
      className={cn("flex flex-col text-[#707070] leading-[1.6]", gap)}
      style={{ fontSize: size }}>
      {items.map((l, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] size-[3px] rounded-full bg-[#707070] shrink-0" />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders a list-style field. Rich-text (TipTap HTML) is rendered via
 * {@link HtmlBody} so formatting/colors apply; legacy plain text falls back
 * to the styled {@link Bullets}.
 */
function RichList({
  text,
  size = 12,
  gap,
}: {
  text: string;
  size?: number;
  gap?: string;
}) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  if (isHtml) return <HtmlBody html={text} size={size} />;
  return <Bullets items={lines(text)} size={size} gap={gap} />;
}

/* ─── Hero: Cover ──────────────────────────────────────────────────── */

export function CoverPage({
  headline,
  subtitle,
  client,
  date,
  validTill,
  aspect = "1240 / 698",
  landscape,
}: {
  headline: string;
  subtitle: string;
  client: string;
  date: string;
  validTill: string;
  market?: string;
  aspect?: string;
  landscape: boolean;
}) {
  const pad = landscape ? 64 : 56;
  return (
    <div
      className="relative w-full h-full text-white overflow-hidden"
      style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/proposal-assets/cover-page.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <HeroTopBar pad={pad} landscape={landscape} />
      <div
        className="absolute flex flex-col"
        style={{
          left: pad,
          right: pad,
          top: "50%",
          transform: "translateY(-46%)",
          gap: landscape ? 18 : 22,
        }}>
        <BrandLockup size={landscape ? 22 : 24} />
        <div
          dir="rtl"
          className="font-bold text-white/95"
          style={{ fontSize: landscape ? 16 : 18 }}>
          الشغل الزين .. يبيله ماستر
        </div>
        <h1
          className="font-bold leading-[1.04]"
          style={{
            fontSize: landscape ? 64 : 56,
            maxWidth: landscape ? "70%" : "90%",
          }}>
          {headline}
        </h1>
        <p
          className="text-white/90 leading-snug"
          style={{
            fontSize: landscape ? 15 : 16,
            maxWidth: landscape ? "60%" : "92%",
          }}>
          {subtitle}
        </p>
        <div className="flex flex-wrap mt-4" style={{ gap: 10 }}>
          <CoverChip icon={Users2} label={`Prepared For: ${client}`} />
          <CoverChip icon={CalendarIcon} label={`Date: ${date}`} />
          <CoverChip icon={Hourglass} label={`Valid Till: ${validTill}`} />
        </div>
      </div>
      <HeroFooter pad={pad} landscape={landscape} />
    </div>
  );
}

/** Footer strip shown on the cover & thank-you hero sheets. */
function HeroFooter({ pad, landscape }: { pad: number; landscape: boolean }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4"
      style={{
        paddingLeft: pad,
        paddingRight: pad,
        paddingBottom: landscape ? 28 : 32,
      }}>
      <div
        className="flex flex-col gap-0.5 text-white/65 leading-tight"
        style={{ fontSize: landscape ? 11 : 12 }}>
        <span>{FOOTER_ADDRESS}</span>
        <span>{FOOTER_CONTACT}</span>
      </div>
      <div
        dir="rtl"
        className="text-white/65 font-bold whitespace-nowrap shrink-0"
        style={{ fontSize: landscape ? 11 : 12 }}>
        الشغل الزين .. يبيله ماستر
      </div>
    </div>
  );
}

/** Top bar on the hero sheets: A mark + faded line + (white) Vision 2030. */
function HeroTopBar({ pad, landscape }: { pad: number; landscape: boolean }) {
  return (
    <div
      className="absolute inset-x-0 flex items-center gap-4"
      style={{ top: landscape ? 36 : 44, paddingLeft: pad, paddingRight: pad }}>
      <AMark size={landscape ? 26 : 30} color="#FFFFFF" />
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-white/50 to-white/10" />
      <div style={{ filter: "brightness(0) invert(1)" }}>
        <Vision2030 size={landscape ? 38 : 44} />
      </div>
    </div>
  );
}

function CoverChip({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-bold leading-none text-white bg-white/10 backdrop-blur-md rounded-[10px] px-4 py-3 ring-1 ring-white/25">
      <span className="size-5 rounded-md bg-white/15 flex items-center justify-center">
        <Icon className="size-3" strokeWidth={2.4} />
      </span>
      {label}
    </span>
  );
}

/* ─── Hero: Thank You ──────────────────────────────────────────────── */

interface ContactRegion {
  country: string;
  coming?: boolean;
  email?: string;
  phone?: string;
  address?: string;
}

const CONTACT_REGIONS: ContactRegion[] = [
  {
    country: "Saudi Arabia",
    email: "Saudi@almaster.tech",
    phone: "+966582700000",
    address:
      "13322 Al-Thumama Road, Al-Yasmin District, Imam Saud Bin Faisal Road, Riyadh",
  },
  {
    country: "Egypt",
    email: "Egypt@almaster.tech",
    phone: "+201553838255",
    address:
      "11835, 2nd Floor, Inside The Capital Mall, Fifth Settlement, New Cairo",
  },
];

function ContactPill({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="bg-white/[0.07] ring-1 ring-white/15 rounded-[10px] px-3 py-2.5 flex items-center gap-2.5 min-w-0">
      <span className="size-7 rounded-[8px] bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="size-3.5 text-white/85" strokeWidth={2.2} />
      </span>
      <span className="text-[12px] text-white/90 truncate">{text}</span>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[20px] font-bold text-white">Contact us</h3>
      <ContactPill icon={Globe} text="https://almaster.tech" />
      {CONTACT_REGIONS.map((r) => (
        <div key={r.country} className="flex flex-col gap-2">
          <span className="text-[18px] font-bold text-white">{r.country}</span>
          <div className="grid grid-cols-2 gap-2">
            <ContactPill icon={Mail} text={r.email!} />
            <ContactPill icon={Phone} text={r.phone!} />
          </div>
          <ContactPill icon={MapPin} text={r.address!} />
        </div>
      ))}
    </div>
  );
}

export function ThankYouPage({
  aspect = "1240 / 698",
  landscape,
}: {
  draft?: ProposalDraft;
  aspect?: string;
  landscape: boolean;
}) {
  const pad = landscape ? 64 : 56;
  return (
    <div
      className="relative w-full h-full text-white overflow-hidden"
      style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/proposal-assets/cover-page.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <HeroTopBar pad={pad} landscape={landscape} />

      {landscape ? (
        <div
          className="absolute inset-x-0 flex items-start justify-between gap-10"
          style={{
            top: "52%",
            transform: "translateY(-44%)",
            paddingLeft: pad,
            paddingRight: pad,
          }}>
          <div className="flex flex-col gap-4 max-w-[46%]">
            <BrandLockup size={landscape ? 22 : 24} />
            <div dir="rtl" className="text-[16px] font-bold text-white/95">
              الشغل الزين .. يبيله ماستر
            </div>
            <h1 className="text-[68px] font-bold leading-none">Thank You!</h1>
            <p className="text-[15px] text-white/85 leading-snug">
              We&apos;re Excited To Begin Your Digital Transformation Journey.!
            </p>
          </div>
          <div className="w-[46%]">
            <ContactPanel />
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-x-0 flex flex-col gap-8"
          style={{ top: "30%", paddingLeft: pad, paddingRight: pad }}>
          <div className="flex flex-col gap-4">
            <BrandLockup size={24} />
            <div dir="rtl" className="text-[18px] font-bold text-white/95">
              الشغل الزين .. يبيله ماستر
            </div>
            <h1 className="text-[64px] font-bold leading-none">Thank You!</h1>
            <p className="text-[16px] text-white/85 leading-snug max-w-[80%]">
              We&apos;re Excited To Begin Your Digital Transformation Journey.!
            </p>
          </div>
          <ContactPanel />
        </div>
      )}
      <HeroFooter pad={pad} landscape={landscape} />
    </div>
  );
}

/* ─── About blocks ─────────────────────────────────────────────────── */

function AboutCard({
  title,
  body,
  size,
}: {
  title: string;
  body: string;
  size: number;
}) {
  return (
    <div className="rounded-[14px] bg-[#EDF2F7] border-l-[4px] border-[#0047FF] p-5 flex flex-col gap-2">
      <h3 className="font-bold text-[#0047FF]" style={{ fontSize: size + 3 }}>
        {title}
      </h3>
      <Body text={body} size={size} />
    </div>
  );
}

function AboutHero({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[16px]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl || "/proposal-assets/about-skyline.jpeg"}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001a66]/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white">
        <BrandLockup size={22} />
        <div dir="rtl" className="text-[16px] font-bold drop-shadow">
          الشغل الزين .. يبيله ماستر
        </div>
      </div>
    </div>
  );
}

/* ─── Core Values + Key Facts + Certifications ─────────────────────── */

const CORE_VALUE_ICONS: Record<string, React.ElementType> = {
  innovation: Rocket,
  excellence: Award,
  relationships: Globe,
  trust: Award,
  quality: Award,
};

function keyFactIconFor(label: string): React.ElementType {
  const l = label.toLowerCase();
  if (l.includes("experience") || l.includes("year")) return Clock;
  if (l.includes("partner")) return Globe;
  if (l.includes("expert") || l.includes("team")) return Users2;
  return Rocket;
}

function CoreValuesCard({
  draft,
  big,
}: {
  draft: ProposalDraft;
  big: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-[#EDF2F7] rounded-[16px] flex flex-col",
        big ? "p-6 gap-4" : "p-5 gap-3",
      )}>
      <h3
        className="font-bold text-[#0047FF]"
        style={{ fontSize: big ? 24 : 20 }}>
        Our Core Values
      </h3>
      <div className={cn("flex flex-col", big ? "gap-3" : "gap-2.5")}>
        {draft.about.coreValues.map((cv) => {
          const Icon = CORE_VALUE_ICONS[cv.icon] ?? Sparkles;
          return (
            <div
              key={cv.id}
              className={cn(
                "bg-white rounded-[12px] flex items-start shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
                big ? "p-4 gap-3.5" : "p-3 gap-3",
              )}>
              <div
                className={cn(
                  "rounded-[10px] bg-[#0047FF] text-white flex items-center justify-center shrink-0",
                  big ? "size-11" : "size-9",
                )}>
                <Icon className={big ? "size-5" : "size-4"} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h4
                  className="font-bold text-[#0047FF] uppercase tracking-wide"
                  style={{ fontSize: big ? 14 : 13 }}>
                  {cv.headline}
                </h4>
                <p
                  className="text-[#707070] leading-snug"
                  style={{ fontSize: big ? 13 : 11 }}>
                  {cv.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeyFactsCard({ draft, big }: { draft: ProposalDraft; big: boolean }) {
  const a = draft.about;
  return (
    <div
      className={cn(
        "bg-[#0047FF] rounded-[16px] flex flex-col text-white",
        big ? "p-6 gap-4" : "p-5 gap-3",
      )}>
      <h3 className="font-bold" style={{ fontSize: big ? 24 : 20 }}>
        Key Facts
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {a.keyFacts.slice(0, 4).map((kf) => {
          const Icon = keyFactIconFor(kf.label);
          return (
            <div
              key={kf.id}
              className={cn(
                "bg-white/10 rounded-[12px] flex items-center gap-3 ring-1 ring-white/15",
                big ? "p-4" : "p-3",
              )}>
              <div
                className={cn(
                  "rounded-[10px] bg-white/10 ring-1 ring-white/25 flex items-center justify-center shrink-0",
                  big ? "size-11" : "size-9",
                )}>
                <Icon className={big ? "size-5" : "size-4"} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className="font-bold leading-none"
                  style={{ fontSize: big ? 22 : 18 }}>
                  {kf.value}
                </span>
                <span
                  className="text-white/80 leading-tight"
                  style={{ fontSize: big ? 12 : 11 }}>
                  {kf.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={cn(
          "bg-white/5 rounded-[14px] ring-1 ring-white/15 flex items-center justify-between gap-4",
          big ? "mt-1 p-4" : "p-3",
        )}>
        <div className={cn("flex flex-col flex-1", big ? "gap-2" : "gap-1.5")}>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 rounded-md px-2.5 py-1 self-start">
            Trust
          </span>
          <span
            className="font-bold uppercase tracking-wide leading-tight"
            style={{ fontSize: big ? 18 : 15 }}>
            Trusted by Saudi Business Center
          </span>
          <span className="text-[12px] font-bold inline-flex items-center gap-1.5 text-white">
            <ArrowRight className="size-3.5" strokeWidth={2.4} /> Check Now
          </span>
        </div>
        <div
          className={cn(
            "bg-white rounded-[12px] p-2 flex items-center justify-center shrink-0",
            big ? "w-[150px] h-[78px]" : "w-[130px] h-[64px]",
          )}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/proposal-assets/saudi-business-center.svg"
            alt="Saudi Business Center"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function CertificationsCard({
  draft,
  cols,
}: {
  draft: ProposalDraft;
  cols: number;
}) {
  const certs = draft.about.certifications.filter((c) => c.visible);
  const compact = cols >= 3;
  return (
    <div
      className={cn(
        "bg-[#0047FF] rounded-[16px] flex flex-col text-white",
        compact ? "p-5 gap-3" : "p-6 gap-4",
      )}>
      <h3 className="font-bold text-[20px]">Certifications</h3>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {certs.map((cert) => (
          <div
            key={cert.id}
            className={cn(
              "bg-white rounded-[12px] flex items-center gap-3",
              compact ? "p-2.5" : "p-3",
            )}>
            <div
              className={cn(
                "rounded-[8px] bg-white border border-[#EDF2F7] flex items-center justify-center p-1 shrink-0",
                compact ? "size-10" : "size-12",
              )}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/proposal-assets/certifications/ISO 2015 1.svg"
                alt=""
                className="size-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[12px] font-bold text-[#0047FF] uppercase tracking-tight leading-tight">
                {cert.title}
              </span>
              <div className="flex justify-between gap-2 text-[10px] text-[#9a9a9a]">
                <span>By: {cert.issuer}</span>
                <span>Date: {cert.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Experts ──────────────────────────────────────────────────────── */

function ExpertCard({
  ex,
  landscape,
}: {
  ex: ProposalDraft["about"]["experts"][number];
  landscape: boolean;
}) {
  const photo = landscape ? 118 : 130;
  return (
    <div className="bg-[#EDF2F7] rounded-[14px] p-3 flex gap-3">
      <div
        className="relative rounded-[12px] overflow-hidden shrink-0 bg-gradient-to-br from-[#0047FF]/30 to-[#9359FF]/20"
        style={{ width: photo, height: photo }}>
        {ex.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ex.avatar} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full flex items-center justify-center font-bold text-[#0047FF] text-[28px]">
            {ex.name.charAt(0)}
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-4 flex flex-col text-white">
          <span className="text-[11px] font-bold leading-tight">{ex.name}</span>
          <span className="text-[9px] leading-tight text-white/85">
            {ex.role}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-[#0047FF] uppercase tracking-tight">
            Key Expertise:
          </span>
          <span className="text-[10px] font-bold text-[#0047FF] inline-flex items-center gap-1 shrink-0">
            View Profile <ArrowUpRight className="size-3" strokeWidth={2.4} />
          </span>
        </div>
        <ul
          className="flex flex-col gap-1 text-[#707070] leading-snug"
          style={{ fontSize: landscape ? 10 : 11 }}>
          {ex.expertise.slice(0, 5).map((e, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="mt-[6px] size-[3px] rounded-full bg-[#0047FF] shrink-0" />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Brands / Partners ────────────────────────────────────────────── */

/** Brand logos (order follows the reference "Brands Trust Us" grid). */
const BRAND_LOGOS: { name: string; src: string }[] = [
  "tantel",
  "mayiah",
  "women",
  "tybina-al-qama",
  "toyou",
  "professional",
  "aren",
  "arabi",
  "tcmg",
  "hassan",
  "othman",
  "jazan",
  "times",
].map((n) => ({ name: n, src: `/proposal-assets/brands/brands/${n}.svg` }));

/** Partner logos (order follows the reference "Our Partners" grid). */
const PARTNER_LOGOS: { name: string; src: string }[] = [
  "microsoft",
  "godaddy",
  "vercel",
  "wati",
  "openai",
  "hostinger",
  "tiktok",
  "aws",
  "ahref",
  "semrush",
].map((n) => ({ name: n, src: `/proposal-assets/brands/partners/${n}.svg` }));

function LogoCell({
  label,
  src,
  h,
}: {
  label: string;
  src?: string;
  h: number;
}) {
  return (
    <div
      className="bg-[#F6F8FB] rounded-[12px] flex items-center justify-center p-3 h-full"
      style={{ minHeight: h }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span className="text-[12px] font-bold text-[#707070] text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

function LogoGrid({
  heading,
  items,
  cols,
  cellH,
}: {
  heading: string;
  items: { name: string; src?: string }[];
  cols: number;
  cellH: number;
}) {
  return (
    <div className="flex flex-col gap-3.5 h-full">
      <h3
        className="font-bold text-[#0047FF]"
        style={{ fontSize: cols >= 8 ? 22 : 26 }}>
        {heading}
      </h3>
      <div
        className="grid gap-3 flex-1 auto-rows-fr"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {items.slice(0, 16).map((b, i) => (
          <LogoCell key={i} label={b.name} src={b.src} h={cellH} />
        ))}
      </div>
    </div>
  );
}

/* ─── Service Details ──────────────────────────────────────────────── */

function ServicePill({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-[#EDF2F7] border border-[#0047FF]/20 rounded-[12px] px-4 py-2.5">
      <div className="size-7 rounded-[8px] bg-[#0047FF] flex items-center justify-center">
        <Sparkles className="size-3.5 text-white" strokeWidth={2.4} />
      </div>
      <span className="text-[14px] font-bold text-[#0047FF]">{name}</span>
    </div>
  );
}

function OverviewCard({ text, size }: { text: string; size: number }) {
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[12px] p-5 flex flex-col gap-2">
      <h3 className="text-[16px] font-bold text-[#0047FF]">Overview</h3>
      <Body text={text} size={size} />
    </div>
  );
}

function DeliverablesCard({ text, size }: { text: string; size: number }) {
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[12px] p-5 flex flex-col gap-2.5">
      <h3 className="text-[16px] font-bold text-[#0047FF]">Key Deliverables</h3>
      <RichList text={text} size={size} />
    </div>
  );
}

function ServiceMock({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[14px] overflow-hidden bg-gradient-to-br from-[#0a0f2c] to-[#1b2bc0]",
        className,
      )}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl || "/proposal-assets/about-skyline.jpeg"}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-90"
      />
    </div>
  );
}

function TechnologiesRow({
  draft,
  stacked,
}: {
  draft: ProposalDraft;
  stacked: boolean;
}) {
  const techs = draft.serviceDetails.technologies;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-[#0047FF] text-[20px]">
        Technologies We Use
      </h3>
      <div
        className={cn("grid gap-3", stacked ? "grid-cols-2" : "grid-cols-3")}>
        {techs.map((g) => (
          <div
            key={g.id}
            className="bg-[#EDF2F7] border border-[#0047FF]/15 rounded-[12px] px-4 py-3 flex items-center gap-3">
            <div className="size-7 rounded-[6px] bg-[#0047FF] flex items-center justify-center shrink-0">
              <Check className="size-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[12px] text-[#707070]">
              <span className="font-bold text-[#343434]">{g.name}:</span>{" "}
              {g.technologies.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceHeader({
  name,
  landscape,
}: {
  name: string;
  landscape: boolean;
}) {
  if (landscape) {
    return (
      <div className="flex items-start justify-between gap-4">
        <SectionTitle landscape>Service Details</SectionTitle>
        <ServicePill name={name} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle landscape={false}>Service Details</SectionTitle>
      <ServicePill name={name} />
    </div>
  );
}

/** Continuation page: the reference "Building Smart Solutions" layout. */
function WhatWeDeliverBlock({
  draft,
  size,
}: {
  draft: ProposalDraft;
  size: number;
}) {
  const s = draft.serviceDetails;
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[16px] p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-[18px] font-bold text-[#0047FF]">
          Building Smart Solutions for Modern Businesses
        </h3>
        <Body text={s.overview} size={size} />
      </div>
      <div className="bg-white rounded-[14px] p-5 flex flex-col gap-3">
        <h4 className="text-[16px] font-bold text-[#0047FF]">
          What We Deliver
        </h4>
        {s.moreDetails ? (
          <Body text={s.moreDetails} size={size} />
        ) : (
          <RichList text={s.keyDeliverables} size={size} />
        )}
      </div>
    </div>
  );
}

/* ─── Why blocks ───────────────────────────────────────────────────── */

function AdvantageBullets({
  items,
  size,
}: {
  items: { id: string; title: string; description: string }[];
  size: number;
}) {
  return (
    <ul
      className="flex flex-col gap-3 text-[#707070] leading-[1.6]"
      style={{ fontSize: size }}>
      {items.map((it) => (
        <li key={it.id} className="flex gap-2">
          <span className="mt-[7px] size-[4px] rounded-full bg-[#343434] shrink-0" />
          <span>
            <span className="font-bold text-[#343434]">{it.title}:</span>{" "}
            {it.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WhyColumn({
  accent,
  title,
  intro,
  nestedTitle,
  items,
  bodySize,
}: {
  accent: string;
  title: string;
  intro: string;
  nestedTitle: string;
  items: { id: string; title: string; description: string }[];
  bodySize: number;
}) {
  return (
    <div
      className="bg-[#EDF2F7] rounded-[16px] p-6 flex flex-col gap-4 border-l-[4px]"
      style={{ borderColor: accent }}>
      <h3 className="font-bold" style={{ color: accent, fontSize: 18 }}>
        {title}
      </h3>
      <Body text={intro} size={bodySize} />
      <div className="bg-white rounded-[12px] p-5 flex flex-col gap-3">
        <h4 className="font-bold" style={{ color: accent, fontSize: 16 }}>
          {nestedTitle}
        </h4>
        <AdvantageBullets items={items} size={bodySize} />
      </div>
    </div>
  );
}

/* ─── Similar Projects blocks ──────────────────────────────────────── */

function SimilarProjectCard({
  project,
}: {
  project: ProposalDraft["why"]["similarProjects"][number];
}) {
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[14px] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-bold text-[#0047FF]">{project.name}</h3>
        <a
          href={project.link}
          className="text-[11px] font-bold text-[#0047FF] inline-flex items-center gap-1 shrink-0">
          View Project <ArrowUpRight className="size-3" strokeWidth={2.4} />
        </a>
      </div>
      <p className="text-[11px] text-[#707070] leading-snug">
        {project.details}
      </p>
    </div>
  );
}

function SimilarFeedbackCard({
  project,
}: {
  project: ProposalDraft["why"]["similarProjects"][number];
}) {
  if (!project.feedbackBody) return null;
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[14px] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-bold text-[#0047FF]">
          Client Feedback
        </h3>
        <span className="text-[11px] font-bold text-[#0047FF] inline-flex items-center gap-1">
          <PenSquare className="size-3" strokeWidth={2.2} /> View Signature
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-br from-[#0047FF] to-[#9359FF]" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#343434]">
              {project.feedbackAuthor ?? "Client"}
            </span>
            <span className="text-[10px] text-[#9a9a9a]">
              Jeddah, Saudi Arabia
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: project.feedbackRating ?? 5 }).map((_, i) => (
            <Star key={i} className="size-3 text-[#F6960F]" fill="#F6960F" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-[10px] p-3 flex gap-2">
        <Quote
          className="size-4 text-[#0047FF]/30 shrink-0 mt-0.5"
          fill="currentColor"
        />
        <p className="text-[11px] text-[#707070] leading-snug italic">
          {project.feedbackBody}
        </p>
      </div>
    </div>
  );
}

function SimilarGallery({
  project,
  fill,
}: {
  project: ProposalDraft["why"]["similarProjects"][number];
  fill?: boolean;
}) {
  const gallery = project.gallery.length
    ? project.gallery
    : Array.from({ length: 4 }).map(() => "");
  return (
    <div
      className={cn(
        "bg-[#EDF2F7] rounded-[14px] p-4 flex flex-col gap-3",
        fill && "h-full",
      )}>
      <h3 className="text-[16px] font-bold text-[#0047FF]">Project Gallery</h3>
      <div
        className={cn(
          "grid grid-cols-2 gap-2",
          fill && "flex-1 min-h-0 grid-rows-2 auto-rows-fr",
        )}>
        {gallery.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className={cn(
              "rounded-[10px] overflow-hidden bg-gradient-to-br from-[#0047FF]/20 to-[#9359FF]/15",
              fill ? "min-h-0" : "aspect-[4/3]",
            )}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="size-full object-cover" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Scope blocks ─────────────────────────────────────────────────── */

function ScopeBadgeCard({
  title,
  accent,
  compact,
  children,
}: {
  title: string;
  accent: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-[#EDF2F7] border-l-[4px] rounded-[14px] flex flex-col",
        compact ? "p-3.5 gap-1.5" : "p-5 gap-2",
      )}
      style={{ borderColor: accent }}>
      <h3 className="font-bold text-[15px]" style={{ color: accent }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function TimelineTable({ draft, big }: { draft: ProposalDraft; big: boolean }) {
  const s = draft.scope;
  return (
    <div className={cn("flex flex-col gap-3", !big && "h-full")}>
      <div
        className={cn(
          "overflow-hidden rounded-[14px] shadow-[0_2px_10px_rgba(0,71,255,0.10)]",
          !big && "flex-1 flex flex-col min-h-0",
        )}>
        <div
          className={cn(
            "bg-[#0047FF] text-white grid grid-cols-[1.2fr_2fr_1fr] px-5",
            big ? "py-4" : "py-3",
          )}>
          <span className="text-[13px] font-bold">Phase</span>
          <span className="text-[13px] font-bold text-center">
            Deliverables
          </span>
          <span className="text-[13px] font-bold text-right">Duration</span>
        </div>
        <div className={cn("bg-[#EDF2F7]", !big && "flex-1 flex flex-col")}>
          {s.phases.map((ph, i) => (
            <div
              key={ph.id}
              className={cn(
                "grid grid-cols-[1.2fr_2fr_1fr] px-5 items-center border-t border-white first:border-t-0",
                big ? "py-3.5" : "py-2.5",
                !big && "flex-1",
              )}>
              <span className="text-[12px] font-bold text-[#343434]">
                {i + 1}. {ph.label}
              </span>
              <span className="text-[12px] text-[#707070] leading-snug text-center">
                {ph.description}
              </span>
              <span className="text-[12px] font-bold text-[#0047FF] text-right">
                {ph.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "bg-[#0047FF] rounded-[14px] px-6 flex items-center justify-between text-white",
          big ? "py-4" : "py-3",
        )}>
        <span className="font-bold" style={{ fontSize: big ? 22 : 16 }}>
          Estimated Total Duration:
        </span>
        <span className="font-bold" style={{ fontSize: big ? 26 : 20 }}>
          {s.estimatedTotalDuration}
        </span>
      </div>
    </div>
  );
}

/* ─── Quotation blocks ─────────────────────────────────────────────── */

function QuotationTable({
  draft,
  descHeader,
  fill,
}: {
  draft: ProposalDraft;
  descHeader: string;
  fill?: boolean;
}) {
  const q = draft.quotation;
  const subtotal = q.lineItems.reduce((s, li) => s + li.price, 0);
  const discount = q.applyDiscount
    ? Math.round((subtotal * q.discountPercent) / 100)
    : 0;
  const total = subtotal - discount;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[16px] shadow-[0_2px_10px_rgba(0,71,255,0.10)]",
        fill && "h-full flex flex-col",
      )}>
      <div className="bg-[#0047FF] text-white grid grid-cols-[1fr_2fr_0.8fr] px-5 py-4">
        <span className="text-[13px] font-bold">Service</span>
        <span className="text-[13px] font-bold text-center">{descHeader}</span>
        <span className="text-[13px] font-bold text-right">Price</span>
      </div>
      <div className={cn("bg-[#EDF2F7]", fill && "flex-1 flex flex-col")}>
        {q.lineItems.map((li) => (
          <div
            key={li.id}
            className={cn(
              "grid grid-cols-[1fr_2fr_0.8fr] px-5 py-3.5 items-center border-t border-white first:border-t-0",
              fill && "flex-1",
            )}>
            <span className="text-[12px] font-bold text-[#343434]">
              {li.service}
            </span>
            <span className="text-[12px] text-[#707070] leading-snug text-center">
              {li.description}
            </span>
            <span className="text-[12px] font-bold text-[#0047FF] text-right inline-flex items-center justify-end gap-1">
              <Riyal size={12} /> {li.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-[#0047FF] text-white px-5 py-4 flex items-center justify-between">
        <span className="text-[16px] font-bold uppercase tracking-wide">
          Subtotal Quote
        </span>
        <span className="inline-flex items-center gap-3">
          {discount > 0 ? (
            <span className="text-[15px] font-bold line-through text-[#FF9A9A]">
              {subtotal.toLocaleString()}
            </span>
          ) : null}
          <span className="text-[20px] font-bold inline-flex items-center gap-1">
            <Riyal size={17} /> {total.toLocaleString()}
          </span>
        </span>
      </div>
    </div>
  );
}

function ImportantNotesCard({ notes }: { notes: string }) {
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[14px] p-5 flex flex-col gap-2">
      <h3 className="text-[16px] font-bold text-[#0047FF]">Important Notes</h3>
      <RichList text={notes} size={11} />
    </div>
  );
}

function PaymentTermsCard({
  draft,
  twoCol,
  fill,
}: {
  draft: ProposalDraft;
  twoCol: boolean;
  fill?: boolean;
}) {
  const q = draft.quotation;
  return (
    <div
      className={cn(
        "bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[14px] p-5 flex flex-col gap-3",
        fill && "flex-1 min-h-0",
      )}>
      <h3 className="text-[16px] font-bold text-[#0047FF]">Payment Terms</h3>
      <div
        className={cn(
          "grid gap-3",
          twoCol ? "grid-cols-2" : "grid-cols-1",
          fill && "flex-1 min-h-0",
        )}>
        {q.paymentTerms.map((pt) => (
          <div
            key={pt.id}
            className="bg-white rounded-[12px] p-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-[7px] bg-[#0047FF] flex items-center justify-center shrink-0">
                <Check className="size-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[12px] font-bold text-[#0047FF]">
                {pt.label} ({pt.percentage}%):
              </span>
            </div>
            <span className="text-[18px] font-bold text-[#0047FF] inline-flex items-center gap-1 shrink-0">
              <Riyal size={15} /> {pt.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidBanner() {
  return (
    <div className="bg-[#FFECED] border-l-[4px] border-[#F60F13] rounded-[12px] p-3.5 flex items-center gap-3">
      <div className="size-8 rounded-[8px] bg-[#F60F13] flex items-center justify-center shrink-0">
        <Hourglass className="size-4 text-white" strokeWidth={2.4} />
      </div>
      <span className="text-[12px] font-bold text-[#F60F13]">
        Quotation valid for 15 days from the issue date.
      </span>
    </div>
  );
}

/* ─── Packages ─────────────────────────────────────────────────────── */

function PackagesGrid({ draft }: { draft: ProposalDraft }) {
  const q = draft.quotation;
  return (
    <div className="grid grid-cols-3 gap-4 items-stretch h-full">
      {q.packages.map((pk, i) => {
        const popular = i === 1;
        return (
          <div
            key={pk.id}
            className={cn(
              "rounded-[18px] p-5 flex flex-col gap-3 text-white relative",
              popular
                ? "bg-gradient-to-b from-[#1f47ff] to-[#0030d6] shadow-[0_12px_30px_rgba(0,71,255,0.35)]"
                : "bg-[#0047FF]",
            )}>
            {popular ? (
              <span className="absolute top-4 right-4 bg-white text-[#0047FF] text-[10px] font-bold rounded-full px-3 py-1">
                Popular
              </span>
            ) : null}
            <h4 className="text-[15px] font-bold">{pk.name}</h4>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold leading-none inline-flex items-center gap-1">
                <Riyal size={22} /> {pk.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-white/80">{pk.cadence}</span>
            </div>
            <p className="text-[11px] leading-snug text-white/85">
              {pk.description}
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-bold">Includes:</span>
              <ul className="flex flex-col gap-2">
                {pk.includes.map((inc, ii) => (
                  <li
                    key={ii}
                    className="flex items-start gap-2 text-[10px] leading-snug">
                    <span className="size-4 rounded-full bg-white/20 flex items-center justify-center mt-px shrink-0">
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    </span>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto self-center bg-white/15 rounded-full px-4 py-1.5">
              <span className="text-[10px] font-bold">
                Timeline: {pk.timeline}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Support blocks ───────────────────────────────────────────────── */

const BENEFIT_ICONS: Record<string, React.ElementType> = {
  shield: Award,
  refresh: RefreshCcw,
  monitor: Activity,
  lock: Globe,
  chart: BarChart3,
  users: UserCog,
};

function AfterSaleBenefits({ draft }: { draft: ProposalDraft }) {
  const s = draft.support;
  return (
    <div className="bg-[#EDF2F7] rounded-[16px] p-6 flex flex-col gap-4">
      <h3 className="text-[20px] font-bold text-[#0047FF]">
        After Sale Benefits
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {s.afterSaleBenefits.slice(0, 6).map((b) => {
          const Icon = BENEFIT_ICONS[b.icon] ?? Award;
          return (
            <div
              key={b.id}
              className="bg-white rounded-[12px] p-4 flex flex-col gap-2.5">
              <div className="size-10 rounded-[10px] bg-[#0047FF]/8 flex items-center justify-center">
                <Icon className="size-5 text-[#0047FF]" strokeWidth={2} />
              </div>
              <h4 className="text-[11px] font-bold text-[#0047FF] uppercase tracking-tight">
                {b.title}
              </h4>
              <p className="text-[10px] text-[#707070] leading-snug">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PromiseStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white/8 ring-1 ring-white/15 rounded-[12px] p-3.5 flex items-center gap-3">
      <div className="size-10 rounded-[10px] bg-white/10 ring-1 ring-white/25 flex items-center justify-center shrink-0">
        <Icon className="size-5" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[16px] font-bold leading-none">{value}</span>
        <span className="text-[10px] text-white/80 leading-tight">{label}</span>
      </div>
    </div>
  );
}

function SupportPromise({ draft }: { draft: ProposalDraft }) {
  const s = draft.support;
  return (
    <div className="bg-[#0047FF] rounded-[16px] p-6 flex flex-col gap-4 text-white">
      <h3 className="text-[20px] font-bold">Our Support Promise</h3>
      <div className="grid grid-cols-2 gap-3">
        <PromiseStat
          icon={Clock}
          value={s.supportPromise.uptime}
          label="Uptime Guarantee"
        />
        <PromiseStat
          icon={Globe}
          value={s.supportPromise.response}
          label="Response Time"
        />
        <PromiseStat
          icon={Users2}
          value={s.supportPromise.satisfaction}
          label="Urgent Issue Response"
        />
        <PromiseStat
          icon={Rocket}
          value={s.supportPromise.warranty}
          label="Warranty Period"
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <h3 className="text-[20px] font-bold">Our Support Team</h3>
        <span className="text-[12px] inline-flex items-center gap-1.5">
          <Users2 className="size-3.5" strokeWidth={2.2} /> Human Support 100%
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {s.supportTeam.slice(0, 2).map((m) => (
          <div
            key={m.id}
            className="bg-white/10 rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-white/20 overflow-hidden flex items-center justify-center font-bold text-[13px] shrink-0">
              {m.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.avatar} alt="" className="size-full object-cover" />
              ) : (
                m.name.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold leading-tight">
                {m.name}
              </span>
              <span className="text-[10px] text-white/75 leading-tight">
                @ {m.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── What We Need blocks ──────────────────────────────────────────── */

function BulletCard({
  title,
  color,
  text,
}: {
  title: string;
  color: string;
  text: string;
}) {
  return (
    <div
      className="bg-[#EDF2F7] rounded-[14px] p-5 flex flex-col gap-2.5 border-l-[4px]"
      style={{ borderColor: color }}>
      <h3 className="font-bold text-[16px]" style={{ color }}>
        {title}
      </h3>
      <RichList text={text} size={12} />
    </div>
  );
}

function UploadCard({ heading }: { heading: boolean }) {
  const Pills = (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-[12px] p-3.5 flex items-center gap-2.5 ring-1 ring-[#0047FF]/10">
        <div className="size-8 rounded-[8px] bg-[#0047FF] flex items-center justify-center shrink-0">
          <Mail className="size-4 text-white" strokeWidth={2.2} />
        </div>
        <span className="text-[12px] font-bold text-[#0047FF]">
          Saudi@almaster.tech
        </span>
      </div>
      <div className="bg-white rounded-[12px] p-3.5 flex items-center gap-2.5 ring-1 ring-[#0047FF]/10">
        <div className="size-8 rounded-[8px] bg-[#0047FF] flex items-center justify-center shrink-0">
          <Phone className="size-4 text-white" strokeWidth={2.2} />
        </div>
        <span className="text-[12px] font-bold text-[#0047FF]">
          +966582700000
        </span>
      </div>
    </div>
  );
  if (heading) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-[#343434] text-[20px]">
          Upload or share files via email or WhatsApp:
        </h3>
        {Pills}
      </div>
    );
  }
  return (
    <div className="bg-[#EDF2F7] border-l-[4px] border-[#0047FF] rounded-[14px] p-5 flex flex-col gap-3">
      <h3 className="text-[16px] font-bold text-[#0047FF]">
        Upload or share files via email or WhatsApp:
      </h3>
      {Pills}
    </div>
  );
}

/* ─── TOC ──────────────────────────────────────────────────────────── */

const TOC_ICONS: Record<string, React.ElementType> = {
  about: Info,
  service: Box,
  why: HelpCircle,
  scope: CalendarIcon,
  quotation: Ticket,
  support: Headphones,
  whatWeNeed: PenSquare,
  thankyou: ThumbsUp,
};

function TocRow({
  itemKey,
  title,
  subtitle,
  landscape,
}: {
  itemKey: string;
  title: string;
  subtitle: string;
  landscape: boolean;
}) {
  const Icon = TOC_ICONS[itemKey] ?? Info;
  return (
    <div
      className="bg-[#EDF2F7] rounded-[14px] border-l-[3px] border-[#0047FF] flex items-center gap-4"
      style={{ padding: landscape ? "18px 22px" : "20px 24px" }}>
      <div
        className="rounded-[10px] bg-[#0047FF] text-white flex items-center justify-center shrink-0"
        style={{ width: landscape ? 44 : 48, height: landscape ? 44 : 48 }}>
        <Icon className={landscape ? "size-5" : "size-6"} strokeWidth={2.2} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="font-bold text-[#343434]"
          style={{ fontSize: landscape ? 17 : 19 }}>
          {title}
        </span>
        <span
          className="text-[#8a8a8a]"
          style={{ fontSize: landscape ? 12 : 13 }}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/* ─── Section builder ──────────────────────────────────────────────── */

interface BuildOptions {
  landscape: boolean;
  cover: {
    headline: string;
    subtitle: string;
    client: string;
    date: string;
    validTill: string;
    aspect: string;
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Builds the ordered list of sections for a draft. The paginator turns
 * these into fixed-size physical sheets.
 */
export function buildProposalSections(
  draft: ProposalDraft,
  opts: BuildOptions,
): SectionDef[] {
  const { landscape, cover } = opts;
  const bodySize = landscape ? 11 : 13;
  const sections: SectionDef[] = [];

  /* 1 — Cover (hero) */
  sections.push({
    id: "cover",
    hero: <CoverPage {...cover} landscape={landscape} />,
  });

  /* 2 — Table of Contents */
  const tocItems: { key: string; title: string; subtitle: string }[] = [];
  const addToc = (key: string, title: string, subtitle: string) =>
    tocItems.push({ key, title, subtitle });
  if (draft.about.enabled)
    addToc(
      "about",
      "About AlMaster",
      "Discover who we are and how we empower businesses through technology.",
    );
  if (draft.serviceDetails.enabled)
    addToc(
      "service",
      "Service Details",
      "An overview of the proposed service and its tailored deliverables.",
    );
  if (draft.why.enabled)
    addToc(
      "why",
      "Why AlMaster",
      "Key reasons to choose Almaster as your trusted tech partner for your project",
    );
  if (draft.scope.enabled)
    addToc(
      "scope",
      "Project Scope & Timeline",
      "A clear roadmap outlining project phases, milestones, and delivery schedule.",
    );
  if (draft.quotation.enabled)
    addToc(
      "quotation",
      "Quotation (Invoice)",
      "Transparent pricing and cost breakdown for all included services.",
    );
  if (draft.quotation.enabled && draft.quotation.packages.length)
    addToc(
      "pricing",
      "Our Packages",
      "Flexible package options tailored to different needs and budgets.",
    );
  if (draft.support.enabled)
    addToc(
      "support",
      "Post-Launch Support & Benefits",
      "Closing notes and contact information.",
    );
  if (draft.whatWeNeed.enabled)
    addToc(
      "whatWeNeed",
      "What We Need",
      "Essential project inputs and information required from the client.",
    );
  addToc("thankyou", "Thank You", "Closing notes and contact information.");

  if (landscape) {
    /* Two-column grid packed row-major as a single block. */
    sections.push({
      id: "toc",
      title: "Table of Content",
      blocks: [
        {
          key: "grid",
          node: (
            <div className="grid grid-cols-2 gap-x-7 gap-y-5 auto-rows-fr h-full">
              {tocItems.map((it) => (
                <TocRow
                  key={it.key}
                  itemKey={it.key}
                  title={it.title}
                  subtitle={it.subtitle}
                  landscape
                />
              ))}
            </div>
          ),
        },
      ],
    });
  } else {
    sections.push({
      id: "toc",
      title: "Table of Content",
      blocks: tocItems.map((it) => ({
        key: it.key,
        node: (
          <TocRow
            itemKey={it.key}
            title={it.title}
            subtitle={it.subtitle}
            landscape={false}
          />
        ),
      })),
    });
  }

  /* 3 — About */
  if (draft.about.enabled) {
    const a = draft.about;
    if (landscape) {
      sections.push({
        id: "about",
        title: "About AlMaster",
        blocks: [
          {
            key: "main",
            node: (
              <div className="grid grid-cols-[1fr_1fr] gap-6 h-full">
                <div className="flex flex-col gap-3.5 justify-between">
                  <AboutCard
                    title="Who We Are?"
                    body={a.whoWeAre}
                    size={bodySize}
                  />
                  <AboutCard
                    title="Our Mission"
                    body={a.ourMission}
                    size={bodySize}
                  />
                  <AboutCard
                    title="Our Vision"
                    body={a.ourVision}
                    size={bodySize}
                  />
                </div>
                <AboutHero imageUrl={a.imageUrl} />
              </div>
            ),
          },
        ],
      });
    } else {
      sections.push({
        id: "about",
        title: "About AlMaster",
        blocks: [
          {
            key: "hero",
            node: <AboutHero imageUrl={a.imageUrl} className="h-[280px]" />,
          },
          {
            key: "who",
            node: (
              <AboutCard
                title="Who We Are?"
                body={a.whoWeAre}
                size={bodySize}
              />
            ),
          },
          {
            key: "mission",
            node: (
              <AboutCard
                title="Our Mission"
                body={a.ourMission}
                size={bodySize}
              />
            ),
          },
          {
            key: "vision",
            node: (
              <AboutCard
                title="Our Vision"
                body={a.ourVision}
                size={bodySize}
              />
            ),
          },
        ],
      });
    }

    /* 4 — Values / Key Facts / Certifications */
    sections.push({
      id: "values",
      blocks: landscape
        ? [
            {
              key: "values-row",
              node: (
                <div className="flex flex-col gap-3 h-full">
                  <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                    <CoreValuesCard draft={draft} big={false} />
                    <KeyFactsCard draft={draft} big={false} />
                  </div>
                  <CertificationsCard draft={draft} cols={3} />
                </div>
              ),
            },
          ]
        : [
            { key: "core", node: <CoreValuesCard draft={draft} big /> },
            { key: "facts", node: <KeyFactsCard draft={draft} big /> },
            {
              key: "certs",
              node: <CertificationsCard draft={draft} cols={2} />,
            },
          ],
    });

    /* 5 — Experts */
    const experts = a.experts.filter((e) => e.selected);
    const rows = chunk(experts, 2);
    sections.push({
      id: "experts",
      title: "Our Experts",
      blocks: rows.map((row, i) => ({
        key: `row-${i}`,
        node: (
          <div className="grid grid-cols-2 gap-3">
            {row.map((ex) => (
              <ExpertCard key={ex.id} ex={ex} landscape={landscape} />
            ))}
          </div>
        ),
      })),
    });

    /* 6 — Brands / Partners.
     * These are AlMaster's fixed client/partner logos (identical on every
     * proposal), so always render the bundled asset set. A draft may still
     * override them by supplying its own `brands`/`partners` with logo URLs. */
    const brands = a.brands.some((b) => b.logo)
      ? a.brands.map((b) => ({ name: b.name, src: b.logo }))
      : BRAND_LOGOS;
    const partners = a.partners.some((p) => p.logo)
      ? a.partners.map((p) => ({ name: p.name, src: p.logo }))
      : PARTNER_LOGOS;
    const cols = landscape ? 8 : 6;
    const cellH = landscape ? 80 : 92;
    sections.push({
      id: "brands",
      blocks: [
        {
          key: "brands",
          node: (
            <LogoGrid
              heading="Brands Trust Us"
              items={brands}
              cols={cols}
              cellH={cellH}
            />
          ),
        },
        {
          key: "partners",
          node: (
            <LogoGrid
              heading="Our Partners"
              items={partners}
              cols={cols}
              cellH={cellH}
            />
          ),
        },
      ],
    });
  }

  /* 7 — Service Details */
  if (draft.serviceDetails.enabled) {
    const s = draft.serviceDetails;
    const titleNode = (
      <ServiceHeader name={s.serviceName} landscape={landscape} />
    );
    if (landscape) {
      const blocks: SectionBlock[] = [
        {
          key: "main",
          node: (
            <div className="flex flex-col gap-5 h-full">
              <div className="grid grid-cols-[1fr_1fr] gap-4 flex-1 min-h-0">
                <div className="flex flex-col gap-3">
                  <OverviewCard text={s.overview} size={bodySize} />
                  <DeliverablesCard text={s.keyDeliverables} size={bodySize} />
                </div>
                {s.showImage ? (
                  <ServiceMock
                    imageUrl={s.imageUrl}
                    className="min-h-[230px]"
                  />
                ) : (
                  <div />
                )}
              </div>
              <TechnologiesRow draft={draft} stacked={false} />
            </div>
          ),
        },
      ];
      if (s.moreDetails?.trim()) {
        blocks.push({
          key: "deliver",
          node: <WhatWeDeliverBlock draft={draft} size={bodySize} />,
        });
      }
      sections.push({ id: "service", titleNode, blocks });
    } else {
      const blocks: SectionBlock[] = [
        {
          key: "overview",
          node: <OverviewCard text={s.overview} size={bodySize} />,
        },
      ];
      if (s.showImage)
        blocks.push({
          key: "image",
          node: <ServiceMock imageUrl={s.imageUrl} className="h-[220px]" />,
        });
      blocks.push({
        key: "deliverables",
        node: <DeliverablesCard text={s.keyDeliverables} size={bodySize} />,
      });
      blocks.push({
        key: "tech",
        node: <TechnologiesRow draft={draft} stacked />,
      });
      if (s.moreDetails?.trim()) {
        blocks.push({
          key: "deliver",
          node: <WhatWeDeliverBlock draft={draft} size={bodySize} />,
        });
      }
      sections.push({ id: "service", titleNode, blocks });
    }
  }

  /* 8 — Why AlMaster */
  if (draft.why.enabled) {
    const w = draft.why;
    const blueCol = (
      <WhyColumn
        accent={BLUE}
        title="Why Choose Almaster for Your Project?"
        intro={w.whyChooseAlMaster}
        nestedTitle="Why we’re a perfect fit:"
        items={w.whyPerfectFit}
        bodySize={bodySize}
      />
    );
    const greenCol = (
      <WhyColumn
        accent={GREEN}
        title="What Almaster Offers, That Others Don’t"
        intro={w.whatOthersDont}
        nestedTitle="Our Distinct Advantages:"
        items={w.distinctAdvantages}
        bodySize={bodySize}
      />
    );
    sections.push({
      id: "why",
      title: "Why AlMaster?",
      blocks: landscape
        ? [
            {
              key: "cols",
              node: (
                <div className="grid grid-cols-2 gap-4 h-full">
                  {blueCol}
                  {greenCol}
                </div>
              ),
            },
          ]
        : [
            { key: "blue", node: blueCol },
            { key: "green", node: greenCol },
          ],
    });

    /* 9 — Similar projects */
    if (w.similarProjects.length) {
      const project = w.similarProjects[0]!;
      sections.push({
        id: "similar",
        title: "Similar projects we have delivered",
        blocks: landscape
          ? [
              {
                key: "main",
                node: (
                  <div className="grid grid-cols-[1fr_1.1fr] gap-4 h-full">
                    <div className="flex flex-col gap-4">
                      <SimilarProjectCard project={project} />
                      <SimilarFeedbackCard project={project} />
                    </div>
                    <SimilarGallery project={project} fill />
                  </div>
                ),
              },
            ]
          : [
              {
                key: "project",
                node: <SimilarProjectCard project={project} />,
              },
              { key: "gallery", node: <SimilarGallery project={project} /> },
              {
                key: "feedback",
                node: <SimilarFeedbackCard project={project} />,
              },
            ],
      });
    }
  }

  /* 10 — Scope & Timeline */
  if (draft.scope.enabled) {
    const s = draft.scope;
    const scopeCards = (
      <div
        className={cn(
          "flex flex-col",
          landscape ? "gap-2.5 h-full justify-between" : "gap-3.5",
        )}>
        <ScopeBadgeCard title="Project Scope" accent={BLUE} compact={landscape}>
          <Body text={s.projectScope} size={landscape ? 11 : 13} />
        </ScopeBadgeCard>
        <ScopeBadgeCard
          title="Included in Scope"
          accent={GREEN}
          compact={landscape}>
          <RichList
            text={s.includedInScope}
            size={landscape ? 11 : 13}
            gap={landscape ? "gap-1" : "gap-1.5"}
          />
        </ScopeBadgeCard>
        <ScopeBadgeCard
          title="Excluded from Scope"
          accent={RED}
          compact={landscape}>
          <RichList
            text={s.excludedFromScope}
            size={landscape ? 11 : 13}
            gap={landscape ? "gap-1" : "gap-1.5"}
          />
        </ScopeBadgeCard>
      </div>
    );
    sections.push({
      id: "scope",
      title: "Project Scope & Timeline",
      blocks: landscape
        ? [
            {
              key: "main",
              node: (
                <div className="grid grid-cols-[1fr_1fr] gap-4 h-full">
                  {scopeCards}
                  <TimelineTable draft={draft} big={false} />
                </div>
              ),
            },
          ]
        : [
            {
              key: "scope-card",
              node: (
                <ScopeBadgeCard title="Project Scope" accent={BLUE}>
                  <Body text={s.projectScope} size={13} />
                </ScopeBadgeCard>
              ),
            },
            {
              key: "included",
              node: (
                <ScopeBadgeCard title="Included in Scope" accent={GREEN}>
                  <RichList text={s.includedInScope} size={13} />
                </ScopeBadgeCard>
              ),
            },
            {
              key: "excluded",
              node: (
                <ScopeBadgeCard title="Excluded from Scope" accent={RED}>
                  <RichList text={s.excludedFromScope} size={13} />
                </ScopeBadgeCard>
              ),
            },
            {
              key: "timeline",
              node: (
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-[#0047FF] text-[24px]">
                    Timeline Overview
                  </h3>
                  <TimelineTable draft={draft} big />
                </div>
              ),
            },
          ],
    });
  }

  /* 11 — Quotation (Invoice) + Our Packages.
   * The design ships both as distinct pages, so both are emitted whenever the
   * module is enabled: the invoice always, and the packages page whenever any
   * packages are defined. (The builder's mode toggle only drives which editor
   * is shown, not which pages render.) */
  if (draft.quotation.enabled) {
    sections.push({
      id: "quotation",
      title: "Quotation (Invoice)",
      blocks: landscape
        ? [
            {
              key: "main",
              node: (
                <div className="grid grid-cols-[1.3fr_1fr] gap-4 h-full">
                  <QuotationTable
                    draft={draft}
                    descHeader="Deliverables"
                    fill
                  />
                  <div className="flex flex-col gap-4 h-full">
                    <ImportantNotesCard notes={draft.quotation.notes} />
                    <PaymentTermsCard draft={draft} twoCol={false} fill />
                    <ValidBanner />
                  </div>
                </div>
              ),
            },
          ]
        : [
            {
              key: "table",
              node: <QuotationTable draft={draft} descHeader="Description" />,
            },
            {
              key: "notes",
              node: <ImportantNotesCard notes={draft.quotation.notes} />,
            },
            { key: "terms", node: <PaymentTermsCard draft={draft} twoCol /> },
            { key: "banner", node: <ValidBanner /> },
          ],
    });

    if (draft.quotation.packages.length) {
      sections.push({
        id: "pricing",
        title: "Our Packages",
        blocks: [{ key: "grid", node: <PackagesGrid draft={draft} /> }],
      });
    }
  }

  /* 12 — Support */
  if (draft.support.enabled) {
    sections.push({
      id: "support",
      title: "Post-Launch Support & Benefits",
      blocks: landscape
        ? [
            {
              key: "main",
              node: (
                <div className="grid grid-cols-[1.2fr_1fr] gap-4 h-full">
                  <AfterSaleBenefits draft={draft} />
                  <SupportPromise draft={draft} />
                </div>
              ),
            },
          ]
        : [
            { key: "benefits", node: <AfterSaleBenefits draft={draft} /> },
            { key: "promise", node: <SupportPromise draft={draft} /> },
          ],
    });
  }

  /* 13 — What We Need */
  if (draft.whatWeNeed.enabled) {
    const w = draft.whatWeNeed;
    sections.push({
      id: "whatWeNeed",
      title: "What We Need To Start",
      blocks: landscape
        ? [
            {
              key: "grid",
              node: (
                <div className="grid grid-cols-2 grid-rows-2 auto-rows-fr gap-3.5 h-full">
                  <BulletCard
                    title="Project Assets"
                    color={BLUE}
                    text={w.projectAssets}
                  />
                  <BulletCard
                    title="Technical References"
                    color={ORANGE}
                    text={w.technicalReferences}
                  />
                  <BulletCard
                    title="Access Details"
                    color={GREEN}
                    text={w.accessDetails}
                  />
                  <UploadCard heading={false} />
                </div>
              ),
            },
          ]
        : [
            {
              key: "assets",
              node: (
                <BulletCard
                  title="Project Assets"
                  color={BLUE}
                  text={w.projectAssets}
                />
              ),
            },
            {
              key: "access",
              node: (
                <BulletCard
                  title="Access Details"
                  color={GREEN}
                  text={w.accessDetails}
                />
              ),
            },
            {
              key: "tech",
              node: (
                <BulletCard
                  title="Technical References"
                  color={ORANGE}
                  text={w.technicalReferences}
                />
              ),
            },
            { key: "upload", node: <UploadCard heading /> },
          ],
    });
  }

  /* 14 — Thank You (hero) */
  sections.push({
    id: "thankyou",
    hero: (
      <ThankYouPage draft={draft} aspect={cover.aspect} landscape={landscape} />
    ),
  });

  return sections;
}
