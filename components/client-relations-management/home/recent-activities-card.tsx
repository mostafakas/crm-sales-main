"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectProposals } from "@/lib/store/slices/proposals-slice";

/**
 * Recent Activities card — Figma 2222:8008.
 *
 * Derives its feed from the most recently created proposals in the store
 * (newest first). Each row links to the proposal's detail page.
 */
export function RecentActivitiesCard() {
  const proposals = useAppSelector(selectProposals);

  const activities = React.useMemo(() => {
    return [...proposals]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        actorName: p.client.name,
        action: p.sentAt ? "generated proposal" : "drafted proposal",
        proposalCode: p.code,
        proposalHeadline: p.headline,
        proposalId: p.id,
        relativeTime: formatRelativeTime(p.createdAt),
      }));
  }, [proposals]);

  return (
    <div className="bg-[#f8fafc] flex flex-col gap-[24px] items-start p-[24px] rounded-[12px] w-full">
      <h3 className="font-bold text-[18px] leading-[20px] text-[#343434] w-full">
        Recent Activities
      </h3>

      {activities.length === 0 ? (
        <p className="font-bold text-[14px] leading-[20px] text-[#707070]">
          No activity yet — create a proposal to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-[8px] items-start w-full">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#edf2f7] flex flex-col gap-[4px] items-start p-[12px] rounded-[8px] w-full">
              <p className="font-bold text-[14px] leading-[20px] text-[#343434]">
                <span>{activity.actorName} </span>
                <span className="text-[#707070]">
                  {activity.action} {activity.proposalCode}
                </span>
                <span> · </span>
                <a
                  href={`/client-relations-management/proposals/${activity.proposalId}`}
                  className="text-[#0047ff] hover:underline">
                  {activity.proposalHeadline}
                </a>
              </p>
              <div className="flex items-center gap-[4px]">
                <Clock
                  className="size-[12px] text-[#707070]"
                  strokeWidth={2.2}
                />
                <span className="font-bold text-[12px] leading-[20px] text-[#707070]">
                  {activity.relativeTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
