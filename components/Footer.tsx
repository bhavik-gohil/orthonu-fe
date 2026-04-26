import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-12 px-6 bg-white border-t border-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section: Logo, Socials, and Contact */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex shrink-0">
            <Image
              src="/orthonu-you-got-this.png"
              alt="OrthoNu"
              width={200}
              height={80}
              className="h-auto w-48"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex space-x-6 text-brand-blue text-xl">
              <a
                className="bi bi-facebook hover:text-atlantic-blue transition-colors cursor-pointer relative group"
                href="https://www.facebook.com/OrthoNu-106817265490952"
                target="_blank"
                title="Facebook"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soft-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  Facebook
                </span>
              </a>
              <a
                className="bi bi-twitter-x hover:text-atlantic-blue transition-colors cursor-pointer relative group"
                href="https://x.com/orthonu"
                target="_blank"
                title="X (Twitter)"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soft-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  X (Twitter)
                </span>
              </a>
              <a
                className="bi bi-linkedin hover:text-atlantic-blue transition-colors cursor-pointer relative group"
                href="https://www.linkedin.com/company/orthonu/"
                target="_blank"
                title="LinkedIn"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soft-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  LinkedIn
                </span>
              </a>
              <a
                className="bi bi-instagram hover:text-atlantic-blue transition-colors cursor-pointer relative group"
                href="https://www.instagram.com/ortho.nu/"
                target="_blank"
                title="Instagram"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soft-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  Instagram
                </span>
              </a>
              <a
                className="bi bi-youtube hover:text-atlantic-blue transition-colors cursor-pointer relative group"
                href="https://youtube.com/@orthonu?si=k76-KzRxkUPZx8GE"
                target="_blank"
                title="YouTube"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soft-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  YouTube
                </span>
              </a>
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-blue text-white rounded-full font-bold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Section: Legal and Copyright */}
        <div className="pt-10 border-t border-zinc-100 space-y-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-5">
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-1">
                <Link
                  href="/terms-of-use"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/shipping-policy"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/refund-and-returns-policy"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  Refund and Returns Policy
                </Link>
                <Link
                  href="/ccpa-opt-out"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  CCPA Opt Out
                </Link>
                <Link
                  href="/community-guidelines"
                  className="text-[11px] font-bold text-atlantic-blue/60 hover:text-brand-blue transition-colors tracking-widest"
                >
                  Community Guidelines
                </Link>
              </div>

              <div className="text-center lg:text-left space-y-1 text-[11px] font-medium text-soft-dark/50 tracking-[0.05em]">
                <p>
                  © {currentYear} OrthoNu. • OrthoNu® and Tweakz® are registered
                  trademarks. • All rights reserved.
                </p>
                <p>
                  Tweakz combination patent: US patent No. 11,642,196 | Tweakz
                  for braces: US patent No. 11,642,197
                </p>
              </div>
            </div>

            <div className="flex shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <a href="https://marislist.com/" target="_blank">
                <Image
                  src="/marislist.png"
                  alt="Marislist"
                  width={140}
                  height={32}
                  className="h-16 md:h-20 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
