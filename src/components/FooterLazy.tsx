"use client";
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./Footer'), {
  loading: () => <div className="h-[600px] bg-[#1e2d3d]" />,
  ssr: true,
});

export default Footer;