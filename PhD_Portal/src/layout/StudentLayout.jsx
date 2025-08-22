import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/custom/sidebar/StudentSidebar";
import HeaderLayout from "./HeaderLayout";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "../redux/slices/authSlice";

export default function StudentLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <div className="flex flex-col flex-1 w-full">
          <HeaderLayout />
          <main className="flex-1 p-10 bg-gray-50 pt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
