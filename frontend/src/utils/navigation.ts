import { menuItems as defaultMenuItems } from '@/config/navigation';
import React from 'react';

export interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType;
  isActive?: boolean;
}

export function getActiveMenuItems(currentPath: string) {
  return defaultMenuItems.map(item => ({
    ...item,
    isActive: item.href === currentPath
  }));
}
