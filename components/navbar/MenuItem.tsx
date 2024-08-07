import Link from "next/link";

interface MenuItemProps {
  label: string;
  href: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, href, onClick }) => {
  return (
    <Link
      onClick={onClick}
      className="w-[250px] h-[30px] text-start rounded-md border-2 border-transparent 
      hover:bg-[#495057] hover:border-[#495057] pl-2 transition duration-200"
      href={href}
    >
      {label}
    </Link>
  );
};

export default MenuItem;
