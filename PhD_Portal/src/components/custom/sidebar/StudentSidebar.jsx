import {
  BrainCog,
  House,
  Megaphone,
  BookText,
  Settings,
  NotebookPen,
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
    url: "/student/profile", // URL to the user profile
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: House ,
      isActive: true,
    },
    {
      title: "Courses",
      url: "/student/courses",
      icon: BrainCog,
    },
    {
      title: "Assignments",
      url: "/student/assignments",
      icon: NotebookPen,
    },
    {
      title: "Announcements",
      url: "/student/announcements",
      icon: Megaphone,
    },
    {
      title: "Resources",
      url: "/student/resources",
      icon: BookText,
  
    },
    {
      title: "Settings",
      url: "/student/settings",
      icon: Settings,
    },
  ]
};


export default function StudentSidebar(props) {
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

