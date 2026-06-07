import RoomsManagerClient from './RoomsManagerClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function RoomsManagerPage() {
  const content = await getAllContent();
  return <RoomsManagerClient content={content} />;
}
