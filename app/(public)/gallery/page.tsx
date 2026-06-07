import GalleryClient from './GalleryClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function GalleryPage({ searchParams }: Props) {
  const content = await getAllContent();
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <GalleryClient content={content} editMode={editMode} />;
}
