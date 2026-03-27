'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  path: string;
  children?: NavItem[];
};

type SidebarProps = {
  items: NavItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const renderNavItems = (navItems: NavItem[], level = 0) =>
    navItems.map((item) => (
      <div key={item.path} style={{ paddingLeft: `${level * 16}px` }}>
        <a
          href={item.path}
          className={pathname === item.path ? 'active' : ''}
          tabIndex={0}
        >
          {item.label}
        </a>
        {item.children && renderNavItems(item.children, level + 1)}
      </div>
    ));

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleCollapse}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <nav>{renderNavItems(items)}</nav>
    </div>
  );
}
