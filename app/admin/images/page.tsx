import ImagesClient from './ImagesClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function ImagesPage() {
  const content = await getAllContent();
  return <ImagesClient content={content} />;
}
