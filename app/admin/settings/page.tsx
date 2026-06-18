import SettingsClient from './SettingsClient';
import { getAllContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const content = await getAllContent();
  return <SettingsClient content={content} />;
}
