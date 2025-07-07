import { Metadata } from 'next';
import ResourcesPageComponent from '../../components/resources/ResourcesPage';

export const metadata: Metadata = {
  title: 'Resources & Insights | HiSync - Expert Knowledge Hub',
  description: 'Explore our comprehensive collection of guides, best practices, case studies, and industry insights. Stay ahead with expert knowledge on data synchronization and enterprise solutions.',
  keywords: 'resources, guides, best practices, case studies, data synchronization, enterprise solutions, tutorials, insights, technical documentation',
  openGraph: {
    title: 'Resources & Insights | HiSync',
    description: 'Expert knowledge hub with guides, best practices, and industry insights for data synchronization.',
    type: 'website',
    siteName: 'HiSync',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources & Insights | HiSync',
    description: 'Expert knowledge hub with guides, best practices, and industry insights.',
  },
  alternates: {
    canonical: '/resources',
  },
};

const RESOURCES_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

async function getResourcesData() {
  try {
    const [featuredRes, trendingRes, latestRes, categoriesRes] = await Promise.all([
      fetch(`${RESOURCES_API_BASE}/resources?featured=true&limit=6`, { next: { revalidate: 3600 } }),
      fetch(`${RESOURCES_API_BASE}/resources?trending=true&limit=4`, { next: { revalidate: 3600 } }),
      fetch(`${RESOURCES_API_BASE}/resources?sort=latest&limit=6`, { next: { revalidate: 3600 } }),
      fetch(`${RESOURCES_API_BASE}/resources/categories`, { next: { revalidate: 3600 } })
    ]);

    const [featured, trending, latest, categories] = await Promise.all([
      featuredRes.json(),
      trendingRes.json(),
      latestRes.json(),
      categoriesRes.json()
    ]);

    // Transform categories object to array format
    const categoriesArray = categories.success && categories.data.categories 
      ? Object.entries(categories.data.categories).map(([name, count]) => ({
          name,
          count: count as number
        }))
      : [];

    return {
      featuredResources: featured.success ? featured.data.data : [],
      trendingResources: trending.success ? trending.data.data : [],
      latestResources: latest.success ? latest.data.data : [],
      categories: categoriesArray,
      totalCount: featured.success ? featured.data.total : 0
    };
  } catch (error) {
    console.error('Error fetching resources data:', error);
    return {
      featuredResources: [],
      trendingResources: [],
      latestResources: [],
      categories: [],
      totalCount: 0
    };
  }
}

export default async function ResourcesPage() {
  const resourcesData = await getResourcesData();

  return (
    <main className="min-h-screen">
      <ResourcesPageComponent {...resourcesData} />
    </main>
  );
}
