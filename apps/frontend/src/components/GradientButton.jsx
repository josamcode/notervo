import React from "react";

const GradientButton = ({ children, onClick, className = "", disabled = false, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        bg-gradient-primary
        text-white
        py-4
        rounded-xl
        font-semibold
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        focus:outline-none
        focus:ring-4
        focus:ring-secondary/60
        ${
          disabled
            ? "opacity-60 cursor-not-allowed transform-none hover:shadow-none"
            : "hover:-translate-y-0.5 active:translate-y-0"
        }
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
