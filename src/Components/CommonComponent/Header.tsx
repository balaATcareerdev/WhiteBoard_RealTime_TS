interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="p-3 border-b border-gray-200">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
};

export default Header;
