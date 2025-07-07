import {
  Users,
  BrainCog,
  House,
  Megaphone,
  BookText,
  Settings,
  NotebookPen,
  CalendarDays,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "../../ui/sidebar";

// Sample data
const data = {
  user: {
    name: "Swayam Sanjay Vernekar",
    avatar: "", // or use a valid image URL
    institution: "K. J. Somaiya School Of Engineering",
    enrollmentId: "1620231407",
    url: "/guide/profile", // URL to the user profile
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/guide/dashboard",
      icon: House ,
      isActive: true,
    },
    {
      title: "Students",
      url: "/guide/students",
      icon: Users,
    },
    {
      title: "Schedule",
      url: "/guide/schedule",
      icon: CalendarDays,
    },
    {
      title: "Assignments",
      url: "/guide/assignments",
      icon: NotebookPen,
    },
    {
      title: "Courses",
      url: "/guide/courses",
      icon: BrainCog,
    },
    {
      title: "Announcements",
      url: "/guide/announcements",
      icon: Megaphone,
    },
    {
      title: "Resources",
      url: "/guide/resources",
      icon: BookText,
  
    },
    {
      title: "Settings",
      url: "/guide/settings",
      icon: Settings,
    },
  ]
};


export default function GuideSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
      <SidebarTrigger className="absolute right-2 bottom-2" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

