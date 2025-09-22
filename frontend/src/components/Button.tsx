import clsx from 'clsx';
import './Button.css';

type ButtonProps = {
  gradientBorder?: boolean;
  hoverColor?: string;
  maxWidth?: string;
} & React.ComponentPropsWithoutRef<'button'>;

function Button({
  children,
  gradientBorder = false,
  className = '',
  type = 'button',
  hoverColor,
  maxWidth = '252px',
  ...rest
}: ButtonProps) {

  const dynamicStyle = {
    ...(hoverColor && { '--hover-bg-color': hoverColor }),
    '--input-max-width': maxWidth,
  };

  const disabled = rest.disabled;

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
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
