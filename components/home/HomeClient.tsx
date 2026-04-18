"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import DiscountBanner from "./DiscountBanner";
import CollectionsSection from "./CollectionsSection";
import CategorySection from "./CategorySection";
import FeaturedProducts from "./FeaturedProducts";
import VideoSection from "./VideoSection";
import ContactSection from "./ContactSection";
import { getHomeContent } from "@/lib/firebase/home-content";
import { getCollections } from "@/lib/firebase/collections";
import { getCategories } from "@/lib/firebase/categories";
import { getActiveProducts } from "@/lib/firebase/products";
import type { HomeContent, Collection, Category, Product } from "@/types";

// Static hero that shows immediately while data loads
function StaticHero() {
  return (
    <section className="relative w-full h-[100vh] min-h-[600px] bg-surface-container-low overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low via-surface-container to-surface" />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface/50 font-label mb-8">
          SPRING / SUMMER 2025
        </p>
        <h1 className="font-notoSerif text-on-surface text-5xl md:text-7xl lg:text-[96px] leading-[1.1] tracking-tight">
          The Quiet
        </h1>
        <h1 className="font-notoSerif text-on-surface text-5xl md:text-7xl lg:text-[96px] leading-[1.1] tracking-tight italic">
          Èlevè of Being
        </h1>
        <Link
          href="/shop"
          className="mt-12 bg-on-surface text-surface text-[10px] tracking-[0.3em] uppercase px-12 py-5 font-label hover:bg-primary-container transition-all duration-400"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

// Skeleton for sections while loading
function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-container-low ${className}`}>
      <div className="h-8 w-48 bg-surface-container rounded mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[3/4] bg-surface-container rounded" />
        ))}
      </div>
    </div>
  );
}

export default function HomeClient() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  // Load hero content first (priority)
  useEffect(() => {
    getHomeContent()
      .then((hc) => {
        setHomeContent(hc);
        setHeroLoaded(true);
      })
      .catch((err) => {
        console.error("[HomeHero]", err);
        setHeroLoaded(true); // Show static hero on error
      });
  }, []);

  // Load other sections in parallel after hero
  useEffect(() => {
    async function fetchSections() {
      try {
        const [cols, cats, prods] = await Promise.all([
          getCollections(),
          getCategories(),
          getActiveProducts(6), // Only fetch 6 products for homepage
        ]);
        setCollections(cols);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("[HomeSections]", err);
      } finally {
        setSectionsLoaded(true);
      }
    }
    fetchSections();
  }, []);

  const hasHeroSlides = homeContent?.heroSlides && homeContent.heroSlides.length > 0;

  return (
    <>

      {/* Hero - shows static immediately, swaps to carousel when loaded */}
      {hasHeroSlides ? (
        <HeroCarousel slides={homeContent.heroSlides} />
      ) : (
        <StaticHero />
      )}

      {/* Collections - with skeleton */}
      {sectionsLoaded ? (
        <CollectionsSection collections={collections} />
      ) : (
        <div className="px-6 md:px-12 py-20">
          <SectionSkeleton />
        </div>
      )}

      {/* Categories - with skeleton */}
      {sectionsLoaded ? (
        <CategorySection categories={categories} />
      ) : (
        <div className="px-6 md:px-12 py-20">
          <SectionSkeleton />
        </div>
      )}

      {/* Featured Products - with skeleton */}
      {sectionsLoaded ? (
        <FeaturedProducts products={products.slice(0, 6)} title="New Arrivals" />
      ) : (
        <div className="px-6 md:px-12 py-20">
          <SectionSkeleton />
        </div>
      )}

      {/* Static Video Section */}
      <VideoSection />

      {/* Static Contact Section */}
      <ContactSection />
    </>
  );
}
