import React from "react";
type TextInputProps = {
  width?: string;
  label: string;
  value: string | undefined;
  editable?: boolean;
  labelClassName?: string;
  handleChange: (value: string | undefined) => void;
};
function DateInput({
  width,
  label,
  value,
  editable = true,
  labelClassName,
  handleChange,
}: TextInputProps) {
  const inputIdentifier = label.toLowerCase().replace(" ", "_");
  return (
    <div
      className={`flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}
    >
      <label
        htmlFor={inputIdentifier}
        className={
          labelClassName
            ? labelClassName
            : "font-sans font-bold  text-[#353432]"
        }
      >
        {label}
      </label>
      <input
        readOnly={!editable}
        value={value}
        onChange={(e) => {
          handleChange(e.target.value != "" ? e.target.value : undefined);
        }}
        id={inputIdentifier}
        onReset={() => handleChange(undefined)}
        type="date"
        className="w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
      />
    </div>
  );
}

export default DateInput;
