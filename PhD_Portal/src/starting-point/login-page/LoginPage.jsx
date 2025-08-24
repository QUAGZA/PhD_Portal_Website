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
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user && !isCheckingAuth) {
      // Redirect based on user role
      const from = location.state?.from || getDefaultRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, isCheckingAuth, navigate, location]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case "Student":
        return "/student/dashboard";
      case "Guide":
        return "/guide/dashboard";
      case "Admin":
        return "/faculty-coordinator/dashboard";
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
  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder="SVV NET ID*"
        className="w-full p-2 border rounded-md mb-2"
      />
      <input
        type="password"
        placeholder="Password*"
        className="w-full p-2 border rounded-md mb-2"
      />
      <div className="flex justify-between text-sm mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 cursor-pointer" /> Remember me
        </label>
        <a href="#" className="text-[#B7202E]">
          forgot password?
        </a>
      </div>
      <button className="w-full bg-[#B7202E] text-white py-2 rounded cursor-pointer">
        LOGIN
      </button>
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
