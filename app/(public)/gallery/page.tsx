import GalleryClient from './GalleryClient';
import { getPageContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos of our beautiful eco-conscious guesthouse, garden, and mountain views at Nanohana Lodge.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function GalleryPage({ searchParams }: Props) {
  const content = await getPageContent('gallery');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <GalleryClient content={content} editMode={editMode} />;
}
