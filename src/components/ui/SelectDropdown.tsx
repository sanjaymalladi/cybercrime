import { useState } from 'react';

export type DropdownOption = { label: string; value: string };

export function SelectDropdown({ value, options, onChange, placeholder = 'Select an option', ariaLabel, className = '' }: { value: string; options: DropdownOption[]; onChange: (value: string) => void; placeholder?: string; ariaLabel: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value);
  return <div className={`ux4g-dropdown ux4g-dropdown-default report-select ${open ? 'is-open' : ''} ${className}`}>
    <button type="button" className="ux4g-dropdown-control" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(current => !current)}>
      <span>{selected?.label ?? placeholder}</span><i className="ph ph-caret-down" aria-hidden="true" />
    </button>
    {open && <div className="ux4g-dropdown-menu report-select-menu" role="listbox" aria-label={ariaLabel}>{options.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={`report-select-option ${option.value === value ? 'selected' : ''}`} onClick={() => { onChange(option.value); setOpen(false); }}><span>{option.label}</span>{option.value === value && <i className="ph ph-check" aria-hidden="true" />}</button>)}</div>}
  </div>;
}
