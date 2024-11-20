import { Meteors } from "@/components/index"; // Đường dẫn đúng đến file Meteors
import { Github, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

//An appealing footer section
export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-800 w-full px-12 overflow-hidden">
      {/*Meteors*/}
      <Meteors number={25} className="z-0 opacity-25" />
      <div className="py-16 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:items-start md:text-left gap-12">
          <div className="flex flex-col gap-6">
            <Link href="/">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/logo.png"
                    alt="logo"
                    className="h-8 w-8 sm:h-11 sm:w-11"
                  />
                  <p className="bg-gradient-to-r from-primary-red to-pink-600 text-transparent bg-clip-text font-semibold text-xl sm:text-[20px]">
                    BlockScan
                  </p>
                </div>
                <div className="h-8 mx-4 border-l border-subtitle__gray"></div>
                <div>
                  <p className="text-gray-300 text-[12px]">Powered by</p>
                  <img
                    src="/images/swinburne-univeristy-logo.webp"
                    alt="swin logo"
                    className="w-[70px]"
                  />
                </div>
              </div>
            </Link>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* GitHub Link */}
              <button className="border-[2px] border-gray-300 rounded-full p-2 hover:text-primary-red hover:border-primary-red/50 hover:scale-105 transition-all duration-300">
                <a href="https://github.com/Levironexe" target="_blank" rel="noopener noreferrer">
                  <Github className="w-7 h-7" />
                  <span className="sr-only">GitHub</span>
                </a>
              </button>
              {/* Twitter Link */}
              <button className="border-[2px] border-gray-300 rounded-full p-2 hover:text-primary-red hover:border-primary-red/50 hover:scale-105 transition-all duration-300">
                <a href="https://x.com/yourmom" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-7 h-7" />
                  <span className="sr-only">Twitter</span>
                </a>
              </button>
              {/* Facebook Link */}
              <button className="border-[2px] border-gray-300 rounded-full p-2 hover:text-primary-red hover:border-primary-red/50 hover:scale-105 transition-all duration-300">
                <a href="https://www.facebook.com/profile.php?id=61566144360040" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-7 h-7" />
                  <span className="sr-only">Facebook</span>
                </a>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 font-semibold">
            <div>
              <a
                href="https://www.google.com/maps/place/Swinburne+Vietnam+-+HCMC+Campus/@10.8162023,106.6664322,17z/data=!3m1!4b1!4m6!3m5!1s0x31752ff6c51d5ebd:0x4403e126c229b92b!8m2!3d10.8162023!4d106.6690071!16s%2Fg%2F11fszkyqgr?entry=ttu&g_ep=EgoyMDI0MTEwNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                className="flex gap-2 hover:text-primary-red hover:scale-105 duration-300 transition-all"
              >
                <MapPin />
                <span className="text-[15px]">A35 Bạch Đằng, Quận Tân Bình, HCMC</span>
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href="mailto:nguyenphuoc4805@gmail.com"
                target="_blank"
                className="flex gap-2 hover:text-primary-red hover:scale-105 duration-300 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span className="text-[15px]">nguyenphuoc4805@gmail.com</span>
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:0798896946"
                target="_blank"
                className="flex gap-2 hover:text-primary-red hover:scale-105 duration-300 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span className="text-[15px]">+84 7988 96 946</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}