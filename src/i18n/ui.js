// UI strings shared by layout & components.
export const UI = {
  vi: {
    home: 'Trang chủ',
    allTools: 'Tất cả công cụ',
    calculate: 'Tính ngay',
    viewDetail: 'Xem kết quả chi tiết',
    result: 'Kết quả',
    sponsored: 'Tài trợ',
    ad: 'Quảng cáo',
    share: 'Chia sẻ kết quả',
    shareDesc: 'Gửi link này cho bạn bè – họ sẽ thấy ngay kết quả với thông số bạn vừa nhập.',
    copyLink: 'Copy link',
    copied: 'Đã copy link!',
    copiedZalo: 'Đã copy link – mở Zalo và dán để gửi.',
    nativeShare: 'Chia sẻ…',
    related: 'Có thể bạn quan tâm',
    moreTools: 'Công cụ khác',
    privacy: 'Chính sách bảo mật',
    disclaimer: 'Kết quả mang tính tham khảo. Các nội dung vận mệnh mang tính giải trí; thông số tài chính cần đối chiếu văn bản pháp luật hiện hành.',
    langName: 'English',
    exportCsv: 'Tải Excel (CSV)',
    print: 'In / Lưu PDF',
    popular: 'Tra cứu phổ biến',
    updated: 'Cập nhật'
  },
  en: {
    home: 'Home',
    allTools: 'All tools',
    calculate: 'Calculate',
    viewDetail: 'View detailed result',
    result: 'Result',
    sponsored: 'Sponsored',
    ad: 'Ad',
    share: 'Share this result',
    shareDesc: 'Send this link to a friend – they will see the result with the same inputs.',
    copyLink: 'Copy link',
    copied: 'Link copied!',
    copiedZalo: 'Link copied – open Zalo and paste it.',
    nativeShare: 'Share…',
    related: 'You may also like',
    moreTools: 'More tools',
    privacy: 'Privacy policy',
    disclaimer: 'Results are for reference only. Destiny content is for entertainment; verify financial figures with current regulations.',
    langName: 'Tiếng Việt',
    exportCsv: 'Download CSV',
    print: 'Print / Save PDF',
    popular: 'Popular lookups',
    updated: 'Updated'
  }
};

export const t = (lang) => UI[lang === 'en' ? 'en' : 'vi'];

