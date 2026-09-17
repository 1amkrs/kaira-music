import React from 'react';
import { Check } from 'lucide-react';

interface Material3SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export const Material3Switch: React.FC<Material3SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={`relative inline-flex items-center w-[52px] h-[32px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-accent' : 'bg-[#3C3639]'}`}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full transition-all duration-200 shadow-sm ${
          checked
            ? 'w-6 h-6 translate-x-[22px] bg-accent-dark text-accent'
            : 'w-4 h-4 translate-x-[6px] bg-[#888083]'
        }`}
      >
        {checked && <Check size={13} strokeWidth={3.5} />}
      </span>
    </button>
  );
};
