import RoomsClient from './RoomsClient';
import { getPageContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description: 'Explore our clean, cozy, eco-conscious rooms and suites with mountain views at Nanohana Lodge.',
};


export const revalidate = 60; // ISR: revalidate every 60 seconds

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function RoomsPage({ searchParams }: Props) {
  const content = await getPageContent('rooms');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <RoomsClient content={content} editMode={editMode} />;
}
