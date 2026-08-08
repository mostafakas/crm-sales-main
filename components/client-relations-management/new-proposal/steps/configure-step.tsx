"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Search,
  ArrowRight,
  Plus,
  Code2,
  Smartphone,
  Sparkles,
  Cloud,
  Brain,
  ShoppingCart,
  Check,
  Languages,
  Info,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_MARKET_META,
  type ProposalLanguage,
  type ProposalMarket,
  type ProposalService,
} from "@/lib/types/proposal";
import {
  type ProposalDimensions,
  type ProposalDraftClient,
} from "@/lib/types/proposal-draft";
import {
  primaryVariant,
  directionFor,
  pageHeightFor,
  pageAspectFor,
  PAGE_WIDTH,
} from "@/lib/proposal-layout";
import { useProposalDraft } from "../proposal-draft-context";
import { WizardStepHeader } from "../wizard-step-header";
import { SelectionCard, WizardFieldSection } from "../selection-card";
import { CoverPage } from "@/components/client-relations-management/proposal-document/pages";
import { ScaledPage } from "@/components/client-relations-management/proposal-document/scaled-page";
import { ClientFormModal } from "@/components/client-relations-management/clients/client-form-modal";
import { getClients } from "@/lib/firebase/clients";
import type { Client } from "@/lib/types/client";
import { useSelector } from "react-redux";
import { selectProposals } from "@/lib/store/slices/proposals-slice";

interface ServiceOption {
  key: ProposalService;
  label: string;
  hint: string;
  icon: React.ElementType;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    key: "programming",
    label: "Web Development",
    hint: "High-performance web platforms & SaaS",
    icon: Code2,
  },
  {
    key: "design",
    label: "Mobile Applications",
    hint: "Native iOS & Android, cross-platform apps",
    icon: Smartphone,
  },
  {
    key: "marketing",
    label: "Brand & Identity",
    hint: "Strategy, visual identity, Brand guidelines",
    icon: Sparkles,
  },
  {
    key: "content-writing",
    label: "Cloud & DevOps",
    hint: "Native iOS & Android, cross-platform apps",
    icon: Cloud,
  },
  {
    key: "artificial-intelligence",
    label: "AI Solutions",
    hint: "Headless commerce, checkout, growth",
    icon: Brain,
  },
  {
    key: "finance",
    label: "E-Commerce Platform",
    hint: "Headless commerce, checkout, growth",
    icon: ShoppingCart,
  },
];

const LANGUAGES: { key: ProposalLanguage; label: string }[] = [
  { key: "arabic", label: "العربية" },
  { key: "english", label: "English" },
  { key: "both", label: "Both (Arabic & English)" },
];

const VALIDITY_PILLS = [
  { value: 0, label: "Enter manually" },
  { value: 7, label: "7d" },
  { value: 15, label: "15d" },
  { value: 21, label: "21d" },
  { value: 30, label: "30d" },
  { value: 45, label: "45d" },
  { value: 60, label: "60d" },
];

const COUNTRY_STYLE: Record<
  ProposalMarket,
  { tint: string; titleColor: string }
> = {
  saudi: { tint: "bg-[rgba(0,108,53,0.1)]", titleColor: "text-[#006c35]" },
  egypt: { tint: "bg-[rgba(255,43,43,0.1)]", titleColor: "text-[#ff2b2b]" },
  global: { tint: "bg-[rgba(0,71,255,0.1)]", titleColor: "text-[#0047ff]" },
};

export function ConfigureStep() {
  const router = useRouter();
  const { draft, updateDraft, setArOverride } = useProposalDraft();
  const [clientSearch, setClientSearch] = React.useState("");
  const [addClientOpen, setAddClientOpen] = React.useState(false);
  const [firebaseClients, setFirebaseClients] = React.useState<Client[]>([]);
  const [isCustomValidity, setIsCustomValidity] = React.useState(false);
  const records = useSelector(selectProposals);

  const fetchClients = React.useCallback(async () => {
    try {
      const data = await getClients();
      setFirebaseClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const mapClientToDraft = (c: Client): ProposalDraftClient => ({
    id: c.id,
    name: c.contactName ? `${c.companyName} - ${c.contactName}` : c.companyName,
    email: c.email,
    /* No real per-client photo exists yet — leave it unset so the UI falls
     * back to initials instead of showing the same stock photo for every
     * client (see the AvatarFallback below). */
    avatar: undefined,
  });

  const expiresAtLabel = React.useMemo(() => {
    if (!draft.validityDays) return "Pick a duration";
    return format(addDays(new Date(), draft.validityDays), "MMM dd, yyyy");
  }, [draft.validityDays]);

  const coverDate = format(new Date(), "MMMM dd, yyyy");
  const coverValidTill = `${format(
    addDays(new Date(), draft.validityDays || 14),
    "MMMM dd, yyyy",
  )} · ${draft.validityDays || 14} Days`;

  const allClients = firebaseClients.map(mapClientToDraft);
  const filteredClients = clientSearch
    ? allClients.filter((c) =>
        `${c.name} ${c.email}`
          .toLowerCase()
          .includes(clientSearch.toLowerCase()),
      )
    : allClients;

  const canContinue = Boolean(
    draft.country &&
      draft.language &&
      draft.services && draft.services.length > 0 &&
      draft.dimensions &&
      draft.client &&
      draft.headline.trim(),
  );

  return (
    <div className="w-full bg-[#f8fafc] min-h-full p-[24px]">
      <div className="bg-white rounded-[20px] p-[32px] flex flex-col gap-[32px]">
        <WizardStepHeader
          icon={Settings}
          title="Step 01: Configure the proposal"
          subtitle="Manage Country, language, client, service"
        />

        {/* Country */}
        <WizardFieldSection
          label="Select country"
          hint="Determines currency, branch & legal footer">
          <div className="grid grid-cols-3 gap-[12px]">
            {(["saudi", "egypt", "global"] as ProposalMarket[]).map(
              (market) => {
                const meta = PROPOSAL_MARKET_META[market];
                const cs = COUNTRY_STYLE[market];
                const selected = draft.country === market;
                return (
                  <SelectionCard
                    key={market}
                    selected={selected}
                    onClick={() => updateDraft({ country: market })}
                    tone={market}>
                    <div className="flex gap-[12px] items-start">
                      <div
                        className={cn(
                          "size-[40px] rounded-[10px] border border-[#e2e8f0] flex items-center justify-center shrink-0 text-[20px] leading-none",
                          cs.tint,
                        )}>
                        {meta.flag}
                      </div>
                      <div className="flex flex-col gap-[4px] min-w-0">
                        <p
                          className={cn(
                            "font-bold text-[14px] leading-[20px]",
                            selected ? cs.titleColor : "text-[#343434]",
                          )}>
                          {meta.label}
                        </p>
                        <p className="font-bold text-[12px] leading-[16px] text-[#707070]">
                          {records.filter(r => r.market === market).length} past proposals
                        </p>
                      </div>
                    </div>
                  </SelectionCard>
                );
              },
            )}
          </div>
        </WizardFieldSection>

        {/* Language */}
        <WizardFieldSection
          label="Select Language"
          hint="Selecting Both enables bilingual fields and RTL preview">
          <div className="grid grid-cols-3 gap-[12px]">
            {LANGUAGES.map((l) => {
              const selected = draft.language === l.key;
              return (
                <SelectionCard
                  key={l.key}
                  selected={selected}
                  onClick={() => updateDraft({ language: l.key })}>
                  <div className="h-[24px] flex items-center">
                    <p
                      className={cn(
                        "font-bold text-[14px] leading-[20px]",
                        selected ? "text-[#0047ff]" : "text-[#343434]",
                      )}>
                      {l.label}
                    </p>
                  </div>
                </SelectionCard>
              );
            })}
          </div>
          {draft.language ? <LanguageNote language={draft.language} /> : null}
        </WizardFieldSection>

        {/* Service */}
        <WizardFieldSection
          label="Service"
          hint="Selecting a service auto-imports CMS content into the builder">
          <div className="grid grid-cols-3 gap-[12px]">
            {SERVICE_OPTIONS.map((s) => {
              const selected = (draft.services || []).includes(s.key);
              const Icon = s.icon;
              return (
                <SelectionCard
                  key={s.key}
                  selected={selected}
                  onClick={() => {
                    const current = draft.services || [];
                    if (selected) {
                      updateDraft({ services: current.filter(x => x !== s.key) });
                    } else {
                      updateDraft({ services: [...current, s.key] });
                    }
                  }}>
                  <div className="flex gap-[12px] items-start">
                    <div
                      className={cn(
                        "size-[40px] rounded-[10px] flex items-center justify-center shrink-0 bg-[rgba(0,71,255,0.1)]",
                      )}>
                      <Icon className="size-4 text-[#0047ff]" strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col gap-[4px] min-w-0">
                      <p
                        className={cn(
                          "font-bold text-[14px] leading-[20px]",
                          selected ? "text-[#0047ff]" : "text-[#343434]",
                        )}>
                        {s.label}
                      </p>
                      <p className="font-bold text-[12px] leading-[16px] text-[#707070]">
                        {s.hint}
                      </p>
                    </div>
                  </div>
                </SelectionCard>
              );
            })}
          </div>
        </WizardFieldSection>

        {/* Validity */}
        <WizardFieldSection
          label="Validity (days)"
          hint={`Expires ${expiresAtLabel}`}>
          <div className="flex flex-col gap-[12px]">
            <div className="grid grid-cols-7 gap-[12px]">
              {VALIDITY_PILLS.map((p) => {
                const selected =
                  p.value === 0
                    ? isCustomValidity
                    : !isCustomValidity && draft.validityDays === p.value;
                return (
                  <SelectionCard
                    key={p.value}
                    selected={selected}
                    onClick={() => {
                      if (p.value === 0) {
                        setIsCustomValidity(true);
                      } else {
                        setIsCustomValidity(false);
                        updateDraft({ validityDays: p.value });
                      }
                    }}>
                    <div className="h-[24px] flex items-center justify-center">
                      <p
                        className={cn(
                          "font-bold text-[14px] leading-[20px] whitespace-nowrap",
                          selected ? "text-[#0047ff]" : "text-[#343434]",
                        )}>
                        {p.label}
                      </p>
                    </div>
                  </SelectionCard>
                );
              })}
            </div>
            {isCustomValidity && (
              <input
                type="number"
                min="1"
                value={draft.validityDays || ""}
                onChange={(e) => updateDraft({ validityDays: parseInt(e.target.value) || 0 })}
                placeholder="Enter number of days..."
                className={FIELD_INPUT_CLASS}
              />
            )}
          </div>
        </WizardFieldSection>

        {/* Dimensions + Client */}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[24px]">
          <WizardFieldSection label="Proposal Dimensions">
            <div className="grid grid-cols-2 gap-[12px]">
              {(
                [
                  { key: "powerpoint" as ProposalDimensions, label: "Powerpoint (16:9)" },
                  { key: "a4" as ProposalDimensions, label: "A4" },
                ]
              ).map((d) => {
                const selected = draft.dimensions === d.key;
                return (
                  <SelectionCard
                    key={d.key}
                    selected={selected}
                    onClick={() => updateDraft({ dimensions: d.key })}>
                    <div className="flex flex-col gap-[12px]">
                      <div
                        className={cn(
                          "rounded-[8px] overflow-hidden",
                          d.key === "a4" ? "w-[58%] mx-auto" : "w-full",
                        )}>
                        <CoverThumb
                          dimension={d.key}
                          headline={
                            draft.headline || "Website Project Proposal"
                          }
                          subtitle={
                            draft.shortDescription ||
                            "Development Of A New Full Website For Client's Real-Estate Company"
                          }
                          client={draft.client?.name || "Client Name"}
                          date={coverDate}
                          validTill={coverValidTill}
                          slogan={draft.slogan}
                          className="rounded-[8px]"
                        />
                      </div>
                      <p
                        className={cn(
                          "font-bold text-[12px] leading-[16px]",
                          selected ? "text-[#0047ff]" : "text-[#343434]",
                        )}>
                        {d.label}
                      </p>
                    </div>
                  </SelectionCard>
                );
              })}
            </div>
          </WizardFieldSection>

          <WizardFieldSection
            label="Client"
            hint={
              <button
                type="button"
                onClick={() => setAddClientOpen(true)}
                className="text-[#0047ff] text-[12px] font-bold inline-flex items-center gap-[4px] hover:underline">
                <Plus className="size-3" strokeWidth={2.4} />
                New Client
              </button>
            }>
            <div className="flex flex-col gap-[8px]">
              <div className="bg-[#edf2f7] rounded-[8px] h-[40px] px-[12px] flex items-center gap-[12px]">
                <Search
                  className="size-[12px] text-[#707070] shrink-0"
                  strokeWidth={2.2}
                />
                <input
                  type="search"
                  placeholder="Search by name or email address..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="bg-transparent outline-none text-[12px] font-normal text-[#343434] placeholder:text-[#707070] flex-1 leading-[20px]"
                />
              </div>
              <div className="flex flex-col gap-[6px] max-h-[230px] overflow-y-auto no-scrollbar">
                {filteredClients.map((c) => {
                  const selected = draft.client?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateDraft({ client: c })}
                      className={cn(
                        "relative flex items-center gap-[12px] p-[12px] rounded-[8px] border outline-none text-left transition-colors",
                        selected
                          ? "bg-[rgba(0,71,255,0.1)] border-[#0047ff]"
                          : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]",
                      )}>
                      <Avatar className="size-[32px]">
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                        <span
                          className={cn(
                            "text-[14px] font-bold leading-[20px]",
                            selected ? "text-[#0047ff]" : "text-[#343434]",
                          )}>
                          {c.name}
                        </span>
                        <span className="text-[12px] font-normal leading-[16px] text-[#707070] truncate">
                          {c.email}
                        </span>
                      </div>
                      {selected ? (
                        <span className="size-[20px] rounded-full bg-[#0047ff] text-white flex items-center justify-center">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </WizardFieldSection>
        </div>

        {/* Headline + Description */}
        <div
          className={cn(
            "grid gap-[24px]",
            draft.language === "both"
              ? "grid-cols-1"
              : "grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
          )}>
          <WizardFieldSection label="Headline">
            <BilingualTextField
              language={draft.language}
              value={draft.headline}
              onChange={(v) => updateDraft({ headline: v })}
              arValue={draft.arOverrides?.["headline"] ?? ""}
              onArChange={(v) => setArOverride("headline", v)}
              placeholder="Ex. Website Project Proposal"
              arPlaceholder="مثال. عرض مشروع موقع إلكتروني"
            />
          </WizardFieldSection>
          <WizardFieldSection label="Short Description">
            <BilingualTextField
              language={draft.language}
              value={draft.shortDescription}
              onChange={(v) => updateDraft({ shortDescription: v })}
              arValue={draft.arOverrides?.["shortDescription"] ?? ""}
              onArChange={(v) => setArOverride("shortDescription", v)}
              placeholder="One line-paragraph context for the executive summary."
              arPlaceholder="سطر واحد يوضح سياق الملخص التنفيذي."
            />
          </WizardFieldSection>
          <WizardFieldSection label="Slogan">
            <BilingualTextField
              language={draft.language}
              value={draft.slogan ?? "الشغل الزين .. يبيله ماستر"}
              onChange={(v) => updateDraft({ slogan: v })}
              arValue={draft.arOverrides?.["slogan"] ?? ""}
              onArChange={(v) => setArOverride("slogan", v)}
              placeholder="Ex. الشغل الزين .. يبيله ماستر"
              arPlaceholder="مثال. الشغل الزين .. يبيله ماستر"
            />
          </WizardFieldSection>
        </div>

        {/* Live Preview */}
        <WizardFieldSection label="Live Preview">
          <div className="flex flex-col gap-[8px] w-full">
            <div
              dir={directionFor(primaryVariant(draft.language))}
              className="rounded-[16px] overflow-hidden w-full mx-auto"
              style={{
                maxWidth: draft.dimensions === "a4" ? 520 : "100%",
              }}>
              <CoverThumb
                dimension={draft.dimensions ?? "powerpoint"}
                headline={draft.headline || "Website Project Proposal"}
                subtitle={
                  draft.shortDescription ||
                  "Development Of A New Full Website For Client's Real-Estate Company"
                }
                client={draft.client?.name || "Client Name"}
                date={coverDate}
                validTill={coverValidTill}
                slogan={draft.slogan}
                className="rounded-[16px]"
              />
            </div>
            <p className="text-[12px] font-bold text-[#707070] text-center">
              {draft.dimensions === "powerpoint"
                ? "PowerPoint (16:9 · Landscape)"
                : "A4 (Portrait)"}
              {" · "}
              {directionFor(primaryVariant(draft.language)) === "rtl"
                ? "Right-to-left"
                : "Left-to-right"}
            </p>
          </div>
        </WizardFieldSection>

        {/* Footer actions */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => router.push("/client-relations-management/proposals")}
            className="bg-[#edf2f7] h-[40px] px-[20px] py-[16px] rounded-[12px] flex items-center justify-center gap-[8px] outline-none transition-colors hover:bg-[#dfe5ec] w-[120px]">
            <span className="font-bold text-[12px] leading-[22.4px] text-[#707070]">
              Cancel
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/client-relations-management/proposals/new/builder")}
            disabled={!canContinue}
            className={cn(
              "h-[40px] px-[20px] py-[16px] rounded-[12px] flex items-center justify-center gap-[8px] outline-none transition-colors",
              canContinue
                ? "bg-[#0047ff] hover:bg-[#0047ff]/90"
                : "bg-[#0047ff]/50 cursor-not-allowed",
            )}>
            <span className="font-bold text-[12px] leading-[22.4px] text-white whitespace-nowrap">
              Continue to builder
            </span>
            <ArrowRight className="size-[16px] text-white" strokeWidth={2.4} />
          </button>
        </div>

        <ClientFormModal
          open={addClientOpen}
          onOpenChange={setAddClientOpen}
          onSuccess={() => {
            setAddClientOpen(false);
            fetchClients(); // Refresh list to get the newly added client
          }}
        />
      </div>
    </div>
  );
}

/**
 * Renders the real proposal {@link CoverPage} (the same artwork used in the
 * document & export) scaled down to fit its container — so the dimension
 * previews and the live preview are pixel-identical to the final cover.
 */
function CoverThumb({
  dimension,
  headline,
  subtitle,
  client,
  date,
  validTill,
  slogan,
  className,
}: {
  dimension: ProposalDimensions;
  headline: string;
  subtitle: string;
  client: string;
  date: string;
  validTill: string;
  slogan?: string;
  className?: string;
}) {
  return (
    <ScaledPage fit="width" className={cn("w-full", className)}>
      <div style={{ width: PAGE_WIDTH, height: pageHeightFor(dimension) }}>
        <CoverPage
          landscape={dimension === "powerpoint"}
          aspect={pageAspectFor(dimension)}
          headline={headline}
          subtitle={subtitle}
          client={client}
          date={date}
          validTill={validTill}
          slogan={slogan}
        />
      </div>
    </ScaledPage>
  );
}

const FIELD_INPUT_CLASS =
  "bg-[#edf2f7] h-[40px] px-[12px] rounded-[8px] outline-none text-[12px] font-normal text-[#343434] placeholder:text-[#707070] w-full leading-[20px]";

/**
 * Single-line text field with bilingual support.
 *  - "both"    → English (LTR) + Arabic (RTL) inputs side by side. English
 *                writes the main field; Arabic writes the `arOverrides` entry.
 *  - "arabic"  → one RTL input writing the main field (the proposal is Arabic).
 *  - otherwise → one LTR input writing the main field.
 */
function BilingualTextField({
  language,
  value,
  onChange,
  arValue,
  onArChange,
  placeholder,
  arPlaceholder,
}: {
  language?: ProposalLanguage;
  value: string;
  onChange: (value: string) => void;
  arValue: string;
  onArChange: (value: string) => void;
  placeholder?: string;
  arPlaceholder?: string;
}) {
  if (language === "both") {
    return (
      <div className="grid grid-cols-2 gap-[12px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0047ff]">
            English
          </span>
          <input
            type="text"
            dir="ltr"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={FIELD_INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9359ff]">
            العربية
          </span>
          <input
            type="text"
            dir="rtl"
            value={arValue}
            onChange={(e) => onArChange(e.target.value)}
            placeholder={arPlaceholder}
            className={FIELD_INPUT_CLASS}
          />
        </div>
      </div>
    );
  }

  const isArabic = language === "arabic";
  return (
    <input
      type="text"
      dir={isArabic ? "rtl" : "ltr"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isArabic ? arPlaceholder : placeholder}
      className={FIELD_INPUT_CLASS}
    />
  );
}

/**
 * Explains the consequence of the language choice: the reading direction,
 * and — for "both" — that two bilingual proposals will be produced.
 */
function LanguageNote({ language }: { language: ProposalLanguage }) {
  if (language === "both") {
    return (
      <div className="mt-[8px] flex items-start gap-[8px] rounded-[8px] bg-[rgba(0,71,255,0.06)] p-[12px]">
        <Languages
          className="size-[14px] text-[#0047ff] mt-[1px] shrink-0"
          strokeWidth={2.4}
        />
        <p className="text-[12px] font-bold leading-[18px] text-[#343434]">
          Two proposals will be generated —{" "}
          <span className="text-[#0047ff]">English (LTR)</span> and{" "}
          <span className="text-[#9359ff]">Arabic (RTL)</span>. All builder
          fields become bilingual, accepting both English and Arabic content.
        </p>
      </div>
    );
  }
  const isAr = language === "arabic";
  return (
    <div className="mt-[8px] flex items-center gap-[8px] rounded-[8px] bg-[#f8fafc] p-[12px]">
      <Info className="size-[14px] text-[#707070] shrink-0" strokeWidth={2.4} />
      <p className="text-[12px] font-bold leading-[18px] text-[#343434]">
        {isAr ? "Arabic" : "English"} proposal ·{" "}
        {isAr ? "Right-to-left (RTL)" : "Left-to-right (LTR)"} layout.
      </p>
    </div>
  );
}
