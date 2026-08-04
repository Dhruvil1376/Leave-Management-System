import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };

export default function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const s = sizes[size];
  if (src) {
    return <img src={src} alt={name} className={`${s} rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
