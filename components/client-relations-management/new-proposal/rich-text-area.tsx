"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered,
  ChevronDown,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Baseline,
} from "lucide-react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import { cn } from "@/lib/utils";
import { useEditMode } from "./module-shell";
import { useProposalDraft } from "./proposal-draft-context";

interface RichTextAreaProps {
  /** HTML string. The component stores its content as HTML. */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Minimum visible height in px (excluding toolbar). */
  minHeight?: number;
  /** When false, renders read-only HTML with no chrome. */
  editing?: boolean;
  onRequestEdit?: () => void;
  /** Stable id; mirrors the field into Arabic when language === "both". */
  fieldPath?: string;
  /** Hard character cap, enforced only for the PowerPoint (landscape) format. */
  maxChars?: number;
}

/** Default landscape character cap when a field doesn't specify one. */
const DEFAULT_LANDSCAPE_CAP = 480;

/**
 * Shared prose styling — applied identically to the editor surface, the
 * read-mode render here, AND the proposal document (see {@link HtmlBody} in
 * `proposal-document/pages.tsx`) so rich text looks the same everywhere.
 * Inline `style` (color, text-align) from TipTap is preserved by the browser.
 */
export const PROSE_CLASS = cn(
  "leading-[1.7]",
  "[&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic",
  "[&_u]:underline [&_s]:line-through",
  "[&_h1]:font-bold [&_h1]:text-[1.5em] [&_h1]:leading-tight [&_h1]:my-1",
  "[&_h2]:font-bold [&_h2]:text-[1.25em] [&_h2]:leading-tight [&_h2]:my-1",
  "[&_h3]:font-bold [&_h3]:text-[1.1em] [&_h3]:leading-tight [&_h3]:my-0.5",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-0.5 [&_li]:marker:text-current",
  "[&_a]:text-[#0047ff] [&_a]:underline",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#0047ff]/40 [&_blockquote]:pl-3 [&_blockquote]:italic",
  "[&_p]:mb-1 [&_p:last-child]:mb-0",
);

const SWATCHES = [
  "#343434",
  "#0047FF",
  "#0AA92A",
  "#F60F13",
  "#F6960F",
  "#9359FF",
  "#707070",
  "#FFFFFF",
];

type BlockFormat = "P" | "H1" | "H2" | "H3" | "BLOCKQUOTE";
const BLOCKS: { value: BlockFormat; label: string }[] = [
  { value: "P", label: "Normal" },
  { value: "H1", label: "Heading 1" },
  { value: "H2", label: "Heading 2" },
  { value: "H3", label: "Heading 3" },
  { value: "BLOCKQUOTE", label: "Quote" },
];

/**
 * Rich-text editor (TipTap) that flips between an **edit** and **read** mode,
 * with a bilingual (EN+AR) split when the proposal language is "both".
 */
export function RichTextArea({
  value,
  onChange,
  placeholder = "Type here…",
  className,
  minHeight = 96,
  editing: editingProp,
  onRequestEdit: onRequestEditProp,
  fieldPath,
  maxChars,
}: RichTextAreaProps) {
  const { editing: ctxEditing, requestEdit: ctxRequestEdit, registerRevert } =
    useEditMode();
  const editing = editingProp ?? ctxEditing;
  const onRequestEdit = onRequestEditProp ?? ctxRequestEdit;

  const { draft, setArOverride } = useProposalDraft();
  const bilingual = Boolean(fieldPath) && draft.language === "both";
  const arValue = fieldPath ? (draft.arOverrides?.[fieldPath] ?? "") : "";

  /* Snapshot for "Discard Changes" — restore the pre-edit value. */
  const snapshotRef = React.useRef(value);
  React.useEffect(() => {
    if (!editing || bilingual) return;
    snapshotRef.current = value;
    return registerRevert(() => onChange(snapshotRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  /* ─── Bilingual split (EN + AR side by side) ─────────────────────── */
  if (bilingual && fieldPath) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {/* English (LTR) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0047FF]">
            English (EN)
          </span>
          <div dir="ltr">
            <RichTextArea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              minHeight={minHeight}
              editing={editing}
              onRequestEdit={onRequestEdit}
              maxChars={maxChars}
            />
          </div>
        </div>
        {/* Arabic (RTL) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9359FF]">
            العربية (AR)
          </span>
          <div dir="rtl">
            <RichTextArea
              value={arValue}
              onChange={(v) => setArOverride(fieldPath, v)}
              placeholder="اكتب هنا…"
              minHeight={minHeight}
              editing={editing}
              onRequestEdit={onRequestEdit}
              maxChars={maxChars}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ─── Read mode ──────────────────────────────────────────────────── */
  if (!editing) {
    const hasContent = value && value.replace(/<[^>]*>/g, "").trim() !== "";
    return (
      <div className={cn("bg-transparent px-1 py-1", className)}>
        {hasContent ? (
          <div
            className={cn("text-[12px] text-[#343434]", PROSE_CLASS)}
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p
            className="text-[12px] italic text-muted-foreground"
            style={{ minHeight }}>
            {placeholder}
          </p>
        )}
      </div>
    );
  }

  /* ─── Edit mode (TipTap) ─────────────────────────────────────────── */
  return (
    <TiptapEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      minHeight={minHeight}
      maxChars={maxChars}
      className={className}
    />
  );
}

/* ─── The TipTap editor (mounted only while editing) ───────────────── */

function TiptapEditor({
  value,
  onChange,
  placeholder,
  minHeight = 96,
  maxChars,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  minHeight?: number;
  maxChars?: number;
  className?: string;
}) {
  const { draft } = useProposalDraft();
  const landscape = draft.dimensions === "powerpoint";
  const cap = landscape ? (maxChars ?? DEFAULT_LANDSCAPE_CAP) : maxChars;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener" } },
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      cap != null
        ? CharacterCount.configure({ limit: cap })
        : CharacterCount,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "outline-none text-xs font-bold text-foreground px-3 py-2",
          PROSE_CLASS,
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
        ),
        "data-placeholder": placeholder,
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  /* Keep editor in sync if the external value changes (e.g. discard). */
  React.useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const used = editor?.storage.characterCount?.characters?.() ?? 0;

  return (
    <div
      className={cn(
        "relative bg-background border border-border rounded-[8px] focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40",
        className,
      )}>
      <Toolbar editor={editor} cap={cap} used={used} />
      <EditorContent editor={editor} />
    </div>
  );
}

/* ─── Toolbar ──────────────────────────────────────────────────────── */

function Toolbar({
  editor,
  cap,
  used,
}: {
  editor: Editor | null;
  cap?: number;
  used: number;
}) {
  if (!editor) {
    return <div className="h-9 border-b border-border bg-muted/30" />;
  }

  const currentBlock: BlockFormat = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
      ? "H2"
      : editor.isActive("heading", { level: 3 })
        ? "H3"
        : editor.isActive("blockquote")
          ? "BLOCKQUOTE"
          : "P";

  const setBlock = (b: BlockFormat) => {
    const chain = editor.chain().focus();
    if (b === "P") chain.setParagraph().run();
    else if (b === "BLOCKQUOTE") chain.toggleBlockquote().run();
    else chain.toggleHeading({ level: Number(b[1]) as 1 | 2 | 3 }).run();
  };

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Paste the URL to link:", prev ?? "");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="px-3 h-9 flex items-center justify-between gap-2 border-b border-border bg-muted/30 rounded-t-[8px]">
      <Popover
        align="left"
        width={140}
        trigger={({ ref, toggle }) => (
          <button
            ref={ref}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggle}
            className="flex items-center gap-1.5 text-xs font-bold leading-none text-foreground outline-none">
            {BLOCKS.find((b) => b.value === currentBlock)?.label ?? "Normal"}
            <ChevronDown className="size-3 text-muted-foreground" strokeWidth={2.2} />
          </button>
        )}>
        {(close) => (
          <div className="p-1">
            {BLOCKS.map((b) => (
              <button
                key={b.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setBlock(b.value);
                  close();
                }}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs font-bold outline-none",
                  currentBlock === b.value
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}>
                {b.label}
              </button>
            ))}
          </div>
        )}
      </Popover>

      <div className="flex items-center gap-0.5">
        <ToolBtn active={editor.isActive("bulletList")} ariaLabel="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListIcon className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} ariaLabel="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <Divider />
        <ToolBtn active={editor.isActive("bold")} ariaLabel="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("italic")} ariaLabel="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("underline")} ariaLabel="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <Divider />
        <ToolBtn active={editor.isActive({ textAlign: "left" })} ariaLabel="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })} ariaLabel="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "right" })} ariaLabel="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="size-3" strokeWidth={2.4} />
        </ToolBtn>
        <Divider />
        <ToolBtn active={editor.isActive("link")} ariaLabel="Insert link" onClick={addLink}>
          <LinkIcon className="size-3" strokeWidth={2.4} />
        </ToolBtn>

        {/* Color picker */}
        <Popover
          align="right"
          width={172}
          trigger={({ ref, toggle, open }) => (
            <button
              ref={ref}
              type="button"
              aria-label="Text color"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggle}
              className={cn(
                "size-6 rounded-[6px] flex items-center justify-center transition-colors outline-none",
                open ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
              )}>
              <Baseline className="size-3" strokeWidth={2.4} />
            </button>
          )}>
          {(close) => (
            <div className="p-2">
              <div className="grid grid-cols-4 gap-1.5">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Color ${c}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().setColor(c).run();
                      close();
                    }}
                    className="size-7 rounded-[6px] border border-border outline-none hover:scale-105 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <input
                  type="color"
                  aria-label="Custom color"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className="size-6 rounded cursor-pointer bg-transparent"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    close();
                  }}
                  className="text-[11px] font-bold text-muted-foreground hover:text-foreground outline-none">
                  Clear
                </button>
              </div>
            </div>
          )}
        </Popover>

        {cap != null ? (
          <>
            <Divider />
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums leading-none px-1",
                used >= cap ? "text-destructive" : "text-muted-foreground",
              )}>
              {used}/{cap}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Toolbar dropdown rendered in a portal (document.body) so it can never be
 * clipped by ancestor `overflow-hidden` (the collapsible sub-item card, the
 * RTL Arabic field, etc.). Positioned fixed under its trigger.
 */
function Popover({
  trigger,
  align = "left",
  width = 160,
  children,
}: {
  trigger: (args: {
    ref: React.RefObject<HTMLButtonElement | null>;
    toggle: () => void;
    open: boolean;
  }) => React.ReactNode;
  align?: "left" | "right";
  width?: number;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const popRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(
    null,
  );

  React.useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    let left = align === "right" ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    setPos({ top: r.bottom + 4, left });
  }, [open, align, width]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (popRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {trigger({ ref: btnRef, toggle: () => setOpen((v) => !v), open })}
      {open && pos
        ? createPortal(
            <div
              ref={popRef}
              style={{ position: "fixed", top: pos.top, left: pos.left, width }}
              className="z-[60] bg-background border border-border rounded-[8px] shadow-xl">
              {children(() => setOpen(false))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function ToolBtn({
  ariaLabel,
  onClick,
  active,
  children,
}: {
  ariaLabel: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "size-6 rounded-[6px] flex items-center justify-center transition-colors outline-none",
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
      )}>
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-4 w-px bg-border" />;
}
