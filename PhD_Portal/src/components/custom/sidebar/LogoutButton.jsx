import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-red-600 transition-all bg-red-500 text-white w-full">
        <span className={`mr-2 ${state === "collapsed" ? "hidden" : ""}`}>Logout</span>
        <LogOut className="w-4 h-4 transform rotate-180" />
    </button>
  );
};

export default LogoutButton;
