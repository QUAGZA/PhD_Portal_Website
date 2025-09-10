import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, BookOpen, Shield } from "lucide-react";

const RoleSelector = ({ className = "" }) => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Don't render if user doesn't have multiple roles
  if (!user?.roles || user.roles.length <= 1) {
    return null;
  }

  const roleConfig = {
    Student: {
      label: "Student",
      icon: BookOpen,
      path: "/student/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    Guide: {
      label: "Guide",
      icon: User,
      path: "/guide/dashboard",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    Admin: {
      label: "Faculty Coordinator",
      icon: Shield,
      path: "/faculty-coordinator/dashboard",
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100"
    }
  };

  const handleRoleSwitch = (role) => {
    const config = roleConfig[role];
    if (config) {
      navigate(config.path);
      setIsOpen(false);
    }
  };

  const getCurrentRole = () => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/student")) return "Student";
    if (currentPath.startsWith("/guide")) return "Guide";
    if (currentPath.startsWith("/faculty-coordinator")) return "Admin";
    return user.roles[0]; // fallback to primary role
  };

  const currentRole = getCurrentRole();
  const currentConfig = roleConfig[currentRole];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 ${currentConfig?.bgColor} transition-colors duration-200`}
      >
        {currentConfig?.icon && (
          <currentConfig.icon className={`h-4 w-4 ${currentConfig.color}`} />
        )}
        <span className={`text-sm font-medium ${currentConfig?.color}`}>
          {currentConfig?.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Switch Role
            </div>
            {user.roles.map((role) => {
              const config = roleConfig[role];
              if (!config || role === currentRole) return null;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 text-left ${config.bgColor} transition-colors duration-200`}
                >
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RoleSelector;
