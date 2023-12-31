import React from "react";
import { BsCheck } from "react-icons/bs";
type CheckboxInputProps = {
  checked: boolean;
  labelTrue: string;
  labelFalse: string;
  handleChange: (value: boolean) => void;
  justify?: string;
  padding?: string;
};
function CheckboxInput({
  labelTrue,
  labelFalse,
  checked,
  handleChange,
  justify = "justify-center",
  padding = "0.75rem",
}: CheckboxInputProps) {
  return (
    <div
      className={`flex w-full items-center ${justify} gap-2 ${
        padding ? `p-[${padding}]` : "p-3"
      }`}
    >
      <div
        className={`flex h-[16px] w-[16px] cursor-pointer items-center justify-center rounded-full border-2 border-[#fbcb83] ${
          checked ? "bg-[#fbcb83]" : ""
        }`}
        onClick={() => handleChange(!checked)}
      >
        {checked ? <BsCheck style={{ color: "#000" }} /> : null}
      </div>
      <p className="cursor-pointer" onClick={() => handleChange(!checked)}>
        {checked ? labelTrue : labelFalse}
      </p>
    </div>
  );
}

export default CheckboxInput;
