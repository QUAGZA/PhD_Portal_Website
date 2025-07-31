import {
  Users,
  BrainCog,
  House,
  Megaphone,
  BookText,
  Settings,
  NotebookPen,
  CalendarDays,
  MessageSquareText,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "../../ui/sidebar";
import LogoutButton from "./LogoutButton";

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
      title: "Forum",
      url: "/guide/forum",
      icon: MessageSquareText,
    },
    {
      title: "Courses",
      url: "/guide/courses",
      icon: BrainCog,
    },
    // {
    //   title: "Announcements",
    //   url: "/guide/announcements",
    //   icon: Megaphone,
    // },
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
  const { state } = useSidebar(); 

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
      <SidebarTrigger className={`absolute cursor-pointer bottom-16 ${state === "collapsed" ? "left-1/2 transform -translate-x-1/2" : "right-2"}`} />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

