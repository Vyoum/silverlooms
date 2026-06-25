export type HomepageAnnouncementContent = {
  text: string;
  linkText: string;
  linkHref: string;
};

export type HomepageHeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
};

export type HomepageEditorialContent = {
  eyebrow: string;
  title: string;
  body: string;
  linkText: string;
  linkHref: string;
  imageUrl: string;
  imageAlt: string;
};

export type HomepageBrandStoryContent = {
  quote: string;
  captionEyebrow: string;
  captionTitle: string;
  imageUrl: string;
  imageAlt: string;
};

export type HomepageStyleTile = {
  name: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

export type HomepageContent = {
  announcement: HomepageAnnouncementContent;
  hero: HomepageHeroContent;
  editorial: HomepageEditorialContent;
  brandStory: HomepageBrandStoryContent;
  shopByStyles: HomepageStyleTile[];
};

export const HOMEPAGE_CONTENT_KEY = "homepage";
