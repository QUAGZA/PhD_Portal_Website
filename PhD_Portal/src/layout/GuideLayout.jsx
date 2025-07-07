import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import GuideSidebar from "../components/custom/sidebar/GuideSidebar";
import HeaderLayout from "./HeaderLayout";

export default function GuideLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <GuideSidebar />
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

