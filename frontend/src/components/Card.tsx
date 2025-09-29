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
     maxWidth = '',
     maxHeight = '',
  }: CardProps
)
{
  return (
    <div
      style={{'--card-max-width': maxWidth, '--card-max-height': maxHeight}}
      className={clsx(
        "max-w-[var(--card-max-width)]",
        "rounded-big backdrop-blur-card",
        "max-h-[var(--card-max-height)]",
        {
          "h-full" : maxHeight != '',
          "w-full" : maxWidth != ''
        },
        bgColor,
        shadowColor,
        className,
    )}>
      {children}
    </div>
  )
}

export default Card;
