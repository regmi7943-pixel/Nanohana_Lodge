import ContactClient from './ContactClient';
import { getPageContent } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Nanohana Lodge for inquiries, bookings, and directions to our Pokhara guesthouse.',
};


export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function ContactPage({ searchParams }: Props) {
  const content = await getPageContent('contact');
  const params = await searchParams;
  const editMode = params.editMode === 'true';

  return <ContactClient content={content} editMode={editMode} />;
}
