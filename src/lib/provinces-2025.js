// Province merger under Nghị quyết 202/2025/QH15 (in force 12/06/2025; new authorities from 01/07/2025).
// Source: baochinhphu.vn. Key = new province; value = former provinces merged into it.
export const MERGED = {
  'Tuyên Quang': ['Hà Giang', 'Tuyên Quang'],
  'Lào Cai': ['Yên Bái', 'Lào Cai'],
  'Thái Nguyên': ['Bắc Kạn', 'Thái Nguyên'],
  'Phú Thọ': ['Vĩnh Phúc', 'Hòa Bình', 'Phú Thọ'],
  'Bắc Ninh': ['Bắc Giang', 'Bắc Ninh'],
  'Hưng Yên': ['Thái Bình', 'Hưng Yên'],
  'TP. Hải Phòng': ['Hải Phòng', 'Hải Dương'],
  'Ninh Bình': ['Hà Nam', 'Nam Định', 'Ninh Bình'],
  'Quảng Trị': ['Quảng Bình', 'Quảng Trị'],
  'TP. Đà Nẵng': ['Đà Nẵng', 'Quảng Nam'],
  'Quảng Ngãi': ['Kon Tum', 'Quảng Ngãi'],
  'Gia Lai': ['Bình Định', 'Gia Lai'],
  'Khánh Hòa': ['Ninh Thuận', 'Khánh Hòa'],
  'Lâm Đồng': ['Đắk Nông', 'Bình Thuận', 'Lâm Đồng'],
  'Đắk Lắk': ['Phú Yên', 'Đắk Lắk'],
  'TP. Hồ Chí Minh': ['TP. Hồ Chí Minh', 'Bà Rịa – Vũng Tàu', 'Bình Dương'],
  'Đồng Nai': ['Bình Phước', 'Đồng Nai'],
  'Tây Ninh': ['Long An', 'Tây Ninh'],
  'TP. Cần Thơ': ['Cần Thơ', 'Sóc Trăng', 'Hậu Giang'],
  'Vĩnh Long': ['Bến Tre', 'Trà Vinh', 'Vĩnh Long'],
  'Đồng Tháp': ['Tiền Giang', 'Đồng Tháp'],
  'Cà Mau': ['Bạc Liêu', 'Cà Mau'],
  'An Giang': ['Kiên Giang', 'An Giang']
};
export const UNCHANGED = ['TP. Hà Nội', 'TP. Huế', 'Cao Bằng', 'Điện Biên', 'Hà Tĩnh', 'Lai Châu', 'Lạng Sơn', 'Nghệ An', 'Quảng Ninh', 'Thanh Hóa', 'Sơn La'];

export const OLD_TO_NEW = Object.fromEntries([
  ...Object.entries(MERGED).flatMap(([n, olds]) => olds.map((o) => [o, n])),
  ...UNCHANGED.map((u) => [u.replace('TP. ', ''), u])
]);
