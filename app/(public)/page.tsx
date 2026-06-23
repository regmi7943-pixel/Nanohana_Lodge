import HomeClient from './HomeClient';
import { getPageContent } from '@/lib/content';

export const revalidate = 60; // ISR: revalidate every 60 seconds

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function HomePage({ searchParams }: Props) {
  const content = await getPageContent('home');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <HomeClient content={content} editMode={editMode} />;
}
