import React, { useState } from 'react';
import clsx from 'clsx';

type CounterProps =
  {
    stroke?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
  }

function Counter
  (
    {
      stroke = 'md',
      className = ''
    }: CounterProps
  ) {
  const [count, setCount] = useState(0);
  const strokeClasses =
  {
    'none': 'border-0',
    'sm': 'border',
    'md': 'border-2',
    'lg': 'border-4'
  };

  return (
    <div className=
      {
        clsx
          (
            'flex flex-col items-center space-y-4',
            'bg-blue-800 p-4 rounded',
            'border-black',
            strokeClasses[stroke],
            className
          )
      }
    >
      <span className=
        {
          clsx
          (
            'bg-white',
            {
              'text-red-500': count < 0,
              'text-gray-500': count === 0,
              'text-blue-500': count > 0 && count < 5,
              'text-green-500 font-bold': count >= 5
            }
          )
        }
      >
       {count}
      </span>
      <div className=
      {
        clsx
        (
          'flex items-center space-x-2'
        )
      }
      >
        <button onClick={() => setCount(count + 1)} className=
        {
          clsx
          (
            'bg-blue-500', 'hover:bg-blue-600', 'text-white',
            'rounded', 'px-4', 'py-2'
          )
        }
        >
        increment
        </button>
        <button onClick={() => setCount(count - 1)} className=
        {
          clsx
          (
            'bg-blue-500', 'hover:bg-blue-600', 'text-white',
            'rounded', 'px-4', 'py-2'
          )
        }
        >
        decrement
        </button>
      </div>
    </div>
  )
}

export default Counter
