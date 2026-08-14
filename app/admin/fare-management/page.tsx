import FareManagementClient from './FareManagementClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function FareManagementPage() {
  const content = await getAllContent();
  return <FareManagementClient content={content} />;
}
