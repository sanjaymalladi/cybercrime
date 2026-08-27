import { useEffect, useRef, useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function toIso(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}
function parseIso(iso: string) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}
function format(iso: string) {
  const p = parseIso(iso);
  if (!p) return '';
  const dt = new Date(p.y, p.m - 1, p.d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function DatePicker({ value, onChange, placeholder = 'Select date' }: { value: string; onChange: (iso: string) => void; placeholder?: string }) {
  const today = new Date();
  const todayIso = toIso(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const init = parseIso(value) ?? { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: init.y, m: init.m });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      // SAFETY: a mousedown event target is always a Node in the DOM.
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const cells: number[] = [];
  const firstDow = new Date(view.y, view.m - 1, 1).getDay();
  const daysInMonth = new Date(view.y, view.m, 0).getDate();
  for (let i = 0; i < firstDow; i++) cells.push(0);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(0);

  const shift = (delta: number) => {
    let m = view.m + delta;
    let y = view.y;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setView({ y, m });
  };

  const select = (day: number) => {
    onChange(toIso(view.y, view.m, day));
    setOpen(false);
  };

  return (
    <div className="date-field" ref={ref}>
      <button type="button" className="input date-trigger" onClick={() => setOpen((o) => !o)}>
        <span className={value ? '' : 'placeholder'}>{value ? format(value) : placeholder}</span>
      </button>
      <span className="date-ic" onClick={() => setOpen((o) => !o)} role="button" aria-label="Pick a date">
        <i className="ph ph-calendar-blank" />
      </span>

      {open && (
        <div className="calendar-pop" role="dialog" aria-label="Choose date">
          <div className="cal-head">
            <button type="button" className="cal-nav" onClick={() => shift(-1)} aria-label="Previous month">
              <i className="ph ph-caret-left" />
            </button>
            <span>{MONTHS[view.m - 1]} {view.y}</span>
            <button type="button" className="cal-nav" onClick={() => shift(1)} aria-label="Next month">
              <i className="ph ph-caret-right" />
            </button>
          </div>
          <div className="cal-grid cal-week">
            {DOW.map((w) => (
              <span key={w} className="cal-dow">{w}</span>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((day, i) => {
              if (!day) return <span key={i} className="cal-day empty" />;
              const iso = toIso(view.y, view.m, day);
              const isSelected = iso === value;
              const isToday = iso === todayIso;
              const disabled = iso > todayIso;
              return (
                <button
                  key={i}
                  type="button"
                  className={`cal-day${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                  disabled={disabled}
                  onClick={() => select(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
