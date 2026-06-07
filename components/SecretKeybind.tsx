'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretKeybind() {
  const router = useRouter();
  const [keys, setKeys] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = (prev + e.key).slice(-6);
        if (newKeys === '123123') {
          router.push('/12312341');
        }
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
