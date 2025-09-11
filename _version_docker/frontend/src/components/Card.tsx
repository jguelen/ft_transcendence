import React, { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps =
{
  children: ReactNode;
  shadowColor?: string;
  className?: string;
};

function Card
(
  {
     children,
     shadowColor = 'accent',
     className = ''
  }: CardProps
)
{
  return (
    <div className="h-full w-full flex flex-col items-center
       justify-center p-2.5 rounded-big bg-main shadow-card backdrop-blur-card"
    >
      {children}
    </div>
  )
}

export default Card;
