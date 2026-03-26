import React from "react";

type Props = {
  pageSize: number;
  options: number[];
  onChange: (size: number) => void;
};

export const PageSizeSelector: React.FC<Props> = ({
  pageSize,
  options,
  onChange,
}) => {
  return (
    <select
      value={pageSize}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border rounded-lg px-2 py-1 text-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt} / page
        </option>
      ))}
    </select>
  );
};