import type { Variants } from 'framer-motion';

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

export const floatAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: ["0px 0px 0px rgba(14, 165, 233, 0)", "0px 0px 30px rgba(14, 165, 233, 0.5)", "0px 0px 0px rgba(14, 165, 233, 0)"],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};
