"use client";
/** Route-change transition — subtle fade/slide for every page */
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.21, 0.65, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
