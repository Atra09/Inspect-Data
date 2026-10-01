/**
 * Indonesian 16-Digit NIK Intelligent Decoder & Validation Utility
 */

const PROVINSI_MAP = {
  '11': 'ACEH', '12': 'SUMATERA UTARA', '13': 'SUMATERA BARAT', '14': 'RIAU',
  '15': 'JAMBI', '16': 'SUMATERA SELATAN', '17': 'BENGKULU', '18': 'LAMPUNG',
  '19': 'KEPULAUAN BANGKA BELITUNG', '21': 'KEPULAUAN RIAU', '31': 'DKI JAKARTA',
  '32': 'JAWA BARAT', '33': 'JAWA TENGAH', '34': 'DI YOGYAKARTA', '35': 'JAWA TIMUR',
  '36': 'BANTEN', '51': 'BALI', '52': 'NUSA TENGGARA BARAT', '53': 'NUSA TENGGARA TIMUR',
  '61': 'KALIMANTAN BARAT', '62': 'KALIMANTAN TENGAH', '63': 'KALIMANTAN SELATAN',
  '64': 'KALIMANTAN TIMUR', '65': 'KALIMANTAN UTARA', '71': 'SULAWESI UTARA',
  '72': 'SULAWESI TENGAH', '73': 'SULAWESI SELATAN', '74': 'SULAWESI TENGGARA',
  '75': 'GORONTALO', '76': 'SULAWESI BARAT', '81': 'MALUKU', '82': 'MALUKU UTARA',
  '91': 'PAPUA BARAT', '92': 'PAPUA'
};

const KABUPATEN_SPECIAL_MAP = {
  '3529': 'KAB. SUMENEP',
  '3528': 'KAB. PAMEKASAN',
  '3527': 'KAB. SAMPANG',
  '3526': 'KAB. BANGKALAN',
  '3578': 'KOTA SURABAYA',
  '3171': 'KOTA JAKARTA SELATAN',
  '3172': 'KOTA JAKARTA TIMUR',
  '3173': 'KOTA JAKARTA PUSAT',
  '3174': 'KOTA JAKARTA BARAT',
  '3175': 'KOTA JAKARTA UTARA',
};

export function cleanNIK(nikRaw = '') {
  if (!nikRaw) return '';
  let cleaned = String(nikRaw).trim().toUpperCase();
  const charToNumMap = {
    O: '0', D: '0', Q: '0',
    I: '1', L: '1', i: '1', l: '1', '|': '1', '!': '1',
    Z: '2', z: '2', S: '5', s: '5', b: '6', G: '6', B: '8', g: '9', q: '9'
  };
  cleaned = cleaned.replace(/[ODQIILlZzSbGBgq!|]/g, (m) => charToNumMap[m] || m);
  const digitsOnly = cleaned.replace(/\D/g, '');
  return digitsOnly.length >= 16 ? digitsOnly.slice(0, 16) : digitsOnly;
}

export function decodeNIK(nikRaw = '') {
  const nik = String(nikRaw).replace(/\D/g, '');
  if (nik.length < 16) {
    return { isValid: false, message: 'NIK harus 16 angka' };
  }

  const provCode = nik.substring(0, 2);
  const kabCode = nik.substring(0, 4);
  const provNama = PROVINSI_MAP[provCode] || 'INDONESIA';
  const kabNama = KABUPATEN_SPECIAL_MAP[kabCode] || `KAB. KODE ${kabCode}`;

  let tgl = parseInt(nik.substring(6, 8), 10);
  const bln = parseInt(nik.substring(8, 10), 10);
  let thn = parseInt(nik.substring(10, 12), 10);

  let jenisKelamin = 'LAKI-LAKI';

  // Female NIK date is offset by +40
  if (tgl > 40) {
    jenisKelamin = 'PEREMPUAN';
    tgl -= 40;
  }

  // Determine full birth year
  const currentYearTwoDigits = parseInt(new Date().getFullYear().toString().substring(2), 10);
  const fullYear = thn > currentYearTwoDigits ? 1900 + thn : 2000 + thn;

  const tglStr = String(tgl).padStart(2, '0');
  const blnStr = String(bln).padStart(2, '0');
  const tanggalLahir = `${tglStr}-${blnStr}-${fullYear}`;

  return {
    isValid: true,
    nik,
    provinsi: provNama,
    kabupaten: kabNama,
    jenisKelamin,
    tanggalLahir,
    tempatLahir: kabNama.replace('KAB. ', '').replace('KOTA ', '')
  };
}
