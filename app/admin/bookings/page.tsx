import BookingsClient from './BookingsClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function BookingManagerPage() {
  const content = await getAllContent();
  return <BookingsClient content={content} />;
}
