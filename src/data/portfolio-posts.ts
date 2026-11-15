import { projects, type Project, type ServiceCategorySlug, type BuildingTypeSlug } from './projects';
import clusteredData from './portfolio-clustered.json';

export interface SocialEmbed {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'unknown';
  embedType: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  id: string;
  embedUrl: string;
  username?: string;
  isReel?: boolean;
  isShorts?: boolean;
  valid: boolean;
  error?: string;
}

export interface ClusteredSubItem {
  id: string;
  rowNum: number;
  title: string;
  location: string;
  service: string;
  captionSnippet: string;
  sourceUrl: string;
  embed: SocialEmbed;
  image: string;
}

export interface ClusteredPortfolioPage {
  slug: string;
  type: 'standalone' | 'cluster';
  title: string;
  serviceCategory: ServiceCategorySlug;
  serviceCategoryLabel: string;
  buildingType: BuildingTypeSlug;
  buildingTypeLabel: string;
  kabupaten: string;
  location: string;
  description: string;
  narrative: {
    intro: string;
    sections: Array<{ heading: string; content: string }>;
  };
  specs: Array<{ label: string; value: string }>;
  isIndexable: boolean;
  seoTitle: string;
  seoDescription: string;
  image: string;
  embed?: SocialEmbed;
  sourceUrl?: string;
  originalCaption?: string;
  items?: ClusteredSubItem[];
  relatedProducts: Array<{ name: string; url: string; brand?: string }>;
  relatedArticles: Array<{ title: string; url: string }>;
  relatedServiceUrl: string;
  subItemsCount?: number;
}

export const clusteredPortfolioPages: ClusteredPortfolioPage[] = clusteredData as ClusteredPortfolioPage[];

const clusteredMap = new Map<string, ClusteredPortfolioPage>();
clusteredPortfolioPages.forEach((page) => {
  clusteredMap.set(page.slug, page);
});

export function getClusteredPage(slug: string): ClusteredPortfolioPage | undefined {
  return clusteredMap.get(slug);
}

export type AnyPortfolioItem = (Project & { isFlagship?: true; isIndexable?: true; slug?: string }) | ClusteredPortfolioPage;

export function getAllPortfolioPages(): AnyPortfolioItem[] {
  const formattedFlagships: AnyPortfolioItem[] = projects.map((p) => ({
    ...p,
    slug: p.id,
    isFlagship: true,
    isIndexable: true
  }));
  return [...formattedFlagships, ...clusteredPortfolioPages];
}
