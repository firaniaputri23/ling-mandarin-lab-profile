import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/stats";
import whatsappIcon from "@/assets/Medsos/wa.svg";
import igIcon from "@/assets/Medsos/ig.svg";
import tiktokIcon from "@/assets/Medsos/tiktok.svg";

import logo from "@/assets/LOGO.svg";

const Footer = () => {
  const handleWhatsappClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Ling Chinese Lab" className="h-auto w-[50%]" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Membawa bahasa Mandarin jadi dekat dan menyenangkan untuk semua.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Hubungi Kami</h3>
            <Button
              size="lg"
              onClick={handleWhatsappClick}
              className="relative py-5 lg:px-6 w-fit  flex-1 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              <span className="flex w-full items-center justify-center gap-2">
                <img src={whatsappIcon} alt="WhatsApp" className="size-7" />
                <p className="text-base sm:text-lg">Whatsapp</p>
              </span>
            </Button>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Follow Kami</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/lingchineselab?igsh=MXNmMnBscmR6aHFlaw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-primary/10"
              >
                <img src={igIcon} alt="Instagram" className="h-5 w-5" />
                <span>@lingchineselab</span>
              </a>
              <a
                href="https://www.tiktok.com/@ceeehaaaaa?_r=1&_t=ZS-91V8Wr9Xixp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-primary/10"
              >
                <img src={tiktokIcon} alt="TikTok" className="h-5 w-5" />
                <span>@ceeehaaaaa</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Ling Chinese Lab – All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
