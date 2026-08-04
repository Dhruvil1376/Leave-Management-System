import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface Crumb { label: string; href?: string; }

interface BreadcrumbProps { items: Crumb[]; }

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FiHome size={13} /></Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <FiChevronRight size={11} />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">{item.label}</Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-200 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
