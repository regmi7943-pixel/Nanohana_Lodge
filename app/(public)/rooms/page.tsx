import RoomsClient from './RoomsClient';
import { getAllContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description: 'Explore our clean, cozy, eco-conscious rooms and suites with mountain views at Nanohana Lodge.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function RoomsPage({ searchParams }: Props) {
  const content = await getAllContent();
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <RoomsClient content={content} editMode={editMode} />;
}
