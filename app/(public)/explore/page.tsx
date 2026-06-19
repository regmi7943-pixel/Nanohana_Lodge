import ExploreClient from './ExploreClient';
import { getPageContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Pokhara',
  description: 'Discover nearby attractions, trekking routes, and the best of Lakeside Pokhara during your stay.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function ExplorePage({ searchParams }: Props) {
  const content = await getPageContent('explore');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <ExploreClient content={content} editMode={editMode} />;
}
