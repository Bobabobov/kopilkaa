"use client";

import { motion } from "framer-motion";

export function HowItWorksHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: "#fffffe" }}
      >
        Как это работает
      </h2>
      <p
        className="text-xl md:text-2xl font-semibold mb-2"
        style={{ color: "#abd1c6" }}
      >
        4 шага — коротко и по делу.
      </p>
    </motion.div>
  );
}
