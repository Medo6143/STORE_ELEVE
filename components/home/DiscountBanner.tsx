"use client";

import Link from "next/link";

interface DiscountBannerProps {
  text: string;
  link?: string;
  bgColor: string;
  isActive: boolean;
}

export default function DiscountBanner({ text, link, bgColor, isActive }: DiscountBannerProps) {
  if (!isActive) return null;

  const content = (
    <div style={{ backgroundColor: bgColor }} className="w-full py-2.5 text-center">
      <p className="text-[10px] tracking-[0.3em] uppercase text-on-primary font-label">{text}</p>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}
