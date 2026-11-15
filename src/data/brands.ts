export interface Brand {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryType: 'pvc' | 'gypsum' | 'baja-ringan' | 'panel' | 'aksesori';
  image?: string;
  initials?: string;
  description: string;
  catalogUrl: string;
  pdfCatalog?: string;
  whatsappMessage: string;
  isBestSeller?: boolean;
}

export const brands: Brand[] = [
  {
    id: 'lamiwood',
    slug: 'lamiwood',
    name: 'LAMIWOOD',
    category: 'Plafon UPVC Premium',
    categoryType: 'pvc',
    image: '/images/catalog/3. Catalog Lamiwood/Cover Lamiwood.webp',
    isBestSeller: true,
    description: 'Brand unggulan plafon UPVC premium Best Seller dengan 50+ varian motif serat kayu timbul, marmer mewah, sambungan interlock rapat, dan ketahanan air 100% anti rayap.',
    catalogUrl: '/produk/plafon-pvc-lamiwood/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin konsultasi dan tanya katalog harga plafon UPVC Lamiwood (Best Seller).'
  },
  {
    id: 'alfafon',
    slug: 'alfafon',
    name: 'ALFAFON',
    category: 'Plafon PVC & Lis Dekoratif',
    categoryType: 'pvc',
    image: '/images/brand/brand-alfafon.webp',
    description: 'Brand pelopor plafon PVC dengan variasi motif marmer dan serat kayu seri AF, papan laminate tebal, serta koleksi lis profil PVC terintegrasi.',
    catalogUrl: '/produk/plafon-pvc-premium/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin konsultasi spesifikasi dan katalog motif plafon PVC Alfafon.'
  },
  {
    id: 'sakura',
    slug: 'sakura',
    name: 'SAKURA',
    category: 'Plafon PVC Modern',
    categoryType: 'pvc',
    image: '/images/catalog/10. Sakura PVC Plafon Catalog/1. Sakura PVC Plafon Catalog.webp',
    description: 'Plafon PVC modern dengan motif garis minimalis, strip perak elegan, dan permukaan mudah dibersihkan untuk hunian kontemporer.',
    catalogUrl: '/produk/plafon-pvc-sakura/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin info katalog motif plafon PVC Sakura dan ketersediaan stok.'
  },
  {
    id: 'golden',
    slug: 'golden',
    name: 'GOLDEN',
    category: 'Plafon PVC Elegan & Ekonomis',
    categoryType: 'pvc',
    image: '/images/brand/brand-golden.webp',
    description: 'Plafon PVC bermutu tinggi dengan sentuhan warna emas mewah, motif serat kayu natural, dan harga ekonomis yang sangat diminati di Solo Raya.',
    catalogUrl: '/produk/plafon-pvc-golden/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin menanyakan katalog motif plafon PVC Golden dan penawaran pemasangannya.'
  },
  {
    id: 'indoking',
    slug: 'indoking',
    name: 'INDOKING',
    category: 'Plafon PVC Kuat & Tahan Lama',
    categoryType: 'pvc',
    image: '/images/brand/brand-indoking.webp',
    description: 'Material plafon PVC kokoh dengan formula anti pudar, tahan benturan, serta anti lembap yang ideal untuk hunian tinggal, masjid, dan gedung fasilitas umum.',
    catalogUrl: '/produk/plafon-pvc-indoking/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin konsultasi plafon PVC Indoking untuk proyek bangunan saya. Mohon info katalog dan harganya.'
  },
  {
    id: 'batik',
    slug: 'batik',
    name: 'BATIK',
    category: 'Plafon PVC Motif Batik Solo',
    categoryType: 'pvc',
    image: '/images/brand/brand-batik.webp',
    description: 'Plafon PVC dan elemen ornamen khas bernuansa budaya Solo (Parang, Kawung, Mega Mendung) untuk interior berkarakter etnik modern.',
    catalogUrl: '/produk/plafon-pvc-batik/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya tertarik dengan plafon PVC motif batik Solo. Mohon info katalog, pilihan motif, dan penawaran harganya.'
  },
  {
    id: 'jayaboard',
    slug: 'jayaboard',
    name: 'JAYA BOARD',
    category: 'Gypsum Board SNI',
    categoryType: 'gypsum',
    image: '/images/brand/brand-jayaboard.webp',
    description: 'Market leader papan gypsum Indonesia dengan teknologi Sheetrock SNI, kerataan permukaan sempurna, tahan lendut, dan mudah dicat kompon.',
    catalogUrl: '/produk/plafon-gypsum-jayaboard/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin tanya harga dan spesifikasi papan gypsum Jayaboard SNI.'
  },
  {
    id: 'kencana',
    slug: 'kencana',
    name: 'KENCANA',
    category: 'Baja Ringan SNI & Hollow',
    categoryType: 'baja-ringan',
    image: '/images/brand/brand-kencana.webp',
    description: 'Produsen baja ringan SNI terpercaya untuk rangka atap profil C75, reng, serta rangka hollow galvalum berdaya tahan tinggi anti-karat.',
    catalogUrl: '/produk/baja-ringan-kencana/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin konsultasi rangka baja ringan & hollow Kencana SNI untuk plafon/atap.'
  },
  {
    id: 'motto',
    slug: 'motto',
    name: 'MOTTO',
    category: 'Vinyl, Wallboard & PVC Board',
    categoryType: 'panel',
    image: '/images/catalog/5. Motto Wallboard Catalog/1. Katalog Wallboard 40ccx295cm.webp',
    description: 'Rangkaian dekorasi interior modern meliputi lantai vinyl seri LM, fluted wallboard 40cm x 295cm, dan lembaran PVC board motif marmer 122cm x 290cm.',
    catalogUrl: '/produk/motto-wall-panel/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin info katalog wallboard, vinyl flooring, dan PVC board merek Motto.'
  },
  {
    id: 'janur',
    slug: 'janur',
    name: 'JANUR',
    category: 'Lis Pigura & Wall Panel WPC',
    categoryType: 'panel',
    image: '/images/catalog/1. Katalog JANUR Lis Pigura/1. Katalog JANUR Lis Pigura PS Premium.webp',
    description: 'Spesialis lis pigura polystirene (PS) premium, moulding dinding elegan, dan wall panel WPC seri J dan WP bertekstur kayu 3 dimensi.',
    catalogUrl: '/produk/janur-wall-panel/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin konsultasi lis pigura PS Premium dan WPC wall panel merek Janur.'
  },
  {
    id: 'honor-decoration',
    slug: 'honor-decoration',
    name: 'HONOR DECORATION',
    category: 'Hollow Kisi-kisi & Louver',
    categoryType: 'aksesori',
    image: '/images/catalog/7. Katalog Hollow Kisi-kisi PT. Honor Decoration/1. Hollow Kisi-kisi.webp',
    description: 'Penyedia hollow kisi-kisi dan kisi interior modern untuk aksen plafon acoustic, louver, dan partisi semi-transparan artistik.',
    catalogUrl: '/produk/hollow-kisi-kisi-honor/',
    whatsappMessage: 'Halo Mas Otello Griya Alfath, saya ingin info katalog hollow kisi-kisi dan louver interior dari Honor Decoration.'
  }
];
