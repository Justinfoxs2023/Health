import React from 'react';

import { motion } from 'framer-motion';

export const HealthAnimation: React.FC<{ data: HealthData }> = ({ data }) => {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
      {/* 健康数据动画展示 */}
    </motion.div>
  );
};
