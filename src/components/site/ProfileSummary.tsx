"use client";

import { useEffect, useRef, useState } from "react";

export function ProfileSummary({ children, expandLabel = "More", collapseLabel = "Less" }: { children: string; expandLabel?: string; collapseLabel?: string }) {
  const description = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const measure = () => {
      const element = description.current;
      if (!element) return;
      setCanExpand(element.scrollHeight > element.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (description.current) observer.observe(description.current);
    return () => observer.disconnect();
  }, [children, expanded]);

  return <div className="profile-summary">
    <p ref={description} className={`section-copy profile-summary-copy${expanded ? " profile-summary-copy--expanded" : ""}`}>{children}</p>
    {(canExpand || expanded) ? <button className="profile-summary-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? collapseLabel : expandLabel}</button> : null}
  </div>;
}
