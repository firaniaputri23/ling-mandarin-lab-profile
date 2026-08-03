import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight } from 'lucide-react';

export type Question = {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  answer: string;
  explanation: string;
};

// --- DATA KUIS ---
export const QUIZ_DATABASE: Record<number, Question[]> = {
  11: [
    { id: 1, question: 'Hanzi yang tepat untuk melengkapi kalimat "Saya ... tiga kali makan setiap hari" adalah:', options: [{ label: 'A', text: '喝' }, { label: 'B', text: '吃 (chī)' }, { label: 'C', text: '咬' }, { label: 'D', text: '吞' }], answer: 'B', explanation: '吃 berarti "makan", sehingga sesuai dengan kalimat "makan tiga kali sehari".' },
    { id: 2, question: 'Hanzi yang tepat untuk melengkapi "Guru ... sebuah pertanyaan" adalah:', options: [{ label: 'A', text: '答' }, { label: 'B', text: '叫' }, { label: 'C', text: '问 (wèn)' }, { label: 'D', text: '告' }], answer: 'C', explanation: '问 berarti "bertanya", sehingga guru mengajukan sebuah pertanyaan.' },
    { id: 3, question: 'Pinyin yang benar untuk 喝 (minum) adalah ...', options: [{ label: 'A', text: 'hē' }, { label: 'B', text: 'hé' }, { label: 'C', text: 'hě' }, { label: 'D', text: 'hè' }], answer: 'A', explanation: '喝 dibaca hē dengan nada pertama ( ̄ ).' },
    { id: 4, question: 'Dia bernyanyi sangat ... !', options: [{ label: 'A', text: '响 (xiǎng)' }, { label: 'B', text: '味' }, { label: 'C', text: '善' }, { label: 'D', text: '古' }], answer: 'A', explanation: '响 (xiǎng) berarti "nyaring", sesuai untuk menggambarkan suara nyanyian.' },
    { id: 5, question: 'Arti dari 吹 (chuī) adalah ...', options: [{ label: 'A', text: 'Menghisap' }, { label: 'B', text: 'Menghembuskan / meniup' }, { label: 'C', text: 'Memuntahkan' }, { label: 'D', text: 'Mengunyah' }], answer: 'B', explanation: '吹 (chuī) berarti meniup atau menghembuskan udara.' },
    { id: 6, question: '... kue ini sangat enak.', options: [{ label: 'A', text: '嘴' }, { label: 'B', text: '喉咙' }, { label: 'C', text: '味道 wèidao' }, { label: 'D', text: '唇' }], answer: 'C', explanation: '味道 berarti "rasa", sehingga kalimat membahas rasa kue.' },
    { id: 7, question: 'Hanzi yang berarti "tenggorokan" adalah ...', options: [{ label: 'A', text: '喉咙 (hóu long)' }, { label: 'B', text: '唇' }, { label: 'C', text: '嘴' }, { label: 'D', text: '口' }], answer: 'A', explanation: '喉咙 (hóu long) berarti "tenggorokan".' },
    { id: 8, question: 'Tolong ... saya nomor teleponmu.', options: [{ label: 'A', text: '听' }, { label: 'B', text: '告诉 (gàosu)' }, { label: 'C', text: '叫' }, { label: 'D', text: '吸' }], answer: 'B', explanation: '告 (dalam 告诉) berarti "memberi tahu".' },
    { id: 9, question: 'Pasangan yang TEPAT antara Hanzi dan artinya adalah ...', options: [{ label: 'A', text: '左 = kanan' }, { label: 'B', text: '右 = kiri' }, { label: 'C', text: '和 = dan / dengan' }, { label: 'D', text: '台 = kuno' }], answer: 'C', explanation: '和 digunakan untuk menghubungkan dua kata atau lebih.' },
    { id: 10, question: 'Pilih hanzi yang berarti "menelan":', options: [{ label: 'A', text: '嚼' }, { label: 'B', text: '吐' }, { label: 'C', text: '吞 (tūn)' }, { label: 'D', text: '吸' }], answer: 'C', explanation: '吞 berarti "menelan", yaitu memasukkan makanan ke dalam tenggorokan.' },
  ],
  16: [
    { id: 1, question: 'Hanzi yang berarti "membaca" adalah:', options: [{ label: 'A', text: '读 (dú)' }, { label: 'B', text: '写' }, { label: 'C', text: '听' }, { label: 'D', text: '说' }], answer: 'A', explanation: '读 berarti "membaca", sesuai dengan kegiatan guru membaca teks pelajaran.' },
    { id: 2, question: 'Hanzi yang berarti "bahasa" adalah:', options: [{ label: 'A', text: '言' }, { label: 'B', text: '语 (yǔ)' }, { label: 'C', text: '词' }, { label: 'D', text: '话' }], answer: 'B', explanation: '语 berarti "bahasa", sehingga kalimat berarti "berbicara tiga bahasa".' },
    { id: 3, question: 'Hanzi yang berarti "mengatakan / mengajukan" adalah:', options: [{ label: 'A', text: '叫' }, { label: 'B', text: '答' }, { label: 'C', text: '问' }, { label: 'D', text: '说 (shuō)' }], answer: 'D', explanation: '说 berarti "mengatakan" atau "mengajukan", sesuai dengan satu pertanyaan.' },
    { id: 4, question: 'Hanzi yang digunakan untuk meminta bantuan dengan sopan (tolong/silakan):', options: [{ label: 'A', text: '求' }, { label: 'B', text: '请 (qǐng)' }, { label: 'C', text: '谢' }, { label: 'D', text: '让' }], answer: 'B', explanation: '请 berarti "tolong" atau "silakan".' },
    { id: 5, question: 'Hanzi yang berarti "mengingat / menghafal" adalah:', options: [{ label: 'A', text: '记 (jì)' }, { label: 'B', text: '忘' }, { label: 'C', text: '想' }, { label: 'D', text: '念' }], answer: 'A', explanation: '记 berarti "mengingat" atau "menghafal", sesuai dengan mengingat nama seseorang.' },
    { id: 6, question: 'Hanzi yang sesuai dengan ungkapan terima kasih adalah:', options: [{ label: 'A', text: '客气' }, { label: 'B', text: '对不起' }, { label: 'C', text: '感谢 (gǎnxiè)' }, { label: 'D', text: '没关系' }], answer: 'C', explanation: '谢 berarti "berterima kasih".' },
    { id: 7, question: 'Hanzi yang berarti "mengenali" adalah:', options: [{ label: 'A', text: '认 (rèn)' }, { label: 'B', text: '识' }, { label: 'C', text: '知' }, { label: 'D', text: '觉' }], answer: 'A', explanation: '认 berarti "mengenali", sehingga 认错人 berarti "salah mengenali orang".' },
    { id: 8, question: 'Hanzi yang berarti "membahas / berdiskusi" adalah:', options: [{ label: 'A', text: '谈 (tán)' }, { label: 'B', text: '论' }, { label: 'C', text: '讲' }, { label: 'D', text: '议' }], answer: 'A', explanation: '谈 berarti "membahas" atau "berdiskusi", sesuai dengan rencana kerja.' },
    { id: 9, question: 'Hanzi yang berarti "kebohongan" adalah:', options: [{ label: 'A', text: '真' }, { label: 'B', text: '谎 (huǎng)' }, { label: 'C', text: '骗' }, { label: 'D', text: '假' }], answer: 'B', explanation: '谎 berarti "kebohongan".' },
    { id: 10, question: 'Hanzi yang berarti "mengatur / menyesuaikan" adalah:', options: [{ label: 'A', text: '调 (tiáo)' }, { label: 'B', text: '理' }, { label: 'C', text: '整' }, { label: 'D', text: '治' }], answer: 'A', explanation: '调 berarti "mengatur" atau "menyesuaikan", sesuai dengan mengatur suhu AC.' },
  ],
  24: [
    { id: 1, question: 'Hanzi yang berarti "lapar" adalah:', options: [{ label: 'A', text: '饱' }, { label: 'B', text: '饿 (è)' }, { label: 'C', text: '渴' }, { label: 'D', text: '累' }], answer: 'B', explanation: '饿 berarti "lapar", sesuai dengan kondisi tidak makan pagi.' },
    { id: 2, question: 'Hanzi yang berarti "nasi / makanan" adalah:', options: [{ label: 'A', text: '饭 (fàn)' }, { label: 'B', text: '菜' }, { label: 'C', text: '肉' }, { label: 'D', text: '面' }], answer: 'A', explanation: '饭 berarti "nasi" atau "makanan".' },
    { id: 3, question: 'Pinyin yang benar untuk 饺 adalah:', options: [{ label: 'A', text: 'jiāo' }, { label: 'B', text: 'jiǎo' }, { label: 'C', text: 'jiáo' }, { label: 'D', text: 'jiào' }], answer: 'B', explanation: '饺 dibaca jiǎo dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang digunakan dalam kata "bakpao" adalah:', options: [{ label: 'A', text: '饼' }, { label: 'B', text: '包 (bāo)' }, { label: 'C', text: '糕' }, { label: 'D', text: '卷' }], answer: 'B', explanation: '包 dalam kata 包子 berarti "bakpao".' },
    { id: 5, question: 'Arti dari 馆 (guǎn) adalah:', options: [{ label: 'A', text: 'Restoran / tempat' }, { label: 'B', text: 'Jalan' }, { label: 'C', text: 'Rumah' }, { label: 'D', text: 'Sekolah' }], answer: 'A', explanation: '馆 berarti tempat atau bangunan tertentu (seperti perpustakaan atau restoran).' },
    { id: 6, question: 'Hanzi yang berarti "teh" adalah:', options: [{ label: 'A', text: '水' }, { label: 'B', text: '酒' }, { label: 'C', text: '茶 (chá)' }, { label: 'D', text: '奶' }], answer: 'C', explanation: '茶 berarti "teh".' },
    { id: 7, question: 'Hanzi yang berarti "gula" adalah:', options: [{ label: 'A', text: '盐 (garam)' }, { label: 'B', text: '酱 (saus)' }, { label: 'C', text: '糖 (táng)' }, { label: 'D', text: '醋 (cuka)' }], answer: 'C', explanation: '糖 berarti "gula".' },
    { id: 8, question: 'Hanzi yang berarti "harum / aroma enak" adalah:', options: [{ label: 'A', text: '香 (xiāng)' }, { label: 'B', text: '臭' }, { label: 'C', text: '酸' }, { label: 'D', text: '甜' }], answer: 'A', explanation: '香 berarti "harum" atau memiliki aroma yang enak.' },
    { id: 9, question: 'Arti dari 营 (yíng) adalah:', options: [{ label: 'A', text: 'Bekerja' }, { label: 'B', text: 'Bermain' }, { label: 'C', text: 'gizi / mengelola' }, { label: 'D', text: 'Tidur' }], answer: 'C', explanation: '营 dapat berarti "mengelola" atau terdapat dalam kata 营养 yang berarti gizi.' },
    { id: 10, question: 'Hanzi yang berarti nasi atau makanan yang sudah dimasak adalah:', options: [{ label: 'A', text: '米' }, { label: 'B', text: '谷' }, { label: 'C', text: '饭 (fàn)' }, { label: 'D', text: '粥' }], answer: 'C', explanation: '饭 berarti nasi atau makanan yang sudah dimasak.' },
  ],
  31: [
    { id: 1, question: 'Hanzi yang berarti "haus" adalah:', options: [{ label: 'A', text: '渴 (kě)' }, { label: 'B', text: '饿' }, { label: 'C', text: '冷' }, { label: 'D', text: '热' }], answer: 'A', explanation: '渴 berarti "haus", sesuai dengan kondisi merasa haus karena cuaca panas.' },
    { id: 2, question: 'Hanzi yang berarti "jernih" adalah:', options: [{ label: 'A', text: '浊' }, { label: 'B', text: '脏' }, { label: 'C', text: '清 (qīng)' }, { label: 'D', text: '净' }], answer: 'C', explanation: '清 berarti "jernih", sehingga air sungai yang jernih membuat batu di dasar terlihat.' },
    { id: 3, question: 'Hanzi yang berarti "tenggelam" adalah:', options: [{ label: 'A', text: '浮' }, { label: 'B', text: '沉 (chén)' }, { label: 'C', text: '没' }, { label: 'D', text: '落' }], answer: 'B', explanation: '沉 berarti "tenggelam", yaitu bergerak turun ke dalam air.' },
    { id: 4, question: 'Hanzi yang berarti "mencuci" adalah:', options: [{ label: 'A', text: '洗 (xǐ)' }, { label: 'B', text: '刷' }, { label: 'C', text: '擦' }, { label: 'D', text: '扫' }], answer: 'A', explanation: '洗 berarti "mencuci", sesuai dengan kegiatan mencuci pakaian.' },
    { id: 5, question: 'Hanzi yang berarti "menyiram" adalah:', options: [{ label: 'A', text: '洒' }, { label: 'B', text: '浇 (jiāo)' }, { label: 'C', text: '泼' }, { label: 'D', text: '淋' }], answer: 'B', explanation: '浇 berarti "menyiram", digunakan untuk menyiram tanaman atau bunga.' },
    { id: 6, question: 'Hanzi yang berarti "danau" adalah:', options: [{ label: 'A', text: '海' }, { label: 'B', text: '湖 (hú)' }, { label: 'C', text: '河' }, { label: 'D', text: '江' }], answer: 'B', explanation: '湖 berarti "danau", tempat ikan dapat berenang.' },
    { id: 7, question: 'Hanzi yang berarti "sup" adalah:', options: [{ label: 'A', text: '汁' }, { label: 'B', text: '汤 (tāng)' }, { label: 'C', text: '水' }, { label: 'D', text: '液' }], answer: 'B', explanation: '汤 berarti "sup", sehingga cocok dengan kalimat tentang makanan yang asin.' },
    { id: 8, question: 'Hanzi yang berarti "air mata" adalah:', options: [{ label: 'A', text: '汗 (keringat)' }, { label: 'B', text: '泪 (lèi)' }, { label: 'C', text: '血' }, { label: 'D', text: '液' }], answer: 'B', explanation: '泪 berarti "air mata", sesuatu yang mengalir dari wajah.' },
    { id: 9, question: 'Hanzi yang berarti "dangkal" adalah:', options: [{ label: 'A', text: '深' }, { label: 'B', text: '浅 (qiǎn)' }, { label: 'C', text: '低' }, { label: 'D', text: '短' }], answer: 'B', explanation: '浅 berarti "dangkal", sehingga anak kecil dapat berdiri di kolam.' },
    { id: 10, question: 'Hanzi yang berarti "meluap / bergelombang naik" adalah:', options: [{ label: 'A', text: '涨' }, { label: 'B', text: '流' }, { label: 'C', text: '涌 (yǒng)' }, { label: 'D', text: '波' }], answer: 'C', explanation: '涌 berarti "meluap" atau "bergelombang naik", sesuai dengan air laut yang naik.' },
  ],
  38: [
    { id: 1, question: 'Hanzi yang berarti "menumis" adalah:', options: [{ label: 'A', text: '炒 (chǎo)' }, { label: 'B', text: '煮' }, { label: 'C', text: '烤' }, { label: 'D', text: '蒸' }], answer: 'A', explanation: '炒 berarti "menumis".' },
    { id: 2, question: 'Hanzi yang berarti "panas" adalah:', options: [{ label: 'A', text: '冷' }, { label: 'B', text: '热 (rè)' }, { label: 'C', text: '温' }, { label: 'D', text: '凉' }], answer: 'B', explanation: '热 berarti "panas", sesuai dengan cuaca di atas 35°C.' },
    { id: 3, question: 'Hanzi yang berarti "nyala api" adalah:', options: [{ label: 'A', text: '火' }, { label: 'B', text: '焰 (yàn)' }, { label: 'C', text: '光' }, { label: 'D', text: '烟' }], answer: 'B', explanation: '焰 berarti "nyala api", menggambarkan besarnya kobaran api saat kebakaran.' },
    { id: 4, question: 'Hanzi yang berarti "memadamkan" adalah:', options: [{ label: 'A', text: '烧' }, { label: 'B', text: '点' }, { label: 'C', text: '熄 (xī)' }, { label: 'D', text: '灭' }], answer: 'C', explanation: '熄 berarti "memadamkan", digunakan untuk mematikan api atau lilin.' },
    { id: 5, question: 'Pinyin untuk 炸 (deep-fry) adalah:', options: [{ label: 'A', text: 'zhà' }, { label: 'B', text: 'zhá' }, { label: 'C', text: 'zhǎ' }, { label: 'D', text: 'zhā' }], answer: 'B', explanation: '炸 (deep-fry) dibaca zhá dengan nada kedua.' },
    { id: 6, question: 'Hanzi yang berarti "gosong" adalah:', options: [{ label: 'A', text: '糊' }, { label: 'B', text: '黑' }, { label: 'C', text: '焦 (jiāo)' }, { label: 'D', text: '黄' }], answer: 'C', explanation: '焦 berarti "gosong", sehingga roti tidak bisa dimakan.' },
    { id: 7, question: 'Arti dari 灭 (miè) adalah:', options: [{ label: 'A', text: 'Menyalakan' }, { label: 'B', text: 'Memadamkan' }, { label: 'C', text: 'Membakar' }, { label: 'D', text: 'Memasak' }], answer: 'B', explanation: '灭 berarti "memadamkan" atau "memusnahkan", terutama api.' },
    { id: 8, question: 'Hanzi yang berarti "bencana" adalah:', options: [{ label: 'A', text: '灾 (zāi)' }, { label: 'B', text: '难' }, { label: 'C', text: '祸' }, { label: 'D', text: '险' }], answer: 'A', explanation: '灾 berarti "bencana", seperti gempa bumi dan banjir.' },
    { id: 9, question: 'Arti dari 炖 (dùn) adalah:', options: [{ label: 'A', text: 'Menggoreng' }, { label: 'B', text: 'Membakar' }, { label: 'C', text: 'Merebus lama' }, { label: 'D', text: 'Mengukus' }], answer: 'C', explanation: '炖 berarti "merebus dalam waktu lama".' },
    { id: 10, question: 'Hanzi yang berarti "arang" adalah:', options: [{ label: 'A', text: '煤' }, { label: 'B', text: '炭 (tàn)' }, { label: 'C', text: '灰' }, { label: 'D', text: '木' }], answer: 'B', explanation: '炭 berarti "arang", yaitu bahan bakar yang berasal dari kayu yang dibakar.' },
  ],
  45: [
    { id: 1, question: 'Hanzi yang berarti "cabang / ranting" adalah:', options: [{ label: 'A', text: '叶' }, { label: 'B', text: '枝 (zhī)' }, { label: 'C', text: '干' }, { label: 'D', text: '根' }], answer: 'B', explanation: '枝 berarti "cabang" atau "ranting".' },
    { id: 2, question: 'Hanzi yang berarti "meja / kursi" adalah:', options: [{ label: 'A', text: '桌 (zhuō) / 椅 (yǐ)' }, { label: 'B', text: '床 / 柜' }, { label: 'C', text: '门 / 窗' }, { label: 'D', text: '灯 / 镜' }], answer: 'A', explanation: '桌 berarti "meja" dan 椅 berarti "kursi", sesuai dengan isi sebuah ruangan.' },
    { id: 3, question: 'Pinyin untuk 森 (hutan lebat) adalah:', options: [{ label: 'A', text: 'sēn' }, { label: 'B', text: 'sén' }, { label: 'C', text: 'sěn' }, { label: 'D', text: 'sèn' }], answer: 'A', explanation: '森 dibaca sēn dengan nada pertama, yang berarti "hutan lebat".' },
    { id: 4, question: 'Hanzi yang berarti "pohon / akar" adalah:', options: [{ label: 'A', text: '树 (shù) / 根 (gēn)' }, { label: 'B', text: '草 / 花' }, { label: 'C', text: '叶 / 枝' }, { label: 'D', text: '果 / 籽' }], answer: 'A', explanation: '树 berarti "pohon" dan 根 berarti "akar".' },
    { id: 5, question: 'Arti dari 桥 (qiáo) adalah:', options: [{ label: 'A', text: 'Jalan' }, { label: 'B', text: 'Sungai' }, { label: 'C', text: 'Jembatan' }, { label: 'D', text: 'Gunung' }], answer: 'C', explanation: '桥 berarti "jembatan", yaitu bangunan yang menghubungkan dua tempat.' },
    { id: 6, question: 'Hanzi yang berarti "persik / plum" adalah:', options: [{ label: 'A', text: '桃 (táo) / 梅 (méi)' }, { label: 'B', text: '苹 / 果' }, { label: 'C', text: '橘 / 柚' }, { label: 'D', text: '瓜 / 豆' }], answer: 'A', explanation: '桃 berarti "persik" dan 梅 berarti "plum".' },
    { id: 7, question: 'Hanzi yang berarti "papan" adalah:', options: [{ label: 'A', text: '木' }, { label: 'B', text: '板 (bǎn)' }, { label: 'C', text: '块' }, { label: 'D', text: '条' }], answer: 'B', explanation: '板 berarti "papan", yaitu lempengan kayu atau bahan datar lainnya.' },
    { id: 8, question: 'Hanzi yang berarti "meja" adalah:', options: [{ label: 'A', text: '几' }, { label: 'B', text: '台' }, { label: 'C', text: '桌 (zhuō)' }, { label: 'D', text: '案' }], answer: 'C', explanation: '桌 berarti "meja", tempat yang paling umum untuk meletakkan buku.' },
    { id: 9, question: 'Arti dari 楼 (lóu) adalah:', options: [{ label: 'A', text: 'Rumah' }, { label: 'B', text: 'Kamar' }, { label: 'C', text: 'Gedung / lantai' }, { label: 'D', text: 'Atap' }], answer: 'C', explanation: '楼 berarti "gedung" atau "lantai" pada sebuah bangunan.' },
    { id: 10, question: 'Hanzi yang berarti "gelas / cangkir" adalah:', options: [{ label: 'A', text: '碗' }, { label: 'B', text: '杯子 (bēi zi)' }, { label: 'C', text: '盘' }, { label: 'D', text: '瓶' }], answer: 'B', explanation: '杯子 berarti "gelas" atau "cangkir", digunakan sebagai wadah minuman.' },
  ],
  53: [
    { id: 1, question: 'Hanzi yang berarti "dia (perempuan)" adalah:', options: [{ label: 'A', text: '他' }, { label: 'B', text: '她 (tā)' }, { label: 'C', text: '它' }, { label: 'D', text: '男' }], answer: 'B', explanation: '她 berarti "dia" untuk perempuan, sehingga sesuai dengan kata "ibu".' },
    { id: 2, question: 'Hanzi yang berarti "kakak perempuan" dan "adik perempuan" adalah:', options: [{ label: 'A', text: '姐 (jiě) / 妹 (mèi)' }, { label: 'B', text: '哥 / 弟' }, { label: 'C', text: '姑 / 姨' }, { label: 'D', text: '妈 / 奶' }], answer: 'A', explanation: '姐 berarti "kakak perempuan" dan 妹 berarti "adik perempuan".' },
    { id: 3, question: 'Pinyin untuk 女 (perempuan) adalah:', options: [{ label: 'A', text: 'nū' }, { label: 'B', text: 'nǚ' }, { label: 'C', text: 'nú' }, { label: 'D', text: 'nǔ' }], answer: 'B', explanation: '女 dibaca nǚ dengan bunyi ü dan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "indah / hebat / luar biasa" adalah:', options: [{ label: 'A', text: '好' }, { label: 'B', text: '美' }, { label: 'C', text: '妙 (miào)' }, { label: 'D', text: '奇' }], answer: 'C', explanation: '妙 berarti "indah", "hebat", atau "luar biasa".' },
    { id: 5, question: 'Arti dari 妻子 (qī zi) adalah:', options: [{ label: 'A', text: 'Suami' }, { label: 'B', text: 'Istri' }, { label: 'C', text: 'Anak' }, { label: 'D', text: 'Orang tua' }], answer: 'B', explanation: '妻子 (qī zi) berarti "istri".' },
    { id: 6, question: 'Hanzi yang berarti "memaafkan / memohon maaf" adalah:', options: [{ label: 'A', text: '恕 (shù)' }, { label: 'B', text: '怨' }, { label: 'C', text: '恨' }, { label: 'D', text: '怒' }], answer: 'A', explanation: '恕 berarti "memaafkan" atau "memohon maaf".' },
    { id: 7, question: 'Hanzi yang berarti "pernikahan" adalah:', options: [{ label: 'A', text: '恋' }, { label: 'B', text: '爱' }, { label: 'C', text: '婚 (hūn)' }, { label: 'D', text: '情' }], answer: 'C', explanation: '婚 berarti "pernikahan", seperti pada kata 婚礼 (upacara pernikahan).' },
    { id: 8, question: 'Hanzi yang berarti "berdandan / rias" adalah:', options: [{ label: 'A', text: '服' }, { label: 'B', text: '妆 (zhuāng)' }, { label: 'C', text: '衣' }, { label: 'D', text: '打' }], answer: 'B', explanation: '妆 berarti "berdandan" atau "rias".' },
    { id: 9, question: 'Arti dari 婶 (shěn) adalah:', options: [{ label: 'A', text: 'Bibi dari ayah' }, { label: 'B', text: 'Bibi dari ibu' }, { label: 'C', text: 'Istri paman' }, { label: 'D', text: 'Kakak ipar perempuan' }], answer: 'C', explanation: '婶 berarti "istri paman". 姑 adalah bibi dari ayah, 姨 adalah bibi dari ibu, dan 嫂 adalah kakak ipar perempuan.' },
    { id: 10, question: 'Hanzi yang berarti "baik / bagus" adalah:', options: [{ label: 'A', text: '坏' }, { label: 'B', text: '错' }, { label: 'C', text: '好 (hǎo)' }, { label: 'D', text: '差' }], answer: 'C', explanation: '好 berarti "baik" atau "bagus".' },
  ],
  60: [
    { id: 1, question: 'Hanzi yang berarti "sayur" adalah:', options: [{ label: 'A', text: '肉' }, { label: 'B', text: '菜 (cài)' }, { label: 'C', text: '果' }, { label: 'D', text: '汤' }], answer: 'B', explanation: '菜 berarti "sayur", sesuai dengan kegiatan menumis di dapur.' },
    { id: 2, question: 'Hanzi yang berarti "teh" adalah:', options: [{ label: 'A', text: '水' }, { label: 'B', text: '酒' }, { label: 'C', text: '茶 (chá)' }, { label: 'D', text: '奶' }], answer: 'C', explanation: '茶 berarti "teh", sehingga sesuai dengan kalimat "minum segelas teh".' },
    { id: 3, question: 'Pinyin untuk 草 (rumput) adalah:', options: [{ label: 'A', text: 'cǎo' }, { label: 'B', text: 'cáo' }, { label: 'C', text: 'cāo' }, { label: 'D', text: 'cào' }], answer: 'A', explanation: '草 dibaca cǎo dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "bunga" adalah:', options: [{ label: 'A', text: '树' }, { label: 'B', text: '叶' }, { label: 'C', text: '花 (huā)' }, { label: 'D', text: '草' }], answer: 'C', explanation: '花 berarti "bunga", sehingga sesuai dengan sesuatu yang harum.' },
    { id: 5, question: 'Arti dari 药 (yào) adalah:', options: [{ label: 'A', text: 'Racun' }, { label: 'B', text: 'Obat' }, { label: 'C', text: 'Pil' }, { label: 'D', text: 'Suntik' }], answer: 'B', explanation: '药 (yào) berarti "obat".' },
    { id: 6, question: 'Hanzi yang berarti "stroberi" adalah:', options: [{ label: 'A', text: '苹果' }, { label: 'B', text: '草莓 (cǎoméi)' }, { label: 'C', text: '香蕉' }, { label: 'D', text: '西瓜' }], answer: 'B', explanation: '草莓 berarti "stroberi".' },
    { id: 7, question: 'Hanzi yang berarti "bawang putih" adalah:', options: [{ label: 'A', text: '葱' }, { label: 'B', text: '蒜 (suàn)' }, { label: 'C', text: '姜' }, { label: 'D', text: '椒' }], answer: 'B', explanation: '蒜 berarti "bawang putih", yang sering digunakan sebagai bumbu masakan.' },
    { id: 8, question: 'Hanzi yang berarti "pahit" adalah:', options: [{ label: 'A', text: '甜' }, { label: 'B', text: '酸' }, { label: 'C', text: '苦 (kǔ)' }, { label: 'D', text: '辣' }], answer: 'C', explanation: '苦 berarti "pahit", rasa yang sering dikaitkan dengan obat.' },
    { id: 9, question: 'Arti dari 荷 (hé) adalah:', options: [{ label: 'A', text: 'Krisan' }, { label: 'B', text: 'Bunga teratai' }, { label: 'C', text: 'Plum' }, { label: 'D', text: 'Mawar' }], answer: 'B', explanation: '荷 berarti "teratai" (lotus). 菊 berarti krisan dan 梅 berarti plum.' },
    { id: 10, question: 'Hanzi 花 (huā) berarti ... (Berdasarkan kunci jawaban buku):', options: [{ label: 'A', text: 'Rumput / Bunga' }, { label: 'B', text: 'Pohon' }, { label: 'C', text: 'Akar' }, { label: 'D', text: 'Daun' }], answer: 'A', explanation: '花 pada umumnya berarti bunga (namun dalam konteks soal/kunci jawaban ini juga merujuk ke tanaman sejenisnya).' },
  ],
  67: [
    { id: 1, question: 'Hanzi yang berarti "menelepon" pada kata 打电话 adalah:', options: [{ label: 'A', text: '打 (dǎ)' }, { label: 'B', text: '拍' }, { label: 'C', text: '接' }, { label: 'D', text: '挂' }], answer: 'A', explanation: '打 berarti "menelepon" pada kata 打电话, yaitu melakukan panggilan telepon.' },
    { id: 2, question: 'Hanzi yang berarti "menopang / membantu" (orang terjatuh) adalah:', options: [{ label: 'A', text: '拉' }, { label: 'B', text: '推' }, { label: 'C', text: '扶 (fú)' }, { label: 'D', text: '抱' }], answer: 'C', explanation: '扶 berarti "menopang" atau "membantu", sesuai dengan orang yang hampir terjatuh.' },
    { id: 3, question: 'Pinyin untuk 打 adalah:', options: [{ label: 'A', text: 'dā' }, { label: 'B', text: 'dá' }, { label: 'C', text: 'dǎ' }, { label: 'D', text: 'dà' }], answer: 'C', explanation: '打 dibaca dǎ dengan nada ketiga.' },
    { id: 4, question: 'Hanzi yang berarti "mencari" adalah:', options: [{ label: 'A', text: '找 (zhǎo)' }, { label: 'B', text: '看' }, { label: 'C', text: '见' }, { label: 'D', text: '寻' }], answer: 'A', explanation: '找 berarti "mencari", sesuai dengan mencari buku di dalam tas.' },
    { id: 5, question: 'Arti dari 握 (wò) adalah:', options: [{ label: 'A', text: 'Memukul' }, { label: 'B', text: 'Berjabat tangan / menggenggam' }, { label: 'C', text: 'Melempar' }, { label: 'D', text: 'Menangkap' }], answer: 'B', explanation: '握 (wò) berarti "menggenggam" atau "berjabat tangan".' },
    { id: 6, question: 'Hanzi yang berarti "mengaduk / mencampur" adalah:', options: [{ label: 'A', text: '炒' }, { label: 'B', text: '炸' }, { label: 'C', text: '拌 (bàn)' }, { label: 'D', text: '煮' }], answer: 'C', explanation: '拌 berarti "mengaduk" atau "mencampur", dilakukan saat menyiapkan masakan.' },
    { id: 7, question: 'Hanzi yang berarti "menunjuk" adalah:', options: [{ label: 'A', text: '点' }, { label: 'B', text: '指 (zhǐ)' }, { label: 'C', text: '画' }, { label: 'D', text: '按' }], answer: 'B', explanation: '指 berarti "menunjuk", yaitu mengarahkan jari ke suatu objek.' },
    { id: 8, question: 'Hanzi yang berarti "mengangkat" adalah:', options: [{ label: 'A', text: '抬 (tái)' }, { label: 'B', text: '提' }, { label: 'C', text: '挑' }, { label: 'D', text: '背' }], answer: 'A', explanation: '抬 berarti "mengangkat", sehingga 抬手 berarti "mengangkat tangan".' },
    { id: 9, question: 'Arti dari 换 (huàn) adalah:', options: [{ label: 'A', text: 'Membeli' }, { label: 'B', text: 'Menjual' }, { label: 'C', text: 'Menukar / mengganti' }, { label: 'D', text: 'Meminjam' }], answer: 'C', explanation: '换 berarti "menukar" atau "mengganti" sesuatu dengan yang lain.' },
    { id: 10, question: 'Hanzi yang berarti "mencengkeram / menangkap" adalah:', options: [{ label: 'A', text: '抓 (zhuā)' }, { label: 'B', text: '放' }, { label: 'C', text: '扔' }, { label: 'D', text: '丢' }], answer: 'A', explanation: '抓 berarti "mencengkeram", "menangkap", atau "meraih" dengan tangan.' },
  ],
  75: [
    { id: 1, question: 'Hanzi yang berarti "menendang" adalah:', options: [{ label: 'A', text: '踢 (tī)' }, { label: 'B', text: '跑' }, { label: 'C', text: '跳' }, { label: 'D', text: '步' }], answer: 'A', explanation: '踢 berarti "menendang", seperti menendang bola ke gawang.' },
    { id: 2, question: 'Hanzi yang berarti "berlutut" dan "berdiri" adalah:', options: [{ label: 'A', text: '坐 / 躺' }, { label: 'B', text: '蹲 / 爬' }, { label: 'C', text: '跪 (guì) / 站 (zhàn)' }, { label: 'D', text: '走 / 跑' }], answer: 'C', explanation: '跪 berarti "berlutut" dan 站 berarti "berdiri".' },
    { id: 3, question: 'Hanzi yang berarti "melompat" adalah:', options: [{ label: 'A', text: '走 / 跑' }, { label: 'B', text: '跳 / 跃 (tiào / yuè)' }, { label: 'C', text: '爬 / 滚' }, { label: 'D', text: '飞 / 游' }], answer: 'B', explanation: '跳 dan 跃 sama-sama berarti "melompat".' },
    { id: 4, question: 'Hanzi yang berarti "mengikuti" dan "berlari" adalah:', options: [{ label: 'A', text: '追 / 逃' }, { label: 'B', text: '跟 (gēn) / 跑 (pǎo)' }, { label: 'C', text: '随 / 步' }, { label: 'D', text: '迎 / 送' }], answer: 'B', explanation: '跟 berarti "mengikuti", sedangkan 跑 berarti "berlari".' },
    { id: 5, question: 'Arti dari 迹 (jì) adalah:', options: [{ label: 'A', text: 'Jejak kaki / jejak' }, { label: 'B', text: 'Langkah' }, { label: 'C', text: 'Jalan' }, { label: 'D', text: 'Arah' }], answer: 'A', explanation: '迹 berarti "jejak", seperti pada kata 足迹 (zújì) yang berarti jejak kaki.' },
    { id: 6, question: 'Hanzi yang berarti "menginjak" adalah:', options: [{ label: 'A', text: '踩 (cǎi)' }, { label: 'B', text: '踏' }, { label: 'C', text: '跨' }, { label: 'D', text: '迈' }], answer: 'A', explanation: '踩 berarti "menginjak" dan merupakan kata yang alami untuk percakapan sehari-hari.' },
    { id: 7, question: 'Hanzi yang berarti "sepak bola" adalah:', options: [{ label: 'A', text: '篮球' }, { label: 'B', text: '排球' }, { label: 'C', text: '足球 (zúqiú)' }, { label: 'D', text: '网球' }], answer: 'C', explanation: '足球 berarti "sepak bola", sehingga 足球比赛 berarti pertandingan sepak bola.' },
    { id: 8, question: 'Hanzi yang berarti "berlari / meloncat" adalah:', options: [{ label: 'A', text: '跑 / 跃 (pǎo / yuè)' }, { label: 'B', text: '走 / 跳' }, { label: 'C', text: '飞 / 爬' }, { label: 'D', text: '游 / 滚' }], answer: 'A', explanation: '跑 berarti "berlari" dan 跃 berarti "meloncat" atau "melompat".' },
    { id: 9, question: 'Arti dari 踪 (zōng) adalah:', options: [{ label: 'A', text: 'Jarak' }, { label: 'B', text: 'Jejak langkah' }, { label: 'C', text: 'Mengikuti' }, { label: 'D', text: 'Jatuh' }], answer: 'B', explanation: '踪 berarti "jejak" atau "bekas langkah". 距 berarti jarak, 跟 berarti mengikuti.' },
    { id: 10, question: 'Hanzi yang berarti "jongkok" dan "berlutut" adalah:', options: [{ label: 'A', text: '蹲 (dūn) / 跪 (guì)' }, { label: 'B', text: '坐 / 站' }, { label: 'C', text: '躺 / 趴' }, { label: 'D', text: '靠 / 倚' }], answer: 'A', explanation: '蹲 berarti "jongkok" dan 跪 berarti "berlutut", sesuai gerakan mencari kunci di tanah.' },
  ],
  83: [
    { id: 1, question: 'Hanzi yang berarti "tembok / dinding" adalah:', options: [{ label: 'A', text: '墙 (qiáng)' }, { label: 'B', text: '门' }, { label: 'C', text: '窗' }, { label: 'D', text: '顶' }], answer: 'A', explanation: '墙 berarti "tembok" atau "dinding", sesuai dengan tembok tinggi di kota.' },
    { id: 2, question: 'Hanzi yang berarti "membuka / mengolah lahan" adalah:', options: [{ label: 'A', text: '种植' }, { label: 'B', text: '开垦 (kāikěn)' }, { label: 'C', text: '收割' }, { label: 'D', text: '浇水' }], answer: 'B', explanation: '垦 berarti "membuka atau mengolah lahan", sesuai kegiatan petani menyiapkan tanah baru.' },
    { id: 3, question: 'Hanzi yang berarti "tanah subur" adalah:', options: [{ label: 'A', text: '泥' }, { label: 'B', text: '沙' }, { label: 'C', text: '壤 (rǎng)' }, { label: 'D', text: '石' }], answer: 'C', explanation: '壤 berarti "tanah" atau "tanah yang subur", cocok untuk tanah pertanian.' },
    { id: 4, question: 'Hanzi yang berarti "makam / kuburan" adalah:', options: [{ label: 'A', text: '坟 (fén)' }, { label: 'B', text: '墓' }, { label: 'C', text: '碑' }, { label: 'D', text: '陵' }], answer: 'A', explanation: '坟 berarti "makam" atau "kuburan", sesuai dengan makam kakek.' },
    { id: 5, question: 'Hanzi yang berarti "datar / rata" adalah:', options: [{ label: 'A', text: '崎岖' }, { label: 'B', text: '平坦 (píngtǎn)' }, { label: 'C', text: '陡峭' }, { label: 'D', text: '弯曲' }], answer: 'B', explanation: '平坦 berarti "datar" atau "rata", sehingga jalan aman dilalui kendaraan.' },
    { id: 6, question: 'Hanzi yang berarti "kuat / kokoh" adalah:', options: [{ label: 'A', text: '坚 (jiān)' }, { label: 'B', text: '软' }, { label: 'C', text: '弱' }, { label: 'D', text: '脆' }], answer: 'A', explanation: '坚 berarti "kuat" atau "kokoh", seperti pada 坚固.' },
    { id: 7, question: 'Hanzi yang berarti "bendungan" adalah:', options: [{ label: 'A', text: '坝 (bà)' }, { label: 'B', text: '桥' }, { label: 'C', text: '堤' }, { label: 'D', text: '堰' }], answer: 'A', explanation: '坝 berarti "bendungan", yaitu bangunan yang menahan aliran air.' },
    { id: 8, question: 'Hanzi yang berarti "alamat / lokasi" adalah:', options: [{ label: 'A', text: '址 (zhǐ)' }, { label: 'B', text: '路' }, { label: 'C', text: '街' }, { label: 'D', text: '巷' }], answer: 'A', explanation: '址 berarti "alamat atau lokasi", seperti pada 地址.' },
    { id: 9, question: 'Hanzi yang berarti "rusak" adalah:', options: [{ label: 'A', text: '好' }, { label: 'B', text: '坏 (huài)' }, { label: 'C', text: '旧' }, { label: 'D', text: '破' }], answer: 'B', explanation: '坏 berarti "rusak", sehingga 椅子坏了 berarti "kursinya rusak".' },
    { id: 10, question: 'Hanzi yang berarti "jurang / lembah yang dalam" adalah:', options: [{ label: 'A', text: '沟壑 (gōuhè)' }, { label: 'B', text: '山峰' }, { label: 'C', text: '平原' }, { label: 'D', text: '丘陵' }], answer: 'A', explanation: '壑 (dalam 沟壑) berarti "jurang" atau "lembah yang dalam".' },
  ]
};


interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onPass: () => void;
  pageId: number;
}

export default function QuizModal({ isOpen, onClose, questions, onPass, pageId }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const isCorrect = selectedAnswer === currentQ.answer;
  const isPassed = true; // Tidak ada batas minimal untuk lulus


  const handleSelect = (label: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(label);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsAnswerRevealed(true);
    if (selectedAnswer === currentQ.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setIsFinished(false);
  };

  const handleFinish = () => {
    if (isPassed) {
      onPass();
      handleReset(); // reset for next time they open it manually
    } else {
      handleReset();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-sand w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-primary">📝 Kuis Bab (Hal. {pageId})</h2>
          <Button variant="ghost" size="icon" onClick={() => { if(!isFinished || isPassed) onClose(); else handleReset(); }} className="rounded-full hover:bg-red-50 hover:text-red-500">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex-1 bg-cream/30">
          {isFinished ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Kuis Selesai!
              </h3>
              <p className="text-muted-foreground mb-8">
                Skor Anda: <span className="font-bold text-xl text-primary">{score} / {questions.length}</span>
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={handleFinish} className="w-64 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-xl">
                  Lanjutkan Membaca <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
                  <span>Soal {currentIdx + 1} dari {questions.length}</span>
                  <span>Skor: {score}</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-700">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-lg md:text-xl font-medium text-foreground mb-8 whitespace-pre-wrap leading-relaxed">
                {currentQ.question}
              </p>

              <div className="space-y-3 mb-8">
                {currentQ.options.map(opt => {
                  let optStyle = "border-border bg-white hover:border-primary/50 text-foreground";
                  if (isAnswerRevealed) {
                    if (opt.label === currentQ.answer) {
                      optStyle = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/20";
                    } else if (opt.label === selectedAnswer) {
                      optStyle = "border-red-500 bg-red-50 text-red-800";
                    } else {
                      optStyle = "border-border bg-white/50 opacity-60";
                    }
                  } else if (selectedAnswer === opt.label) {
                    optStyle = "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary";
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      disabled={isAnswerRevealed}
                      className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${optStyle}`}
                    >
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shrink-0 ${selectedAnswer === opt.label ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {opt.label}
                      </span>
                      <span className="font-medium">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswerRevealed && (
                <div className={`p-4 rounded-2xl mb-8 flex items-start gap-3 ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-green-600" /> : <XCircle className="w-6 h-6 shrink-0 mt-0.5 text-red-600" />}
                  <div>
                    <p className="font-bold mb-1">{isCorrect ? 'Jawaban Anda Benar!' : 'Jawaban Kurang Tepat'}</p>
                    <p className="text-sm opacity-90 leading-relaxed">{currentQ.explanation}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="p-6 border-t bg-white flex justify-end">
            {!isAnswerRevealed ? (
              <Button 
                onClick={handleCheck} 
                disabled={!selectedAnswer}
                className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base rounded-xl"
              >
                Cek Jawaban
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="w-full md:w-auto px-8 bg-foreground hover:bg-foreground/90 text-background h-12 text-base rounded-xl"
              >
                {currentIdx + 1 < questions.length ? 'Lanjut Soal Berikutnya' : 'Lihat Hasil Akhir'}
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
