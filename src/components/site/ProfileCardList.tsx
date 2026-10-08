"use client";

import { Children, type ReactNode, useState } from "react";

export function ProfileCardList({ itemLabel, children }: { itemLabel: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const visibleItems = expanded ? items : items.slice(0, 6);
  return <><p className="directory-result-count">{items.length} {itemLabel}{items.length === 1 ? "" : "s"}</p><div className="grid grid--three">{visibleItems}</div>{items.length > 6 ? <button className="profile-list-toggle" type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show fewer" : `View all ${items.length} ${itemLabel}${items.length === 1 ? "" : "s"} →`}</button> : null}</>;
}
