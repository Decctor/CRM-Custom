import React from "react";
type NumberInputProps = {
  width?: string;
  label: string;
  value: number | null;
  placeholder: string;
  handleChange: (value: number) => void;
};
function NumberInput({
  width,
  label,
  value,
  placeholder,
  handleChange,
}: NumberInputProps) {
  const inputIdentifier = label.toLowerCase().replace(" ", "_");
  return (
    <div
      className={`flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}
    >
      <label
        htmlFor={inputIdentifier}
        className="font-sans font-bold  text-[#353432]"
      >
        {label}
      </label>
      <input
        value={value ? value.toString() : undefined}
        onChange={(e) => handleChange(Number(e.target.value))}
        id={inputIdentifier}
        type="number"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  );
}

export default NumberInput;
