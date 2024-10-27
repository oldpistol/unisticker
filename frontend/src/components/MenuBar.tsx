interface MenuItem {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

interface MenuBarProps {
  items?: MenuItem[];
}

const defaultItems: MenuItem[] = [
  {
    href: "/",
    icon: "lni-grid-alt",
    label: "Applications",
    isActive: true
  },
  {
    href: "/chatbot",
    icon: "lni-comments",
    label: "ChatBot",
    isActive: false
  }
];

export default function MenuBar({ items = defaultItems }: MenuBarProps) {
  return (
    <div className="bg-indigo-100 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex space-x-8">
          {items.map((item, index) => (
            <li key={index}>
              <a 
                href={item.href} 
                className={`flex items-center py-4 px-2 ${
                  item.isActive 
                    ? 'text-indigo-800 border-b-2 border-indigo-800'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                <i className={`lni ${item.icon} text-current text-xl mr-2`}></i>
                <span className="text-base">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
