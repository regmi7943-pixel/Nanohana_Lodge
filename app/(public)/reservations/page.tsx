import ReservationsClient from './ReservationsClient';
import { getAllContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Stay',
  description: 'Book your stay at Nanohana Lodge in Lakeside Pokhara. View availability and reserve your room online.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function ReservationsPage({ searchParams }: Props) {
  const content = await getAllContent();
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <ReservationsClient content={content} editMode={editMode} />;
}
