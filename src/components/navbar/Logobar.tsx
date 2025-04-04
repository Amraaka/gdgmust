import Image from "next/image";
import logo from "../../../public/logos/logo.png";
import Link from "next/link";

const Logobar = () => {
  return (
    <div 
      // className="mr-[10px]"  
      className="select-none"
      style={{ userSelect: 'none', cursor: 'pointer' }}  // Prevent text selection
      draggable="false"  // Make undraggable
    >
      {/* GDG Logo */}
      {/* <Link
        href="/" 
        className="flex items-center p-4 py-[12px] rounded-full bg-white outline-none outline-1 outline-black outline-offset-0"
        draggable="false"  // Make link undraggable
      >
        <Image
          src={logo}
          alt="GDG"
          width={40}
          height={40.67}
          draggable="false"  // Make image undraggable
        />
      </Link> */}
      <Link
          href="/"
          draggable="false"
          className="flex items-center h-[48px] px-4 rounded-full bg-white/85 shadow-[0px_1px_7px] shadow-gray-300/80 backdrop-blur-md select-none"
      >
          <Image 
              src={logo} 
              alt="GDG" 
              draggable="false" 
              className="select-none max-w-[40px] max-h[24px]" 
              style={{ width: '40', height: '24' }}
          />
      </Link>
    </div>
  );
};

export default Logobar;