import React from "react";
import { BsCheck } from "react-icons/bs";
type CheckboxInputProps = {
  checked: boolean;
  labelTrue: string;
  labelFalse: string;
  handleChange: (value: boolean) => void;
};
function CheckboxInput({
  labelTrue,
  labelFalse,
  checked,
  handleChange,
}: CheckboxInputProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 p-3">
      <div
        className={`flex h-[16px] w-[16px] cursor-pointer items-center justify-center rounded-full border-2 border-[#15599a] ${
          checked ? "bg-[#15599a]" : ""
        }`}
        onClick={() => handleChange(!checked)}
      >
        {checked ? <BsCheck style={{ color: "#fead61" }} /> : null}
      </div>
      <p className="cursor-pointer" onClick={() => handleChange(!checked)}>
        {checked ? labelTrue : labelFalse}
      </p>
    </div>
  );
}

export default CheckboxInput;
