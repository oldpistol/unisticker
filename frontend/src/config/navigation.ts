import { LayoutGrid as GridAltIcon, MessageSquare as CommentsIcon } from 'lucide-react';

export const menuItems = [
  {
    href: "/applications",
    icon: GridAltIcon,
    label: "Applications",
    isActive: true
  },
  {
    href: "/chatbot",
    icon: CommentsIcon,
    label: "ChatBot",
    isActive: false
  }
];
