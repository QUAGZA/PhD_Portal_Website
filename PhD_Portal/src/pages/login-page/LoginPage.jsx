import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import lg2 from "../../assets/Lg_2.jpg";
import lg1 from "../../assets/Lg_1.jpg";
import lg3 from "../../assets/Lg_3.jpg";
import somaiya_logo from "../../assets/favicon.svg";
import google_logo from "../../assets/icon_google.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LoginPage.css";
import { getDecodedToken } from "../../utils/authToken";
const images = [lg1, lg2, lg3];

const LoginPage = () => {
  const [active, setActive] = useState("login");

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md flex w-5/6 h-[90vh] md:w-3/4 mx-auto overflow-hidden">
        <div className="w-1/2 h-full p-4 flex items-center justify-center border-r">
          <Slider infinite autoplay autoplaySpeed={3000} arrows={false} adaptiveHeight={true} className="w-full h-full">
            {images.map((image, index) => (
              <div key={index} className="w-full h-full">
                <img src={image} alt="Slideshow" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <img src={somaiya_logo} alt="Logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-4 text-[#B7202E]">Login to Shodh Ganga</h2>
          <div className="flex rounded-lg overflow-hidden mb-4">
            <button className={`px-6 py-2 transition-all duration-300 flex-1 cursor-pointer ${active === "login" ? "bg-[#B7202E] text-white" : "bg-gray-300 text-black"}`} onClick={() => setActive("login")}>SVV LOGIN</button>
            <button className={`px-6 py-2 transition-all duration-300 flex-1 cursor-pointer ${active === "mail" ? "bg-[#B7202E] text-white" : "bg-gray-300 text-black"}`} onClick={() => setActive("mail")}>SOMAIYA MAIL</button>
          </div>
          {active === "login" ? <LoginForm /> : <MailComponent />}
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [svvId, setSvvId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ svvId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const decoded = getDecodedToken();
        // const role = "student"; // Default to student if no role found
        // navigate(`/${role}/dashboard`);
        const roles = decoded?.roles || [];
        console.log("Decoded roles:", roles);
        if (roles.includes("faculty")) {
          navigate("/faculty-coordinator/dashboard");
        } else if (roles.includes("guide")) {
          navigate("/guide/dashboard");
        } else if (roles.includes("student")) {
          navigate("/student/dashboard");
        } else {
          alert("Role not recognized");
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder="SVV NET ID*"
        value={svvId}
        onChange={(e) => setSvvId(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <input
        type="password"
        placeholder="Password*"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <div className="flex justify-between text-sm mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 cursor-pointer" /> Remember me
        </label>
        <a href="#" className="text-[#B7202E]">forgot password?</a>
      </div>
      <button onClick={handleLogin} className="w-full bg-[#B7202E] text-white py-2 rounded cursor-pointer">LOGIN</button>
      <p className="text-center text-sm mt-4">
        First Time? <Link to="/register" className="text-[#B7202E]">Sign Up</Link>
      </p>
    </div>
  );
};

const MailComponent = () => {
  return (
    <div className="p-4 rounded-lg w-full flex flex-col items-center flex-1">
      <button className="w-[60%] bg-[#58595B1C] text-white py-2 rounded-md cursor-pointer flex flex-row justify-around">
        <img src={google_logo} className="w-7 h-7" alt="Google" />
        <h2 className="flex items-center justify-center text-[#B7202E] font-semibold">Login with Somaiya Mail ID</h2>
      </button>
      <p className="text-center text-sm mt-4">
        First Time? <Link to="/register" className="text-[#B7202E]">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
