// PhD_Portal_Website/PhD_Portal/src/starting-point/login-page/LoginPage.jsx
import { React, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import lg2 from "../../assets/Lg_2.jpg";
import lg1 from "../../assets/Lg_1.jpg";
import lg3 from "../../assets/Lg_3.jpg";
import somaiya_logo from "../../assets/favicon.svg";
import google_logo from "../../assets/icon_google.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LoginPage.css";
import SignUpDialog from "../../components/custom/SignUpDialog.jsx";

const images = [lg1, lg2, lg3];

const LoginPage = () => {
  const [active, setActive] = useState("login");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth status...");
        const result = await Promise.race([
          dispatch(checkAuthStatus()).unwrap(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Auth check timeout")), 5000)
          )
        ]);
        console.log("Auth check result:", result);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Continue to login page even if auth check fails
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user && !isCheckingAuth) {
      // Redirect based on user role (using the first role in the array as primary)
      const primaryRole =
        user.roles && user.roles.length > 0 ? user.roles[0] : "Student";
      const from = location.state?.from || getDefaultRoute(primaryRole);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, isCheckingAuth, navigate, location]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case "Student":
        return "/student/dashboard";
      case "Guide":
        return "/guide/dashboard";
      case "FacultyCoordinator":
        return "/faculty-coordinator/dashboard";
      case "Admin":
        return "/admin/dashboard";
      default:
        return "/student/dashboard";
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B7202E] mx-auto"></div>
          <p className="mt-3 text-gray-600">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md flex w-5/6 h-[90vh] md:w-3/4  mx-auto overflow-hidden">
        <div className="w-1/2 h-full p-4 flex items-center justify-center border-r">
          <Slider
            infinite
            autoplay
            autoplaySpeed={3000}
            arrows={false}
            adaptiveHeight={true}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={image}
                  alt="Slideshow"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <img src={somaiya_logo} alt="Logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-4 text-[#B7202E]">
            Login to PhD Portal
          </h2>
          <div className="flex rounded-lg overflow-hidden mb-4">
            <button
              className={`px-6 py-2 transition-all duration-300 flex-1 cursor-pointer ${active === "login" ? "bg-[#B7202E] text-white" : "bg-gray-300 text-black"}`}
              onClick={() => setActive("login")}
            >
              SVV LOGIN
            </button>
            <button
              className={`px-6 py-2 transition-all duration-300 flex-1 cursor-pointer ${active === "mail" ? "bg-[#B7202E] text-white" : "bg-gray-300 text-black"}`}
              onClick={() => setActive("mail")}
            >
              SOMAIYA MAIL
            </button>
          </div>
          {active === "login" ? (
            <LoginForm setShowSignUpDialog={setShowSignUpDialog} />
          ) : (
            <MailComponent />
          )}
        </div>
      </div>

      {/* SignUp Dialog */}
      <SignUpDialog
        isOpen={showSignUpDialog}
        onClose={() => setShowSignUpDialog(false)}
      />
    </div>
  );
};

const LoginForm = ({ setShowSignUpDialog }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9999/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Update auth state
      await dispatch(checkAuthStatus()).unwrap();

      // Redirect based on user role
      const primaryRole =
        data.user.roles && data.user.roles.length > 0
          ? data.user.roles[0]
          : "Student";

      if (data.needsRegistration) {
        navigate("/register");
      } else {
        switch (primaryRole) {
          case "Student":
            navigate("/student/dashboard");
            break;
          case "Guide":
            navigate("/guide/dashboard");
            break;
          case "FacultyCoordinator":
            navigate("/faculty-coordinator/dashboard");
            break;
          case "Admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
          required
        />
        <div className="flex justify-between text-sm mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember me
          </label>
          <a href="#" className="text-[#B7202E]">
            forgot password?
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B7202E] text-white py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        First Time?{" "}
        <a
          onClick={() => setShowSignUpDialog(true)}
          className="text-[#B7202E] cursor-pointer"
        >
          Sign Up
        </a>
      </p>
    </div>
  );
};

/* Mail Component */
const MailComponent = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9999/auth/google";
  };

  return (
    <div className="p-4 rounded-lg w-full flex flex-col items-center flex-1">
      <button
        onClick={handleGoogleLogin}
        className="w-[60%] bg-[#58595B1C] text-white py-2 rounded-md cursor-pointer flex flex-row justify-around"
      >
        <img src={google_logo} className="w-7 h-7" alt="Google"></img>
        <h2 className="flex items-center justify-center text-[#B7202E] font-semibold">
          Login with Somaiya Mail ID
        </h2>
      </button>
    </div>
  );
};

export default LoginPage;
