"use client";

import * as React from "react";
import {
  ChevronDown,
  Building2,
  Layers,
  Award,
  Calendar,
  CreditCard,
  Shield,
  ClipboardList,
  Pencil,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ModuleKey } from "@/lib/types/proposal-draft";

/* ─── Shared expand/collapse animation ─────────────────────────────── */

/**
 * Smoothly animates its children open/closed by transitioning the CSS grid
 * row track from 0fr → 1fr (height) together with opacity. A single easing
 * curve + duration is used everywhere so every section animates identically.
 */
function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      aria-hidden={!open}>
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}

const MODULE_ICONS: Record<ModuleKey, React.ElementType> = {
  about: Building2,
  service: Layers,
  why: Award,
  scope: Calendar,
  quotation: CreditCard,
  support: Shield,
  whatWeNeed: ClipboardList,
};

interface ModuleShellProps {
  moduleKey: ModuleKey;
  title: string;
  hint: string;
  itemCount: number;
  enabled: boolean;
  onToggle: () => void;
  expanded: boolean;
  onExpandToggle: () => void;
  children?: React.ReactNode;
}

export function ModuleShell({
  moduleKey,
  title,
  hint,
  itemCount,
  enabled,
  onToggle,
  expanded,
  onExpandToggle,
  children,
}: ModuleShellProps) {
  const Icon = MODULE_ICONS[moduleKey];

  return (
    <div
      className={cn(
        "rounded-[8px] overflow-hidden",
        expanded ? "bg-white border border-[#e2e8f0]" : "",
      )}>
      <button
        type="button"
        onClick={onExpandToggle}
        className="bg-[#edf2f7] w-full p-[16px] flex items-center justify-between rounded-[8px] outline-none transition-colors">
        <div className="flex gap-[12px] items-center shrink-0">
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={enabled}
              onCheckedChange={() => onToggle()}
              size="sm"
            />
          </div>
          <div className="flex gap-[12px] items-start shrink-0">
            <div className="size-[40px] rounded-[10px] bg-[rgba(0,71,255,0.1)] ring-1 ring-inset ring-[#0047ff]/30 flex items-center justify-center shrink-0">
              <Icon className="size-[18px] text-[#0047ff]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col gap-[6px] items-start text-left">
              <p className="font-bold text-[16px] leading-[20px] text-[#343434]">
                {title}
              </p>
              <p className="font-bold text-[14px] leading-[16.5px] text-[#64748b] whitespace-nowrap">
                {hint}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-[16px] items-center shrink-0">
          <div className="bg-[rgba(0,71,255,0.1)] h-[32px] px-[12px] flex items-center justify-center rounded-[8px]">
            <span className="font-bold text-[14px] leading-[1.5] text-[#0047ff] whitespace-nowrap">
              {itemCount} items
            </span>
          </div>
          <ChevronDown
            className={cn(
              "size-[18px] text-[#707070] transition-transform",
              expanded && "rotate-180",
            )}
            strokeWidth={2.2}
          />
        </div>
      </button>

      <Collapsible open={expanded}>
        <div className="px-[16px] pb-[16px] pt-[12px] flex flex-col gap-[12px]">
          {children}
        </div>
      </Collapsible>
    </div>
  );
}

/* ─── Edit-mode context ────────────────────────────────────────────── */

/**
 * Lets descendants (like RichTextArea) know whether the surrounding
 * sub-item is in edit mode. Defaults to false so child editors stay in
 * read mode until the user clicks Edit.
 */
const EditModeContext = React.createContext<{
  editing: boolean;
  requestEdit: () => void;
  /**
   * Editors register a revert callback (called on "Discard Changes") that
   * restores the field to its value when edit mode began. Returns an
   * unregister function.
   */
  registerRevert: (fn: () => void) => () => void;
}>({
  editing: false,
  requestEdit: () => {},
  registerRevert: () => () => {},
});

export function useEditMode() {
  return React.useContext(EditModeContext);
}

/* ─── Sub-item card ────────────────────────────────────────────────── */

/**
 * Sub-item card inside an expanded module.
 *
 * State machine:
 *   - **collapsed** (open=false): just the title row.
 *   - **read** (open=true, editing=false): shows the value with no
 *     toolbar, plus an Edit button that flips to edit mode.
 *   - **edit** (open=true, editing=true): shows the toolbar plus Save /
 *     Discard Changes buttons.
 *
 * The component owns its `editing` state and exposes it via the
 * EditModeContext so nested RichTextArea instances hide their toolbar
 * automatically.
 */
export function ModuleSubItem({
  title,
  open,
  onToggle,
  onSave,
  onDiscard,
  children,
  titleClassName,
  /** Skip the Edit/Save controls entirely (e.g. for image-only items). */
  hideEditControls = false,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  children?: React.ReactNode;
  titleClassName?: string;
  hideEditControls?: boolean;
}) {
  const [editing, setEditing] = React.useState(false);

  /* Revert callbacks registered by descendant editors. Each restores its
   * field to the value captured when edit mode began. */
  const revertersRef = React.useRef<Set<() => void>>(new Set());
  const registerRevert = React.useCallback((fn: () => void) => {
    revertersRef.current.add(fn);
    return () => {
      revertersRef.current.delete(fn);
    };
  }, []);

  /* Re-collapsing the sub-item resets it to read mode. */
  React.useEffect(() => {
    if (!open) setEditing(false);
  }, [open]);

  const handleSave = () => {
    setEditing(false);
    onSave?.();
  };
  const handleDiscard = () => {
    /* Restore every registered editor to its pre-edit value. */
    revertersRef.current.forEach((fn) => fn());
    setEditing(false);
    onDiscard?.();
  };
  const handleEdit = () => {
    if (!open) onToggle();
    setEditing(true);
  };

  return (
    <EditModeContext.Provider
      value={{ editing, requestEdit: handleEdit, registerRevert }}>
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] overflow-hidden">
        <div className="px-[16px] h-[44px] flex items-center justify-between">
          <span
            className={cn(
              "text-[14px] font-bold leading-[20px] text-[#343434]",
              titleClassName,
            )}>
            {title}
          </span>
          <div className="flex items-center gap-[12px]">
            {hideEditControls ? null : editing ? (
              <>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="text-[12px] font-bold text-[#f55050] hover:underline">
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-[12px] font-bold text-[#0047ff] hover:underline">
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0047ff] hover:underline">
                <Pencil className="size-3" strokeWidth={2.4} />
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={onToggle}
              aria-label={open ? "Collapse" : "Expand"}
              className="outline-none">
              <ChevronDown
                className={cn(
                  "size-[14px] text-[#707070] transition-transform",
                  open && "rotate-180",
                )}
                strokeWidth={2.2}
              />
            </button>
          </div>
        </div>
        <Collapsible open={open}>
          {/* A disabled <fieldset> makes every form control inside read-only
           * until the user clicks "Edit" — inputs, selects, checkboxes and the
           * add/remove buttons. (RichTextArea handles its own read mode via
           * context.) `display:contents` keeps the layout unchanged. */}
          <fieldset
            disabled={hideEditControls ? false : !editing}
            className="contents">
            <div
              className={cn(
                "px-[16px] pb-[16px] flex flex-col gap-[12px]",
                !hideEditControls && !editing && "opacity-70",
              )}>
              {children}
            </div>
          </fieldset>
        </Collapsible>
      </div>
    </EditModeContext.Provider>
  );
}
