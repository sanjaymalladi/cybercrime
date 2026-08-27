import type { RouteKey } from '../../types';

export function ServiceCard({
  icon,
  title,
  description,
  route,
  tone,
  onNavigate,
}: {
  icon: string;
  title: string;
  description: string;
  route: RouteKey;
  tone?: string;
  onNavigate: (route: RouteKey) => void;
}) {
  return (
    <button
      className={`card card-hover service-card ${tone ?? ''}`}
      type="button"
      onClick={() => onNavigate(route)}
    >
      <span className="service-icon">
        <i className={`ph ph-${icon}`} aria-hidden="true" />
      </span>
      <strong>{title}</strong>
      <span className="desc">{description}</span>
      <i className="ph ph-arrow-up-right card-arrow" aria-hidden="true" />
    </button>
  );
}
