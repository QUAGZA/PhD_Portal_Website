import somaiyaLogo from "../assets/SVU_KJSCE.png";
import trustLogo from "../assets/Somaiya_Trust.png";

const HeaderLayout = () => {
  return (
    <div>
      <header className="w-full h-16 flex items-center border-b-2 border-[#B7202E] bg-white px-4 shadow-sm fixed top-0 left-0 z-50">
        <div className="flex items-center flex-row justify-between w-full">
          <img src={somaiyaLogo} alt="Somaiya Logo" className="h-12" />
          <h1 className="text-xl font-semibold text-[#B7202E] text-center">
            PhD Portal
          </h1>
          <img src={trustLogo} alt="Trust Logo" className="h-10" />
        </div>
      </header>
    </div>
  );
};

export default HeaderLayout;
