import clsx from 'clsx';
import './Button.css';

type ButtonProps = {
  gradientBorder?: boolean;
  hoverColor?: string;
  maxWidth?: string;
  maxHeight?: string;
} & React.ComponentPropsWithoutRef<'button'>;

function Button({
  children,
  gradientBorder = false,
  className = '',
  type = 'button',
  hoverColor,
  maxWidth = '252px',
  maxHeight = '58px',
  ...rest
}: ButtonProps) {

  const dynamicStyle = {
    ...(hoverColor && { '--hover-bg-color': hoverColor }),
    '--button-max-width': maxWidth,
    '--button-max-height': maxHeight,
  };

  const disabled = rest.disabled;

  return (
    <button
      type={type}
      disabled={disabled}
      style={dynamicStyle}
      className={clsx(
        "relative overflow-hidden text-white font-inter text-subtitle rounded-small",
        "max-w-[var(--button-max-width)] max-h-[var(--button-max-height)]",
        "transition-colors duration-300",
        { 'dynamic-hover': hoverColor && !disabled },
        {
          'gradient-ring': gradientBorder && !disabled,
          'opacity-50 cursor-not-allowed border border-stroke': disabled,
          'hover:bg-opacity-20 hover:bg-white': !hoverColor && !disabled,
          'w-full': maxWidth != '',
          'h-full': maxHeight != ''
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
