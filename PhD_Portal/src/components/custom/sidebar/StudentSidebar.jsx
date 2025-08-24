import {
  BrainCog,
  House,
  Megaphone,
  BookText,
  Settings,
  NotebookPen,
  UserRound,
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
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "../../../redux/slices/authSlice";

// Navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: House,
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
      title: "Guide Allocation",
      url: "/student/guide-allocation",
      icon: UserRound,
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
  ],
};

export default function StudentSidebar(props) {
  const dispatch = useDispatch();
  // Get user data from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check authentication status when component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, user]);

  // Debug log user data
  useEffect(() => {
    console.log("Sidebar - Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  // Create user object for sidebar
  const userData = {
    name: user?.personalDetails
      ? `${user.personalDetails.title || ""} ${user.personalDetails.firstName || ""} ${user.personalDetails.middleName || ""} ${user.personalDetails.lastName || ""}`.trim()
      : "Student Name",
    avatar: "", // Avatar image URL if available
    institution:
      user?.programDetails?.institute || "K. J. Somaiya School Of Engineering",
    enrollmentId: user?.programDetails?.rollNumber || "",
    url: "/student/profile", // URL to the user profile
  };

  // Debug log formatted user data
  console.log("Sidebar - Formatted user data:", userData);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarTrigger className="absolute right-2 bottom-2" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
