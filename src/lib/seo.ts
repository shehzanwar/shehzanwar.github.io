// src/lib/seo.ts

export interface MetaInput {
  title: string;
  description: string;
  canonicalUrl?: string | URL;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedAt?: Date | string;
}

export interface MetaOutput {
  title: string;
  description: string;
  canonical: string | undefined;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | undefined;
  ogType: 'website' | 'article';
  articlePublishedTime: string | undefined;
}

export function buildMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  publishedAt,
}: MetaInput): MetaOutput {
  return {
    title,
    description,
    canonical: canonicalUrl ? canonicalUrl.toString() : undefined,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType,
    articlePublishedTime:
      publishedAt && ogType === 'article'
        ? new Date(publishedAt).toISOString()
        : undefined,
  };
}
