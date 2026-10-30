// Unit factors to a base unit (exact international definitions). Temperature uses functions.
const u = (vi, en, f) => ({ name: { vi, en }, f });
export const UNITS = {
  length: {
    icon: '📏', name: { vi: 'Độ dài', en: 'Length' }, pair: ['cm', 'in'],
    units: { mm: u('Milimét (mm)', 'Millimeters (mm)', 0.001), cm: u('Xentimét (cm)', 'Centimeters (cm)', 0.01), m: u('Mét (m)', 'Meters (m)', 1), km: u('Kilômét (km)', 'Kilometers (km)', 1000), in: u('Inch (in)', 'Inches (in)', 0.0254), ft: u('Foot (ft)', 'Feet (ft)', 0.3048), ftin: u('Feet + inch', 'Feet + inches', 0.3048), yd: u('Yard', 'Yards', 0.9144), mi: u('Dặm (mile)', 'Miles', 1609.344) }
  },
  weight: {
    icon: '⚖️', name: { vi: 'Khối lượng', en: 'Weight' }, pair: ['kg', 'lb'],
    units: { g: u('Gam (g)', 'Grams (g)', 0.001), kg: u('Kilôgam (kg)', 'Kilograms (kg)', 1), lb: u('Pound (lb)', 'Pounds (lb)', 0.45359237), oz: u('Ounce (oz)', 'Ounces (oz)', 0.028349523125), st: u('Stone', 'Stone', 6.35029318), t: u('Tấn', 'Metric tons', 1000) }
  },
  temp: {
    icon: '🌡️', name: { vi: 'Nhiệt độ', en: 'Temperature' }, pair: ['f', 'c'],
    units: { c: u('Độ C', 'Celsius (°C)', null), f: u('Độ F', 'Fahrenheit (°F)', null), k: u('Kelvin', 'Kelvin (K)', null) }
  },
  volume: {
    icon: '🧪', name: { vi: 'Thể tích', en: 'Volume' }, pair: ['l', 'gal'],
    units: { ml: u('Mililít (ml)', 'Milliliters (ml)', 0.001), l: u('Lít (l)', 'Liters (l)', 1), gal: u('Gallon (Mỹ)', 'US gallons', 3.785411784), qt: u('Quart (Mỹ)', 'US quarts', 0.946352946), cup: u('Cup (Mỹ)', 'US cups', 0.2365882365), floz: u('Fl oz (Mỹ)', 'US fl oz', 0.0295735295625) }
  },
  area: {
    icon: '📐', name: { vi: 'Diện tích', en: 'Area' }, pair: ['m2', 'ft2'],
    units: { m2: u('Mét vuông (m²)', 'Square meters', 1), ft2: u('Feet vuông (ft²)', 'Square feet', 0.09290304), ha: u('Héc-ta', 'Hectares', 10000), acre: u('Mẫu Anh (acre)', 'Acres', 4046.8564224), km2: u('Km²', 'Square km', 1e6) }
  },
  speed: {
    icon: '🚗', name: { vi: 'Tốc độ', en: 'Speed' }, pair: ['kmh', 'mph'],
    units: { kmh: u('km/h', 'km/h', 1 / 3.6), mph: u('mph', 'mph', 0.44704), ms: u('m/s', 'm/s', 1), kn: u('Hải lý/giờ', 'Knots', 1852 / 3600) }
  }
};

const toC = { c: (x) => x, f: (x) => (x - 32) * 5 / 9, k: (x) => x - 273.15 };
const fromC = { c: (x) => x, f: (x) => x * 9 / 5 + 32, k: (x) => x + 273.15 };

export function convert(cat, value, from, to) {
  if (cat === 'temp') return fromC[to](toC[from](value));
  const U = UNITS[cat].units;
  return (value * U[from].f) / U[to].f;
}
