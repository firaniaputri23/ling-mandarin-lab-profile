import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { programs } from "@/data/programs";
import { whatsappUrl } from "@/data/stats";
import whatsappIcon from "@/assets/Medsos/wa.svg";

import chinaFlag from "@/assets/Flag/china.svg";
import taiwanFlag from "@/assets/Flag/taiwan.svg";

const ProgramsSection = () => {
  const handleWhatsappClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <section className="py-16 md:py-24 ">
      <div className="container px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Program Ling Chinese Lab
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-2">
              <img src={chinaFlag} alt="Bendera China" className="h-7 w-7 rounded-full shadow-sm" />
              <span>Simplified</span>
            </span>
            <span className="text-xl font-semibold text-muted-foreground">&</span>
            <span className="flex items-center gap-2">
              <img src={taiwanFlag} alt="Bendera Taiwan" className="h-7 w-7 rounded-full shadow-sm" />
              <span>Traditional</span>
            </span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Pilih level yang sesuai dengan kemampuan Anda. Setiap program dirancang untuk hasil maksimal.
          </p>
        </div>

        {/* Simplified vs Traditional info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-white/80 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={chinaFlag} alt="Bendera China" className="h-9 w-9 rounded-full shadow-sm" />
                <CardTitle className="text-lg">Simplified (简体字)</CardTitle>
              </div>
              <CardDescription className="space-y-2 text-foreground">
                <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                  <li>Bentuk tulisan yang disederhanakan</li>
                  <li>Lebih mudah dipahami untuk pemula</li>
                  <li>Digunakan di: China, Singapura, Malaysia</li>
                </ol>
                <div className="pt-2 text-foreground font-semibold">Cocok untuk:</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Ujian HSK
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Keperluan bisnis & pekerjaan
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Belajar lebih cepat sebagai pemula
                  </li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-white/80 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={taiwanFlag} alt="Bendera Taiwan" className="h-9 w-9 rounded-full shadow-sm" />
                <CardTitle className="text-lg">Traditional (繁體字)</CardTitle>
              </div>
              <CardDescription className="space-y-2 text-foreground">
                <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                  <li>Bentuk asli dengan goresan lebih banyak</li>
                  <li>Banyak dipakai dalam budaya & literatur klasik</li>
                  <li>Digunakan di: Taiwan, Hong Kong, Makau</li>
                </ol>
                <div className="pt-2 text-foreground font-semibold">Cocok untuk:</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Persiapan sekolah/kerja di Taiwan/HK
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Minat budaya atau literatur klasik
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    Ingin mempelajari karakter yang lebih lengkap
                  </li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* --- NEW SECTIONS --- */}
        {/* Perbandingan Level Table */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 md:p-6 text-center bg-muted/30 border-b">
            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-wide">Perbandingan Level</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 font-semibold text-muted-foreground border-b w-16 text-center bg-primary/5 text-sm">CEFR</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b bg-primary/5 text-sm">Keterangan</th>
                  <th className="p-4 font-semibold text-[#E63946] border-b text-center bg-red-50/50">
                    <div className="text-base font-bold">HSK (China)</div>
                    <div className="text-xs font-normal opacity-90">简体字 jiǎn tǐ zì</div>
                  </th>
                  <th className="p-4 font-semibold text-blue-600 border-b text-center bg-blue-50/50">
                    <div className="text-base font-bold">TOCFL (Taiwan)</div>
                    <div className="text-xs font-normal opacity-90">繁體字 fán tǐ zì</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">C2</td>
                  <td className="p-4 font-medium">Sangat Mahir / Mastery</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 9</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 6 (Band C)<br/><span className="text-xs text-muted-foreground">精通級 (Mastery)</span></td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">C1</td>
                  <td className="p-4 font-medium">Mahir / Advanced</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 7 - 8</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 5 (Band C)<br/><span className="text-xs text-muted-foreground">流利級 (Fluent)</span></td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">B2</td>
                  <td className="p-4 font-medium">Menengah Atas / Upper-Inter</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 6</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 4 (Band B)<br/><span className="text-xs text-muted-foreground">高階級 (Advanced)</span></td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">B1</td>
                  <td className="p-4 font-medium">Menengah / Intermediate</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 4 - 5</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 3 (Band B)<br/><span className="text-xs text-muted-foreground">進階級 (Vantage)</span></td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">A2</td>
                  <td className="p-4 font-medium">Dasar / Elementary</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 2 - 3</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 2 (Band A)<br/><span className="text-xs text-muted-foreground">基礎級 (Waystage)</span></td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-center">A1</td>
                  <td className="p-4 font-medium">Pemula / Beginner</td>
                  <td className="p-4 text-center font-bold text-foreground/80 bg-red-50/30">HSK 1</td>
                  <td className="p-4 text-center bg-blue-50/30">Level 1 (Band A)<br/><span className="text-xs text-muted-foreground">入門級 (Breakthrough)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Contoh Perbedaan Goresan & Harus Pilih Yang Mana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 mb-8">
          
          {/* Contoh Goresan */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-5 md:p-6 flex flex-col">
            <h3 className="text-lg font-bold text-center mb-4 px-5 py-2 bg-primary/10 rounded-full inline-block mx-auto w-fit text-primary">
              Contoh Perbedaan Goresan
            </h3>
            <div className="flex gap-4 flex-1">
              {/* Simplified Col */}
              <div className="flex-1 bg-red-50/70 rounded-2xl p-4 border border-red-100/50">
                <h4 className="text-[#E63946] font-bold text-center text-base">HSK (China)</h4>
                <p className="text-xs text-center text-[#E63946]/80 mb-4 font-medium">简体字 jiǎn tǐ zì</p>
                <ul className="space-y-2 text-center text-lg md:text-xl font-medium text-foreground/90">
                  <li>学习</li>
                  <li>让</li>
                  <li>汉语</li>
                  <li>门</li>
                  <li>头</li>
                </ul>
              </div>
              {/* Traditional Col */}
              <div className="flex-1 bg-blue-50/70 rounded-2xl p-4 border border-blue-100/50">
                <h4 className="text-blue-600 font-bold text-center text-base">TOCFL (Taiwan)</h4>
                <p className="text-xs text-center text-blue-600/80 mb-4 font-medium">繁體字 fán tǐ zì</p>
                <ul className="space-y-2 text-center text-lg md:text-xl font-medium text-foreground/90">
                  <li>學習</li>
                  <li>讓</li>
                  <li>漢語</li>
                  <li>門</li>
                  <li>頭</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Harus Pilih Yang Mana */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-5 md:p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold text-center mb-4 px-6 py-2 bg-primary/10 rounded-full text-primary w-fit tracking-wide">
              Panduan Pemilihan
            </h3>
            <div className="flex w-full gap-4 flex-1">
               {/* China */}
               <div className="flex-1 flex flex-col items-center justify-center text-center bg-red-50/70 rounded-2xl p-4 border border-red-100/50">
                  <p className="font-semibold text-sm mb-1 text-foreground/80">Mau China?</p>
                  <div className="w-0.5 h-4 bg-red-300 mb-1 rounded-full"></div>
                  <div className="font-bold text-[#E63946] text-base mb-1 flex flex-col items-center gap-1">
                    Ujian HSK
                    <img src={chinaFlag} alt="China" className="w-5 h-5 rounded-full shadow-sm mt-0.5" />
                  </div>
                  <div className="w-0.5 h-4 bg-red-300 mb-1 rounded-full"></div>
                  <p className="font-bold text-sm text-foreground/90">Berbisnis</p>
               </div>
               {/* Taiwan */}
               <div className="flex-1 flex flex-col items-center justify-center text-center bg-blue-50/70 rounded-2xl p-4 border border-blue-100/50">
                  <p className="font-semibold text-sm mb-1 text-foreground/80">Mau Taiwan?</p>
                  <div className="w-0.5 h-4 bg-blue-300 mb-1 rounded-full"></div>
                  <div className="font-bold text-blue-600 text-base mb-1 flex flex-col items-center gap-1">
                    Ujian TOCFL
                    <img src={taiwanFlag} alt="Taiwan" className="w-5 h-5 rounded-full shadow-sm mt-0.5" />
                  </div>
                  <div className="w-0.5 h-4 bg-blue-300 mb-1 rounded-full"></div>
                  <p className="font-bold text-sm text-foreground/90">Keseharian Taiwan</p>
               </div>
            </div>
          </div>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="border-border hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {program.level}
                  </span>
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <Card className="border-primary/20 bg-muted/30">
            <CardContent className="py-8">
              <p className="text-muted-foreground mb-4">
                Info: Harga dan jadwal dikirimkan secara personal via WhatsApp
              </p>
              <Button
                size="lg"
                onClick={handleWhatsappClick}
                className="relative py-5 md:py-8 lg:px-6 w-full md:w-auto sm:min-w-[260px] md:min-w-[400px]  flex-1 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                <span className="flex w-full items-center justify-center gap-2">
                  <img src={whatsappIcon} alt="WhatsApp" className="size-7" />
                  <p className="text-base sm:text-lg">Tanya Program Lewat Whatsapp</p>
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
