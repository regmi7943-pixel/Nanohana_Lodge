import ReservationsClient from './ReservationsClient';
import { getAllContent } from '@/lib/content';

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
