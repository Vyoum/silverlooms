"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import {
  updateHomepageContentAction,
  type ContentActionResult,
} from "@/features/admin/actions/content-actions";
import type { HomepageContent } from "@/lib/site-content/types";
import { BrandStorySectionPreview } from "@/features/admin/components/brand-story-section-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ContentActionResult = { success: false };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-medium text-admin-ink">{title}</h2>
        <p className="mt-1 text-sm text-admin-muted">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ImageField({
  label,
  name,
  urlName,
  currentUrl,
  alt,
  layout = "horizontal",
}: {
  label: string;
  name: string;
  urlName: string;
  currentUrl: string;
  alt: string;
  layout?: "horizontal" | "stacked";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayUrl = previewUrl ?? currentUrl;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setSelectedFileName(null);
      return;
    }

    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setSelectedFileName(file.name);
  }

  const isStacked = layout === "stacked";

  return (
    <div className="rounded-xl border border-admin-border bg-admin-canvas p-4">
      <FieldLabel>{label}</FieldLabel>
      <div
        className={
          isStacked
            ? "mt-2 flex flex-col gap-3"
            : "mt-2 flex flex-col gap-4 sm:flex-row sm:items-start"
        }
      >
        <div
          className={
            isStacked
              ? "relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-admin-border bg-white"
              : "relative aspect-[4/5] w-full max-w-[200px] shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white"
          }
        >
          <Image
            src={displayUrl}
            alt={alt}
            fill
            unoptimized
            className="object-cover"
            sizes={isStacked ? "280px" : "200px"}
          />
        </div>
        {isStacked ? (
          <>
            <input
              ref={fileRef}
              type="file"
              name={name}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              Upload new image
            </Button>
            <Input name={urlName} defaultValue={currentUrl} placeholder="Image URL" />
            {selectedFileName ? (
              <p className="text-xs text-admin-muted">
                Selected: <span className="text-admin-ink">{selectedFileName}</span>
                {" · "}
                Save to apply
              </p>
            ) : null}
          </>
        ) : (
          <div className="min-w-0 flex-1 space-y-3">
            <Input name={urlName} defaultValue={currentUrl} placeholder="Image URL" />
            <input
              ref={fileRef}
              type="file"
              name={name}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              Upload new image
            </Button>
            {selectedFileName ? (
              <p className="text-xs text-admin-muted">
                Selected: <span className="text-admin-ink">{selectedFileName}</span>
                {" · "}
                Save to apply
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function HomepageContentForm({ content }: { content: HomepageContent }) {
  const [state, action, pending] = useActionState(
    async (_prev: ContentActionResult, formData: FormData) =>
      updateHomepageContentAction(formData),
    initialState,
  );

  return (
    <form action={action} encType="multipart/form-data" className="space-y-6">
      <SectionCard
        title="Announcement Bar"
        description="Top banner message on every storefront page."
      >
        <div>
          <FieldLabel>Message</FieldLabel>
          <Input name="announcementText" defaultValue={content.announcement.text} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Link Text</FieldLabel>
            <Input name="announcementLinkText" defaultValue={content.announcement.linkText} />
          </div>
          <div>
            <FieldLabel>Link URL</FieldLabel>
            <Input name="announcementLinkHref" defaultValue={content.announcement.linkHref} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Homepage Hero"
        description="Main banner on the homepage with headline and CTAs."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input name="heroEyebrow" defaultValue={content.hero.eyebrow} />
          </div>
          <div>
            <FieldLabel>Image Alt Text</FieldLabel>
            <Input name="heroImageAlt" defaultValue={content.hero.imageAlt} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>Title Line 1</FieldLabel>
            <Input name="heroTitleLine1" defaultValue={content.hero.titleLine1} />
          </div>
          <div>
            <FieldLabel>Accent Word</FieldLabel>
            <Input name="heroTitleAccent" defaultValue={content.hero.titleAccent} />
          </div>
          <div>
            <FieldLabel>Title Line 2</FieldLabel>
            <Input name="heroTitleLine2" defaultValue={content.hero.titleLine2} />
          </div>
        </div>
        <div>
          <FieldLabel>Subtitle</FieldLabel>
          <Input name="heroSubtitle" defaultValue={content.hero.subtitle} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Primary CTA Label</FieldLabel>
            <Input name="heroPrimaryCtaLabel" defaultValue={content.hero.primaryCtaLabel} />
          </div>
          <div>
            <FieldLabel>Primary CTA Link</FieldLabel>
            <Input name="heroPrimaryCtaHref" defaultValue={content.hero.primaryCtaHref} />
          </div>
          <div>
            <FieldLabel>Secondary CTA Label</FieldLabel>
            <Input name="heroSecondaryCtaLabel" defaultValue={content.hero.secondaryCtaLabel} />
          </div>
          <div>
            <FieldLabel>Secondary CTA Link</FieldLabel>
            <Input name="heroSecondaryCtaHref" defaultValue={content.hero.secondaryCtaHref} />
          </div>
        </div>
        <ImageField
          label="Hero Image"
          name="heroImage"
          urlName="heroImageUrl"
          currentUrl={content.hero.imageUrl}
          alt={content.hero.imageAlt}
        />
      </SectionCard>

      <SectionCard
        title="Editorial Section"
        description="Heritage story block on the homepage."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input name="editorialEyebrow" defaultValue={content.editorial.eyebrow} />
          </div>
          <div>
            <FieldLabel>Link Text</FieldLabel>
            <Input name="editorialLinkText" defaultValue={content.editorial.linkText} />
          </div>
        </div>
        <div>
          <FieldLabel>Title</FieldLabel>
          <Input name="editorialTitle" defaultValue={content.editorial.title} />
        </div>
        <div>
          <FieldLabel>Body</FieldLabel>
          <textarea
            name="editorialBody"
            defaultValue={content.editorial.body}
            rows={4}
            className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-ink outline-none focus:border-admin-primary"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Link URL</FieldLabel>
            <Input name="editorialLinkHref" defaultValue={content.editorial.linkHref} />
          </div>
          <div>
            <FieldLabel>Image Alt Text</FieldLabel>
            <Input name="editorialImageAlt" defaultValue={content.editorial.imageAlt} />
          </div>
        </div>
        <ImageField
          label="Editorial Image"
          name="editorialImage"
          urlName="editorialImageUrl"
          currentUrl={content.editorial.imageUrl}
          alt={content.editorial.imageAlt}
        />
      </SectionCard>

      <SectionCard
        title="Shop By Fabric"
        description="The four fabric tiles on the homepage (Cotton, Lawn Cotton, Chiffon, Jaipur Fabric). Edit the section heading, each tile name, link, and photo."
      >
        <div>
          <FieldLabel>Section Title</FieldLabel>
          <Input name="fabricSectionTitle" defaultValue={content.shopByFabric.title} />
        </div>
        <div>
          <FieldLabel>Section Subtitle</FieldLabel>
          <textarea
            name="fabricSectionSubtitle"
            defaultValue={content.shopByFabric.subtitle}
            rows={2}
            className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-ink outline-none focus:border-admin-primary"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.shopByFabric.fabrics.map((fabric, index) => (
            <div
              key={`fabric-${index}`}
              className="space-y-4 rounded-xl border border-admin-border bg-admin-canvas p-4"
            >
              <p className="text-sm font-medium text-admin-ink">Fabric {index + 1}</p>
              <div>
                <FieldLabel>Name</FieldLabel>
                <Input name={`fabric${index}Name`} defaultValue={fabric.name} />
              </div>
              <div>
                <FieldLabel>Link URL</FieldLabel>
                <Input name={`fabric${index}Href`} defaultValue={fabric.href} />
              </div>
              <div>
                <FieldLabel>Image Alt Text</FieldLabel>
                <Input name={`fabric${index}ImageAlt`} defaultValue={fabric.imageAlt} />
              </div>
              <ImageField
                label="Fabric Photo"
                layout="stacked"
                name={`fabric${index}Image`}
                urlName={`fabric${index}ImageUrl`}
                currentUrl={fabric.imageUrl}
                alt={fabric.imageAlt}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Shop By Styles"
        description="The three style tiles on the homepage (Threads of Paradise, Midnight Kari Grace, Whispers of Charm). Upload or replace each photo."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {content.shopByStyles.map((style, index) => (
            <div
              key={`style-${index}`}
              className="space-y-4 rounded-xl border border-admin-border bg-admin-canvas p-4"
            >
              <p className="text-sm font-medium text-admin-ink">Style {index + 1}</p>
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input name={`style${index}Name`} defaultValue={style.name} />
              </div>
              <div>
                <FieldLabel>Link URL</FieldLabel>
                <Input name={`style${index}Href`} defaultValue={style.href} />
              </div>
              <div>
                <FieldLabel>Image Alt Text</FieldLabel>
                <Input name={`style${index}ImageAlt`} defaultValue={style.imageAlt} />
              </div>
              <ImageField
                label="Style Photo"
                name={`style${index}Image`}
                urlName={`style${index}ImageUrl`}
                currentUrl={style.imageUrl}
                alt={style.imageAlt}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Quote & Portrait Section"
        description="The split block on the homepage: italic quote on the left, editorial portrait on the right with the caption overlay (e.g. “Threads of Paradise”)."
      >
        <BrandStorySectionPreview content={content.brandStory} />
        <div>
          <FieldLabel>Quote</FieldLabel>
          <textarea
            name="brandStoryQuote"
            defaultValue={content.brandStory.quote}
            rows={3}
            className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-ink outline-none focus:border-admin-primary"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Caption Eyebrow</FieldLabel>
            <Input
              name="brandStoryCaptionEyebrow"
              defaultValue={content.brandStory.captionEyebrow}
              placeholder="Threads of Paradise"
            />
          </div>
          <div>
            <FieldLabel>Caption Title</FieldLabel>
            <Input
              name="brandStoryCaptionTitle"
              defaultValue={content.brandStory.captionTitle}
              placeholder="Midnight Kari Grace"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Portrait Image Alt Text</FieldLabel>
          <Input name="brandStoryImageAlt" defaultValue={content.brandStory.imageAlt} />
        </div>
        <ImageField
          label="Portrait Image (right side)"
          name="brandStoryImage"
          urlName="brandStoryImageUrl"
          currentUrl={content.brandStory.imageUrl}
          alt={content.brandStory.imageAlt}
        />
      </SectionCard>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Homepage Content"}
        </Button>
        {state.success ? (
          <p className="text-sm text-emerald-700">Homepage content saved.</p>
        ) : null}
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      </div>
    </form>
  );
}
