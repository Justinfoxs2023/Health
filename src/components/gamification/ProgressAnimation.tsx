import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

export const ProgressAnimation: React.FC<{
  progress: number;
  target: number;
}> = ({ progress, target }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="progress-bar"
        initial={{ width: 0 }}
        animate={{ width: `${(progress / target) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </AnimatePresence>
  );
};
