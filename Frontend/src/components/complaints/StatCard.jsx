import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-md"
    >
      <div className={cn("absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10", colorClass)} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          {trend && (
            <p className="mt-2 text-xs font-medium text-slate-400">
              <span className="text-emerald-500 font-bold">{trend}</span> vs last month
            </p>
          )}
        </div>
        <div className={cn("rounded-2xl p-3 shadow-lg", colorClass)}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
