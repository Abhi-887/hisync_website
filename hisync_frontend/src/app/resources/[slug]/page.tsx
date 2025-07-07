import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ResourceDetailPage from '../../../components/resources/ResourceDetailPage';

interface ResourcePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Resource {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    email: string;
  };
  featured_image: string | null;
  featured_image_url: string | null;
  gallery_images: string[];
  gallery_images_urls: string[];
  is_featured: boolean;
  is_trending: boolean;
  published_at: string;
  published_date_formatted: string;
  read_time: number;
  reading_time_text: string;
  view_count: number;
  share_count: number;
  like_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  full_url: string;
}

interface RelatedResource {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: {
    id: number;
    name: string;
  };
  featured_image_url: string | null;
  published_at: string;
  read_time: number;
  view_count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    resource: Resource;
    related_resources: RelatedResource[];
    next_resource: { id: number; title: string; slug: string } | null;
    previous_resource: { id: number; title: string; slug: string } | null;
  };
  meta: {
    canonical_url: string;
    schema_org: any;
  };
}

async function getResource(slug: string): Promise<ApiResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/resources/${slug}`, {
      cache: 'no-store', // Always fetch fresh data for SEO
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resourceData = await getResource(resolvedParams.slug);
  
  if (!resourceData || !resourceData.success) {
    return {
      title: 'Resource Not Found | HiSync',
      description: 'The requested resource could not be found.',
    };
  }

  const { resource } = resourceData.data;

  return {
    title: resource.meta_title || resource.title,
    description: resource.meta_description || resource.excerpt,
    keywords: resource.meta_keywords || resource.tags?.join(', '),
    authors: [{ name: resource.author.name }],
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: 'article',
      publishedTime: resource.published_at,
      authors: [resource.author.name],
      images: resource.featured_image_url ? [
        {
          url: resource.featured_image_url,
          width: 1200,
          height: 630,
          alt: resource.title,
        }
      ] : undefined,
      siteName: 'HiSync',
      url: resource.full_url,
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.excerpt,
      images: resource.featured_image_url ? [resource.featured_image_url] : undefined,
    },
    alternates: {
      canonical: resource.full_url,
    },
    other: {
      'article:author': resource.author.name,
      'article:published_time': resource.published_at,
      'article:section': resource.category,
      'article:tag': resource.tags?.join(', ') || '',
    },
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resolvedParams = await params;
  const resourceData = await getResource(resolvedParams.slug);
  
  if (!resourceData || !resourceData.success) {
    notFound();
  }

  const { resource, related_resources, next_resource, previous_resource } = resourceData.data;
  const { schema_org } = resourceData.meta;

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema_org),
        }}
      />
      
      <ResourceDetailPage
        resource={resource}
        relatedResources={related_resources}
        nextResource={next_resource}
        previousResource={previous_resource}
      />
    </>
  );
}

// Generate static params for popular resources (optional, for better performance)
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/resources/featured`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    
    if (data.success && data.data.resources) {
      return data.data.resources.map((resource: any) => ({
        slug: resource.slug,
      }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }

  return [];
}
