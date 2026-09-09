import { motion } from 'framer-motion';

export function AnimatedBackground() {
  // Generate random positions for background decorative bubbles
  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 10,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-brand-500/5 blur-xl"
          style={{ width: b.size, height: b.size, left: b.left, bottom: '-10%' }}
          animate={{
            y: ['0vh', '-120vh'],
            x: ['0px', `${Math.random() * 100 - 50}px`]
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
