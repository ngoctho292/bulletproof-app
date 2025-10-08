'use client';

import { useEffect, useState } from 'react';

interface ClientDateProps {
  date: Date | string;
  format?: 'date' | 'datetime' | 'time';
  className?: string;
}

export function ClientDate({ date, format = 'date', className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder during SSR to match server HTML
    return <span className={className}>...</span>;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  let formattedDate = '';
  
  switch (format) {
    case 'date':
      formattedDate = dateObj.toLocaleDateString();
      break;
    case 'datetime':
      formattedDate = dateObj.toLocaleString();
      break;
    case 'time':
      formattedDate = dateObj.toLocaleTimeString();
      break;
  }

  return <span className={className}>{formattedDate}</span>;
}