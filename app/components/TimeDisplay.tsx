'use client';

import { Clock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, monoLabel } from '@/components/ds';

type TimeDisplayProps = {
  timezone: string;
  title?: string;
  showLocation?: boolean;
};

export function TimeDisplay({ timezone, title, showLocation = true }: TimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="w-full p-6">
      <div className={`flex items-center gap-2 ${monoLabel}`}>
        <Clock className="size-4" />
        {title || 'Current Time'}
      </div>
      <div className="mt-4 grid gap-3">
        <div className="tnum text-center font-mono text-[clamp(36px,6vw,56px)] font-light leading-none tracking-[-0.045em]">{timeString}</div>
        <div className="text-center text-lg font-medium tracking-[-0.01em]">{dateString}</div>
        {showLocation && (
          <div className="flex items-center justify-center gap-2 text-sm text-subtle">
            <Globe className="size-4" />
            <span>{timezone}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
