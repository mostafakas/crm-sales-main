/**
 * Export the rendered proposal as PDF or DOCX.
 *
 * - PDF : every `.proposal-page` div is captured via html-to-image at
 *   2× density, then stitched into an A4 portrait PDF with jspdf.
 *
 * - DOCX: built from the proposal draft directly using Word's Office
 *   Open XML wrapped in an HTML envelope that Word/Pages reads as
 *   `application/msword`. No html-docx-js dependency, no computed-style
 *   inlining (both were unreliable / slow in the browser).
 */

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { ProposalDraft, ProposalDimensions } from "@/lib/types/proposal-draft";
import { primaryVariant } from "@/lib/proposal-layout";

/* Page width (mm) per format. A4 portrait is 210mm wide; a PowerPoint deck
 * uses the standard 13.333" (338.667mm) wide 16:9 page. Heights are derived
 * per page from the rendered content so nothing is clipped or squished. */
const A4_WIDTH_MM = 210;
const WIDE_WIDTH_MM = 338.667;

/* ─── PDF ──────────────────────────────────────────────────────────── */

export async function exportProposalAsPdf(
  root: HTMLElement,
  filename = "proposal.pdf",
  dimensions?: ProposalDimensions,
): Promise<void> {
  const pages = Array.from(
    root.querySelectorAll<HTMLElement>(".proposal-page"),
  );
  if (pages.length === 0) {
    throw new Error("No proposal pages found to export.");
  }

  const baseW = dimensions === "powerpoint" ? WIDE_WIDTH_MM : A4_WIDTH_MM;

  /* Each PDF page keeps the fixed width and grows its height to the page's
   * natural aspect ratio. Orientation follows the resulting shape so jsPDF
   * doesn't swap our dimensions. */
  const dims = pages.map((page) => {
    const { width: pw, height: ph } = page.getBoundingClientRect();
    const aspect = pw > 0 ? ph / pw : 1;
    const h = baseW * aspect;
    return {
      w: baseW,
      h,
      orient: (baseW >= h ? "landscape" : "portrait") as
        | "landscape"
        | "portrait",
    };
  });

  const pdf = new jsPDF({
    orientation: dims[0]!.orient,
    unit: "mm",
    format: [dims[0]!.w, dims[0]!.h],
  });

  for (let i = 0; i < pages.length; i += 1) {
    const dataUrl = await toPng(pages[i]!, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const d = dims[i]!;
    if (i > 0) pdf.addPage([d.w, d.h], d.orient);
    pdf.addImage(dataUrl, "PNG", 0, 0, d.w, d.h, undefined, "FAST");
  }

  pdf.save(filename);
}

/* ─── DOCX ─────────────────────────────────────────────────────────── */

/**
 * Build the proposal as a Word-readable HTML document. Word and Pages
 * both recognise `application/msword` blobs with this structure, so we
 * sidestep the html-docx-js fragility.
 */
export async function exportProposalAsDocx(
  draft: ProposalDraft,
  filename = "proposal.docx",
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("DOCX export must run in the browser.");
  }

  const html = buildProposalDocxHtml(draft);

  /* Word reads this MIME and the explicit `<meta charset>` reliably. */
  const blob = new Blob(
    ["﻿", html], // BOM helps Word detect UTF-8
    { type: "application/msword;charset=utf-8" },
  );
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/* ─── HTML builder ─────────────────────────────────────────────────── */

const HTML_HEAD = `
<style>
  body { font-family: 'Janna LT', 'Segoe UI', Arial, sans-serif; color: #343434; margin: 0; padding: 0; }
  h1 { color: #0047FF; font-size: 28pt; margin: 0 0 8pt; }
  h2 { color: #0047FF; font-size: 20pt; margin: 0 0 8pt; }
  h3 { color: #0047FF; font-size: 14pt; margin: 12pt 0 6pt; }
  h4 { color: #343434; font-size: 12pt; margin: 10pt 0 4pt; }
  p  { font-size: 11pt; line-height: 1.6; margin: 0 0 8pt; }
  .muted { color: #707070; font-size: 10pt; }
  .center { text-align: center; }
  .cover { background: #0047FF; color: #fff; padding: 80pt 60pt; }
  .cover h1 { color: #fff; font-size: 36pt; line-height: 1.1; margin-bottom: 12pt; }
  .cover .sub { color: rgba(255,255,255,0.9); font-size: 13pt; margin-bottom: 24pt; }
  .cover .chips { font-size: 10pt; color: rgba(255,255,255,0.85); margin-bottom: 6pt; }
  .grid-2 { display: table; width: 100%; }
  .grid-2 > div { display: table-cell; width: 50%; vertical-align: top; padding: 6pt; }
  .card { background: #F8FAFC; border: 1pt solid #EDF2F7; border-radius: 8pt; padding: 12pt; margin-bottom: 8pt; }
  .card-primary { background: #0047FF; color: #fff; }
  ul { margin: 4pt 0 8pt 18pt; padding: 0; }
  li { font-size: 11pt; margin-bottom: 4pt; }
  table.line-items { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
  table.line-items th, table.line-items td { border: 1pt solid #EDF2F7; padding: 8pt; font-size: 11pt; text-align: left; }
  table.line-items th { background: #F8FAFC; color: #343434; }
  table.line-items td.right { text-align: right; }
  .total { text-align: right; font-size: 13pt; font-weight: bold; color: #0047FF; margin-top: 8pt; }
  .page-break { page-break-after: always; }
</style>
`;

function buildProposalDocxHtml(draft: ProposalDraft): string {
  const today = new Date();
  const validTill = new Date(today);
  validTill.setDate(today.getDate() + (draft.validityDays || 14));
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const variant = primaryVariant(draft.language);
  const ar = draft.arOverrides ?? {};
  const pick = (path: string, base: string) =>
    variant === "arabic" ? ar[path]?.trim() || base : base;
  const coverHeadline =
    pick("headline", draft.headline) || "Website Project Proposal";
  const coverSubtitle =
    pick("shortDescription", draft.shortDescription) ||
    "Development of a new full website for client's real-estate company";

  const sections: string[] = [];

  /* Cover */
  sections.push(
    `<div class="cover">
      <h1>${esc(coverHeadline)}</h1>
      <p class="sub">${esc(coverSubtitle)}</p>
      <p class="chips"><strong>Prepared For:</strong> ${esc(draft.client?.name || "Client Name")}</p>
      <p class="chips"><strong>Date:</strong> ${fmt(today)}</p>
      <p class="chips"><strong>Valid Till:</strong> ${fmt(validTill)} · ${draft.validityDays || 14} Days</p>
    </div>
    <div class="page-break"></div>`,
  );

  /* About */
  if (draft.about.enabled) {
    sections.push(
      `<h1>About AlMaster</h1>
      <h3>Who We Are?</h3>${richToHtml(draft.about.whoWeAre)}
      <h3>Our Mission</h3>${richToHtml(draft.about.ourMission)}
      <h3>Our Vision</h3>${richToHtml(draft.about.ourVision)}

      <h2>Our Core Values</h2>
      ${draft.about.coreValues
        .map(
          (cv) => `
        <div class="card">
          <h4>${esc(cv.headline)}</h4>
          <p>${esc(cv.description)}</p>
        </div>`,
        )
        .join("")}

      <h2>Key Facts</h2>
      <div class="grid-2">
        ${draft.about.keyFacts
          .map(
            (kf) => `
          <div>
            <div class="card">
              <h4 style="color:#0047FF;font-size:18pt">${esc(kf.value)}</h4>
              <p class="muted">${esc(kf.label)}</p>
            </div>
          </div>`,
          )
          .join("")}
      </div>

      <h2>Certifications</h2>
      <ul>
        ${draft.about.certifications
          .filter((c) => c.visible)
          .map(
            (c) =>
              `<li><strong>${esc(c.title)}</strong> — ${esc(c.issuer)}, ${esc(c.date)}</li>`,
          )
          .join("")}
      </ul>

      <h2>Our Experts</h2>
      ${draft.about.experts
        .filter((e) => e.selected)
        .map(
          (e) => `
        <div class="card">
          <h4>${esc(e.name)} — <span class="muted">${esc(e.role)}</span></h4>
          <ul>
            ${e.expertise.map((x) => `<li>${esc(x)}</li>`).join("")}
          </ul>
        </div>`,
        )
        .join("")}
      <div class="page-break"></div>`,
    );
  }

  /* Why */
  if (draft.why.enabled) {
    sections.push(
      `<h1>Why AlMaster</h1>
      <h3>Why Choose AlMaster for Your Project?</h3>
      ${richToHtml(draft.why.whyChooseAlMaster)}

      <h2>Why we're a perfect fit</h2>
      ${draft.why.whyPerfectFit
        .map(
          (p) => `
        <div class="card">
          <h4>${esc(p.title)}</h4>
          <p>${esc(p.description)}</p>
        </div>`,
        )
        .join("")}

      <h2>Our Distinct Advantages</h2>
      ${richToHtml(draft.why.whatOthersDont)}
      ${draft.why.distinctAdvantages
        .map(
          (a) => `
        <div class="card">
          <h4>${esc(a.title)}</h4>
          <p>${esc(a.description)}</p>
        </div>`,
        )
        .join("")}

      ${
        draft.why.similarProjects.length
          ? `<h2>Similar projects we have delivered</h2>
            ${draft.why.similarProjects
              .map(
                (p) => `
              <div class="card">
                <h4>${esc(p.name)} — <span class="muted">${esc(p.link)}</span></h4>
                <p>${esc(p.details)}</p>
                ${p.feedbackBody ? `<p class="muted"><em>"${esc(p.feedbackBody)}"</em> — ${esc(p.feedbackAuthor ?? "")}</p>` : ""}
              </div>`,
              )
              .join("")}`
          : ""
      }
      <div class="page-break"></div>`,
    );
  }

  /* Scope */
  if (draft.scope.enabled) {
    sections.push(
      `<h1>Project Scope &amp; Timeline</h1>
      <h3>Project Scope</h3>${richToHtml(draft.scope.projectScope)}

      <div class="grid-2">
        <div>
          <h3 style="color:#0AA92A">Included in Scope</h3>
          <ul>${listFromLines(draft.scope.includedInScope)}</ul>
        </div>
        <div>
          <h3 style="color:#F60F13">Excluded from Scope</h3>
          <ul>${listFromLines(draft.scope.excludedFromScope)}</ul>
        </div>
      </div>

      <h2>Phases &amp; Timeline</h2>
      ${draft.scope.phases
        .map(
          (ph, i) => `
        <div class="card">
          <h4>${i + 1}. ${esc(ph.label)} — <span class="muted">${esc(ph.duration)}</span></h4>
          <p>${esc(ph.description)}</p>
        </div>`,
        )
        .join("")}

      <p class="total">Estimated Total Duration: ${esc(draft.scope.estimatedTotalDuration)}</p>
      <div class="page-break"></div>`,
    );
  }

  /* Quotation */
  if (draft.quotation.enabled) {
    const q = draft.quotation;
    const subtotal = q.lineItems.reduce((s, li) => s + li.price, 0);
    const discount = q.applyDiscount
      ? Math.round((subtotal * q.discountPercent) / 100)
      : 0;
    const total = subtotal - discount;
    sections.push(
      `<h1>Quotation (Invoice)</h1>
      <table class="line-items">
        <tr><th>Service</th><th class="right">Price</th></tr>
        ${q.lineItems
          .map(
            (li) => `
          <tr>
            <td><strong>${esc(li.service)}</strong><br/><span class="muted">${esc(li.description)}</span></td>
            <td class="right">SR ${li.price.toLocaleString()}</td>
          </tr>`,
          )
          .join("")}
        <tr><td class="right"><strong>Subtotal</strong></td><td class="right">SR ${subtotal.toLocaleString()}</td></tr>
        ${q.applyDiscount ? `<tr><td class="right">Discount (${q.discountPercent}%)</td><td class="right" style="color:#F60F13">- SR ${discount.toLocaleString()}</td></tr>` : ""}
        <tr><td class="right"><strong>Total</strong></td><td class="right"><strong style="color:#0047FF">SR ${total.toLocaleString()}</strong></td></tr>
      </table>

      <h2>Payment Terms</h2>
      <ul>
        ${q.paymentTerms
          .map(
            (pt) =>
              `<li><strong>${esc(pt.label)}:</strong> SR ${pt.amount.toLocaleString()} (${pt.percentage}%)</li>`,
          )
          .join("")}
      </ul>

      ${q.notes ? `<h3>Notes</h3>${richToHtml(q.notes)}` : ""}
      <div class="page-break"></div>`,
    );

    /* Our Packages — a distinct page whenever packages are defined. */
    if (q.packages.length) {
      sections.push(
        `<h1>Our Packages</h1>
        ${q.packages
          .map(
            (pk) => `
          <div class="card">
            <h3>${esc(pk.name)} — SR ${pk.price.toLocaleString()} <span class="muted">${esc(pk.cadence)}</span></h3>
            <p>${esc(pk.description)}</p>
            <ul>${pk.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
            <p class="muted">Timeline: ${esc(pk.timeline)}</p>
          </div>`,
          )
          .join("")}
        <div class="page-break"></div>`,
      );
    }
  }

  /* Support */
  if (draft.support.enabled) {
    sections.push(
      `<h1>Post-Launch Support &amp; Benefits</h1>
      <h2>After Sale Benefits</h2>
      <div class="grid-2">
        ${draft.support.afterSaleBenefits
          .map(
            (b) => `<div><div class="card">
              <h4>${esc(b.title)}</h4>
              <p>${esc(b.description)}</p>
            </div></div>`,
          )
          .join("")}
      </div>

      <h2>Our Support Promise</h2>
      <ul>
        <li><strong>Uptime:</strong> ${esc(draft.support.supportPromise.uptime)}</li>
        <li><strong>Response Time:</strong> ${esc(draft.support.supportPromise.response)}</li>
        <li><strong>Warranty Period:</strong> ${esc(draft.support.supportPromise.warranty)}</li>
        <li><strong>Human Support:</strong> ${esc(draft.support.supportPromise.satisfaction)}</li>
      </ul>

      <h2>Our Support Team</h2>
      ${draft.support.supportTeam
        .map(
          (m) => `<div class="card">
            <h4>${esc(m.name)} — <span class="muted">${esc(m.role)}</span></h4>
          </div>`,
        )
        .join("")}
      <div class="page-break"></div>`,
    );
  }

  /* What We Need */
  if (draft.whatWeNeed.enabled) {
    sections.push(
      `<h1>What We Need</h1>
      <h3 style="color:#0047FF">Project Assets</h3>
      <ul>${listFromLines(draft.whatWeNeed.projectAssets)}</ul>
      <h3 style="color:#0AA92A">Access Details</h3>
      <ul>${listFromLines(draft.whatWeNeed.accessDetails)}</ul>
      <h3 style="color:#F6960F">Technical References</h3>
      <ul>${listFromLines(draft.whatWeNeed.technicalReferences)}</ul>
      <div class="page-break"></div>`,
    );
  }

  /* Thank You */
  sections.push(
    `<div class="cover center">
      <h1>Thank You</h1>
      <p class="sub">We're excited about the possibility of partnering with ${esc(
        draft.client?.name || "your team",
      )} to bring this project to life.</p>
      <p class="chips">Email: saudi@almaster.tech</p>
      <p class="chips">Phone: +966 58 270 0000</p>
      <p class="chips">Website: almaster.tech</p>
    </div>`,
  );

  const landscape = draft.dimensions === "powerpoint";
  const rtl = primaryVariant(draft.language) === "arabic";
  const pageStyle = `<style>@page { size: A4 ${
    landscape ? "landscape" : "portrait"
  }; }</style>`;

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40" dir="${
    rtl ? "rtl" : "ltr"
  }">
<head>
  <meta charset="utf-8" />
  <title>${esc(draft.headline || "Proposal")}</title>
  ${HTML_HEAD}
  ${pageStyle}
</head>
<body dir="${rtl ? "rtl" : "ltr"}">
${sections.join("\n")}
</body>
</html>`;
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function listFromLines(text: string): string {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => `<li>${esc(line)}</li>`)
    .join("");
}

/**
 * Treat the rich-text-area HTML as already-safe authored HTML, but strip
 * `<script>` / `<style>` for safety. Plain text is wrapped in a <p>.
 */
function richToHtml(value: string): string {
  if (!value) return "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(value);
  if (!looksLikeHtml) {
    return `<p>${esc(value).replace(/\n/g, "<br/>")}</p>`;
  }
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}
