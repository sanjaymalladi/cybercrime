import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow && (
          <span className="eyebrow" style={{ marginBottom: 'var(--sp-4)', display: 'inline-flex' }}>
            {eyebrow}
          </span>
        )}
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
    </section>
  );
}
