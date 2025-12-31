'use client'
import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'

export default function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 }); // * 0.2 slows it down (magnetic effect)
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-8 py-3 rounded-full border border-gold-500 text-gold-500 uppercase tracking-widest text-sm font-serif hover:bg-gold-500 hover:text-richBlack transition-colors duration-300"
    >
      {children}
    </motion.button>
  )
}