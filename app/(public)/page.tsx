import dynamic from 'next/dynamic';
import { getPageContent } from '@/lib/content';

const HomeClient = dynamic(() => import('./HomeClient'), {
  loading: () => (
    <div className="w-full h-screen bg-cream flex items-center justify-center">
      <div className="text-earth/30 font-serif text-xl animate-pulse">Nanohana Lodge</div>
    </div>
  ),
});

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
