import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  Calendar,
  BarChart3,
  UserCog,
  Shield,
} from "lucide-react";
import { SidebarHeader } from "../../ui/sidebar";
import { SidebarTrigger } from "../../ui/sidebar";

const AdminSidebar = (props) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Role Management",
      url: "/admin/roles",
      icon: UserCog,
    },
    {
      title: "Guide Assignments",
      url: "/admin/guide-assignments",
      icon: UserCheck,
    },
    {
      title: "Faculty Coordinators",
      url: "/admin/faculty-coordinators",
      icon: Shield,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Schedule",
      url: "/admin/schedule",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* User Info Section */}
      <SidebarHeader>
        <div className="mt-auto pt-18 pb-4 border-b">
          <div className="flex item-center space-x-3">
            <div className="w-8 h-8 bg-[#B7202E] rounded-full flex items-center justify-center">
              <span className="text-white text-base font-medium">
                {user?.personalDetails?.firstName?.charAt(0) || "A"}
                {user?.personalDetails?.lastName?.charAt(0) || "D"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.personalDetails?.firstName || "Admin"}{" "}
                {user?.personalDetails?.lastName || "User"}
              </p>
              <p className="text-xs text-white truncate">Administrator</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-white font-bold text-xl">
            Admin Panel
          </SidebarGroupLabel>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className={`${
                      location.pathname === item.url
                        ? "bg-[#B7202E] text-white"
                        : "text-white hover:bg-gray-100"
                    }`}
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarTrigger />
    </Sidebar>
  );
};

export default AdminSidebar;
