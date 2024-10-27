import { menuItems as defaultMenuItems } from '@/config/navigation';

export function getActiveMenuItems(currentPath: string) {
  return defaultMenuItems.map(item => ({
    ...item,
    isActive: item.href === currentPath
  }));
}
