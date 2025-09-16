import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed }) => {
  return (
    <li>
      <Tooltip
        content={isCollapsed ? label : ""}
        placement="right"
        delay={200}
        isDisabled={!isCollapsed}
      >
        <NavLink
          to={to}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
            ${isActive ? 'bg-primary-100 text-primary-600' : 'text-foreground-600 hover:bg-default-100'}
          `}
          activeClassName="bg-primary-100 text-primary-600"
        >
          <Icon icon={icon} className="text-xl flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium"
            >
              {label}
            </motion.span>
          )}
        </NavLink>
      </Tooltip>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className="h-full flex flex-col bg-content1 border-r border-divider">
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Icon icon="lucide:calendar" className="text-white text-lg" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-lg"
            >
              EventAdmin
            </motion.span>
          )}
        </div>
        {!isCollapsed && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={toggleSidebar}
            className="hidden lg:flex"
          >
            <Icon icon="lucide:chevrons-left" className="text-lg" />
          </Button>
        )}
        {isCollapsed && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={toggleSidebar}
            className="hidden lg:flex absolute -right-4 top-7 bg-content1 border border-divider rounded-full shadow-sm z-10"
          >
            <Icon icon="lucide:chevrons-right" className="text-lg" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <NavItem to="/" icon="lucide:home" label="Dashboard" isCollapsed={isCollapsed} />
          <NavItem to="/events" icon="lucide:calendar" label="Events" isCollapsed={isCollapsed} />
          <NavItem to="/settings" icon="lucide:settings" label="Settings" isCollapsed={isCollapsed} />
        </ul>
      </nav>

      {/* User */}
      <div className={`p-4 border-t border-divider ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Tooltip
          content={isCollapsed ? "John Doe" : ""}
          placement="right"
          isDisabled={!isCollapsed}
        >
          <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
              JD
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-foreground-500">Admin</span>
              </div>
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};