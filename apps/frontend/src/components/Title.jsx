import React from "react";

export default function Title({
  title,
  subtitle = "",
  textColor = "text-primary",
  className = "",
  subtitleClass = "text-sm text-gray-500 mt-2",
}) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className={`text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-heading ${textColor}`}>
        {title}
      </h2>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
}
