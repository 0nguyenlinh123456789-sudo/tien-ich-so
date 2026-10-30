// Tarot deck (78 cards). Majors have hand-written meanings, minors are composed from suit + rank.

export const MAJORS = [
  { n: 0, vi: 'Kẻ Khờ', en: 'The Fool', up: { vi: 'Khởi đầu mới, tự do, dám mạo hiểm và tin vào hành trình.', en: 'New beginnings, freedom, a leap of faith.' }, rev: { vi: 'Liều lĩnh thiếu suy nghĩ, ngập ngừng không dám bắt đầu.', en: 'Recklessness, hesitation, fear of the unknown.' } },
  { n: 1, vi: 'Nhà Ảo Thuật', en: 'The Magician', up: { vi: 'Bạn có đủ công cụ và năng lực để biến ý tưởng thành hiện thực.', en: 'Manifestation, skill, resourcefulness.' }, rev: { vi: 'Tài năng bị lãng phí, thao túng hoặc thiếu tập trung.', en: 'Wasted talent, manipulation, poor planning.' } },
  { n: 2, vi: 'Nữ Tư Tế', en: 'The High Priestess', up: { vi: 'Trực giác, bí ẩn, hãy lắng nghe tiếng nói bên trong.', en: 'Intuition, mystery, inner voice.' }, rev: { vi: 'Bỏ qua trực giác, bí mật bị che giấu.', en: 'Ignored intuition, hidden agendas.' } },
  { n: 3, vi: 'Hoàng Hậu', en: 'The Empress', up: { vi: 'Sung túc, nuôi dưỡng, sáng tạo và sinh sôi nảy nở.', en: 'Abundance, nurturing, fertility, creativity.' }, rev: { vi: 'Phụ thuộc, bỏ bê bản thân, bế tắc sáng tạo.', en: 'Dependence, self-neglect, creative block.' } },
  { n: 4, vi: 'Hoàng Đế', en: 'The Emperor', up: { vi: 'Kỷ luật, cấu trúc, quyền lực và sự ổn định.', en: 'Authority, structure, stability.' }, rev: { vi: 'Độc đoán, cứng nhắc hoặc mất kiểm soát.', en: 'Domination, rigidity, lack of discipline.' } },
  { n: 5, vi: 'Giáo Hoàng', en: 'The Hierophant', up: { vi: 'Truyền thống, người dẫn dắt, học hỏi theo khuôn mẫu.', en: 'Tradition, mentorship, conformity.' }, rev: { vi: 'Phá vỡ lề lối, nghi ngờ niềm tin cũ.', en: 'Rebellion, challenging the status quo.' } },
  { n: 6, vi: 'Tình Nhân', en: 'The Lovers', up: { vi: 'Tình yêu, sự hòa hợp và một lựa chọn quan trọng từ trái tim.', en: 'Love, harmony, meaningful choices.' }, rev: { vi: 'Mất cân bằng, lựa chọn sai, bất đồng giá trị.', en: 'Imbalance, misalignment of values.' } },
  { n: 7, vi: 'Cỗ Xe', en: 'The Chariot', up: { vi: 'Ý chí, quyết tâm và chiến thắng nhờ kiểm soát bản thân.', en: 'Willpower, determination, victory.' }, rev: { vi: 'Mất phương hướng, thiếu kiểm soát.', en: 'Lack of direction, loss of control.' } },
  { n: 8, vi: 'Sức Mạnh', en: 'Strength', up: { vi: 'Can đảm, kiên nhẫn, sức mạnh mềm mỏng từ bên trong.', en: 'Courage, patience, inner strength.' }, rev: { vi: 'Tự ti, nóng nảy, nghi ngờ chính mình.', en: 'Self-doubt, weakness, raw emotion.' } },
  { n: 9, vi: 'Ẩn Sĩ', en: 'The Hermit', up: { vi: 'Chiêm nghiệm, tìm kiếm câu trả lời bên trong, rút lui để trưởng thành.', en: 'Introspection, solitude, inner guidance.' }, rev: { vi: 'Cô lập quá mức, trốn tránh.', en: 'Isolation, loneliness, withdrawal.' } },
  { n: 10, vi: 'Bánh Xe Số Phận', en: 'Wheel of Fortune', up: { vi: 'Vận may xoay chuyển, chu kỳ mới, bước ngoặt bất ngờ.', en: 'Change, cycles, good luck, destiny.' }, rev: { vi: 'Vận rủi tạm thời, cưỡng lại thay đổi.', en: 'Bad luck, resisting change.' } },
  { n: 11, vi: 'Công Lý', en: 'Justice', up: { vi: 'Công bằng, sự thật, nhân quả và quyết định sáng suốt.', en: 'Fairness, truth, cause and effect.' }, rev: { vi: 'Bất công, né tránh trách nhiệm.', en: 'Unfairness, dishonesty, avoidance.' } },
  { n: 12, vi: 'Người Treo Ngược', en: 'The Hanged Man', up: { vi: 'Tạm dừng, nhìn vấn đề từ góc nhìn mới, buông bỏ.', en: 'Pause, surrender, new perspective.' }, rev: { vi: 'Trì hoãn vô ích, hy sinh không đáng.', en: 'Stalling, needless sacrifice.' } },
  { n: 13, vi: 'Cái Chết', en: 'Death', up: { vi: 'Kết thúc để tái sinh, chuyển hóa sâu sắc.', en: 'Endings, transformation, transition.' }, rev: { vi: 'Sợ thay đổi, níu kéo quá khứ.', en: 'Resistance to change, stagnation.' } },
  { n: 14, vi: 'Tiết Chế', en: 'Temperance', up: { vi: 'Cân bằng, điều độ, kiên nhẫn chữa lành.', en: 'Balance, moderation, patience.' }, rev: { vi: 'Thái quá, mất cân bằng.', en: 'Excess, imbalance.' } },
  { n: 15, vi: 'Ác Quỷ', en: 'The Devil', up: { vi: 'Ràng buộc, cám dỗ, thói quen xấu cần nhận diện.', en: 'Bondage, temptation, addiction.' }, rev: { vi: 'Giải thoát, phá vỡ xiềng xích.', en: 'Release, breaking free.' } },
  { n: 16, vi: 'Tòa Tháp', en: 'The Tower', up: { vi: 'Biến cố đột ngột phá vỡ điều giả tạo, thức tỉnh.', en: 'Sudden upheaval, revelation.' }, rev: { vi: 'Né tránh khủng hoảng, thay đổi từ bên trong.', en: 'Averting disaster, internal change.' } },
  { n: 17, vi: 'Ngôi Sao', en: 'The Star', up: { vi: 'Hy vọng, chữa lành, niềm tin vào tương lai.', en: 'Hope, renewal, inspiration.' }, rev: { vi: 'Mất niềm tin, chán nản.', en: 'Despair, disconnection.' } },
  { n: 18, vi: 'Mặt Trăng', en: 'The Moon', up: { vi: 'Ảo tưởng, nỗi sợ, tiềm thức – mọi thứ chưa rõ ràng.', en: 'Illusion, fear, the subconscious.' }, rev: { vi: 'Sự thật dần sáng tỏ, vượt qua sợ hãi.', en: 'Release of fear, truth revealed.' } },
  { n: 19, vi: 'Mặt Trời', en: 'The Sun', up: { vi: 'Thành công, niềm vui, năng lượng tích cực rực rỡ.', en: 'Success, joy, vitality.' }, rev: { vi: 'Niềm vui bị trì hoãn, lạc quan quá mức.', en: 'Temporary sadness, over-optimism.' } },
  { n: 20, vi: 'Phán Xét', en: 'Judgement', up: { vi: 'Thức tỉnh, đánh giá lại, tiếng gọi mới.', en: 'Rebirth, inner calling, absolution.' }, rev: { vi: 'Tự phán xét khắt khe, bỏ lỡ cơ hội.', en: 'Self-doubt, ignoring the call.' } },
  { n: 21, vi: 'Thế Giới', en: 'The World', up: { vi: 'Hoàn thành, viên mãn, kết thúc một chu kỳ trọn vẹn.', en: 'Completion, accomplishment, travel.' }, rev: { vi: 'Còn dang dở, thiếu khép lại.', en: 'Incompletion, lack of closure.' } }
];

const SUITS = [
  { id: 'wands', vi: 'Gậy', en: 'Wands', symbol: '🔥', domain: { vi: 'sự nghiệp, đam mê và hành động', en: 'career, passion and action' } },
  { id: 'cups', vi: 'Cốc', en: 'Cups', symbol: '💧', domain: { vi: 'tình cảm, các mối quan hệ và cảm xúc', en: 'love, relationships and emotions' } },
  { id: 'swords', vi: 'Kiếm', en: 'Swords', symbol: '⚔️', domain: { vi: 'tư duy, giao tiếp và thử thách', en: 'thoughts, communication and conflict' } },
  { id: 'pentacles', vi: 'Tiền', en: 'Pentacles', symbol: '🪙', domain: { vi: 'tài chính, công việc và vật chất', en: 'money, work and material life' } }
];

const RANKS = [
  { id: 1, vi: 'Át', en: 'Ace', up: { vi: 'Một cơ hội mới mẻ xuất hiện', en: 'A fresh opportunity arrives' }, rev: { vi: 'Cơ hội bị bỏ lỡ hoặc khởi đầu chậm', en: 'A missed or delayed start' } },
  { id: 2, vi: 'Hai', en: 'Two', up: { vi: 'Cần cân nhắc lựa chọn và hợp tác', en: 'Balance, choices and partnership' }, rev: { vi: 'Do dự, mất cân bằng', en: 'Indecision and imbalance' } },
  { id: 3, vi: 'Ba', en: 'Three', up: { vi: 'Phát triển, mở rộng, làm việc nhóm', en: 'Growth, expansion, teamwork' }, rev: { vi: 'Trì trệ, thiếu phối hợp', en: 'Delays and lack of teamwork' } },
  { id: 4, vi: 'Bốn', en: 'Four', up: { vi: 'Ổn định và củng cố nền móng', en: 'Stability and foundations' }, rev: { vi: 'Bảo thủ, sợ thay đổi', en: 'Stagnation, holding on too tight' } },
  { id: 5, vi: 'Năm', en: 'Five', up: { vi: 'Thử thách, mâu thuẫn cần vượt qua', en: 'Challenge and conflict to overcome' }, rev: { vi: 'Xung đột lắng xuống, hồi phục', en: 'Recovery after conflict' } },
  { id: 6, vi: 'Sáu', en: 'Six', up: { vi: 'Hài hòa, giúp đỡ và tiến triển', en: 'Harmony, support and progress' }, rev: { vi: 'Hoài niệm, cho nhận không cân xứng', en: 'Living in the past, unequal giving' } },
  { id: 7, vi: 'Bảy', en: 'Seven', up: { vi: 'Đánh giá lại chiến lược, kiên trì', en: 'Reassessment and perseverance' }, rev: { vi: 'Thiếu kiên nhẫn, ảo tưởng', en: 'Impatience, illusion' } },
  { id: 8, vi: 'Tám', en: 'Eight', up: { vi: 'Chuyển động nhanh, tập trung rèn luyện', en: 'Rapid movement, mastery through effort' }, rev: { vi: 'Bị mắc kẹt, thiếu tập trung', en: 'Feeling stuck, scattered energy' } },
  { id: 9, vi: 'Chín', en: 'Nine', up: { vi: 'Gần chạm đích, gặt hái thành quả', en: 'Near completion, rewards' }, rev: { vi: 'Lo âu, kiệt sức', en: 'Anxiety and exhaustion' } },
  { id: 10, vi: 'Mười', en: 'Ten', up: { vi: 'Hoàn tất một chu kỳ, trách nhiệm lớn', en: 'End of a cycle, culmination' }, rev: { vi: 'Gánh nặng quá sức, chu kỳ chưa khép', en: 'Burden, unfinished cycle' } },
  { id: 11, vi: 'Tiểu Đồng', en: 'Page', up: { vi: 'Tin tức mới, tinh thần học hỏi', en: 'News, curiosity, a student mindset' }, rev: { vi: 'Non nớt, tin xấu nhỏ', en: 'Immaturity, small setbacks' } },
  { id: 12, vi: 'Hiệp Sĩ', en: 'Knight', up: { vi: 'Hành động mạnh mẽ, theo đuổi mục tiêu', en: 'Bold action, pursuit' }, rev: { vi: 'Hấp tấp, thiếu kiên định', en: 'Haste, inconsistency' } },
  { id: 13, vi: 'Hoàng Hậu', en: 'Queen', up: { vi: 'Thấu cảm, trưởng thành, nuôi dưỡng', en: 'Maturity, empathy, nurturing' }, rev: { vi: 'Cảm xúc thất thường, kiểm soát', en: 'Moodiness, control' } },
  { id: 14, vi: 'Vua', en: 'King', up: { vi: 'Làm chủ, lãnh đạo, quyết đoán', en: 'Mastery, leadership, authority' }, rev: { vi: 'Lạm quyền, cứng nhắc', en: 'Abuse of power, rigidity' } }
];

export function buildDeck() {
  const deck = MAJORS.map((m) => ({
    id: `major-${m.n}`,
    arcana: 'major',
    number: m.n,
    name: { vi: m.vi, en: m.en },
    symbol: '✶',
    upright: m.up,
    reversed: m.rev
  }));
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({
        id: `${s.id}-${r.id}`,
        arcana: 'minor',
        suit: s.id,
        number: r.id,
        name: { vi: `${r.vi} ${s.vi}`, en: `${r.en} of ${s.en}` },
        symbol: s.symbol,
        upright: { vi: `${r.up.vi} trong lĩnh vực ${s.domain.vi}.`, en: `${r.up.en} in ${s.domain.en}.` },
        reversed: { vi: `${r.rev.vi} trong lĩnh vực ${s.domain.vi}.`, en: `${r.rev.en} in ${s.domain.en}.` }
      });
    }
  }
  return deck;
}

function randomInt(max) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const SPREADS = {
  one: { vi: ['Thông điệp hôm nay'], en: ['Message of the day'] },
  three: { vi: ['Quá khứ', 'Hiện tại', 'Tương lai'], en: ['Past', 'Present', 'Future'] },
  love: { vi: ['Bạn', 'Đối phương', 'Mối quan hệ'], en: ['You', 'Partner', 'Relationship'] },
  career: { vi: ['Tình hình hiện tại', 'Thử thách', 'Lời khuyên', 'Kết quả'], en: ['Situation', 'Challenge', 'Advice', 'Outcome'] }
};

export function drawSpread(spread = 'three') {
  const positions = SPREADS[spread] || SPREADS.three;
  const deck = shuffle(buildDeck());
  return positions.vi.map((_, i) => {
    const card = deck[i];
    const reversed = randomInt(100) < 30;
    return { position: { vi: positions.vi[i], en: positions.en[i] }, card, reversed };
  });
}

