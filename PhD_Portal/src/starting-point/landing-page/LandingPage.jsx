import { React, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPage.css";
import somaiya_logo from "../../assets/favicon.svg";
import lp1 from "../../assets/Lp_1.jpg";
import lp2 from "../../assets/Lp_2.jpg";
import lp3 from "../../assets/Lp_3.jpg";
import Somaiya_Trust from "../../assets/Somaiya_Trust.png";
import KJSSE from "../../assets/SVU_KJSCE.png";

const images = [lp1, lp2, lp3];

const LandingPage = ({ onContinue }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  const [isHidden, setIsHidden] = useState(false);

  const handleClick = () => {
    setIsHidden(true);
    setTimeout(onContinue, 600);
  };

  return (
    <motion.div
      className="absolute top-0 left-0 h-screen w-screen overflow-hidden cursor-pointer"
      initial={{ y: 0 }}
      animate={isHidden ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={handleClick}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="h-screen w-screen">
            <img
              src={image}
              alt="Slideshow"
              className="w-full h-full object-cover "
            />
          </div>
        ))}
      </Slider>
      <div className="absolute bg-[#F0F2F9AA] inset-0 flex flex-col items-center justify-center text-center text-white p-6 h-screen w-screen">
        <img src={somaiya_logo} alt="Logo" className="w-24 mb-4" />
        <h1 className="text-4xl font-bold text-[#B7202E]">PhD Portal</h1>
        {/* <h2 className="text-2xl mt-2 text-[#004466]">PhD Portal</h2>*/}
        <h2 className="text-2xl mt-2 text-[#004466]">
          KJ Somaiya School of Engineering
        </h2>
      </div>
      <div className="absolute right-5 top-5 h-25 w-25 z-10">
        <img src={Somaiya_Trust} alt="Lp_1" className="top-0 right-0 z-10" />
      </div>
      <div className="absolute left-5 top-5 h-auto w-60 z-10 bg-[#FFF6E5] rounded-lg drop-shadow-sm">
        {" "}
        {/**ANOTHER BG COLOR OPTION F0F2F999*/}
        <img src={KJSSE} alt="Lp_1" className="top-0 left-0 z-10 p-2" />
      </div>
      <div className="absolute bottom-5 w-full text-center">
        <p className="mt-4 text-lg text-[#B7202E] bottom-5 font-bold">
          Tap to continue
        </p>
      </div>
    </motion.div>
  );
};

export default LandingPage;
