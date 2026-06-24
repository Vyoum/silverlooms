import type { HomepageAnnouncementContent } from "@/lib/site-content/types";
import { defaultHomepageContent } from "@/lib/site-content/defaults";

export function AnnouncementBar({
  content = defaultHomepageContent.announcement,
}: {
  content?: HomepageAnnouncementContent;
}) {
  return (
    <div className="bg-ink py-2 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[2.2px] text-cream">
        {content.text}{" "}
        <span className="mx-2 text-border-strong">|</span>
        <a href={content.linkHref} className="underline underline-offset-2">
          {content.linkText}
        </a>
      </p>
    </div>
  );
}
