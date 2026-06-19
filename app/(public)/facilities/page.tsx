import FacilitiesClient from './FacilitiesClient';
import { getPageContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facilities',
  description: 'Enjoy our organic garden, rooftop terrace, and fast Wi-Fi. Discover the amenities at Nanohana Lodge.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function FacilitiesPage({ searchParams }: Props) {
  const content = await getPageContent('facilities');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <FacilitiesClient content={content} editMode={editMode} />;
}
