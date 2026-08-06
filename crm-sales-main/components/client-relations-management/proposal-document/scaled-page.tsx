"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PAGE_WIDTH } from "@/lib/proposal-layout";

interface ScaledPageProps {
  children: React.ReactNode;
  /** Explicit scale factor. When set, fit-to-parent measuring is skipped. */
  zoom?: number;
  /**
   * Layout mode when `zoom` is omitted:
   *  - "width" (default): fill the parent's width; height follows content.
   *  - "box": shrink the whole page to fit inside the parent box (letterbox).
   */
  fit?: "width" | "box";
  className?: string;
}

/**
 * Renders a proposal page — authored at {@link PAGE_WIDTH} with a
 * content-driven height — scaled down for preview.
 *
 * The page's natural height is measured from the rendered content (a CSS
 * `transform: scale()` does not change `offsetHeight`), so a page never gets
 * clipped: short pages fill the sheet via the page's own `min-height`, and
 * long pages grow to fit whatever is inside them.
 */
export function ScaledPage({
  children,
  zoom,
  fit = "width",
  className,
}: ScaledPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(zoom ?? 0);
  const [boxHeight, setBoxHeight] = React.useState<number | undefined>(
    undefined,
  );

  React.useLayoutEffect(() => {
    const measure = () => {
      const naturalH = innerRef.current?.offsetHeight ?? 0;
      if (zoom !== undefined) {
        setScale(zoom);
        setBoxHeight(naturalH * zoom);
        return;
      }
      const cw = containerRef.current?.clientWidth ?? 0;
      if (fit === "box") {
        const ch = containerRef.current?.clientHeight ?? 0;
        const s =
          naturalH > 0
            ? Math.min(cw / PAGE_WIDTH, ch / naturalH)
            : cw / PAGE_WIDTH;
        setScale(s);
        setBoxHeight(undefined); // height comes from the parent box
      } else {
        const s = cw / PAGE_WIDTH;
        setScale(s);
        setBoxHeight(naturalH * s);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [zoom, fit]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        width: zoom !== undefined ? PAGE_WIDTH * zoom : undefined,
        height: boxHeight,
      }}>
      <div
        ref={innerRef}
        style={{
          width: PAGE_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          background: "white",
        }}>
        {children}
      </div>
    </div>
  );
}
