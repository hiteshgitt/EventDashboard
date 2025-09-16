import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/") return "Dashboard";
    if (path === "/events") return "Events";
    if (path.includes("/events/new")) return "Create Event";
    if (path.includes("/events/") && path.includes("/edit")) return "Edit Event";
    if (path.includes("/events/")) return "Event Details";
    if (path === "/settings") return "Settings";
    
    return "Dashboard";
  };

  return (
    <header className="h-16 border-b border-divider bg-content1 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={toggleMobileSidebar}
          className="lg:hidden"
        >
          <Icon icon="lucide:menu" className="text-lg" />
        </Button>
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="relative"
            >
              <Icon icon="lucide:bell" className="text-lg" />
              <Badge content="3" color="danger" size="sm" className="absolute -top-1 -right-1" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications">
            <DropdownItem key="new" description="New event was created">
              <div className="flex justify-between items-center">
                <span>New Event</span>
                <span className="text-xs text-foreground-500">5m ago</span>
              </div>
            </DropdownItem>
            <DropdownItem key="updated" description="Event details were updated">
              <div className="flex justify-between items-center">
                <span>Event Updated</span>
                <span className="text-xs text-foreground-500">2h ago</span>
              </div>
            </DropdownItem>
            <DropdownItem key="reminder" description="Upcoming event in 2 days">
              <div className="flex justify-between items-center">
                <span>Event Reminder</span>
                <span className="text-xs text-foreground-500">1d ago</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
        {/* User menu */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="light"
              className="hidden sm:flex gap-2 items-center"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                JD
              </div>
              <span className="text-sm font-medium">John Doe</span>
              <Icon icon="lucide:chevron-down" className="text-sm" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownItem key="profile">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user" />
                <span>Profile</span>
              </div>
            </DropdownItem>
            <DropdownItem key="settings">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:settings" />
                <span>Settings</span>
              </div>
            </DropdownItem>
            <DropdownItem key="logout" className="text-danger">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:log-out" />
                <span>Logout</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};