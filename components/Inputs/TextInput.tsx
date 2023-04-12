import React from "react";
type TextInputProps = {
  width?: string;
  label: string;
  value: string;
  placeholder: string;
  handleChange: (value: string) => void;
};
function TextInput({
  width,
  label,
  value,
  placeholder,
  handleChange,
}: TextInputProps) {
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
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        id={inputIdentifier}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  );
}

export default TextInput;
