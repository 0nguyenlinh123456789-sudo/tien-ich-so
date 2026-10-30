"""Exact calculations – Python ports of src/lib/*.js (salary, loan, numerology, lunar).
Keep in sync with the JS versions so page numbers and AI text always match."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAX = json.loads((ROOT / "src" / "config" / "tax-vn.json").read_text(encoding="utf-8"))
NUM = json.loads((ROOT / "src" / "data" / "numerology.json").read_text(encoding="utf-8"))


def js_round(x: float) -> int:
    """Math.round semantics (Python's round() is banker's rounding)."""
    return math.floor(x + 0.5)


# ---------------------------------------------------------------- salary
def progressive_tax(assessable: float):
    remaining, lower, total, detail = max(0.0, assessable), 0.0, 0.0, []
    for b in TAX["taxBrackets"]:
        upper = math.inf if b["upTo"] is None else b["upTo"]
        portion = min(remaining, upper - lower)
        tax = portion * b["rate"] if portion > 0 else 0.0
        detail.append({"rate": b["rate"], "taxable": max(0.0, portion), "tax": tax})
        total += tax
        remaining -= max(0.0, portion)
        lower = upper
    return total, detail


def gross_to_net(gross: float, dependents: int = 0, region: int = 1, insurance_salary: float = 0, non_taxable: float = 0):
    gross = max(0.0, float(gross))
    ins_base = insurance_salary if insurance_salary and insurance_salary > 0 else gross
    cap_social = TAX["baseSalary"] * TAX["insuranceCapMultiplier"]
    min_wage = TAX["regionalMinWage"].get(str(region), TAX["regionalMinWage"]["1"])
    cap_unemp = min_wage * TAX["insuranceCapMultiplier"]
    bhxh_base = min(ins_base, cap_social)
    bhtn_base = min(ins_base, cap_unemp)
    e, er = TAX["employee"], TAX["employer"]
    bhxh, bhyt, bhtn = js_round(bhxh_base * e["bhxh"]), js_round(bhxh_base * e["bhyt"]), js_round(bhtn_base * e["bhtn"])
    insurance = bhxh + bhyt + bhtn
    employer = (js_round(bhxh_base * er["bhxh"]) + js_round(bhxh_base * er["tnld"])
                + js_round(bhxh_base * er["bhyt"]) + js_round(bhtn_base * er["bhtn"]))
    taxable = max(0.0, gross - max(0.0, non_taxable))
    deduction = TAX["personalDeduction"] + TAX["dependentDeduction"] * max(0, dependents)
    assessable = max(0.0, taxable - insurance - deduction)
    total, detail = progressive_tax(assessable)
    pit = js_round(total)
    net = gross - insurance - pit
    top = max((d["rate"] for d in detail if d["taxable"] > 0), default=0.0)
    return {
        "gross": gross, "net": net, "bhxh": bhxh, "bhyt": bhyt, "bhtn": bhtn, "insurance": insurance,
        "deduction": deduction, "assessable": assessable, "pit": pit, "top_rate": top,
        "employer_insurance": employer, "employer_cost": gross + employer,
        "effective_rate": pit / gross if gross else 0.0, "dependents": dependents,
    }


def net_to_gross(net: float, **kw):
    lo, hi = float(net), float(net) * 2 + 50_000_000
    for _ in range(100):
        mid = (lo + hi) / 2
        if gross_to_net(mid, **kw)["net"] < net:
            lo = mid
        else:
            hi = mid
        if hi - lo < 0.5:
            break
    return gross_to_net(js_round(hi), **kw)


# ---------------------------------------------------------------- loan
def loan_summary(principal: float, annual_rate: float, months: int, method: str):
    r = annual_rate / 100 / 12
    balance, total_interest, total_paid = float(principal), 0.0, 0.0
    first = last = maxp = 0.0
    equal_principal = principal / months
    for m in range(1, months + 1):
        interest = balance * r
        if method == "annuity":
            remaining = months - m + 1
            payment = balance / remaining if r == 0 else balance * r / (1 - (1 + r) ** -remaining)
            principal_part = payment - interest
        else:
            principal_part = min(equal_principal, balance)
            payment = principal_part + interest
        if m == months:
            principal_part = balance
            payment = principal_part + interest
        balance = max(0.0, balance - principal_part)
        total_interest += interest
        total_paid += payment
        if m == 1:
            first = payment
        last = payment
        maxp = max(maxp, payment)
    return {"first": first, "last": last, "max": maxp, "interest": total_interest, "total": total_paid}


# ---------------------------------------------------------------- numerology
MASTER = {11, 22, 33}


def digit_sum(n: int) -> int:
    return sum(int(c) for c in str(abs(int(n))))


def reduce_number(n: int, keep_master: bool = True) -> int:
    n = abs(int(n))
    while n > 9 and not (keep_master and n in MASTER):
        n = digit_sum(n)
    return n


def to_single(n: int) -> int:
    return reduce_number(n, False)


def numerology(day: int, month: int, year: int, target_year: int):
    life_path = reduce_number(digit_sum(day) + digit_sum(month) + digit_sum(year))
    lp1 = to_single(life_path)
    m, d, y = to_single(month), to_single(day), to_single(digit_sum(year))
    p1 = reduce_number(m + d)
    p2 = reduce_number(d + y)
    p3 = reduce_number(to_single(p1) + to_single(p2))
    p4 = reduce_number(m + y)
    age1 = 36 - lp1
    peaks = [(age1 + 9 * i, n) for i, n in enumerate([p1, p2, p3, p4])]
    personal_year = to_single(d + m + to_single(digit_sum(target_year)))
    lucky = list(dict.fromkeys([lp1, to_single(day), personal_year, to_single(life_path + personal_year) or 9]))[:4]
    # Personal months of target year (numerology convention: PY + calendar month)
    pm = {mo: to_single(personal_year + mo) for mo in range(1, 13)}
    best = [mo for mo, v in pm.items() if v in (1, 3, 8)]
    caution = [mo for mo, v in pm.items() if v in (4, 7)]
    return {
        "life_path": life_path, "birthday": reduce_number(day), "attitude": reduce_number(day + month),
        "peaks": peaks, "personal_year": personal_year, "lucky": lucky, "best_months": best, "caution_months": caution,
    }


# ---------------------------------------------------------------- lunar calendar (Hồ Ngọc Đức, GMT+7)
INT = math.floor
CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
CON_GIAP = ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"]
NAP_AM = [
    ("Hải Trung Kim", "Kim"), ("Lư Trung Hỏa", "Hỏa"), ("Đại Lâm Mộc", "Mộc"), ("Lộ Bàng Thổ", "Thổ"), ("Kiếm Phong Kim", "Kim"),
    ("Sơn Đầu Hỏa", "Hỏa"), ("Giản Hạ Thủy", "Thủy"), ("Thành Đầu Thổ", "Thổ"), ("Bạch Lạp Kim", "Kim"), ("Dương Liễu Mộc", "Mộc"),
    ("Tuyền Trung Thủy", "Thủy"), ("Ốc Thượng Thổ", "Thổ"), ("Tích Lịch Hỏa", "Hỏa"), ("Tùng Bách Mộc", "Mộc"), ("Trường Lưu Thủy", "Thủy"),
    ("Sa Trung Kim", "Kim"), ("Sơn Hạ Hỏa", "Hỏa"), ("Bình Địa Mộc", "Mộc"), ("Bích Thượng Thổ", "Thổ"), ("Kim Bạch Kim", "Kim"),
    ("Phú Đăng Hỏa", "Hỏa"), ("Thiên Hà Thủy", "Thủy"), ("Đại Trạch Thổ", "Thổ"), ("Thoa Xuyến Kim", "Kim"), ("Tang Đố Mộc", "Mộc"),
    ("Đại Khê Thủy", "Thủy"), ("Sa Trung Thổ", "Thổ"), ("Thiên Thượng Hỏa", "Hỏa"), ("Thạch Lựu Mộc", "Mộc"), ("Đại Hải Thủy", "Thủy"),
]
ELEMENTS = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"]


def jd_from_date(dd, mm, yy):
    a = INT((14 - mm) / 12)
    y = yy + 4800 - a
    m = mm + 12 * a - 3
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045
    if jd < 2299161:
        jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083
    return jd


def _new_moon(k):
    T = k / 1236.85
    T2, T3 = T * T, T * T * T
    dr = math.pi / 180
    jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
    jd1 += 0.00033 * math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr)
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3
    C1 = (0.1734 - 0.000393 * T) * math.sin(M * dr) + 0.0021 * math.sin(2 * dr * M)
    C1 = C1 - 0.4068 * math.sin(Mpr * dr) + 0.0161 * math.sin(dr * 2 * Mpr)
    C1 = C1 - 0.0004 * math.sin(dr * 3 * Mpr)
    C1 = C1 + 0.0104 * math.sin(dr * 2 * F) - 0.0051 * math.sin(dr * (M + Mpr))
    C1 = C1 - 0.0074 * math.sin(dr * (M - Mpr)) + 0.0004 * math.sin(dr * (2 * F + M))
    C1 = C1 - 0.0004 * math.sin(dr * (2 * F - M)) - 0.0006 * math.sin(dr * (2 * F + Mpr))
    C1 = C1 + 0.001 * math.sin(dr * (2 * F - Mpr)) + 0.0005 * math.sin(dr * (2 * Mpr + M))
    if T < -11:
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    else:
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
    return jd1 + C1 - deltat


def _sun_longitude(jdn):
    T = (jdn - 2451545.0) / 36525
    T2 = T * T
    dr = math.pi / 180
    M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
    DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * math.sin(dr * M)
    DL += (0.019993 - 0.000101 * T) * math.sin(dr * 2 * M) + 0.00029 * math.sin(dr * 3 * M)
    L = (L0 + DL) * dr
    return L - math.pi * 2 * INT(L / (math.pi * 2))


def _sun_long(day, tz):
    return INT(_sun_longitude(day - 0.5 - tz / 24) / math.pi * 6)


def _new_moon_day(k, tz):
    return INT(_new_moon(k) + 0.5 + tz / 24)


def _lunar_month11(yy, tz):
    k = INT((jd_from_date(31, 12, yy) - 2415021) / 29.530588853)
    nm = _new_moon_day(k, tz)
    if _sun_long(nm, tz) >= 9:
        nm = _new_moon_day(k - 1, tz)
    return nm


def _leap_offset(a11, tz):
    k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5)
    i = 1
    arc = _sun_long(_new_moon_day(k + i, tz), tz)
    while True:
        last = arc
        i += 1
        arc = _sun_long(_new_moon_day(k + i, tz), tz)
        if not (arc != last and i < 14):
            break
    return i - 1


def solar_to_lunar(dd, mm, yy, tz=7):
    day_number = jd_from_date(dd, mm, yy)
    k = INT((day_number - 2415021.076998695) / 29.530588853)
    month_start = _new_moon_day(k + 1, tz)
    if month_start > day_number:
        month_start = _new_moon_day(k, tz)
    a11 = _lunar_month11(yy, tz)
    b11 = a11
    if a11 >= month_start:
        lunar_year = yy
        a11 = _lunar_month11(yy - 1, tz)
    else:
        lunar_year = yy + 1
        b11 = _lunar_month11(yy + 1, tz)
    lunar_day = day_number - month_start + 1
    diff = INT((month_start - a11) / 29)
    lunar_month = diff + 11
    if b11 - a11 > 365:
        leap_diff = _leap_offset(a11, tz)
        if diff >= leap_diff:
            lunar_month = diff + 10
    if lunar_month > 12:
        lunar_month -= 12
    if lunar_month >= 11 and diff < 4:
        lunar_year -= 1
    return lunar_day, lunar_month, lunar_year


def year_profile(lunar_year: int):
    can, chi = (lunar_year + 6) % 10, (lunar_year + 8) % 12
    name, element = NAP_AM[((lunar_year - 4) % 60) // 2]
    return {"can_chi": f"{CAN[can]} {CHI[chi]}", "chi_index": chi, "con_giap": CON_GIAP[chi], "nap_am": name, "element": element}


ZODIAC = [  # (name, last day of sign within its starting month window)
    ("Ma Kết", 1, 19), ("Bảo Bình", 2, 18), ("Song Ngư", 3, 20), ("Bạch Dương", 4, 19), ("Kim Ngưu", 5, 20), ("Song Tử", 6, 20),
    ("Cự Giải", 7, 22), ("Sư Tử", 8, 22), ("Xử Nữ", 9, 22), ("Thiên Bình", 10, 22), ("Bọ Cạp", 11, 21), ("Nhân Mã", 12, 21),
]
ZODIAC_NAMES = [z[0] for z in ZODIAC]


def zodiac_index(day: int, month: int) -> int:
    name, m, last = ZODIAC[month - 1]
    if day <= last:
        return month - 1
    return month % 12  # next sign (Dec 22+ -> index 0 = Ma Kết)

