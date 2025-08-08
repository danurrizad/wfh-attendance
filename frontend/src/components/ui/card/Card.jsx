import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl shadow-md bg-white  ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = ""}) => (
  <div className={`${className} border-b-1 font-semibold border-gray-300  p-4`}>
    {children}
  </div>
)

export const CardContent = ({ children, className = "" }) => (
  <div className={`mt-2 ${className} p-4`}>
    {children}
  </div>
);

