import React, { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps =
{
  children: ReactNode;
  shadowColor?: string;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  direction?: 'flex-row' | 'flex-col'
};

function Card
(
  {
     children,
     shadowColor = 'shadow-card',
     className = '',
     maxWidth = '400px',
     maxHeight = '100px',
  }: CardProps
)
{
  return (
    <div
      style={{'--card-max-width': maxWidth, '--card-max-height': maxHeight}}
      className={clsx(
        "h-full max-w-[var(--card-max-width)]",
        "w-full rounded-big bg-main backdrop-blur-card",
        "max-h-[var(--card-max-height)] h-full",
        shadowColor,
        className,
    )}>
      {children}
    </div>
  )
}

export default Card;
