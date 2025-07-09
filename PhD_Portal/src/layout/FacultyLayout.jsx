import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import FacultySidebar from "../components/custom/sidebar/FacultySidebar";

export default function FacultyLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FacultySidebar />
        <div className="flex flex-col flex-1 w-full">
          <HeaderLayout />
          <main className="flex-1 p-10 bg-gray-50 pt-16">
            <Outlet/>
          </main>
        </div>
      </div>
    </SidebarProvider>

  );
}

