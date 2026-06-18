import AboutClient from './AboutClient';
import { getAllContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the history and family behind Nanohana Lodge in Lakeside Pokhara.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function AboutPage({ searchParams }: Props) {
  const content = await getAllContent();
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <AboutClient content={content} editMode={editMode} />;
}
