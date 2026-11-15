export type ServiceCategorySlug =
  | 'pvc'
  | 'gypsum'
  | 'baja-ringan'
  | 'wall-moulding';

export type BuildingTypeSlug =
  | 'rumah'
  | 'komersial'
  | 'tempat-ibadah'
  | 'lainnya';

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  caption?: string;
  platform?: 'youtube' | 'instagram' | 'facebook' | 'tiktok';
  embedUrl?: string;
}

export interface ProjectSection {
  heading: string;
  content: string;
  media?: ProjectMedia[];
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectRelatedProduct {
  name: string;
  url: string;
  brand?: string;
  image?: string;
}

export interface ProjectRelatedArticle {
  title: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categorySlug?: string; // Backward compatibility alias

  serviceCategory: ServiceCategorySlug;
  serviceCategoryLabel: string;
  buildingType: BuildingTypeSlug;
  buildingTypeLabel: string;

  image: string;
  description: string;
  location?: string;
  completionYear?: string;
  client?: string;

  // Editorial content for detail page
  introduction: string;
  specs: ProjectSpec[];
  sections: ProjectSection[];
  gallery: ProjectMedia[];
  videos?: ProjectMedia[];

  // Relations
  relatedProducts: ProjectRelatedProduct[];
  relatedArticles: ProjectRelatedArticle[];
  relatedServiceUrl?: string;

  // Verification & source tracking
  sourceUrl?: string;
  isExample?: boolean;
}

export const serviceCategoryFilters = [
  { slug: 'all', label: 'Semua Layanan' },
  { slug: 'pvc', label: 'Plafon PVC' },
  { slug: 'gypsum', label: 'Plafon Gypsum' },
  { slug: 'baja-ringan', label: 'Baja Ringan' },
  { slug: 'wall-moulding', label: 'Wall Moulding' }
];

export const buildingTypeFilters = [
  { slug: 'all', label: 'Semua Bangunan' },
  { slug: 'rumah', label: 'Rumah Tinggal' },
  { slug: 'komersial', label: 'Komersial & Usaha' },
  { slug: 'tempat-ibadah', label: 'Tempat Ibadah' },
  { slug: 'lainnya', label: 'Lainnya' }
];

export const projects: Project[] = [
  {
    id: 'showroom-iwan-motor',
    title: 'Showroom Iwan Motor Autodealer',
    category: 'Proyek Komersial',
    categorySlug: 'komersial',
    serviceCategory: 'pvc',
    serviceCategoryLabel: 'Plafon PVC',
    buildingType: 'komersial',
    buildingTypeLabel: 'Komersial & Showroom',
    image: '/images/proyek/proyek-showroom-motor.webp',
    description: 'Pemasangan plafon PVC doff laminate series area showroom motor komersial dengan kombinasi motif modern dan pencahayaan terang teratur.',
    location: 'Solo Raya',
    client: 'Iwan Motor Autodealer',
    completionYear: '2025',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/reel/DKozMjtTamN/',
    introduction: 'Area komersial showroom otomotif Iwan Motor Autodealer di Solo Raya membutuhkan pembaruan langit-langit interior yang mampu memberikan impresi mewah, bersih, dan terang merata tanpa memantulkan kilau silau (anti-glare) pada bodi kendaraan yang dipajang. Solusi plafon PVC doff laminate series diaplikasikan untuk menghasilkan suasana showroom yang berkelas dan tahan air.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Plafon PVC & Panel Dinding' },
      { label: 'Tipe Bangunan', value: 'Showroom Komersial Otomotif' },
      { label: 'Material Utama', value: 'Plafon PVC Doff Laminate Series (Anti Air & Anti Rayap)' },
      { label: 'Konstruksi Rangka', value: 'Hollow Galvalum 2x4 & 4x4 SNI' },
      { label: 'Sistem Sambungan', value: 'Interlocking Tongue & Groove Presisi' },
      { label: 'Konsep Pencahayaan', value: 'Downlight LED Teratur & Indirect Light' },
      { label: 'Lokasi Proyek', value: 'Solo Raya' },
      { label: 'Status Pengerjaan', value: 'Selesai & Bergaransi Resmi Griya Alfath' }
    ],
    sections: [
      {
        heading: 'Kebutuhan Ruang & Tantangan Pengerjaan',
        content: 'Sebagai ruang display unit kendaraan, showroom membutuhkan pencahayaan yang optimal agar lekuk dan warna bodi motor tampil akurat. Plafon konvensional sebelumnya rentan terkena bercak rembesan air dan debu. Griya Alfath merekomendasikan panel PVC finishing doff agar pencahayaan lampu tersebar lembut tanpa pantulan silau berlebih.'
      },
      {
        heading: 'Pemasangan Rangka Hollow Presisi',
        content: 'Struktur rangka menggunakan hollow galvalum anti karat dengan modul gantungan berjarak 60 cm. Pemasangan dilakukan dengan pengukuran laser level teliti untuk memastikan seluruh bentangan plafon datar sempurna, sanggup menopang instalasi lampu downlight secara presisi.'
      },
      {
        heading: 'Hasil Akhir & Keunggulan Ruangan',
        content: 'Hasil pemasangan menghasilkan langit-langit showroom yang rapi, modern, dan sangat mudah dirawat. Permukaan plafon PVC doff tahan terhadap kelembapan udara tropis dan dapat dibersihkan dengan mudah tanpa risiko luntur atau mengelupas.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/proyek/proyek-showroom-motor.webp',
        alt: 'Plafon PVC Showroom Iwan Motor',
        caption: 'Tampilan utama plafon PVC doff laminate pada area display showroom Iwan Motor'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-3.webp',
        alt: 'Detail pencahayaan plafon showroom',
        caption: 'Pencahayaan teratur yang menonjolkan estetika interior komersial'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-4.webp',
        alt: 'Finishing sudut lis plafon',
        caption: 'Penyambungan sudut lis profil PVC yang rapat dan presisi'
      }
    ],
    relatedProducts: [
      { name: 'Plafon UPVC Lamiwood Premium', url: '/katalog/', brand: 'LAMIWOOD', image: '/images/produk/produk-plafon-pvc-lamiwood.webp' },
      { name: 'Wall Panel & WPC Board', url: '/katalog/', brand: 'JANUR / MOTTO', image: '/images/produk/produk-wallboard.webp' },
      { name: 'Hollow Galvalum 2x4 & 4x4', url: '/katalog/', brand: 'HONOR / KENCANA', image: '/images/produk/produk-hollow.webp' }
    ],
    relatedArticles: [
      { title: 'Tips Memilih Plafon PVC Berkualitas untuk Bangunan Komersial', url: '/blog/tips-memilih-plafon-pvc-berkualitas/' },
      { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' }
    ]
  },
  {
    id: 'gedung-ibadah-gereja',
    title: 'Plafon PVC Gedung Gereja GBI Delanggu',
    category: 'Proyek Plafon PVC',
    categorySlug: 'pvc',
    serviceCategory: 'pvc',
    serviceCategoryLabel: 'Plafon PVC',
    buildingType: 'tempat-ibadah',
    buildingTypeLabel: 'Tempat Ibadah',
    image: '/images/proyek/proyek-gereja.webp',
    description: 'Pengerjaan bentang lebar plafon PVC dengan rangka kokoh untuk kenyamanan dan akustik ruangan yang sejuk pada gedung ibadah di Delanggu, Klaten.',
    location: 'Delanggu, Klaten',
    client: 'Gereja GBI Delanggu',
    completionYear: '2022',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/reel/CmJB5hiJj-1/',
    introduction: 'Pemasangan plafon PVC bentang lebar pada aula utama Gereja GBI Delanggu, Klaten. Mengingat gedung ibadah menampung jemaat dalam jumlah besar, diperlukan material plafon yang berbobot ringan, tidak menyerap panas seng atap, serta tahan air bila terjadi tempias hujan dari atap tinggi.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Plafon PVC Bentang Lebar' },
      { label: 'Tipe Bangunan', value: 'Tempat Ibadah (Gereja)' },
      { label: 'Material Utama', value: 'Papan Plafon PVC Premium Tebal 8mm' },
      { label: 'Konstruksi Rangka', value: 'Rangka Hollow Galvalum Tebal Modul Rapat' },
      { label: 'Ketinggian Langit-Langit', value: 'Lebih dari 4,5 Meter' },
      { label: 'Karakteristik', value: 'Tahan Api (Flame Retardant) & Tidak Menyerap Air' },
      { label: 'Lokasi Proyek', value: 'Delanggu, Klaten' },
      { label: 'Status Pengerjaan', value: 'Selesai & Bergaransi Resmi' }
    ],
    sections: [
      {
        heading: 'Tantangan Struktur Bentang Lebar',
        content: 'Aula ibadah memiliki bentangan yang sangat luas tanpa pilar penyangga di tengah area kursi jemaat. Kondisi tersebut menuntut perakitan rangka hollow galvalum bertulang dengan gantungan kaku yang diikatkan langsung ke struktur kuda-kuda baja utama atap agar tidak mengalami penurunan elevasi (sagging).'
      },
      {
        heading: 'Bobot Ringan & Kenyamanan Termal',
        content: 'Panel plafon PVC memiliki keunggulan bobot yang sangat ringan dibanding plafon gipsum atau semen, sehingga tidak membebani struktur atap. Rongga udara di dalam papan PVC berfungsi sebagai penghambat rambatan panas atap seng, menjadikan suhu aula tetap sejuk selama ibadah berlangsung.'
      },
      {
        heading: 'Keamanan Jangka Panjang bagi Jemaat',
        content: 'Material PVC yang tidak menyerap air memberikan rasa aman penuh bagi pengurus dan jemaat gereja. Bila terjadi rembesan air dari atap, plafon tidak akan lapuk atau runtuh mendadak, menjamin keselamatan serta keindahan interior gereja selama bertahun-tahun.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/proyek/proyek-gereja.webp',
        alt: 'Plafon PVC Gereja GBI Delanggu',
        caption: 'Pemandangan aula utama Gereja GBI Delanggu dengan plafon PVC bentang lebar'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-1.webp',
        alt: 'Aula ibadah dengan plafon rapi',
        caption: 'Kerataan garis plafon PVC memberikan kesan megah dan lapang'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-2.webp',
        alt: 'Detail sambungan plafon',
        caption: 'Sambungan interlocking rapi yang bebas dari retakan'
      }
    ],
    relatedProducts: [
      { name: 'Plafon PVC Alfafon Premium', url: '/katalog/', brand: 'ALFAFON', image: '/images/produk/produk-plafon-pvc-alfafon.webp' },
      { name: 'Hollow Galvalum 2x4 & 4x4', url: '/katalog/', brand: 'HONOR / KENCANA', image: '/images/produk/produk-hollow.webp' }
    ],
    relatedArticles: [
      { title: 'Perbedaan Plafon PVC dan Gypsum: Kelebihan dan Rekomendasi', url: '/blog/perbedaan-plafon-pvc-dan-gypsum/' },
      { title: 'Tips Memilih Plafon PVC Berkualitas untuk Bangunan Luas', url: '/blog/tips-memilih-plafon-pvc-berkualitas/' }
    ]
  },
  {
    id: 'rumah-tinggal-tawangsari',
    title: 'Kantor Pelayanan Desa Lorog Tawangsari',
    category: 'Proyek Komersial',
    categorySlug: 'komersial',
    serviceCategory: 'pvc',
    serviceCategoryLabel: 'Plafon PVC',
    buildingType: 'komersial',
    buildingTypeLabel: 'Kantor & Fasilitas Publik',
    image: '/images/proyek/proyek-rumah-tawangsari.webp',
    description: 'Plafon PVC motif serat kayu hangat dan drop ceiling minimalis elegan pada area pelayanan front office Desa Lorog, Tawangsari, Sukoharjo.',
    location: 'Desa Lorog, Tawangsari, Sukoharjo',
    client: 'Kantor Kelurahan Desa Lorog',
    completionYear: '2025',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/reel/DRCVUrkkwJz/',
    introduction: 'Proyek renovasi interior front office dan ruang pelayanan publik kantor kelurahan desa Lorog, Kecamatan Tawangsari, Kabupaten Sukoharjo. Desain memadukan drop ceiling plafon PVC doff laminate motif serat kayu natural dengan aksen lis profil untuk menciptakan suasana kantor pelayanan yang hangat, berwibawa, dan nyaman bagi warga.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Plafon PVC & Interior Front Office' },
      { label: 'Tipe Bangunan', value: 'Kantor Pelayanan Publik / Balai Desa' },
      { label: 'Material Utama', value: 'Plafon PVC Doff Laminate Motif Serat Kayu & Putih' },
      { label: 'Desain Plafon', value: 'Drop Ceiling Trap dengan Aksentuasi Kayu' },
      { label: 'Konstruksi Rangka', value: 'Hollow Galvalum Anti Karat 2x4' },
      { label: 'Lokasi Proyek', value: 'Desa Lorog, Kec. Tawangsari, Kab. Sukoharjo' },
      { label: 'Status Pengerjaan', value: 'Selesai & Bergaransi Resmi Griya Alfath' }
    ],
    sections: [
      {
        heading: 'Pembaruan Fasilitas Layanan Publik',
        content: 'Ruang pelayanan kantor desa merupakan pusat interaksi antara aparatur pemerintah dan warga masyarakat. Pembaruan plafon ini bertujuan memberikan kenyamanan visual, menghindarkan ruangan dari kesan kusam, serta memastikan langit-langit tahan lembap saat pergantian musim.'
      },
      {
        heading: 'Kombinasi Motif Kayu & Drop Ceiling Elegan',
        content: 'Bagian tengah ruangan menggunakan trap drop ceiling dengan motif serat kayu doff hangat yang memancarkan kesan ramah dan berkelas. Rangka hollow dipasang bertingkat untuk menampung lampu LED strip warm white yang mendistribusikan cahaya ramah di mata petugas dan warga.'
      },
      {
        heading: 'Efisiensi Perawatan Jangka Panjang',
        content: 'Permukaan panel PVC tidak memerlukan pengecatan berkala. Perawatan rutin cukup dengan membersihkan debu menggunakan kain mikrofiber, menghemat alokasi biaya pemeliharaan gedung kantor desa di masa depan.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/proyek/proyek-rumah-tawangsari.webp',
        alt: 'Plafon PVC Tawangsari',
        caption: 'Tampilan plafon drop ceiling motif kayu pada ruang front office Desa Lorog Tawangsari'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-2.webp',
        alt: 'Pencahayaan drop ceiling',
        caption: 'Pencahayaan lampu tersembunyi yang memberi aksen hangat pada langit-langit'
      },
      {
        type: 'image',
        src: '/images/layanan/layanan-plafon-pvc.webp',
        alt: 'Proses perakitan rangka plafon',
        caption: 'Tahap penyusunan rangka hollow berjarak rapat untuk drop ceiling'
      }
    ],
    relatedProducts: [
      { name: 'Plafon UPVC Lamiwood Premium', url: '/katalog/', brand: 'LAMIWOOD', image: '/images/produk/produk-plafon-pvc-lamiwood.webp' },
      { name: 'Lis Pigura & Profil Janur', url: '/katalog/', brand: 'JANUR', image: '/images/produk/produk-pvc-board.webp' }
    ],
    relatedArticles: [
      { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' },
      { title: 'Tips Memilih Plafon PVC Berkualitas untuk Bangunan', url: '/blog/tips-memilih-plafon-pvc-berkualitas/' }
    ]
  },
  {
    id: 'drop-ceiling-ruang-tamu',
    title: 'Drop Ceiling Ruang Tamu Modern Surakarta',
    category: 'Proyek Plafon PVC',
    categorySlug: 'pvc',
    serviceCategory: 'pvc',
    serviceCategoryLabel: 'Plafon PVC',
    buildingType: 'rumah',
    buildingTypeLabel: 'Rumah Tinggal',
    image: '/images/proyek/proyek-interior-solo-2.webp',
    description: 'Desain plafon bertingkat dengan lampu sembunyi (hidden lamp) yang memberikan aksen mewah pada area ruang utama hunian di Surakarta.',
    location: 'Surakarta',
    completionYear: '2024',
    introduction: 'Pemasangan drop ceiling plafon PVC bertingkat pada ruang tamu hunian modern di Kota Surakarta. Desain ini menghadirkan transisi trap berundak dengan jalur lampu LED tersembunyi (indirect lighting) yang memancarkan pendaran cahaya warm white hangat di malam hari.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Drop Ceiling Plafon PVC' },
      { label: 'Tipe Bangunan', value: 'Rumah Tinggal Modern' },
      { label: 'Material Utama', value: 'Panel PVC Glossy Putih & Lis Profil Aksen Kayu' },
      { label: 'Sistem Pencahayaan', value: 'Hidden LED Strip Warm White + Downlight Simetris' },
      { label: 'Rangka Konstruksi', value: 'Hollow Galvalum 4x4 Bertingkat' },
      { label: 'Lokasi Proyek', value: 'Surakarta (Solo Kota)' },
      { label: 'Status Pengerjaan', value: 'Selesai Pengerjaan' }
    ],
    sections: [
      {
        heading: 'Kebutuhan Dimensi & Estetika Ruang Keluarga',
        content: 'Pemilik rumah menginginkan area ruang tamu dan keluarga memiliki kesan visual yang tinggi dan megah. Langit-langit flat biasa digantikan dengan konsep drop ceiling berundak yang menciptakan kedalaman perspektif ruangan.'
      },
      {
        heading: 'Presisi Kedalaman Ceruk Lampu Sembunyi',
        content: 'Ceruk drop ceiling dibuat dengan kedalaman 15 cm yang proporsional. Jalur dudukan lampu dirancang rapi agar pita LED strip terpasang lurus tanpa titik lampu terlihat langsung dari bawah (zero glare).'
      },
      {
        heading: 'Bebas Noda Air & Mudah Dirawat',
        content: 'Material PVC berkualitas tinggi yang dipasang membuat pemilik rumah bebas cemas dari risiko rembesan air hujan pada genteng. Sambungan panel interlocking rapat dan tidak meninggalkan celah debu.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-2.webp',
        alt: 'Drop ceiling ruang tamu Solo',
        caption: 'Plafon bertingkat dengan aksen lampu LED tersembunyi di Surakarta'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-1.webp',
        alt: 'Pemandangan ruang utama',
        caption: 'Sudut pandang ruang utama dengan pencahayaan warm white elegan'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-3.webp',
        alt: 'Detail lampu downlight',
        caption: 'Penempatan lampu downlight simetris untuk penerangan harian yang merata'
      }
    ],
    relatedProducts: [
      { name: 'Plafon UPVC Lamiwood Premium', url: '/katalog/', brand: 'LAMIWOOD', image: '/images/produk/produk-plafon-pvc-lamiwood.webp' },
      { name: 'Hollow Galvalum 2x4 & 4x4', url: '/katalog/', brand: 'HONOR / KENCANA', image: '/images/produk/produk-hollow.webp' }
    ],
    relatedArticles: [
      { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' }
    ]
  },
  {
    id: 'proyek-komersial-simran',
    title: 'Plafon Gedung Komersial Simran Gorden',
    category: 'Proyek Komersial',
    categorySlug: 'komersial',
    serviceCategory: 'pvc',
    serviceCategoryLabel: 'Plafon PVC',
    buildingType: 'komersial',
    buildingTypeLabel: 'Komersial & Ruko Usaha',
    image: '/images/proyek/proyek-komersial-simran.webp',
    description: 'Instalasi plafon PVC area pertokoan modern dan front office Simran Gorden yang tahan air dan mudah dibersihkan dari debu aktivitas harian di Solo Baru.',
    location: 'Solo Baru, Sukoharjo',
    client: 'Simran Gorden',
    completionYear: '2025',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/reel/DOAVD8_kyYQ/',
    introduction: 'Pemasangan plafon PVC doff laminate series dan backdrop interior area front office Simran Gorden di kawasan komersial Solo Baru, Sukoharjo. Proyek ini memadukan material plafon anti debu dan panel dinding estetis untuk menunjang display produk gorden bernilai tinggi.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Plafon PVC & Panel Dinding' },
      { label: 'Tipe Bangunan', value: 'Ruko / Gerai Komersial' },
      { label: 'Material Utama', value: 'Plafon PVC Doff Laminate Premium' },
      { label: 'Konstruksi Rangka', value: 'Hollow Galvalum 2x4 Anti Karat' },
      { label: 'Keunggulan Khusus', value: 'Anti Debu, Anti Noda, Tahan Rembesan Air' },
      { label: 'Lokasi Proyek', value: 'Solo Baru, Sukoharjo' },
      { label: 'Status Pengerjaan', value: 'Selesai & Bergaransi' }
    ],
    sections: [
      {
        heading: 'Standar Kebersihan Ruang Pameran Tekstil',
        content: 'Toko tekstil interior membutuhkan ruangan yang senantiasa bersih dari rontokan partikel debu. Plafon PVC dipilih karena permukaannya yang padat dan halus tidak melepaskan butiran debu seperti plafon semen atau gipsum lama.'
      },
      {
        heading: 'Instalasi Efisien Minim Gangguan Toko',
        content: 'Tim aplikator Griya Alfath bekerja dengan metode cutting presisi di luar ruangan kerja untuk meminimalkan kotoran. Pemasangan panel lidah-alur berlangsung cepat sehingga aktivitas perniagaan toko dapat segera beroperasi kembali.'
      },
      {
        heading: 'Tampilan Front Office Modern & Elegan',
        content: 'Plafon PVC putih doff berpadu dengan panel dinding kayu sintetis menghadirkan suasana ruang tunggu dan transaksi yang sangat berkelas, meningkatkan kenyamanan pelanggan saat berbelanja.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/proyek/proyek-komersial-simran.webp',
        alt: 'Plafon Simran Gorden Solo Baru',
        caption: 'Area front office Simran Gorden dengan plafon PVC doff laminate bersih'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-4.webp',
        alt: 'Detail sambungan plafon toko',
        caption: 'Penyambungan lidah alur rapat tanpa celah debu'
      },
      {
        type: 'image',
        src: '/images/layanan/layanan-wall-moulding.webp',
        alt: 'Panel dinding dekoratif',
        caption: 'Aksen panel dinding yang mempercantik interior toko'
      }
    ],
    relatedProducts: [
      { name: 'Plafon UPVC Lamiwood Premium', url: '/katalog/', brand: 'LAMIWOOD', image: '/images/produk/produk-plafon-pvc-lamiwood.webp' },
      { name: 'Wall Panel & WPC Board Janur', url: '/katalog/', brand: 'JANUR', image: '/images/produk/produk-wallboard.webp' }
    ],
    relatedArticles: [
      { title: 'Tips Memilih Plafon PVC Berkualitas untuk Bangunan Komersial', url: '/blog/tips-memilih-plafon-pvc-berkualitas/' }
    ]
  },
  {
    id: 'wall-moulding-interior',
    title: 'Wall Moulding Ruang Keluarga Sukoharjo',
    category: 'Proyek Wall Moulding',
    categorySlug: 'wall-moulding',
    serviceCategory: 'wall-moulding',
    serviceCategoryLabel: 'Wall Moulding',
    buildingType: 'rumah',
    buildingTypeLabel: 'Rumah Tinggal',
    image: '/images/layanan/layanan-wall-moulding.webp',
    description: 'Aksen panel dinding simetris dengan finishing bersih untuk memperkuat estetika interior ruangan modern di Sukoharjo.',
    location: 'Sukoharjo',
    completionYear: '2024',
    introduction: 'Pengerjaan dekorasi panel dinding (wall moulding) simetris pada area ruang keluarga hunian modern di Sukoharjo. Konsep lis profil geometris klasik kontemporer ini dirancang untuk memberikan karakter arsitektural yang berkelas pada bidang dinding utama tanpa memakan ruang gerak lantai.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Wall Moulding & Panel Dinding' },
      { label: 'Tipe Bangunan', value: 'Rumah Tinggal Modern' },
      { label: 'Material Profil', value: 'Lis Profil Kayu Sintetis & Lis PVC Tahan Rayap' },
      { label: 'Sistem Perekat', value: 'Sealant Konstruksi Polyurethane + Micro-Pin Nailer' },
      { label: 'Finishing Sambungan', value: 'Kompon Mulus Anti Retak & Pengecatan Semi-Doff' },
      { label: 'Lokasi Proyek', value: 'Sukoharjo' },
      { label: 'Status Pengerjaan', value: 'Selesai' }
    ],
    sections: [
      {
        heading: 'Perancangan Skala & Proporsi Geometris',
        content: 'Keindahan wall moulding sangat ditentukan oleh pembagian bidang dinding yang presisi. Tim mengukur tinggi plafon dan lebar dinding secara cermat, menggunakan laser level untuk memastikan setiap kotak lis memiliki jarak simetris yang harmonis terhadap penataan perabot ruangan.'
      },
      {
        heading: 'Pemotongan Sudut Miter 45 Derajat',
        content: 'Setiap ujung lis profil dipotong menggunakan mesin miter saw dengan sudut 45 derajat presisi. Sambungan antar profil direkatkan dengan lem berkekuatan tinggi serta diperkuat paku tembak mikro yang titik kepalanya tertutup rapat oleh kompon.'
      },
      {
        heading: 'Sentuhan Kemewahan Klasik Modern',
        content: 'Setelah proses kompon dan pengecatan selesai, dinding ruang keluarga memiliki kedalaman visual yang memikat. Tampilan dinding menjadi fokus estetika yang mewah dan serasi dipadukan dengan pencahayaan warm white.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/layanan/layanan-wall-moulding.webp',
        alt: 'Wall moulding Sukoharjo',
        caption: 'Pola wall moulding simetris pada dinding ruang keluarga'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-1.webp',
        alt: 'Penyelarasan plafon dan dinding',
        caption: 'Harmonisasi antara wall moulding dinding dan plafon interior'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-2.webp',
        alt: 'Sudut ruang tamu elegan',
        caption: 'Kombinasi wall moulding dengan pencahayaan hangat'
      }
    ],
    relatedProducts: [
      { name: 'Wall Panel & WPC Board', url: '/katalog/', brand: 'JANUR / MOTTO', image: '/images/produk/produk-wallboard.webp' },
      { name: 'Lis Pigura & Profil Janur', url: '/katalog/', brand: 'JANUR', image: '/images/produk/produk-pvc-board.webp' }
    ],
    relatedArticles: [
      { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' }
    ]
  },
  {
    id: 'rangka-atap-baja-ringan',
    title: 'Rangka Kuda-Kuda Baja Ringan Kencana SNI',
    category: 'Proyek Baja Ringan',
    categorySlug: 'baja-ringan',
    serviceCategory: 'baja-ringan',
    serviceCategoryLabel: 'Baja Ringan',
    buildingType: 'rumah',
    buildingTypeLabel: 'Rumah Tinggal',
    image: '/images/layanan/layanan-baja-ringan.webp',
    description: 'Pemasangan konstruksi kuda-kuda atap baja ringan Kencana SNI untuk hunian baru yang kokoh, anti rayap, dan tahan karat di Sukoharjo.',
    location: 'Baki, Sukoharjo & Boyolali',
    client: 'Bapak Prasetyo (Vionilys) & Proyek Hunian Solo Raya',
    completionYear: '2020 - 2025',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/p/CFMdKpjATUz/',
    introduction: 'Perakitan dan instalasi konstruksi kuda-kuda serta reng atap baja ringan menggunakan material Kanal C bersertifikasi SNI resmi dari Kencana Truss. Memberikan perlindungan struktur atap hunian yang kokoh, berbobot ringan, anti rayap, dan tahan korosi jangka panjang bagi pemilik rumah di Solo Raya.',
    specs: [
      { label: 'Jenis Layanan', value: 'Perakitan & Pemasangan Rangka Atap Baja Ringan' },
      { label: 'Tipe Bangunan', value: 'Rumah Tinggal' },
      { label: 'Material Utama', value: 'Kanal C75 Kencana Truss SNI (Baja High Tensile G550)' },
      { label: 'Profil Reng', value: 'Reng Asimetris Kencana SNI' },
      { label: 'Baut Pengikat', value: 'Self Drilling Screw (SDS) Berpelindung Karat' },
      { label: 'Sistem Angkur', value: 'Dynabolt Baja ke Balok Ring Cincin Beton' },
      { label: 'Lokasi Proyek', value: 'Baki, Sukoharjo & Boyolali' },
      { label: 'Status Pengerjaan', value: 'Selesai & Bergaransi Konstruksi' }
    ],
    sections: [
      {
        heading: 'Perhitungan Beban & Struktur Kokoh',
        content: 'Konstruksi atap harus sanggup menahan beban penutup genteng, beban hembusan angin kencang, serta beban pekerja pemeliharaan. Tim aplikator menghitung sudut kemiringan dan jarak bentangan kuda-kuda dengan rumus teknis standar konstruksi atap aman.'
      },
      {
        heading: 'Material Baja High Tensile G550 SNI',
        content: 'Kami menggunakan profil Kanal C Kencana Truss asli berkekuatan tarik tinggi G550 dengan lapisan paduan seng-aluminium (Zincalume) yang terbukti tahan terhadap kelembapan tropis dan tidak memicu karat.'
      },
      {
        heading: 'Perakitan Kaku & Penguncian Balok Cincin',
        content: 'Kuda-kuda dirakit dengan bracing silang yang kaku untuk mencegah pergeseran lateral. Kaki-kaki kuda-kuda dikunci kuat ke balok beton ring cincin menggunakan dynabolt baja galvanis, menjamin kestabilan atap hunian selama puluhan tahun.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/layanan/layanan-baja-ringan.webp',
        alt: 'Konstruksi baja ringan Kencana',
        caption: 'Perakitan kuda-kuda baja ringan Kanal C Kencana Truss SNI'
      },
      {
        type: 'image',
        src: '/images/produk/produk-baja-ringan-kencana.webp',
        alt: 'Material baja ringan SNI',
        caption: 'Profil Kanal C dan reng berstandar SNI tahan karat'
      },
      {
        type: 'image',
        src: '/images/dokumentasi/dok-ready-to-work.webp',
        alt: 'Aplikator baja ringan Griya Alfath',
        caption: 'Kesiapan peralatan kerja aplikator baja ringan Griya Alfath'
      }
    ],
    relatedProducts: [
      { name: 'Rangka Baja Ringan Kencana Truss SNI', url: '/katalog/', brand: 'KENCANA', image: '/images/produk/produk-baja-ringan-kencana.webp' },
      { name: 'Hollow Galvalum 2x4 & 4x4', url: '/katalog/', brand: 'HONOR / KENCANA', image: '/images/produk/produk-hollow.webp' },
      { name: 'Atap Galvalum Pasir', url: '/katalog/', brand: 'KENCANA', image: '/images/produk/produk-galvalum.webp' }
    ],
    relatedArticles: [
      { title: 'Panduan Memilih Rangka Baja Ringan SNI yang Aman dan Kokoh', url: '/blog/panduan-memilih-rangka-baja-ringan-sni/' }
    ]
  },
  {
    id: 'plafon-gypsum-flat',
    title: 'Plafon Gypsum Flat Minimalis Colomadu',
    category: 'Proyek Plafon Gypsum',
    categorySlug: 'gypsum',
    serviceCategory: 'gypsum',
    serviceCategoryLabel: 'Plafon Gypsum',
    buildingType: 'rumah',
    buildingTypeLabel: 'Rumah Tinggal',
    image: '/images/layanan/layanan-gypsum.webp',
    description: 'Pemasangan partisi dan plafon gypsum mulus dengan finishing cat interior rata tanpa bayangan sambungan di Colomadu, Karanganyar.',
    location: 'Colomadu, Karanganyar',
    client: 'Bapak Joko',
    completionYear: '2020 - 2025',
    sourceUrl: 'https://www.instagram.com/plafonpvcsolo/p/CCruO3Hh34E/',
    introduction: 'Pemasangan plafon gypsum flat minimalis dengan teknik pengomponan sambungan tanpa bayangan (seamless finish) pada hunian tinggal bernuansa klasik modern di Colomadu, Karanganyar. Menghadirkan bidang langit-langit yang rata sempurna, kedap suara, dan siap dilapisi warna cat interior kesukaan pemilik rumah.',
    specs: [
      { label: 'Jenis Layanan', value: 'Pemasangan Plafon Gypsum Flat & Lis Profil' },
      { label: 'Tipe Bangunan', value: 'Rumah Tinggal Modern' },
      { label: 'Material Papan', value: 'Papan Gypsum Jayaboard Sheetrock 9mm' },
      { label: 'Rangka Penopang', value: 'Hollow Galvalum 2x4 & 4x4 SNI' },
      { label: 'Sistem Sambungan', value: 'Cornice Adhesive + Paper Tape Anti Retak' },
      { label: 'Finishing Akhir', value: 'Amplas Halus & Cat Dasar Alkali Sealer' },
      { label: 'Lokasi Proyek', value: 'Colomadu, Karanganyar' },
      { label: 'Status Pengerjaan', value: 'Selesai' }
    ],
    sections: [
      {
        heading: 'Kelebihan Bidang Langit-Langit Monolitik',
        content: 'Plafon gypsum menjadi pilihan ideal bagi pemilik rumah yang menghendaki bidang langit-langit rata tanpa sambungan garis. Permukaannya yang halus menyatu sempurna dengan lis dinding profil klasik minimalis.'
      },
      {
        heading: 'Teknik Pengomponan Tiga Tahap',
        content: 'Untuk mencegah retak rambut pada pertemuan antar papan gypsum, tim aplikator mengaplikasikan pita kertas perkuatan (paper tape) yang dibenamkan dalam adukan kompon khusus. Pengamplasan dilakukan dengan kontrol pencahayaan grazing light agar permukaan bebas tonjolan.'
      },
      {
        heading: 'Hasil Akhir Rata & Akustik Tenang',
        content: 'Plafon gypsum Jayaboard memberikan redaman suara ruang yang sangat baik. Hasil pengerjaan mulus tanpa bayangan sambungan, menciptakan suasana hunian yang tenang, elegan, dan berkelas.'
      }
    ],
    gallery: [
      {
        type: 'image',
        src: '/images/layanan/layanan-gypsum.webp',
        alt: 'Plafon gypsum flat Colomadu',
        caption: 'Plafon gypsum dengan hasil akhir permukaan rata tanpa sambungan'
      },
      {
        type: 'image',
        src: '/images/produk/produk-gypsum-jayaboard.webp',
        alt: 'Papan Gypsum Jayaboard Sheetrock',
        caption: 'Papan gypsum Jayaboard 9mm standar SNI berbobot stabil'
      },
      {
        type: 'image',
        src: '/images/proyek/proyek-interior-solo-1.webp',
        alt: 'Ruangan bersih bernuansa netral',
        caption: 'Interior ruangan hunian yang tampak tenang dan rapi'
      }
    ],
    relatedProducts: [
      { name: 'Papan Gypsum Jayaboard Sheetrock', url: '/katalog/', brand: 'JAYABOARD', image: '/images/produk/produk-gypsum-jayaboard.webp' },
      { name: 'Hollow Galvalum 2x4 & 4x4', url: '/katalog/', brand: 'HONOR / KENCANA', image: '/images/produk/produk-hollow.webp' }
    ],
    relatedArticles: [
      { title: 'Perbedaan Plafon PVC dan Gypsum: Kelebihan dan Rekomendasi', url: '/blog/perbedaan-plafon-pvc-dan-gypsum/' }
    ]
  }
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getRelatedProjects(currentProject: Project, limit = 3): Project[] {
  return projects
    .filter((p) => p.id !== currentProject.id)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.serviceCategory === currentProject.serviceCategory) scoreA += 2;
      if (a.buildingType === currentProject.buildingType) scoreA += 1;
      if (b.serviceCategory === currentProject.serviceCategory) scoreB += 2;
      if (b.buildingType === currentProject.buildingType) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
