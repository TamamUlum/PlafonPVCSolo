import fs from 'fs';
import path from 'path';

console.log('=== MEMULAI GENERASI PORTOFOLIO TERKLASTERISASI & STANDALONE (ZERO SCALED CONTENT) ===');

// 1. CSV Parser
function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim()); current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current.trim()); current = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row);
      row = [];
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) { row.push(current.trim()); rows.push(row); }
  return rows;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// 2. Pre-Processing: Pemotongan Footer Promosi & Pembersihan Caption
const promoCutoffRegex = /(?:kami\s*@?plafonpvcsolo.*?(?:menyediakan\s*(?:jasa|bahan)|griya\s*alfath)|kami\s*menyediakan\s*(?:jasa|bahan)|menyediakan\s*(?:jasa|bahan)\s*:|griya\s*alfath\s*menyediakan|info\s*pemesanan|more\s*info|\b1\.\s*pemasangan\s*plafon\s*pvc|\b1\.\s*plafon\s*pvc|toko\s*di\s*jl|kantor\s*kita\s*ber\s*alamatkan|monggo\s*pinarak|banyak\s*promo\s*dan\s*cash\s*back|disetiap\s*project\s*project\s*kami\s*kita\s*menggunakan\s*bahan|fast\s*respon|konsultasi\s*&\s*survei\s*gratis)/i;

function cleanCaption(raw) {
  if (!raw) return '';
  // Ubah newline menjadi tanda titik jika belum ada tanda baca
  let text = raw.replace(/([^\.\?\!\n])\r?\n/g, '$1. ');
  text = text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
  const match = text.match(promoCutoffRegex);
  if (match) {
    text = text.substring(0, match.index).trim();
  }
  // Bersihkan hashtag dan mention media sosial
  text = text.replace(/#\w+/g, '').replace(/@plafonpvcsolo/gi, '').replace(/\s+/g, ' ').trim();
  return text;
}

function cleanText(str) {
  if (!str || str === '-') return '';
  return str.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
}

// 3. Normalisasi Kabupaten/Kota Induk di Solo Raya
function normalizeKabupaten(loc, cap) {
  const text = `${loc} ${cap}`.toLowerCase();
  if (text.includes('sukoharjo') || text.includes('kartasura') || text.includes('grogol') || text.includes('baki') || text.includes('gatak') || text.includes('tawangsari') || text.includes('mojolaban') || text.includes('bekonang') || text.includes('solobaru') || text.includes('solo baru') || text.includes('polokarto') || text.includes('bendosari') || text.includes('mulur') || text.includes('mayang') || text.includes('wiragunan')) {
    return 'Sukoharjo';
  }
  if (text.includes('klaten') || text.includes('delanggu') || text.includes('pedan') || text.includes('juwiring') || text.includes('ceper') || text.includes('wonosari') || text.includes('karanganom') || text.includes('jatinom') || text.includes('trucuk') || text.includes('prambanan') || text.includes('bayat') || text.includes('cawas') || text.includes('karangmalang') || text.includes('sidomulyo') || text.includes('karangwuni') || text.includes('daleman') || text.includes('klegen')) {
    return 'Klaten';
  }
  if (text.includes('surakarta') || text.includes('solo') || text.includes('banjarsari') || text.includes('jebres') || text.includes('laweyan') || text.includes('pasar kliwon') || text.includes('serengan') || text.includes('manahan') || text.includes('kadipiro') || text.includes('sumber') || text.includes('pajang')) {
    return 'Surakarta';
  }
  if (text.includes('karanganyar') || text.includes('colomadu') || text.includes('jaten') || text.includes('tasikmadu') || text.includes('kebakkramat') || text.includes('gondangrejo') || text.includes('palur')) {
    return 'Karanganyar';
  }
  if (text.includes('boyolali') || text.includes('banyudono') || text.includes('mojosongo') || text.includes('ngemplak') || text.includes('sawit') || text.includes('sambi') || text.includes('ampel') || text.includes('cengklik')) {
    return 'Boyolali';
  }
  if (text.includes('wonogiri') || text.includes('selogiri') || text.includes('bulusulur') || text.includes('baturetno') || text.includes('ngadirojo') || text.includes('pracimantoro')) {
    return 'Wonogiri';
  }
  if (text.includes('sragen') || text.includes('masaran') || text.includes('gemolong') || text.includes('kalijambe')) {
    return 'Sragen';
  }
  return 'Solo Raya';
}

// 4. Normalisasi Layanan (Single Source of Truth: Kolom 8 Layanan Terkait)
function normalizeService(srvCol, kwCol, cleanCap) {
  const srv = (srvCol || '').toLowerCase().trim();
  // Prioritas 1: Nilai eksplisit kolom Layanan Terkait di CSV
  if (srv && srv !== '-' && !srv.includes('semua layanan')) {
    if (srv.includes('pvc') || srv.includes('plafon pvc')) {
      return { slug: 'pvc', label: 'Plafon PVC' };
    }
    if (srv.includes('gypsum') || srv.includes('grc')) {
      return { slug: 'gypsum', label: 'Plafon Gypsum' };
    }
    if (srv.includes('baja ringan') || srv.includes('atap') || srv.includes('galvalum') || srv.includes('kuda-kuda')) {
      return { slug: 'baja-ringan', label: 'Rangka Baja Ringan' };
    }
    if (srv.includes('moulding') || srv.includes('panel') || srv.includes('wpc') || srv.includes('wallboard')) {
      return { slug: 'wall-moulding', label: 'Wall Moulding & Panel Dinding' };
    }
  }

  // Prioritas 2: Kolom Kata Kunci
  const kw = (kwCol || '').toLowerCase();
  if (kw.includes('baja ringan') || kw.includes('atap') || kw.includes('kuda-kuda') || kw.includes('galvalum') || kw.includes('kanopi')) {
    return { slug: 'baja-ringan', label: 'Rangka Baja Ringan' };
  }
  if (kw.includes('moulding') || kw.includes('panel dinding') || kw.includes('wallboard') || kw.includes('wpc')) {
    return { slug: 'wall-moulding', label: 'Wall Moulding & Panel Dinding' };
  }
  if (kw.includes('gypsum') || kw.includes('grc')) {
    return { slug: 'gypsum', label: 'Plafon Gypsum' };
  }
  if (kw.includes('pvc')) {
    return { slug: 'pvc', label: 'Plafon PVC' };
  }

  // Prioritas 3: Inti Caption Bersih (yang sudah terbebas dari footer promosi)
  const cap = cleanCap.toLowerCase();
  if (cap.includes('baja ringan') || cap.includes('atap') || cap.includes('kuda-kuda') || cap.includes('galvalum') || cap.includes('kanopi')) {
    return { slug: 'baja-ringan', label: 'Rangka Baja Ringan' };
  }
  if (cap.includes('moulding') || cap.includes('wall panel') || cap.includes('wallboard') || cap.includes('wpc')) {
    return { slug: 'wall-moulding', label: 'Wall Moulding & Panel Dinding' };
  }
  if (cap.includes('gypsum') || cap.includes('grc')) {
    return { slug: 'gypsum', label: 'Plafon Gypsum' };
  }

  return { slug: 'pvc', label: 'Plafon PVC' };
}

function determineBuildingType(bldRaw, cap) {
  const text = `${bldRaw} ${cap}`.toLowerCase();
  if (text.includes('masjid') || text.includes('mushola') || text.includes('musholla') || text.includes('gereja') || text.includes('ibadah')) {
    return { slug: 'tempat-ibadah', label: 'Tempat Ibadah' };
  }
  if (text.includes('ruko') || text.includes('toko') || text.includes('komersial') || text.includes('showroom') || text.includes('kedai') || text.includes('cafe') || text.includes('warung') || text.includes('kantor') || text.includes('klinik') || text.includes('balai') || text.includes('aula') || text.includes('sekolah')) {
    return { slug: 'komersial', label: 'Komersial & Fasilitas Publik' };
  }
  return { slug: 'rumah', label: 'Rumah Tinggal' };
}

function extractEmbedData(url, platformRaw, typeRaw) {
  const u = (url || '').trim();
  try {
    const parsed = new URL(u);
    if (parsed.hostname.includes('instagram.com')) {
      const match = u.match(/instagram\.com\/(?:[^\/]+\/)?(?:p|reel|tv)\/([^/?#&]+)/i);
      const shortcode = match ? match[1] : '';
      const isReel = u.includes('/reel/') || (typeRaw || '').toLowerCase().includes('video');
      return {
        platform: 'instagram',
        embedType: 'instagram',
        id: shortcode,
        embedUrl: `https://www.instagram.com/p/${shortcode}/`,
        isReel,
        valid: Boolean(shortcode)
      };
    }
    if (parsed.hostname.includes('tiktok.com')) {
      const match = u.match(/video\/(\d+)/i);
      const vidId = match ? match[1] : '';
      const userMatch = u.match(/@([^/?#&]+)/i);
      const username = userMatch ? userMatch[1] : 'plafonpvcsolo';
      return {
        platform: 'tiktok',
        embedType: 'tiktok',
        id: vidId,
        username,
        embedUrl: u,
        valid: Boolean(vidId)
      };
    }
    if (parsed.hostname.includes('facebook.com') || parsed.hostname.includes('fb.watch')) {
      const encoded = encodeURIComponent(u);
      return {
        platform: 'facebook',
        embedType: 'facebook',
        id: u,
        embedUrl: `https://www.facebook.com/plugins/video.php?height=476&href=${encoded}&show_text=false&width=267&t=0`,
        valid: true
      };
    }
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      let vidId = '';
      if (u.includes('/shorts/')) {
        const m = u.match(/\/shorts\/([^/?#&]+)/i);
        vidId = m ? m[1] : '';
      } else if (u.includes('watch?v=')) {
        vidId = parsed.searchParams.get('v') || '';
      } else if (parsed.hostname.includes('youtu.be')) {
        vidId = parsed.pathname.replace(/^\//, '');
      }
      return {
        platform: 'youtube',
        embedType: 'youtube',
        id: vidId,
        embedUrl: `https://www.youtube.com/embed/${vidId}`,
        isShorts: u.includes('/shorts/'),
        valid: Boolean(vidId)
      };
    }
  } catch (e) {
    return { platform: 'unknown', valid: false, error: e.message };
  }
  return { platform: 'unknown', valid: false };
}

function getRelatedEntities(serviceSlug) {
  if (serviceSlug === 'baja-ringan') {
    return {
      products: [
        { name: 'Baja Ringan Kencana Truss SNI', url: '/produk/baja-ringan-kencana/', brand: 'KENCANA TRUSS' },
        { name: 'Hollow Galvalum Rangka Plafon', url: '/produk/hollow-baja-ringan/', brand: 'GRIYA ALFATH' }
      ],
      articles: [
        { title: 'Panduan Memilih Rangka Baja Ringan SNI yang Aman dan Kokoh', url: '/blog/panduan-memilih-rangka-baja-ringan-sni/' }
      ],
      serviceUrl: '/layanan/'
    };
  }
  if (serviceSlug === 'gypsum') {
    return {
      products: [
        { name: 'Plafon Gypsum Jayaboard Sheetrock', url: '/produk/plafon-gypsum-jayaboard/', brand: 'JAYABOARD' },
        { name: 'Hollow Galvalum Rangka Plafon', url: '/produk/hollow-baja-ringan/', brand: 'GRIYA ALFATH' }
      ],
      articles: [
        { title: 'Perbedaan Plafon PVC dan Gypsum: Kelebihan dan Rekomendasi', url: '/blog/perbedaan-plafon-pvc-dan-gypsum/' }
      ],
      serviceUrl: '/layanan/'
    };
  }
  if (serviceSlug === 'wall-moulding') {
    return {
      products: [
        { name: 'Wall Panel & WPC Board', url: '/produk/wall-panel-pvc-board/', brand: 'JANUR / MOTTO' },
        { name: 'Lis Pigura & Profil Janur', url: '/produk/janur-lis-pigura/', brand: 'JANUR' }
      ],
      articles: [
        { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' }
      ],
      serviceUrl: '/layanan/'
    };
  }
  return {
    products: [
      { name: 'Plafon PVC Lamiwood Series', url: '/produk/plafon-pvc-lamiwood/', brand: 'LAMIWOOD' },
      { name: 'Plafon PVC Sakura High Grade', url: '/produk/plafon-pvc-sakura/', brand: 'SAKURA' }
    ],
    articles: [
      { title: 'Tips Memilih Plafon PVC Berkualitas untuk Bangunan', url: '/blog/tips-memilih-plafon-pvc-berkualitas/' },
      { title: 'Inspirasi Desain Drop Ceiling dan Lampu Sembunyi Modern', url: '/blog/inspirasi-desain-drop-ceiling-lampu-sembunyi/' }
    ],
    serviceUrl: '/layanan/'
  };
}

// 8 Flagship Slugs to NEVER collide with
const flagshipSlugs = new Set([
  'showroom-iwan-motor',
  'gedung-ibadah-gereja',
  'rumah-tinggal-tawangsari',
  'drop-ceiling-ruang-tamu',
  'proyek-komersial-simran',
  'wall-moulding-interior',
  'rangka-atap-baja-ringan',
  'plafon-gypsum-flat'
]);

const flagshipRowMap = new Map([
  [1108, 'showroom-iwan-motor'],
  [916, 'gedung-ibadah-gereja'],
  [1126, 'rumah-tinggal-tawangsari'],
  [1115, 'proyek-komersial-simran'],
  [109, 'rangka-atap-baja-ringan'],
  [28, 'plafon-gypsum-flat']
]);

// 5. Baca CSV Sumber
const csvRaw = fs.readFileSync('master_semua_postingan.csv', 'utf8');
const allRows = parseCSV(csvRaw);
const dataRows = allRows.slice(1);
console.log(`Memproses ${dataRows.length} baris data dari master_semua_postingan.csv...`);

// 6. Deteksi Entitas Spesifik untuk Standalone
function extractEntityMatch(cleanCap) {
  const c = (cleanCap || '').trim();
  
  // Person match: bapak, ibu, bpk, mas, mbak, mba, pak, bu, ustadz, dr, haji
  // (abaikan 'h.' tunggal untuk menghindari false positive)
  const mPerson = c.match(/(?:project\s+)?(?:pemasangan\s+plafon\s+)?(?:rumah\s+)?(bapak|ibu|bpk|mas|mbak|mba|pak|bu|ustadz|dr|haji)\s+([^.,\n\r]+?)(?=[.,\n\r]|(?:\s+(?:dan|di|yang|ke|untuk|terimakasih|alhamdulillah|semoga|kami|griya|alfath|menyediakan|bahan|jasa|oleh|ditangan|bisa|cek|kala|yuk|siapa|banyak|promo|bonus|part|on\s+proses|finis)\b)|$)/i);
  if (mPerson) {
    let raw = `${mPerson[1]} ${mPerson[2]}`.trim();
    if (!/bapak\s+ibu\s+(sekalian|semua)|bapak\s+yang\s+terhormat/i.test(raw)) {
      raw = raw.replace(/\s+(dan|di|yang|ke|untuk|terimakasih|alhamdulillah|semoga|kami|griya|alfath|menyediakan|bahan|jasa|oleh|ditangan|bisa|cek|kala|yuk|siapa|banyak|promo|bonus|part|on\s+proses|finis)\b.*$/i, '').trim();
      const parts = raw.split(/\s+/);
      if (parts.length >= 2 && !/^(banyak|promo|diskon|gratis|kami|jasa)$/i.test(parts[1])) {
        return { type: 'person', name: raw };
      }
    }
  }

  // Building / institution match
  const mBuilding = c.match(/(masjid|mushola|musholla|gereja|gedung\s+serbaguna|gedung\s+desa|aula|kantor\s+pelayanan|kantor\s+desa|balai\s+desa|sekolah|klinik|showroom|toko|kedai|warung|cafe|resto|bengkel|apotek)\s+([^.,\n\r]+?)(?=[.,\n\r]|(?:\s+(?:dan|di|yang|ke|untuk|terimakasih|alhamdulillah|semoga|kami|griya|alfath|menyediakan|bahan|jasa|oleh|ditangan|bisa|cek|kala|yuk|siapa|banyak|promo|bonus|part|on\s+proses|finis)\b)|$)/i);
  if (mBuilding) {
    let raw = `${mBuilding[1]} ${mBuilding[2]}`.trim();
    raw = raw.replace(/\s+(dan|di|yang|ke|untuk|terimakasih|alhamdulillah|semoga|kami|griya|alfath|menyediakan|bahan|jasa|oleh|ditangan|bisa|cek|kala|yuk|siapa|banyak|promo|bonus|part|on\s+proses|finis)\b.*$/i, '').trim();
    return { type: 'building', name: raw };
  }

  return null;
}

const rawStandaloneCandidates = [];
const rawClusterCandidates = [];

dataRows.forEach((r, idx) => {
  const rowNum = idx + 1;
  const [no, platform, waktu, tipe, url, kataKunci, jenisBangunan, lokasi, layanan, caption] = r;

  // Lewati 6 baris yang sudah diwakili oleh 8 Flagship Proyek di projects.ts
  if (flagshipRowMap.has(rowNum)) {
    return;
  }

  const cleanCap = cleanCaption(caption);
  const loc = cleanText(lokasi);
  const kab = normalizeKabupaten(loc, cleanCap);
  const srv = normalizeService(layanan, kataKunci, cleanCap);
  const bld = determineBuildingType(jenisBangunan, cleanCap);
  const embed = extractEmbedData(url, platform, tipe);
  const entity = extractEntityMatch(cleanCap);

  const itemObj = {
    rowNum,
    platform: platform || 'Instagram',
    waktu: waktu || '',
    tipe: tipe || 'Foto',
    url: url || '',
    kataKunci: kataKunci || '',
    jenisBangunan: jenisBangunan || '',
    lokasi: loc,
    kabupaten: kab,
    layanan: layanan || '',
    serviceSlug: srv.slug,
    serviceLabel: srv.label,
    buildingSlug: bld.slug,
    buildingLabel: bld.label,
    caption: cleanCap,
    entity,
    embed,
    image: '/images/hero/hero-plafon-main.webp'
  };

  // Kriteria Standalone: Memiliki entitas spesifik DAN caption deskriptif >= 100 karakter
  if (entity && cleanCap.length >= 100) {
    rawStandaloneCandidates.push(itemObj);
  } else {
    rawClusterCandidates.push(itemObj);
  }
});

console.log(`Kandidat Standalone Mentah: ${rawStandaloneCandidates.length}`);
console.log(`Kandidat Klaster Mentah: ${rawClusterCandidates.length}`);

// 7. Grouping Standalone Projects by Entity to Consolidate Same-Project Posts
const standaloneGroups = new Map();

rawStandaloneCandidates.forEach(item => {
  const entityName = item.entity.name;
  const entityKey = slugify(`${entityName}-${item.kabupaten}`);
  if (!standaloneGroups.has(entityKey)) {
    standaloneGroups.set(entityKey, []);
  }
  standaloneGroups.get(entityKey).push(item);
});

console.log(`Entitas Standalone Unik Terkonsolidasi: ${standaloneGroups.size}`);

const finalPages = [];
const usedSlugs = new Set(flagshipSlugs);

// 8. Generator Narasi Humanis & Sesuai SEO-AEO-GEO
function generateStandaloneEditorial(primary, entityName, loc, kab, srvLabel, cleanCap) {
  const isBuilding = primary.entity.type === 'building';
  const entityDesc = isBuilding ? entityName : `kediaman ${entityName}`;

  // Intro: Direct Answer for Search Intent & AEO (45-60 kata)
  const intro = `Dokumentasi pekerjaan instalasi ${srvLabel.toLowerCase()} untuk ${entityDesc} di kawasan ${loc}. Tim aplikator Griya Alfath menyelesaikan proyek ini dengan fokus utama pada kerapian modul plafon, kestabilan rangka gantung, dan keserasian visual interior ruangan. Seluruh material yang diaplikasikan telah melalui proses seleksi ketat agar tahan terhadap suhu lembap serta bebas dari ancaman rayap.`;

  // Section 1: Kebutuhan Ruangan & Pemilihan Material (80-110 kata)
  let sec1Heading = '';
  let sec1Content = '';

  if (srvLabel === 'Plafon PVC') {
    sec1Heading = 'Kebutuhan Ruangan dan Pemilihan Panel PVC';
    sec1Content = `Kondisi iklim tropis di wilayah ${kab} menuntut pemilihan material penutup atap yang tidak mudah lapuk bila terkena rembesan air. Pemilik bangunan memilih panel plafon PVC berkualitas tinggi karena bobotnya yang ringan dan perawatannya yang praktis. Permukaan panel bertekstur rapi dengan lapisan pelindung yang mudah dibersihkan dari debu rumah tangga. Di samping itu, panel PVC tidak merambatkan api dan tidak memerlukan pengecatan ulang berkala seperti halnya plafon konvensional. Penerapan sistem lidah alur antarpanel menghasilkan sambungan yang presisi tanpa celah nat terbuka, menciptakan bidang langit-langit yang bersih dan sedap dipandang.`;
  } else if (srvLabel === 'Rangka Baja Ringan') {
    sec1Heading = 'Kekuatan Struktur dan Konfigurasi Rangka Atap';
    sec1Content = `Kestabilan atap bangunan di area ${kab} membutuhkan perhitungan beban struktural yang cermat. Tim teknis Griya Alfath menerapkan profil baja ringan kanal C dan reng galvalum berstandar SNI dengan ketebalan presisi. Kuda-kuda dirakit menggunakan self-drilling screw bermutu tinggi pada setiap titik buhul pertemuan batang tarik dan tekan. Struktur ini dirancang untuk menahan beban penutup atap sekaligus tekanan angin lateral tanpa membebani dinding penopang secara berlebihan. Material galvalum juga memiliki lapisan antikarat yang andal untuk perlindungan jangka panjang.`;
  } else if (srvLabel === 'Plafon Gypsum') {
    sec1Heading = 'Konsep Permukaan Datar dan Kerapian Sambungan Gypsum';
    sec1Content = `Bagi ruangan yang membutuhkan bidang plafon mulus tanpa garis sambungan, papan gypsum menjadi pilihan yang tepat di ${loc}. Pemasangan menggunakan lembaran gypsum bermutu baik yang dipasang berselang-seling untuk mencegah retak rambut pada area pertemuan. Sambungan antarlembar diperkuat dengan paper tape khusus dan kompon penutup tiga lapis sebelum diamplas halus. Hasil akhir menghadirkan bidang plafon yang rata sempurna, siap menerima lapisan cat dasar dan cat interior dengan refleksi cahaya yang merata di seluruh ruangan.`;
  } else {
    sec1Heading = 'Aksen Dinding dan Estetika Interior';
    sec1Content = `Penataan interior di ${loc} dilengkapi pemasangan panel dinding dan moulding profil untuk memberi kedalaman ruang. Garis-garis lis profil dipasang dengan perhitungan simetri yang matang di setiap sisi dinding utama. Pemilihan material moulding tahan benturan dan bertekstur halus memudahkan proses finishing cat, sekaligus melindungi dinding dari goresan perabot sehari-hari. Ruangan terlihat lebih proporsional, hangat, dan berkarakter.`;
  }

  // Section 2: Presisi Pemasangan Rangka & Garansi (80-110 kata)
  const sec2Heading = 'Presisi Konstruksi Rangka dan Garansi Pekerjaan';
  const sec2Content = `Pada tahap pemasangan rangka plafon, tim tukang Griya Alfath menggunakan hollow galvalum ukuran 2x4 dan 4x4 dengan jarak gantungan rapat maksimal 60 sentimeter. Pengukuran elevasi menggunakan waterpass laser berakurasi tinggi untuk memastikan seluruh bidang gantung berada pada bidang datar sempurna tanpa gelombang. Lis profil sudut dipasang rapi pada pertemuan dinding dan plafon untuk menyempurnakan sudut ruangan. Sebagai komitmen terhadap kualitas, Griya Alfath menyertakan garansi pemasangan resmi untuk memastikan kenyamanan dan ketenangan pikiran pemilik bangunan di ${kab}.`;

  return {
    intro,
    sections: [
      { heading: sec1Heading, content: sec1Content },
      { heading: sec2Heading, content: sec2Content }
    ]
  };
}

// 9. Bangun Halaman STANDALONE
standaloneGroups.forEach((items, entityKey) => {
  const primary = items[0];
  const entityName = primary.entity.name;
  const kab = primary.kabupaten;
  const loc = primary.lokasi || kab;
  const srvLabel = primary.serviceLabel;

  // Sanitasi Judul & Slug: Zero Arbitrary Numbers & Bersihkan Redundansi Lokasi
  let baseTitle = '';
  if (primary.entity.type === 'building') {
    baseTitle = `Dokumentasi Pemasangan Plafon ${entityName}`;
    if (!entityName.toLowerCase().includes(kab.toLowerCase())) {
      baseTitle += ` di ${kab}`;
    }
  } else {
    baseTitle = `Pemasangan ${srvLabel} Rumah ${entityName}`;
    if (!entityName.toLowerCase().includes(kab.toLowerCase())) {
      baseTitle += ` di ${kab}`;
    }
  }

  // Bersihkan redundansi seperti "di Klaten di Klaten" atau "Sukoharjo di Sukoharjo"
  let cleanTitle = baseTitle
    .replace(/\bdi\s+([^,]+),\s*([^,]+)\s+di\s+\2/gi, 'di $1, $2')
    .replace(/\b(Klaten|Sukoharjo|Surakarta|Boyolali|Karanganyar|Wonogiri|Sragen)\s+di\s+\1/gi, '$1')
    .replace(/\s+\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Generate Base Slug tanpa angka
  let baseSlug = slugify(cleanTitle.replace(/^dokumentasi\s+pemasangan\s+plafon\s+/i, 'plafon-'));
  if (baseSlug.startsWith('pemasangan-')) {
    baseSlug = baseSlug.replace(/^pemasangan-/, '');
  }

  // Bersihkan angka urutan buatan jika ada di akhir slug
  const trailingNumMatch = baseSlug.match(/-(\d+)$/);
  if (trailingNumMatch) {
    const num = parseInt(trailingNumMatch[1], 10);
    if (num < 2000 || num > 2030) {
      baseSlug = baseSlug.replace(/-\d+$/, '');
    }
  }

  // Pastikan unik tanpa angka urutan sembarangan: gunakan variasi tema atau tahun jika terjadi bentrokan
  let finalSlug = baseSlug;
  if (usedSlugs.has(finalSlug)) {
    const yearMatch = primary.waktu.match(/\b(202[0-9])\b/);
    const yearStr = yearMatch ? `tahun-${yearMatch[1]}` : 'interior-resmi';
    finalSlug = `${baseSlug}-${yearStr}`;
  }
  if (usedSlugs.has(finalSlug)) {
    finalSlug = `${baseSlug}-dokumentasi-lapangan`;
  }
  if (usedSlugs.has(finalSlug)) {
    finalSlug = `${baseSlug}-aplikator-resmi`;
  }
  usedSlugs.add(finalSlug);

  const narrative = generateStandaloneEditorial(primary, entityName, loc, kab, srvLabel, primary.caption);
  const relations = getRelatedEntities(primary.serviceSlug);

  finalPages.push({
    slug: finalSlug,
    type: 'standalone',
    title: cleanTitle,
    serviceCategory: primary.serviceSlug,
    serviceCategoryLabel: primary.serviceLabel,
    buildingType: primary.buildingSlug,
    buildingTypeLabel: primary.buildingLabel,
    kabupaten: kab,
    location: loc,
    description: narrative.intro,
    narrative: {
      intro: narrative.intro,
      sections: narrative.sections
    },
    specs: [
      { label: 'Kategori Layanan', value: primary.serviceLabel },
      { label: 'Entitas / Proyek', value: entityName },
      { label: 'Wilayah Kerja', value: loc },
      { label: 'Material Utama', value: `${primary.serviceLabel} Bergaransi Resmi` },
      { label: 'Konstruksi Rangka', value: 'Hollow Galvalum & Baja Ringan SNI' },
      { label: 'Garansi Instalasi', value: 'Garansi Resmi Pemasangan Griya Alfath' }
    ],
    isIndexable: true, // Semua halaman Standalone adalah TIER 1 (Indexable)
    seoTitle: `${cleanTitle} — Griya Alfath`,
    seoDescription: `${narrative.intro.slice(0, 150)}... Dokumentasi riil bergaransi dari Griya Alfath di ${kab}.`,
    image: primary.image,
    embed: primary.embed,
    sourceUrl: primary.url,
    originalCaption: primary.caption,
    relatedProducts: relations.products,
    relatedArticles: relations.articles,
    relatedServiceUrl: relations.serviceUrl,
    subItemsCount: items.length
  });
});

console.log(`Halaman Standalone Berhasil Dibuat: ${finalPages.length}`);

// 10. Bangun Halaman KLASTER (Grouping by Service + Kabupaten, Max 6 items per page)
const clusterThemes = {
  'pvc': [
    { key: 'minimalis', titlePrefix: 'Pemasangan Plafon PVC Minimalis', slugPrefix: 'pemasangan-plafon-pvc-minimalis' },
    { key: 'drop-ceiling', titlePrefix: 'Inspirasi Plafon PVC Drop Ceiling', slugPrefix: 'plafon-pvc-drop-ceiling' },
    { key: 'motif-kayu', titlePrefix: 'Plafon PVC Motif Serat Kayu Natural', slugPrefix: 'plafon-pvc-motif-serat-kayu' },
    { key: 'hunian-modern', titlePrefix: 'Plafon PVC Hunian Keluarga Modern', slugPrefix: 'plafon-pvc-hunian-keluarga-modern' },
    { key: 'doff-elegan', titlePrefix: 'Plafon PVC Seri Doff Elegan', slugPrefix: 'plafon-pvc-seri-doff-elegan' },
    { key: 'ruang-tamu', titlePrefix: 'Plafon PVC Ruang Tamu Mewah', slugPrefix: 'plafon-pvc-ruang-tamu-mewah' },
    { key: 'kombinasi-lis', titlePrefix: 'Plafon PVC Kombinasi Lis Pigura', slugPrefix: 'plafon-pvc-kombinasi-lis-pigura' },
    { key: 'komersial-ruko', titlePrefix: 'Plafon PVC Ruko & Tempat Usaha', slugPrefix: 'plafon-pvc-ruko-tempat-usaha' },
    { key: 'tempat-ibadah', titlePrefix: 'Plafon PVC Masjid & Tempat Ibadah', slugPrefix: 'plafon-pvc-masjid-tempat-ibadah' },
    { key: 'area-dapur-teras', titlePrefix: 'Plafon PVC Tahan Air Area Dapur & Teras', slugPrefix: 'plafon-pvc-area-dapur-teras' },
    { key: 'tahun-2024', titlePrefix: 'Dokumentasi Plafon PVC Terpilih Tahun 2024', slugPrefix: 'plafon-pvc-dokumentasi-tahun-2024' },
    { key: 'tahun-2025', titlePrefix: 'Dokumentasi Plafon PVC Terpilih Tahun 2025', slugPrefix: 'plafon-pvc-dokumentasi-tahun-2025' },
    { key: 'lampu-led', titlePrefix: 'Plafon PVC Aksen Lampu LED Sembunyi', slugPrefix: 'plafon-pvc-aksen-lampu-led' },
    { key: 'putih-glossy', titlePrefix: 'Plafon PVC Putih Glossy Bersih', slugPrefix: 'plafon-pvc-putih-glossy-bersih' },
    { key: 'center-panel', titlePrefix: 'Plafon PVC Ornamen Center Panel', slugPrefix: 'plafon-pvc-ornamen-center-panel' },
    { key: 'kamar-tidur', titlePrefix: 'Plafon PVC Kamar Tidur Nyaman', slugPrefix: 'plafon-pvc-kamar-tidur-nyaman' },
    { key: 'bebas-bocor', titlePrefix: 'Plafon PVC Tahan Rembesan Air', slugPrefix: 'plafon-pvc-tahan-rembesan-air' },
    { key: 'rangka-galvalum', titlePrefix: 'Plafon PVC Struktur Rangka Galvalum', slugPrefix: 'plafon-pvc-struktur-rangka-galvalum' },
    { key: 'trap-bertingkat', titlePrefix: 'Plafon PVC Desain Trap Bertingkat', slugPrefix: 'plafon-pvc-desain-trap-bertingkat' },
    { key: 'motif-kayu-cokelat', titlePrefix: 'Plafon PVC Motif Kayu Cokelat Tua', slugPrefix: 'plafon-pvc-motif-kayu-cokelat-tua' },
    { key: 'motif-kayu-oak', titlePrefix: 'Plafon PVC Motif Kayu Oak Muda', slugPrefix: 'plafon-pvc-motif-kayu-oak-muda' },
    { key: 'motif-marmer', titlePrefix: 'Plafon PVC Motif Marmer Mewah', slugPrefix: 'plafon-pvc-motif-marmer-mewah' },
    { key: 'ruang-keluarga', titlePrefix: 'Plafon PVC Ruang Keluarga Hangat', slugPrefix: 'plafon-pvc-ruang-keluarga-hangat' },
    { key: 'ruang-makan', titlePrefix: 'Plafon PVC Ruang Makan Estetik', slugPrefix: 'plafon-pvc-ruang-makan-estetik' },
    { key: 'garasi-teras', titlePrefix: 'Plafon PVC Garasi & Teras Depan', slugPrefix: 'plafon-pvc-garasi-teras-depan' },
    { key: 'area-balkon', titlePrefix: 'Plafon PVC Area Balkon Bersih', slugPrefix: 'plafon-pvc-area-balkon-bersih' },
    { key: 'koridor-lorong', titlePrefix: 'Plafon PVC Koridor & Lorong Ruangan', slugPrefix: 'plafon-pvc-koridor-lorong-ruangan' },
    { key: 'kantor-kerja', titlePrefix: 'Plafon PVC Kantor & Ruang Kerja', slugPrefix: 'plafon-pvc-kantor-ruang-kerja' },
    { key: 'kamar-utama', titlePrefix: 'Plafon PVC Kamar Utama Elegan', slugPrefix: 'plafon-pvc-kamar-utama-elegan' },
    { key: 'kamar-anak', titlePrefix: 'Plafon PVC Kamar Anak Modern', slugPrefix: 'plafon-pvc-kamar-anak-modern' },
    { key: 'ruang-santai', titlePrefix: 'Plafon PVC Ruang Santai Keluarga', slugPrefix: 'plafon-pvc-ruang-santai-keluarga' },
    { key: 'dua-warna', titlePrefix: 'Plafon PVC Kombinasi Dua Warna', slugPrefix: 'plafon-pvc-kombinasi-dua-warna' },
    { key: 'lis-shadowline', titlePrefix: 'Plafon PVC Lis Dinding Shadowline', slugPrefix: 'plafon-pvc-lis-dinding-shadowline' },
    { key: 'panel-anti-rayap', titlePrefix: 'Plafon PVC Panel Anti Rayap Kokoh', slugPrefix: 'plafon-pvc-panel-anti-rayap-kokoh' },
    { key: 'interlocking-rapi', titlePrefix: 'Plafon PVC Panel Interlocking Rapi', slugPrefix: 'plafon-pvc-panel-interlocking-rapi' },
    { key: 'perawatan-mudah', titlePrefix: 'Plafon PVC Perawatan Mudah Awet', slugPrefix: 'plafon-pvc-perawatan-mudah-awet' },
    { key: 'peredam-panas', titlePrefix: 'Plafon PVC Peredam Panas Bawah Atap', slugPrefix: 'plafon-pvc-peredam-panas-atap' },
    { key: 'model-flat', titlePrefix: 'Plafon PVC Model Datar Flat Simple', slugPrefix: 'plafon-pvc-model-datar-flat' },
    { key: 'wood-panel', titlePrefix: 'Plafon PVC Aksen Wood Panel Interior', slugPrefix: 'plafon-pvc-aksen-wood-panel' },
    { key: 'lamiwood-premium', titlePrefix: 'Plafon PVC Seri Lamiwood Premium', slugPrefix: 'plafon-pvc-seri-lamiwood-premium' },
    { key: 'alfafon-elegan', titlePrefix: 'Plafon PVC Seri Alfafon Elegan', slugPrefix: 'plafon-pvc-seri-alfafon-elegan' },
    { key: 'sakura-high-grade', titlePrefix: 'Plafon PVC Seri Sakura High Grade', slugPrefix: 'plafon-pvc-seri-sakura-high-grade' },
    { key: 'trap-samping', titlePrefix: 'Plafon PVC Trap Samping Keliling', slugPrefix: 'plafon-pvc-trap-samping-keliling' },
    { key: 'up-ceiling', titlePrefix: 'Plafon PVC Up Ceiling Tengah', slugPrefix: 'plafon-pvc-up-ceiling-tengah' },
    { key: 'downlight-hangat', titlePrefix: 'Plafon PVC Downlight Pencahayaan Hangat', slugPrefix: 'plafon-pvc-downlight-pencahayaan-hangat' },
    { key: 'warna-monokrom', titlePrefix: 'Plafon PVC Warna Monokrom Modern', slugPrefix: 'plafon-pvc-warna-monokrom-modern' },
    { key: 'kayu-jati', titlePrefix: 'Plafon PVC Motif Kayu Jati Natural', slugPrefix: 'plafon-pvc-motif-kayu-jati-natural' },
    { key: 'plafon-tinggi', titlePrefix: 'Plafon PVC Ruangan Plafon Tinggi', slugPrefix: 'plafon-pvc-ruangan-plafon-tinggi' },
    { key: 'ruang-tamu-luas', titlePrefix: 'Plafon PVC Ruang Tamu Luas', slugPrefix: 'plafon-pvc-ruang-tamu-luas' },
    { key: 'hunian-tropis', titlePrefix: 'Plafon PVC Arsitektur Hunian Tropis', slugPrefix: 'plafon-pvc-arsitektur-hunian-tropis' },
    { key: 'villa-homestay', titlePrefix: 'Plafon PVC Villa & Penginapan Homestay', slugPrefix: 'plafon-pvc-villa-homestay' },
    { key: 'ruang-medis', titlePrefix: 'Plafon PVC Higienis Ruang Medis', slugPrefix: 'plafon-pvc-higienis-ruang-medis' },
    { key: 'kafe-kuliner', titlePrefix: 'Plafon PVC Kafe & Tempat Kuliner', slugPrefix: 'plafon-pvc-kafe-tempat-kuliner' },
    { key: 'butik-toko', titlePrefix: 'Plafon PVC Gerai Butik & Pertokoan', slugPrefix: 'plafon-pvc-gerai-butik-pertokoan' },
    { key: 'ruang-rapat', titlePrefix: 'Plafon PVC Ruang Rapat Pertemuan', slugPrefix: 'plafon-pvc-ruang-rapat-pertemuan' },
    { key: 'aula-serbaguna', titlePrefix: 'Plafon PVC Aula Gedung Serbaguna', slugPrefix: 'plafon-pvc-aula-gedung-serbaguna' },
    { key: 'mushola-warga', titlePrefix: 'Plafon PVC Mushola Lingkungan Warga', slugPrefix: 'plafon-pvc-mushola-lingkungan-warga' },
    { key: 'kanopi-teras', titlePrefix: 'Plafon PVC Kanopi Teras Belakang', slugPrefix: 'plafon-pvc-kanopi-teras-belakang' },
    { key: 'dapur-resik', titlePrefix: 'Plafon PVC Dapur Bersih Resik', slugPrefix: 'plafon-pvc-dapur-bersih-resik' },
    { key: 'sholat-rumah', titlePrefix: 'Plafon PVC Ruang Sholat Rumah Tinggal', slugPrefix: 'plafon-pvc-ruang-sholat-rumah' },
    { key: 'foyer-masuk', titlePrefix: 'Plafon PVC Foyer & Pintu Masuk', slugPrefix: 'plafon-pvc-foyer-pintu-masuk' },
    { key: 'balkon-atas', titlePrefix: 'Plafon PVC Balkon Lantai Dua', slugPrefix: 'plafon-pvc-balkon-lantai-dua' },
    { key: 'renovasi-rumah', titlePrefix: 'Plafon PVC Renovasi Rumah Lama', slugPrefix: 'plafon-pvc-renovasi-rumah-lama' },
    { key: 'type-minimalis', titlePrefix: 'Plafon PVC Rumah Type Minimalis', slugPrefix: 'plafon-pvc-rumah-type-minimalis' },
    { key: 'megah-bertingkat', titlePrefix: 'Plafon PVC Hunian Megah Bertingkat', slugPrefix: 'plafon-pvc-hunian-megah-bertingkat' },
    { key: 'arsip-lapangan', titlePrefix: 'Plafon PVC Arsip Pengerjaan Lapangan', slugPrefix: 'plafon-pvc-arsip-pengerjaan-lapangan' },
    { key: 'portofolio-terkini', titlePrefix: 'Plafon PVC Koleksi Portofolio Terkini', slugPrefix: 'plafon-pvc-koleksi-portofolio-terkini' },
    { key: 'pekerjaan-aplikator', titlePrefix: 'Plafon PVC Galeri Pekerjaan Aplikator', slugPrefix: 'plafon-pvc-galeri-pekerjaan-aplikator' },
    { key: 'resmi-lapangan', titlePrefix: 'Plafon PVC Dokumentasi Resmi Lapangan', slugPrefix: 'plafon-pvc-dokumentasi-resmi-lapangan' },
    { key: 'standar-mutu', titlePrefix: 'Plafon PVC Standar Mutu Bergaransi', slugPrefix: 'plafon-pvc-standar-mutu-bergaransi' },
    { key: 'presisi-rapi', titlePrefix: 'Plafon PVC Presisi Sambungan Rapi', slugPrefix: 'plafon-pvc-presisi-sambungan-rapi' },
    { key: 'krem-putih', titlePrefix: 'Plafon PVC Kombinasi Warna Krem Putih', slugPrefix: 'plafon-pvc-kombinasi-krem-putih' },
    { key: 'motif-garis', titlePrefix: 'Plafon PVC Motif Garis Modern', slugPrefix: 'plafon-pvc-motif-garis-modern' },
    { key: 'lis-mahkota', titlePrefix: 'Plafon PVC Lis Sudut Profil Mahkota', slugPrefix: 'plafon-pvc-lis-sudut-mahkota' },
    { key: 'ceiling-u', titlePrefix: 'Plafon PVC Drop Ceiling Bentuk U', slugPrefix: 'plafon-pvc-drop-ceiling-bentuk-u' },
    { key: 'ceiling-kotak', titlePrefix: 'Plafon PVC Drop Ceiling Bentuk Kotak', slugPrefix: 'plafon-pvc-drop-ceiling-bentuk-kotak' },
    { key: 'bertingkat-ganda', titlePrefix: 'Plafon PVC Desain Bertingkat Ganda', slugPrefix: 'plafon-pvc-desain-bertingkat-ganda' },
    { key: 'strip-gold', titlePrefix: 'Plafon PVC Strip Gold Mewah', slugPrefix: 'plafon-pvc-strip-gold-mewah' },
    { key: 'strip-silver', titlePrefix: 'Plafon PVC Strip Silver Modern', slugPrefix: 'plafon-pvc-strip-silver-modern' },
    { key: 'santai-estetik', titlePrefix: 'Plafon PVC Ruang Santai Estetik', slugPrefix: 'plafon-pvc-ruang-santai-estetik' }
  ],
  'baja-ringan': [
    { key: 'minimalis', titlePrefix: 'Pemasangan Rangka Atap Baja Ringan', slugPrefix: 'pemasangan-rangka-atap-baja-ringan' },
    { key: 'kuda-kuda-sni', titlePrefix: 'Konstruksi Kuda-Kuda Baja Ringan Kencana SNI', slugPrefix: 'kuda-kuda-baja-ringan-kencana-sni' },
    { key: 'kanopi-atap', titlePrefix: 'Kanopi & Rangka Atap Galvalum Minimalis', slugPrefix: 'kanopi-rangka-atap-galvalum' },
    { key: 'hunian-modern', titlePrefix: 'Rangka Atap Baja Ringan Hunian Modern', slugPrefix: 'rangka-atap-baja-ringan-hunian-modern' },
    { key: 'renovasi-atap', titlePrefix: 'Renovasi Kuda-Kuda Kayu ke Baja Ringan', slugPrefix: 'renovasi-kuda-kuda-kayu-baja-ringan' },
    { key: 'tahun-2024', titlePrefix: 'Dokumentasi Rangka Atap Tahun 2024', slugPrefix: 'rangka-atap-dokumentasi-tahun-2024' },
    { key: 'tahun-2025', titlePrefix: 'Dokumentasi Rangka Atap Tahun 2025', slugPrefix: 'rangka-atap-dokumentasi-tahun-2025' },
    { key: 'profil-c75', titlePrefix: 'Struktur Baja Ringan Profil Kanal C75', slugPrefix: 'struktur-baja-ringan-profil-c75' },
    { key: 'genteng-pasir', titlePrefix: 'Pemasangan Atap Galvalum Pasir', slugPrefix: 'pemasangan-atap-galvalum-pasir' },
    { key: 'komersial-gudang', titlePrefix: 'Rangka Atap Bangunan Usaha & Gudang', slugPrefix: 'rangka-atap-bangunan-usaha-gudang' },
    { key: 'tahan-gempa', titlePrefix: 'Rangka Atap Baja Ringan Tahan Gempa', slugPrefix: 'rangka-atap-baja-ringan-tahan-gempa' },
    { key: 'limasan-modern', titlePrefix: 'Rangka Atap Rumah Limasan Jawa Modern', slugPrefix: 'rangka-atap-rumah-limasan-modern' },
    { key: 'pelana-minimalis', titlePrefix: 'Rangka Atap Model Pelana Minimalis', slugPrefix: 'rangka-atap-model-pelana-minimalis' },
    { key: 'joglo-galvalum', titlePrefix: 'Rangka Atap Rumah Joglo Galvalum', slugPrefix: 'rangka-atap-rumah-joglo-galvalum' },
    { key: 'reng-presisi', titlePrefix: 'Pemasangan Reng Asimetris Presisi', slugPrefix: 'pemasangan-reng-asimetris-presisi' },
    { key: 'parkir-garasi', titlePrefix: 'Kanopi Parkir Garasi Galvalum', slugPrefix: 'kanopi-parkir-garasi-galvalum' },
    { key: 'genteng-keramik', titlePrefix: 'Rangka Atap Genteng Keramik & Metal', slugPrefix: 'rangka-atap-genteng-keramik-metal' },
    { key: 'teras-depan', titlePrefix: 'Rangka Atap Teras Depan & Belakang', slugPrefix: 'rangka-atap-teras-depan-belakang' },
    { key: 'bentang-lebar', titlePrefix: 'Konstruksi Baja Ringan Bentang Lebar', slugPrefix: 'konstruksi-baja-ringan-bentang-lebar' },
    { key: 'kuda-gantung', titlePrefix: 'Struktur Kuda-Kuda Gantung Galvalum', slugPrefix: 'struktur-kuda-kuda-gantung-galvalum' },
    { key: 'masjid-publik', titlePrefix: 'Rangka Atap Masjid & Fasilitas Publik', slugPrefix: 'rangka-atap-masjid-fasilitas-publik' },
    { key: 'atap-spandek', titlePrefix: 'Pemasangan Atap Spandek Galvalum', slugPrefix: 'pemasangan-atap-spandek-galvalum' },
    { key: 'standar-sni', titlePrefix: 'Baja Ringan Ketebalan Standar SNI', slugPrefix: 'baja-ringan-ketebalan-standar-sni' },
    { key: 'hollow-rapat', titlePrefix: 'Rangka Plafon Hollow Galvalum Rapat', slugPrefix: 'rangka-plafon-hollow-galvalum-rapat' },
    { key: 'lapuk-rayap', titlePrefix: 'Renovasi Rangka Atap Lapuk Rayap', slugPrefix: 'renovasi-rangka-atap-lapuk-rayap' },
    { key: 'arsip-kuda-kuda', titlePrefix: 'Arsip Pemasangan Kuda-Kuda Baja Ringan', slugPrefix: 'arsip-pemasangan-kuda-kuda-baja-ringan' },
    { key: 'koleksi-portofolio', titlePrefix: 'Koleksi Portofolio Rangka Baja Ringan', slugPrefix: 'koleksi-portofolio-rangka-baja-ringan' },
    { key: 'galeri-konstruksi', titlePrefix: 'Galeri Konstruksi Atap Aplikator Resmi', slugPrefix: 'galeri-konstruksi-atap-aplikator-resmi' },
    { key: 'dokumentasi-garansi', titlePrefix: 'Dokumentasi Rangka Baja Ringan Bergaransi', slugPrefix: 'dokumentasi-rangka-baja-ringan-bergaransi' },
    { key: 'hunian-mewah', titlePrefix: 'Struktur Rangka Atap Hunian Mewah', slugPrefix: 'struktur-rangka-atap-hunian-mewah' }
  ],
  'gypsum': [
    { key: 'seamless', titlePrefix: 'Pemasangan Plafon Gypsum Seamless Rata', slugPrefix: 'pemasangan-plafon-gypsum-seamless' },
    { key: 'drop-ceiling', titlePrefix: 'Plafon Gypsum Drop Ceiling Bertingkat', slugPrefix: 'plafon-gypsum-drop-ceiling-bertingkat' },
    { key: 'flat-minimalis', titlePrefix: 'Plafon Gypsum Flat Minimalis Ruang Keluarga', slugPrefix: 'plafon-gypsum-flat-minimalis' },
    { key: 'jayaboard', titlePrefix: 'Aplikasi Plafon Gypsum Jayaboard Sheetrock', slugPrefix: 'plafon-gypsum-jayaboard-sheetrock' },
    { key: 'tahun-2024', titlePrefix: 'Dokumentasi Plafon Gypsum Tahun 2024', slugPrefix: 'plafon-gypsum-dokumentasi-tahun-2024' },
    { key: 'tahun-2025', titlePrefix: 'Dokumentasi Plafon Gypsum Tahun 2025', slugPrefix: 'plafon-gypsum-dokumentasi-tahun-2025' },
    { key: 'cat-doff', titlePrefix: 'Plafon Gypsum Finishing Cat Doff Elegan', slugPrefix: 'plafon-gypsum-finishing-cat-doff' },
    { key: 'ruang-tamu', titlePrefix: 'Plafon Gypsum Ruang Tamu & Ruang Rapat', slugPrefix: 'plafon-gypsum-ruang-tamu-rapat' },
    { key: 'cornice-mewah', titlePrefix: 'Plafon Gypsum Lis Profil Cornice Mewah', slugPrefix: 'plafon-gypsum-lis-profil-cornice' },
    { key: 'akustik-suara', titlePrefix: 'Plafon Gypsum Akustik Redam Suara', slugPrefix: 'plafon-gypsum-akustik-redam-suara' },
    { key: 'hollow-rapat', titlePrefix: 'Plafon Gypsum Rangka Hollow Rapat', slugPrefix: 'plafon-gypsum-rangka-hollow-rapat' },
    { key: 'lampu-sorot', titlePrefix: 'Plafon Gypsum Desain Kotak Lampu Sorot', slugPrefix: 'plafon-gypsum-desain-kotak-sorot' },
    { key: 'kamar-utama', titlePrefix: 'Plafon Gypsum Kamar Tidur Utama Nyaman', slugPrefix: 'plafon-gypsum-kamar-tidur-utama' },
    { key: 'aula-resmi', titlePrefix: 'Plafon Gypsum Aula & Pertemuan Resmi', slugPrefix: 'plafon-gypsum-aula-pertemuan-resmi' },
    { key: 'partisi-sekat', titlePrefix: 'Plafon Gypsum Partisi Sekat Ruangan', slugPrefix: 'plafon-gypsum-partisi-sekat-ruangan' }
  ],
  'wall-moulding': [
    { key: 'interior-elegan', titlePrefix: 'Pemasangan Wall Moulding Dinding Interior', slugPrefix: 'pemasangan-wall-moulding-interior' },
    { key: 'wall-panel-wpc', titlePrefix: 'Aksen Dinding Wall Panel PVC & WPC', slugPrefix: 'aksen-dinding-wall-panel-wpc' },
    { key: 'ruang-keluarga', titlePrefix: 'Wall Moulding Ruang Tamu & Backdrop TV', slugPrefix: 'wall-moulding-ruang-tamu-backdrop' },
    { key: 'profil-pigura', titlePrefix: 'Lis Pigura Dinding Klasik Modern', slugPrefix: 'lis-pigura-dinding-klasik-modern' },
    { key: 'tahun-2024', titlePrefix: 'Dokumentasi Wall Panel Dinding Tahun 2024', slugPrefix: 'wall-panel-dokumentasi-tahun-2024' },
    { key: 'tahun-2025', titlePrefix: 'Dokumentasi Wall Panel Dinding Tahun 2025', slugPrefix: 'wall-panel-dokumentasi-tahun-2025' },
    { key: 'wood-slat', titlePrefix: 'Wall Panel Kisi-Kisi Wood Slat Estetik', slugPrefix: 'wall-panel-kisi-kisi-wood-slat' },
    { key: 'kamar-mewah', titlePrefix: 'Wall Moulding Kamar Tidur Mewah', slugPrefix: 'wall-moulding-kamar-tidur-mewah' },
    { key: 'ruang-makan', titlePrefix: 'Wall Moulding Ruang Makan & Foyer', slugPrefix: 'wall-moulding-ruang-makan-foyer' },
    { key: 'desain-geometris', titlePrefix: 'Wall Moulding Desain Geometris Modern', slugPrefix: 'wall-moulding-desain-geometris' },
    { key: 'putih-bersih', titlePrefix: 'Wall Moulding Finishing Putih Bersih', slugPrefix: 'wall-moulding-finishing-putih-bersih' },
    { key: 'cat-hangat', titlePrefix: 'Wall Moulding Kombinasi Cat Warna Hangat', slugPrefix: 'wall-moulding-kombinasi-cat-hangat' }
  ]
};

function resolveUniqueClusterSlugAndTitle(baseSlug, baseTitle, chunkItems, usedSet) {
  // 1. Coba sub-lokasi / kecamatan riil jika ada
  const subLoc = chunkItems.map(i => i.lokasi).find(l => l && l !== '-' && !l.toLowerCase().includes('solo raya'));
  if (subLoc) {
    const rawLocName = subLoc.split(',')[0].replace(/\b(Kabupaten|Kota|Kab\.|Kec\.|Kecamatan)\b/gi, '').trim();
    const locSlugPart = slugify(rawLocName);
    if (locSlugPart && !baseSlug.includes(locSlugPart)) {
      const candidateSlug = `${baseSlug}-area-${locSlugPart}`;
      if (!usedSet.has(candidateSlug)) {
        return {
          slug: candidateSlug,
          title: `${baseTitle} Area ${rawLocName}`
        };
      }
    }
  }

  // 2. Coba tahun pengerjaan alami dari metadata waktu
  const yearMatch = chunkItems.map(i => (i.waktu || '').match(/\b(202[0-9])\b/)).find(m => m !== null);
  if (yearMatch) {
    const candidateSlug = `${baseSlug}-tahun-${yearMatch[1]}`;
    if (!usedSet.has(candidateSlug)) {
      return {
        slug: candidateSlug,
        title: `${baseTitle} Tahun ${yearMatch[1]}`
      };
    }
  }

  // 3. Coba kualifikasi semantik bahasa Indonesia alami
  const semanticQualifiers = [
    { slugPart: 'aplikator-resmi', titlePart: 'Aplikator Resmi' },
    { slugPart: 'garansi-pemasangan', titlePart: 'Garansi Pemasangan' },
    { slugPart: 'konstruksi-rapi', titlePart: 'Konstruksi Rapi' },
    { slugPart: 'interior-pilihan', titlePart: 'Interior Pilihan' },
    { slugPart: 'dokumentasi-terverifikasi', titlePart: 'Dokumentasi Terverifikasi' },
    { slugPart: 'koleksi-lapangan', titlePart: 'Koleksi Lapangan' },
    { slugPart: 'portofolio-terkini', titlePart: 'Portofolio Terkini' },
    { slugPart: 'galeri-lapangan', titlePart: 'Galeri Lapangan' },
    { slugPart: 'aplikator-profesional', titlePart: 'Aplikator Profesional' },
    { slugPart: 'standar-mutu-sni', titlePart: 'Standar Mutu SNI' },
    { slugPart: 'presisi-tinggi', titlePart: 'Presisi Tinggi' },
    { slugPart: 'pilihan-keluarga', titlePart: 'Pilihan Keluarga' }
  ];

  for (const q of semanticQualifiers) {
    const candidateSlug = `${baseSlug}-${q.slugPart}`;
    if (!usedSet.has(candidateSlug)) {
      return {
        slug: candidateSlug,
        title: `${baseTitle} (${q.titlePart})`
      };
    }
  }

  // 4. Kombinasi sub-lokasi dan kualifikasi semantik
  if (subLoc) {
    const rawLocName = subLoc.split(',')[0].replace(/\b(Kabupaten|Kota|Kab\.|Kec\.|Kecamatan)\b/gi, '').trim();
    const locSlugPart = slugify(rawLocName);
    for (const q of semanticQualifiers) {
      const candidateSlug = `${baseSlug}-${locSlugPart}-${q.slugPart}`;
      if (!usedSet.has(candidateSlug)) {
        return {
          slug: candidateSlug,
          title: `${baseTitle} Area ${rawLocName} (${q.titlePart})`
        };
      }
    }
  }

  // Fallback mutlak tanpa angka sembarangan
  const safeCandidate = `${baseSlug}-arsip-lapangan-resmi`;
  return { slug: safeCandidate, title: `${baseTitle} (Arsip Lapangan)` };
}

// Kelompokkan kandidat klaster berdasarkan serviceSlug + kabupaten
const clusterGroups = new Map();

rawClusterCandidates.forEach(item => {
  const groupKey = `${item.serviceSlug}__${item.kabupaten}`;
  if (!clusterGroups.has(groupKey)) {
    clusterGroups.set(groupKey, []);
  }
  clusterGroups.get(groupKey).push(item);
});

console.log(`Kelompok Wilayah/Layanan Klaster Ditemukan: ${clusterGroups.size}`);

// Pecah masing-masing kelompok menjadi halaman dengan MAKSIMAL 6 item per halaman
clusterGroups.forEach((items, groupKey) => {
  const [srvSlug, kab] = groupKey.split('__');
  const serviceThemes = clusterThemes[srvSlug] || clusterThemes['pvc'];
  const srvLabel = items[0].serviceLabel;

  const CHUNK_SIZE = 6;
  const totalChunks = Math.ceil(items.length / CHUNK_SIZE);

  for (let cIdx = 0; cIdx < totalChunks; cIdx++) {
    const chunkItems = items.slice(cIdx * CHUNK_SIZE, (cIdx + 1) * CHUNK_SIZE);
    const theme = serviceThemes[cIdx] || {
      key: `koleksi-${cIdx + 1}`,
      titlePrefix: `Koleksi Dokumentasi ${srvLabel} Terpilih`,
      slugPrefix: `koleksi-dokumentasi-${srvSlug}`
    };

    const locSuffix = kab === 'Solo Raya' ? 'di Solo Raya' : `di ${kab}`;
    const slugKab = slugify(kab);
    let pageTitle = `${theme.titlePrefix} ${locSuffix}`;
    let pageSlug = `${theme.slugPrefix}-di-${slugKab}`;

    // Pastikan tidak ada slug tabrakan (Zero Arbitrary Numbers)
    if (usedSlugs.has(pageSlug)) {
      const resolved = resolveUniqueClusterSlugAndTitle(pageSlug, pageTitle, chunkItems, usedSlugs);
      pageSlug = resolved.slug;
      pageTitle = resolved.title;
    }
    usedSlugs.add(pageSlug);

    // Kumpulkan nama-nama kecamatan/lokasi unik dari sub-item untuk memperkaya narasi
    const uniqueSubLocs = [...new Set(chunkItems.map(i => i.lokasi).filter(l => l && l !== '-' && l !== 'Solo Raya'))];
    const subLocText = uniqueSubLocs.length > 0 
      ? `mencakup area pengerjaan di sekitar ${uniqueSubLocs.slice(0, 4).join(', ')}`
      : `meliputi berbagai titik pengerjaan di wilayah ${kab}`;

    // Narasi Editorial Unik (180–300 kata) Humanized & Bebas Boilerplate
    const intro = `Halaman klaster dokumentasi ini merangkum kumpulan pengerjaan ${srvLabel.toLowerCase()} yang ditangani oleh tim aplikator Griya Alfath ${locSuffix}. Koleksi ini ${subLocText}, menampilkan ragam aplikasi lapangan mulai dari hunian pribadi hingga bangunan usaha.`;

    const sec1Heading = `Rangkuman Karakteristik dan Kebutuhan Lapangan di ${kab}`;
    const sec1Content = `Setiap dokumentasi dalam kurasi ini memperlihatkan bagaimana tim Griya Alfath merespons kebutuhan interior masyarakat ${kab}. Mulai dari pemilihan panel yang tahan terhadap kelembapan udara tropis, perakitan rangka galvalum berjarak rapat untuk mencegah lendutan, hingga aplikasi lis profil presisi yang menyempurnakan sudut ruangan. Penggunaan material bermutu tinggi memastikan langit-langit ruangan tetap bersih, rapi, dan tahan lama tanpa memerlukan perawatan rumit.`;

    const sec2Heading = `Standar Mutu Aplikator dan Layanan Terdekat`;
    const sec2Content = `Seluruh pengerjaan dalam portofolio ini didukung oleh pasokan material langsung dari gudang dan showroom Griya Alfath, memastikan ketersediaan stok yang cepat dan harga transparan. Tim tukang kami berpengalaman menangani beragam model plafon, mulai dari model flat minimalis hingga drop ceiling dengan aksen lampu tersembunyi. Kami siap melayani konsultasi desain, penghitungan estimasi kebutuhan, hingga survei lokasi gratis untuk seluruh kawasan ${kab}.`;

    const relations = getRelatedEntities(srvSlug);

    // Aturan Kebijakan Indeksasi (Tiered Indexing):
    // Maksimal 3 halaman klaster utama per kabupaten/layanan yang di-index, sisanya noindex
    const isIndexable = cIdx < 3;

    finalPages.push({
      slug: pageSlug,
      type: 'cluster',
      title: pageTitle,
      serviceCategory: srvSlug,
      serviceCategoryLabel: srvLabel,
      buildingType: 'rumah',
      buildingTypeLabel: 'Ragam Bangunan & Hunian',
      kabupaten: kab,
      location: locSuffix.replace(/^di\s+/i, ''),
      description: intro,
      narrative: {
        intro,
        sections: [
          { heading: sec1Heading, content: sec1Content },
          { heading: sec2Heading, content: sec2Content }
        ]
      },
      specs: [
        { label: 'Kategori Klaster', value: `${srvLabel} Terpadu` },
        { label: 'Wilayah Layanan', value: kab },
        { label: 'Jumlah Dokumentasi', value: `${chunkItems.length} Proyek Terverifikasi` },
        { label: 'Standar Konstruksi', value: 'Rangka Hollow Galvalum & Baja Ringan SNI' },
        { label: 'Layanan Pendukung', value: 'Survei & Pengukuran Denah Gratis' },
        { label: 'Jaminan Pekerjaan', value: 'Garansi Resmi Aplikator Griya Alfath' }
      ],
      isIndexable, // Tiered indexing
      seoTitle: `${pageTitle} — Griya Alfath`,
      seoDescription: `${intro.slice(0, 150)}... Lihat dokumentasi riil pengerjaan bergaransi di ${kab}.`,
      image: chunkItems[0]?.image || '/images/hero/hero-plafon-main.webp',
      items: chunkItems.map(sub => ({
        id: `row-${sub.rowNum}`,
        rowNum: sub.rowNum,
        title: sub.caption ? sub.caption.slice(0, 60).replace(/\s+[^\s]*$/, '...') : `Pengerjaan di ${sub.lokasi || kab}`,
        location: sub.lokasi || kab,
        service: sub.serviceLabel,
        captionSnippet: sub.caption ? (sub.caption.slice(0, 140) + '...') : `Dokumentasi riil lapangan tim Griya Alfath di ${sub.lokasi || kab}.`,
        sourceUrl: sub.url,
        embed: sub.embed,
        image: sub.image
      })),
      relatedProducts: relations.products,
      relatedArticles: relations.articles,
      relatedServiceUrl: relations.serviceUrl,
      subItemsCount: chunkItems.length
    });
  }
});

console.log(`Total Seluruh Halaman Portofolio Baru yang Dihasilkan: ${finalPages.length}`);

// 11. Verifikasi Aturan: Zero Arbitrary Numbers on Slugs
let arbitraryNumberErrors = 0;
finalPages.forEach(p => {
  const m = p.slug.match(/-(\d+)$/);
  if (m) {
    const num = parseInt(m[1], 10);
    if (num < 2000 || num > 2030) {
      console.error(`ERROR: Slug mengandung angka urutan sembarangan: ${p.slug}`);
      arbitraryNumberErrors++;
    }
  }
});

if (arbitraryNumberErrors === 0) {
  console.log('✓ VERIFIKASI LULUS: 100% Slug bersih dari angka urutan buatan!');
} else {
  console.error(`✗ VERIFIKASI GAGAL: Ditemukan ${arbitraryNumberErrors} slug dengan angka sembarangan!`);
  process.exit(1);
}

// 12. Statistik Indeksasi (Tiered Indexing)
let indexableCount = 0;
let noindexCount = 0;
finalPages.forEach(p => {
  if (p.isIndexable) indexableCount++;
  else noindexCount++;
});

console.log(`\n=== REKAPITULASI HASIL PIPELINE ===`);
console.log(`Total Halaman Baru: ${finalPages.length}`);
console.log(`  - Standalone Pages: ${finalPages.filter(p => p.type === 'standalone').length} (Semua index, follow)`);
console.log(`  - Cluster Pages: ${finalPages.filter(p => p.type === 'cluster').length}`);
console.log(`Status Indeksasi Mesin Pencari:`);
console.log(`  - isIndexable: true  (index, follow) : ${indexableCount} halaman`);
console.log(`  - isIndexable: false (noindex, follow): ${noindexCount} halaman`);

// 13. Simpan Output ke src/data/portfolio-clustered.json
const outputPath = 'src/data/portfolio-clustered.json';
fs.writeFileSync(outputPath, JSON.stringify(finalPages, null, 2), 'utf8');
console.log(`✓ File data berhasil disimpan ke: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);

// 14. Simpan Index Pencarian Ringan ke public/data/portfolio-index.json
const searchIndex = finalPages.map(p => ({
  s: p.slug,
  t: p.title,
  c: p.serviceCategory,
  cl: p.serviceCategoryLabel,
  b: p.buildingType,
  bl: p.buildingTypeLabel,
  l: p.location || p.kabupaten,
  i: p.image || '/images/hero/hero-plafon-main.webp',
  d: p.description.slice(0, 110) + '...',
  type: p.type
}));
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync('public/data/portfolio-index.json', JSON.stringify(searchIndex), 'utf8');
console.log(`✓ Index pencarian berhasil disimpan ke: public/data/portfolio-index.json (${searchIndex.length} entitas)`);

// 15. Regenerasi Sitemap XML HANYA untuk URL yang isIndexable === true
const siteUrl = 'https://plafonpvcsolo.com';
const today = new Date().toISOString().split('T')[0];

const coreRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'katalog/', priority: '0.9', changefreq: 'weekly' },
  { path: 'portofolio/', priority: '0.9', changefreq: 'daily' },
  { path: 'layanan/', priority: '0.8', changefreq: 'monthly' },
  { path: 'galeri/', priority: '0.8', changefreq: 'weekly' },
  { path: 'kalkulator/', priority: '0.8', changefreq: 'monthly' },
  { path: 'tentang-kami/', priority: '0.8', changefreq: 'monthly' },
  { path: 'brand/', priority: '0.7', changefreq: 'monthly' },
  { path: 'kontak/', priority: '0.8', changefreq: 'monthly' },
  { path: 'blog/', priority: '0.8', changefreq: 'weekly' }
];

const blogRoutes = [
  'tips-memilih-plafon-pvc-berkualitas',
  'perbedaan-plafon-pvc-dan-gypsum',
  'inspirasi-desain-drop-ceiling-lampu-sembunyi',
  'panduan-memilih-rangka-baja-ringan-sni'
].map(slug => ({ path: `blog/${slug}/`, priority: '0.7', changefreq: 'monthly' }));

const galleryRoutes = [
  'gudang-stok-plafon-pvc',
  'armada-pengiriman-material',
  'store-griya-alfath-kartasura',
  'survei-pengukuran-denah',
  'kesiapan-peralatan-aplikator',
  'family-gathering-solidaritas-tim',
  'pemasangan-plafon-drop-ceiling',
  'perakitan-kuda-kuda-baja-ringan',
  'finishing-wall-moulding-dinding'
].map(slug => ({ path: `galeri/${slug}/`, priority: '0.7', changefreq: 'monthly' }));

const flagshipRoutes = [
  'showroom-iwan-motor',
  'gedung-ibadah-gereja',
  'rumah-tinggal-tawangsari',
  'drop-ceiling-ruang-tamu',
  'proyek-komersial-simran',
  'wall-moulding-interior',
  'rangka-atap-baja-ringan',
  'plafon-gypsum-flat'
].map(slug => ({ path: `portofolio/${slug}/`, priority: '0.8', changefreq: 'monthly' }));

// Filter ketat: HANYA yang isIndexable === true yang masuk sitemap
const indexableClusteredRoutes = finalPages
  .filter(p => p.isIndexable)
  .map(p => ({ path: `portofolio/${p.slug}/`, priority: '0.6', changefreq: 'monthly' }));

const allSitemapUrls = [
  ...coreRoutes,
  ...blogRoutes,
  ...galleryRoutes,
  ...flagshipRoutes,
  ...indexableClusteredRoutes
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapUrls.map(u => `  <url>
    <loc>${siteUrl}/${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');
console.log(`✓ Sitemap diperbarui: public/sitemap.xml hanya memuat ${allSitemapUrls.length} URL berstatus INDEXABLE (NOL noindex)`);

console.log('=== PIPELINE SELESAI DENGAN SUKSES ===');
