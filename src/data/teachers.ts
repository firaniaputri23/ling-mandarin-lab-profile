import annieCertificate from "@/assets/Laoshi/Annie/Annie Laoshi.jpg";
import aureliaCertificate from "@/assets/Laoshi/Aurelia/CamScanner 24-11-2025 06.20.pdf";
import celineHsk from "@/assets/Laoshi/Celine/Celine HSK.pdf";
import celineTims from "@/assets/Laoshi/Celine/Celine TIMS.jpg";
import celineTocfl from "@/assets/Laoshi/Celine/Celine TOCFL.jpg";
import celineHskPreview from "@/assets/Laoshi/Celine/celine-hsk-1.png";
import michelleOliviaTocfl from "@/assets/Laoshi/MichelleOlivia/Michelle TOCFL A2.pdf";
import michelleOliviaPhoto from "@/assets/Laoshi/MichelleOlivia/person/olivia.svg";
import michellePutriHsk from "@/assets/Laoshi/MichellePutri/Michelle P HSK.pdf";
import michelleHskPreview from "@/assets/Laoshi/MichellePutri/michelle-hsk-1.png";
import michellePutriPhoto from "@/assets/Laoshi/MichellePutri/person/michelleputri.svg";
import tasyaPortfolio from "@/assets/Laoshi/Tasya/Tasya 1.jpg";
import tasyaArticle from "@/assets/Laoshi/Tasya/Tasya Article.jpg";
import tasyaHsk from "@/assets/Laoshi/Tasya/Tasya HSK.pdf";
import tasyaHskPreview from "@/assets/Laoshi/Tasya/tasya-hsk-1.png";
import tasyaPhoto from "@/assets/Laoshi/Tasya/person/tasya.svg";
import rachelHsk from "@/assets/Laoshi/Rachel/HSK.pdf";
import rachelTocfl from "@/assets/Laoshi/Rachel/TOCFL.pdf";
import rachelJinan from "@/assets/Laoshi/Rachel/Jinan University Chinese Language Level Test Score Certificate.pdf";
import schoolHsing from "@/assets/School/hsing.svg";
import schoolMedical from "@/assets/School/medical.svg";
import schoolNtcust from "@/assets/School/ntcust_long.svg";
import schoolPetra from "@/assets/School/petra.svg";
import schoolXinZhong from "@/assets/School/xin_zhong.svg";
import celinePhoto from "@/assets/Laoshi/Celine/person/celine.svg";
import anniePhoto from "@/assets/Laoshi/Annie/person/annie.svg";
import aureliaPhoto from "@/assets/Laoshi/Aurelia/person/aurellia.svg";

export interface TeacherCertificate {
  label: string;
  file: string;
  type: "image" | "pdf";
  preview?: string;
}

export interface TeacherSchool {
  name: string;
  logo: string;
}

export interface Teacher {
  id: number;
  name: string;
  mandarinName: string;
  location: string;
  education: string;
  schools: TeacherSchool[];
  photo?: string;
  degree: string;
  xinzhongBackground: string;
  certification: string;
  experience: string;
  certificates: TeacherCertificate[];
}

const schoolOptions: Record<string, TeacherSchool> = {
  xinZhong: { name: "Xin Zhong School", logo: schoolXinZhong },
  ntcust: { name: "NTCUST", logo: schoolNtcust },
  petra: { name: "Petra Christian University", logo: schoolPetra },
  chunghsing: { name: "Taichung Chung Hsing University", logo: schoolHsing },
  chinaMedical: { name: "China Medical University, Taichung", logo: schoolMedical }
};

const educationText = (schools: TeacherSchool[]) => schools.map((school) => school.name).join(" / ");

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Celine",
    mandarinName: "Laoshi Celine",
    location: "Jakarta & Online",
    schools: [schoolOptions.xinZhong, schoolOptions.ntcust],
    education: educationText([schoolOptions.xinZhong, schoolOptions.ntcust]),
    photo: celinePhoto,
    degree: "Sertifikasi pengajaran Mandarin",
    xinzhongBackground: "Alumni Xin Zhong School yang melanjutkan studi di NTCUST dengan fokus pengajaran HSK dan TOCFL.",
    certification: "HSK 5 - TOCFL - TIMS Teaching Certificate",
    experience: "Berpengalaman membimbing anak dan dewasa pemula hingga menengah dengan fokus pengucapan yang rapi.",
    certificates: [
      { label: "HSK - Celine", file: celineHsk, type: "pdf", preview: celineHskPreview },
      { label: "TIMS - Celine", file: celineTims, type: "image" },
      { label: "TOCFL - Celine", file: celineTocfl, type: "image" }
    ]
  },
  {
    id: 2,
    name: "Tasya",
    mandarinName: "Laoshi Tasya",
    location: "Surabaya & Online",
    schools: [schoolOptions.xinZhong, schoolOptions.petra],
    education: educationText([schoolOptions.xinZhong, schoolOptions.petra]),
    photo: tasyaPhoto,
    degree: "Lulusan program intensif bahasa Mandarin & mahasiswi Petra",
    xinzhongBackground: "Aktif di komunitas Xin Zhong dan menerapkan pendekatan kreatif dari Petra Christian University untuk murid remaja.",
    certification: "HSK - Artikel & karya tulis Mandarin",
    experience: "3 tahun mengajar, fokus meningkatkan percaya diri berbicara dan pemahaman bacaan.",
    certificates: [
      { label: "HSK - Tasya", file: tasyaHsk, type: "pdf", preview: tasyaHskPreview },
      { label: "Artikel Mandarin - Tasya", file: tasyaArticle, type: "image" },
      { label: "Portofolio Tasya", file: tasyaPortfolio, type: "image" }
    ]
  },
  {
    id: 3,
    name: "Annie",
    mandarinName: "Laoshi Annie",
    location: "Bandung & Online",
    schools: [schoolOptions.chinaMedical],
    education: educationText([schoolOptions.chinaMedical]),
    photo: anniePhoto,
    degree: "Spesialisasi pengajaran anak-anak",
    xinzhongBackground: "Lulusan China Medical University di Taichung yang terbiasa mengajar siswa usia dini dengan pendekatan fun learning.",
    certification: "Sertifikasi pengajaran",
    experience: "4 tahun mengajar, memadukan latihan percakapan dan permainan kosakata.",
    certificates: [{ label: "Sertifikat Annie", file: annieCertificate, type: "image" }]
  },
  {
    id: 4,
    name: "Michelle Olivia",
    mandarinName: "Laoshi Michelle Olivia",
    location: "Jakarta & Online",
    schools: [schoolOptions.ntcust],
    education: educationText([schoolOptions.ntcust]),
    photo: michelleOliviaPhoto,
    degree: "Sertifikasi TOCFL",
    xinzhongBackground: "Lulusan NTCUST dengan fokus pengembangan kemampuan dasar percakapan.",
    certification: "TOCFL A2 - NTCUST",
    experience: "Mendampingi banyak pemula dewasa memulai percakapan sehari-hari dalam Mandarin.",
    certificates: [{ label: "TOCFL A2 - Michelle Olivia", file: michelleOliviaTocfl, type: "pdf" }]
  },
  {
    id: 5,
    name: "Michelle Putri",
    mandarinName: "Laoshi Michelle Putri",
    location: "Medan & Online",
    schools: [schoolOptions.chunghsing],
    education: educationText([schoolOptions.chunghsing]),
    photo: michellePutriPhoto,
    degree: "Sertifikasi HSK",
    xinzhongBackground: "Lulusan Taichung Chung Hsing University yang aktif membina kelas persiapan ujian.",
    certification: "HSK",
    experience: "5 tahun mengajar, membantu siswa menaklukkan ujian HSK lewat latihan intensif.",
    certificates: [{ label: "HSK - Michelle Putri", file: michellePutriHsk, type: "pdf", preview: michelleHskPreview }]
  },
  {
    id: 6,
    name: "Rachel",
    mandarinName: "Laoshi Rachel",
    location: "Online",
    schools: [schoolOptions.ntcust],
    education: educationText([schoolOptions.ntcust]),
    degree: "Sertifikasi menyusul",
    xinzhongBackground: "Lulusan NTCUST yang tengah menyiapkan sertifikat terbarunya.",
    certification: "HSK • TOCFL • Jinan University Score",
    experience: "Berpengalaman mengajar percakapan sehari-hari dan kelas privat fleksibel.",
    certificates: [
      { label: "HSK - Rachel", file: rachelHsk, type: "pdf" },
      { label: "TOCFL - Rachel", file: rachelTocfl, type: "pdf" },
      { label: "Jinan University Score", file: rachelJinan, type: "pdf" }
    ]
  },
  {
    id: 7,
    name: "Aurelia Kelly",
    mandarinName: "Laoshi Aurelia Kelly",
    location: "Online",
    schools: [schoolOptions.xinZhong],
    education: educationText([schoolOptions.xinZhong]),
    photo: aureliaPhoto,
    degree: "Sertifikasi pengajaran Mandarin",
    xinzhongBackground: "Berbasis di Xin Zhong School dengan fokus pendampingan percakapan dasar dan persiapan ujian.",
    certification: "Sertifikat pengajaran Mandarin",
    experience: "Mendampingi pemula dewasa memulai percakapan sehari-hari dengan latihan terstruktur.",
    certificates: [{ label: "Sertifikat Aurelia Kelly", file: aureliaCertificate, type: "pdf" }]
  }
];
