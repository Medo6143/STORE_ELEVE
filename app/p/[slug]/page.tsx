"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion } from "framer-motion";

interface PageData {
  title: string;
  content: string;
}

export default function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      if (!slug) return;
      try {
        const snap = await getDoc(doc(db, "pages", slug as string));
        if (snap.exists()) {
          setPage(snap.data() as PageData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 text-center">
        <h1 className="text-4xl font-notoSerif mb-4">404</h1>
        <p className="font-notoSerif opacity-60">The page you're looking for was not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-notoSerif mb-12 tracking-tight">
          {page.title}
        </h1>
        
        <div className="font-notoSerif leading-relaxed space-y-6 opacity-80 text-lg">
          {page.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-outline-variant/10 flex justify-between items-center text-[10px] font-label uppercase tracking-widest opacity-40">
          <span>Èlevè Atelier</span>
          <span>Last Updated 2026</span>
        </div>
      </motion.div>
    </div>
  );
}
