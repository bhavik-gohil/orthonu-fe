import Link from "next/link";
import Image from "next/image";

// test

export default function Footer() {
  return (
    <footer className="mt-auto py-7 md:py-10 px-6 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12">
        <div className="flex mx-auto md:mx-0">
          <Image src="/logo-nu.png" alt="OrthoNu" width={100} height={22} />
        </div>
        <div className="space-y-3 flex flex-col w-full">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 w-full justify-center items-center">
            <div className="flex space-x-6 text-brand-blue text-2xl transition-all duration-200">
              <a
                className="bi bi-facebook hover:text-atlantic-blue cursor-pointer relative group"
                href="https://www.facebook.com/OrthoNu-106817265490952"
                target="_blank"
                title="Facebook"
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Facebook
                </span>
              </a>
              <a
                className="bi bi-twitter-x hover:text-atlantic-blue cursor-pointer relative group"
                href="https://x.com/orthonu"
                target="_blank"
                title="X (Twitter)"
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  X (Twitter)
                </span>
              </a>
              <a
                className="bi bi-linkedin hover:text-atlantic-blue cursor-pointer relative group"
                href="https://www.linkedin.com/company/orthonu/"
                target="_blank"
                title="LinkedIn"
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  LinkedIn
                </span>
              </a>
              <a
                className="bi bi-instagram hover:text-atlantic-blue cursor-pointer relative group"
                href="https://www.instagram.com/ortho.nu/"
                target="_blank"
                title="Instagram"
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Instagram
                </span>
              </a>
              <a
                className="bi bi-youtube hover:text-atlantic-blue cursor-pointer relative group"
                href="https://youtube.com/@orthonu?si=k76-KzRxkUPZx8GE"
                target="_blank"
                title="YouTube"
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  YouTube
                </span>
              </a>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-brand-blue text-white rounded-full hover:bg-atlantic-blue transition-all font-semibold mb-1 md:mb-0"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full border-t-2 border-brand-blue/50">
            <div className="w-full">
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 text-xs pb-3 pt-4 text-atlantic-blue/60 justify-center items-center">
                <Link
                  href="/terms-of-use"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy-policy"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/shipping-policy"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/refund-and-returns-policy"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  Refund and Returns Policy
                </Link>
                <Link
                  href="/ccpa-opt-out"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  CCPA Opt Out
                </Link>
                <Link
                  href="/community-guidelines"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  Community Guidelines
                </Link>
              </div>
              <div className="text-xs font-bold tracking-[0.05em] text-zinc-400 w-full">
                <div className="flex justify-center">
                  © {new Date().getFullYear()} OrthoNu. • OrthoNu® and Tweakz®
                  are registered trademarks. • All rights reserved.
                </div>
                <div className="flex justify-center">
                  Tweakz combination patent: US patent No. 11,642,196 | Tweakz
                  for braces: US patent No. 11,642,197
                </div>
              </div>
            </div>
            <a
              className="flex items-center justify-center md:justify-start cursor-pointer pt-4"
              href="https://marislist.com/"
              target="_blank"
            >
              <Image
                src="/marislist.png"
                alt="OrthoNu"
                width={80}
                height={18}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
