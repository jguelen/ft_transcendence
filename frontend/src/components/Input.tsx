import React from 'react';
import clsx from 'clsx';
import './Input.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  iconSrc?: string;
  className?: string;
  maxWidth?: string;
};

function Input({
  iconSrc,
  maxWidth = '252px',
  className,
  ...rest
}: InputProps) {

  const dynamicStyles = {
    ...(iconSrc && { '--icon-url': `url(${iconSrc})` }),
    '--input-max-width': maxWidth,
  };

  return (
    <input
      style={dynamicStyles}
      className={clsx(
        "text-white rounded-small w-full h-[58px] bg-transparent border border-stroke",
        "font-inter text-subtitle focus:outline-none focus:border-accent transition-colors duration-200",
        'max-w-[var(--input-max-width)]',
        {
          "with-icon": iconSrc,
          "has-value": iconSrc && rest.value && rest.value.toString().length > 0, 
        },
        className
      )}
      {...rest}
    />
  );
}

export default Input;
