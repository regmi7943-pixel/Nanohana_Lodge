import BookingRequestsClient from './BookingRequestsClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function BookingRequestsPage() {
  const content = await getAllContent();
  return <BookingRequestsClient content={content} />;
}
