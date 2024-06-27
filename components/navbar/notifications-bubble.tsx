interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center justify-center size-2 p-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
      {count}
    </span>
  );
};

export default Badge;
