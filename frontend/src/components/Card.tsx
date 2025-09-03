import React, { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps =
{
  children: ReactNode;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
};

function Card
(
  {
     children,
     shadow = 'md',
     padding = 'md',
     rounded = 'md',
     className = ''
  }: CardProps
)
{
      const shadowClasses =
      {
        'none': '',
        'sm': 'shadow-sm',
        'md': 'shadow-md',
        'lg': 'shadow-lg'
      };
      const paddingClasses =
      {
        'none': 'p-0',
        'sm': 'p-2',
        'md': 'p-4',
        'lg': 'p-6'
      };
      const radiusClasses =
      {
        'none': 'rounded-none',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg'
      };
      
  return (
    <div className=
      {
        clsx
          (
            'bg-red-800',
            shadowClasses[shadow], paddingClasses[padding],
            radiusClasses[rounded],
            className
          )
      }
    >
      {children}
    </div>
  )
}

export default Card;
