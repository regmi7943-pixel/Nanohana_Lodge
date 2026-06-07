import RoomsClient from './RoomsClient';
import { getAllContent } from '@/lib/content';

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
