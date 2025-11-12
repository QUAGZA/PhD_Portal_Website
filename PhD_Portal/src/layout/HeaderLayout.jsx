import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import somaiyaLogo from "../assets/SVU_KJSCE.png";
import trustLogo from "../assets/Somaiya_Trust.png";
import RoleSelector from "../components/RoleSelector";
import { logout } from "../redux/slices/authSlice";
import { Button } from "@/components/ui/button";

const HeaderLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if API call fails
      navigate("/");
    }
  };

  return (
    <div>
      <header className="w-full h-16 flex items-center border-b-2 border-[#B7202E] bg-white px-4 shadow-sm fixed top-0 left-0 z-50">
        <div className="flex items-center flex-row justify-between w-full">
          <img src={somaiyaLogo} alt="Somaiya Logo" className="h-12" />
          <h1 className="text-xl font-semibold text-[#B7202E] text-center">
            PhD Portal
          </h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600 font-medium">
                {user.personalDetails?.firstName || user.email}
              </span>
            )}
            <RoleSelector />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 border-[#B7202E] text-[#B7202E] hover:bg-[#B7202E] hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <img src={trustLogo} alt="Trust Logo" className="h-10" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderLayout;
