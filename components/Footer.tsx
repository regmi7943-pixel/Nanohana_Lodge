import React, { Suspense } from 'react';
import { getAllContent } from '@/lib/content';
import FooterClient from './FooterClient';

export default async function Footer() {
  const allContent = await getAllContent();
  const contentMap = allContent.reduce((acc, curr) => {
    acc[`${curr.page}_${curr.key}`] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Suspense fallback={null}>
      <FooterClient content={contentMap} />
    </Suspense>
  );
}
