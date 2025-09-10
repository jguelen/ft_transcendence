import React, { ReactNode } from 'react';
import clsx from 'clsx';
import './Button.css';

type ButtonProps = {
  children: ReactNode;
  gradientBorder?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  hoverColor?: string;
  maxWidth?: string;
};

function Button({
  children,
  gradientBorder = false,
  className = '',
  type = 'button',
  disabled = false,
  hoverColor,
  maxWidth = '252px'
}: ButtonProps) {

  const dynamicStyle = {
    ...(hoverColor && { '--hover-bg-color': hoverColor }),
    '--input-max-width': maxWidth,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={dynamicStyle}
      className={clsx(
        "relative overflow-hidden text-white font-inter text-subtitle rounded-small",
        "max-w-[var(--input-max-width)] w-full h-[58px] transition-colors duration-300",
        { 'dynamic-hover': hoverColor && !disabled },
        {
          'gradient-ring': gradientBorder && !disabled,
          'opacity-50 cursor-not-allowed border border-stroke': disabled,
          'hover:bg-opacity-20 hover:bg-white': !hoverColor && !disabled
        },
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
