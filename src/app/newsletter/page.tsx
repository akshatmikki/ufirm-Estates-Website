'use client';

import dynamic from 'next/dynamic';

// Newsletter uses pdfjs + react-pageflip — both access window on init.
// ssr:false ensures they only run in the browser.
const NewsletterViewer = dynamic(
  () => import('@/components/Newsletter'),
  { ssr: false },
);

export default function NewsletterPage() {
  return <NewsletterViewer />;
}
