


import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bookNow';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, style, variant = 'default', ...rest }) => {
  const { theme, isDarkMode } = useAppContext();
  
  const buttonStyle: React.CSSProperties = {
    letterSpacing: '0.5px',
    ...style,
  };

  if (variant === 'bookNow' && !isDarkMode) {
    buttonStyle.backgroundColor = theme.bookNowButtonBg ?? theme.primary;
    buttonStyle.color = theme.bookNowButtonText ?? theme.textPrimary;
    buttonStyle.borderRadius = `${theme.bookNowButtonBorderRadius ?? 8}px`;
    
    if (theme.bookNowButtonBorderWidth && theme.bookNowButtonBorderWidth > 0 && theme.bookNowButtonBorderColor) {
      buttonStyle.border = `${theme.bookNowButtonBorderWidth}px solid ${theme.bookNowButtonBorderColor}`;
    } else {
      buttonStyle.border = 'none';
    }
  } else {
    // Default styles or dark mode Book Now button
    buttonStyle.backgroundColor = theme.primary;
    buttonStyle.color = theme.textPrimary;
    buttonStyle.borderRadius = '63% 37% 54% 46% / 55% 48% 52% 45%';
    buttonStyle.border = 'none';
  }

  return (
    <button
      onClick={onClick}
      className="px-6 py-3 font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={buttonStyle}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;