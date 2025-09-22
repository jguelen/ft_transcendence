import React, { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps =
{
  children: ReactNode;
  shadowColor?: string;
  bgColor?: string;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
};

function Card
(
  {
     children,
     shadowColor = 'shadow-card',
     bgColor = "bg-main",
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
        "w-full rounded-big backdrop-blur-card",
        "max-h-[var(--card-max-height)] h-full",
        bgColor,
        shadowColor,
        className,
    )}>
      {children}
    </div>
  )
}

export default Card;
