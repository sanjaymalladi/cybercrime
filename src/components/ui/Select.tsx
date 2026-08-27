import { useEffect, useRef, useState } from 'react';

export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  required = false,
}: {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // SAFETY: a mousedown event target is always a Node in the DOM.
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const selected = options.find((o) => o.value === value);
  return (
    <div className={`select ${open ? 'open' : ''}`} ref={ref}>
      {label && (
        <span className="label">
          {label}
          {required ? ' *' : ''}
        </span>
      )}
      <button
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? '' : 'placeholder'}>{selected ? selected.label : placeholder}</span>
        <i className="ph ph-caret-down" aria-hidden="true" />
      </button>
      {open && (
        <div className="select-panel" role="listbox">
          {options.map((o) => (
            <button
              type="button"
              role="option"
              aria-selected={o.value === value}
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <span>{o.label}</span>
              <i className="ph ph-check" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
