import React from 'react';
import { cn } from '../../utils/cn';

const StatusBadge = ({ status, className }) => {
  const variants = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Done: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "In Progress": "bg-sky-100 text-sky-700 border-sky-200",
    Rejected: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 w-fit",
      variants[status] || variants.Pending,
      className
    )}>
      {status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
      {status === 'Done' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
