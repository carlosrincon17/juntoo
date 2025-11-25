'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/app/lib/currency';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
}

export default function AnimatedNumber({ value, duration = 1000, className = "", prefix = "" }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = displayValue;
        const endValue = value;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (endValue - startValue) * easeProgress;
            setDisplayValue(currentValue);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span className={className}>
            {prefix}{formatCurrency(displayValue)}
        </span>
    );
}
