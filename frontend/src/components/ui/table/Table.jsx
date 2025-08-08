import { ReactNode } from "react";

// Table Component
const Table = ({ children, className }) => {
  return <table className={`min-w-full  ${className} rounded-lg shadow overflow-hidden`}>{children}</table>;
};

// TableHeader Component
const TableHeader = ({ children, className }) => {
  return <thead className={`${className} bg-gray-50 font-[550] `}>{children}</thead>;
};

// TableBody Component
const TableBody = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell = ({
  children,
  isHeader = false,
  className,
  colSpan,
  rowSpan
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag rowSpan={rowSpan} colSpan={colSpan} className={` ${className}  py-3 px-2 ${!isHeader ? "border-b-1" : "border-1"} border-gray-200 `}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
