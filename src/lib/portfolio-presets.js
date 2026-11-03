// Pre-written starter content per profession + Open-Source Design System presets.
// Every preset includes long-form case studies (projectDetails), experience, awards, testimonials & clients.

export const OPEN_SOURCE_THEMES = [
  { id: 'inkwash_do', name: { vi: '🖌 Thủy Mặc & Giấy Dó (Vẽ tay)', en: '🖌 Oriental Ink & Dó Paper' }, style: 'inkwash', color: '#b91c1c', font: 'Playfair Display', tex: 'kraft', stk: 'inkseal', badge: 'Hand-drawn Ink' },
  { id: 'watercolor_art', name: { vi: '🎨 Màu Nước & Chì Màu (Vẽ tay)', en: '🎨 Watercolor & Pencil' }, style: 'watercolor', color: '#e76f51', font: 'Caveat', tex: 'watercolor', stk: 'doodle', badge: 'Hand-painted' },
  { id: 'botanical_herb', name: { vi: '🌿 Sổ Tay Thực Vật Cổ Điển', en: '🌿 Vintage Botanical Journal' }, style: 'botanical', color: '#3f5e39', font: 'Lora', tex: 'kraft', stk: 'botanical', badge: 'Field Sketchbook' },
  { id: 'comic_manga', name: { vi: '💥 Truyện Tranh & Manga Zine', en: '💥 Comic & Manga Zine' }, style: 'comic', color: '#e11d48', font: 'Bangers', tex: 'dotgrid', stk: 'doodle', badge: 'Storyboard' },
  { id: 'polaroid_washi', name: { vi: '📌 Nhật Ký Polaroid & Washi', en: '📌 Polaroid & Washi Scrapbook' }, style: 'scrapbook', color: '#d97706', font: 'Caveat', tex: 'dotgrid', stk: 'doodle', badge: 'Analog Craft' },
  { id: 'riso_zine', name: { vi: '🖨 Ấn Bản Risograph Indie', en: '🖨 Risograph Indie Zine' }, style: 'risograph', color: '#e63946', font: 'Space Grotesk', tex: 'dotgrid', stk: 'inkseal', badge: 'Two-Tone Print' },
  { id: 'tarot_gold', name: { vi: '🔮 Chiêm Tinh & Khắc Gỗ Tarot', en: '🔮 Celestial Tarot & Woodcut' }, style: 'tarot_alchemy', color: '#d4af37', font: 'Playfair Display', tex: '', stk: 'doodle', badge: 'Gold Arcana' },
  { id: 'clay_tactile', name: { vi: '🧸 Đất Sét 3D & Khâu Chỉ', en: '🧸 Tactile Clay & Stitched' }, style: 'clay_play', color: '#ec4899', font: 'Plus Jakarta Sans', tex: '', stk: 'doodle', badge: 'Claymorphism' },
  { id: 'bauhaus_canvas', name: { vi: '📐 Hội Họa Hình Học Bauhaus', en: '📐 Bauhaus Constructivist' }, style: 'bauhaus_art', color: '#e63946', font: 'Space Grotesk', tex: 'grid', stk: '', badge: 'De Stijl' },
  { id: 'street_graffiti', name: { vi: '⚡ Graffiti & Mực Đường Phố', en: '⚡ Street Calligraffiti' }, style: 'cyber_ink', color: '#10b981', font: 'Permanent Marker', tex: '', stk: 'doodle', badge: 'Underground' },
  { id: 'claude_warm', name: { vi: '✦ Biên tập Ấm áp (Serif)', en: '✦ Warm Editorial Serif' }, style: 'claude', color: '#d97757', font: 'Source Serif 4', tex: '', stk: '', badge: 'Warm Editorial' },
  { id: 'behance_pro', name: { vi: '★ Case Study Chuyên nghiệp', en: '★ Pro Case Study' }, style: 'behance', color: '#0057ff', font: 'Plus Jakarta Sans', tex: '', stk: '', badge: '1400px Boards' },
  { id: 'github_os', name: { vi: '📦 Kỹ sư mã nguồn mở', en: '📦 Open-Source Engineer' }, style: 'opensource', color: '#2ea043', font: 'JetBrains Mono', tex: '', stk: '', badge: 'GitHub REST API' },
  { id: 'spatial_vision', name: { vi: '🌌 Kính Không gian', en: '🌌 Spatial Glass' }, style: 'spatial', color: '#6366f1', font: 'Plus Jakarta Sans', tex: '', stk: '', badge: 'Glass UI' },
  { id: 'neo_brutal', name: { vi: '🟨 Tân Thô mộc (Neo-Brutalist)', en: '🟨 Neo-Brutalist' }, style: 'brutalist', color: '#ec4899', font: 'Space Grotesk', tex: 'dotgrid', stk: '', badge: 'High Contrast' },
  { id: 'rams_braun', name: { vi: '⚙ Công năng Tối giản Thụy Sĩ', en: '⚙ Swiss Functionalist' }, style: 'industrial', color: '#ea580c', font: 'Space Grotesk', tex: 'grid', stk: '', badge: 'Industrial Grid' }
];

export const LIVE_SEARCH_TOPICS = [
  { q: 'creative coding webgl', label: { vi: '✨ Creative Coding & WebGL', en: '✨ Creative Coding & WebGL' } },
  { q: 'threejs portfolio 3d', label: { vi: '🧊 Three.js & 3D Artist', en: '🧊 Three.js & 3D Artist' } },
  { q: 'design system ui figma', label: { vi: '🎨 Design System & UI/UX', en: '🎨 Design System & UI/UX' } },
  { q: 'svg illustration canvas', label: { vi: '🖌 Minh họa SVG & Canvas', en: '🖌 SVG Illustration & Canvas' } },
  { q: 'indie game godot pixel', label: { vi: '🎮 Game Indie & Pixel Art', en: '🎮 Indie Game & Pixel Art' } },
  { q: 'generative art shader', label: { vi: '🌀 Generative Art & Shader', en: '🌀 Generative Art & Shader' } },
  { q: 'ai agent llm studio', label: { vi: '🤖 AI Agent & LLM', en: '🤖 AI Agent & LLM' } },
  { q: 'location:vietnam followers:>50', label: { vi: '🇻🇳 Creator tại Việt Nam', en: '🇻🇳 Creators in Vietnam' } }
];

export const QUICK_SNIPPETS = {
  availability: {
    vi: [
      '🟢 Đang nhận dự án Freelance & Commission Vẽ/Thiết kế',
      '⚡ Sẵn sàng hợp tác Full-time / Remote toàn cầu',
      '🎨 Đang mở 3 suất Commission Minh họa & Nhận diện tháng này',
      '☕ Nhận tư vấn Art Direction, Thiết kế & Đào tạo 1-1'
    ],
    en: [
      '🟢 Available for Freelance & Bespoke Commissions',
      '⚡ Open to Full-time & Global Remote Roles',
      '🎨 3 Commission Slots Open This Month',
      '☕ Available for Art Direction & Advisory'
    ]
  },
  manifesto: {
    vi: [
      'Mỗi nét vẽ thủ công đều mang một linh hồn riêng mà máy móc không thể sao chép.',
      'Thiết kế tốt là sự giao thoa giữa cảm xúc con người và cấu trúc rõ ràng.',
      'Không chạy theo xu hướng đại trà — mỗi dự án là một tác phẩm độc bản được đo ni đóng giày.',
      'Kể chuyện bằng hình ảnh, chạm đến trái tim bằng sự tỉ mỉ trong từng chi tiết nhỏ.'
    ],
    en: [
      'Every hand-drawn line carries a human soul that machines cannot replicate.',
      'Good design is as little design as possible — honest, tactile and timeless.',
      'No generic templates — every project is a bespoke world crafted from scratch.',
      'Storytelling through light, ink and human emotion.'
    ]
  }
};

export const PORTFOLIO_PRESETS = [
  {
    id: 'illustrator_hand', icon: '🎨', style: 'watercolor', color: '#e76f51',
    label: { vi: 'Họa sĩ Minh họa Vẽ tay (Watercolor)', en: 'Hand-Drawn Illustrator (Watercolor)' },
    vi: {
      role: 'Họa sĩ Minh họa Tự do & Tác giả Sách tranh',
      availability: '🎨 Đang mở nhận Commission Vẽ bìa sách, Bao bì & Minh họa thương hiệu',
      manifesto: 'Mỗi nét cọ màu nước và nét chì phác thảo đều lưu giữ hơi ấm của đôi bàn tay người nghệ sĩ.',
      signature: 'Hà My Atelier ✦',
      paperTexture: 'watercolor',
      handSticker: 'doodle',
      bio: 'Chuyên sáng tác minh họa vẽ tay màu nước, chì màu và kỹ thuật số cho bìa sách văn học, bao bì trà/cà phê thủ công và chiến dịch kể chuyện thương hiệu.',
      skills: 'Màu nước thủ công, Minh họa Bìa sách, Procreate, Ký họa Thực vật, Thiết kế Nhân vật (Character), Bao bì Nghệ thuật, In Lụa & Risograph',
      projects: 'Khu Vườn Trên Mây | Sách Tranh (Picture Book) | 2026 | Bộ 36 tranh màu nước vẽ tay trên giấy Arches xuất bản tại Việt Nam & Pháp |\nTrà Cổ Thụ Tây Bắc | Bao bì Minh họa | 2025 | Bộ 6 hộp thiếc khắc họa hệ động thực vật rừng già Hoàng Liên Sơn |\nMùa Thu Hà Nội | Bìa Sách Văn học | 2025 | Series 12 bìa tiểu thuyết tản văn bán chạy nhất hội sách |\nLịch Để Bàn Bốn Mùa | Art Merchandise | 2024 | Dự án gây quỹ cộng đồng đạt 320% mục tiêu với 2.500 bản in Risograph |',
      projectDetails: [
        { challenge: 'Thương hiệu trà cổ thụ muốn thoát khỏi hình ảnh bao bì công nghiệp đại trà để định vị làm quà tặng văn hóa cao cấp.', solution: 'Thực hiện chuyến đi thực địa 10 ngày lên vùng núi Tây Bắc để ký họa trực tiếp cây chè shan tuyết cổ thụ, chim rừng và sương mù bằng màu nước trên giấy cotton 300gsm, sau đó ép kim tinh xảo lên hộp thiếc.', result: 'Giúp dòng trà quà tặng tăng giá bán 180%, cháy hàng 5.000 hộp trong dịp Tết và đoạt giải Bao bì Sáng tạo.' },
        { challenge: 'Làm sao để giữ nguyên kết cấu loang màu tự nhiên và hạt giấy vẽ tay khi đưa tranh màu nước lên quy trình in offset công nghiệp số lượng lớn.', solution: 'Quét (scan) bản gốc ở độ phân giải 1200 DPI, hiệu chỉnh tách kênh màu CMYK thủ công và chọn giấy mỹ thuật có vân nổi đồng điệu với giấy vẽ.', result: 'Cuốn sách tranh bán hết 8.000 bản ngay tuần đầu và được mua bản quyền dịch sang tiếng Pháp.' }
      ],
      stats: '7+ | Năm vẽ minh họa\n15 | Đầu sách xuất bản\n35+ | Thương hiệu đặt vẽ\n2.500+ | Bản in Art Print',
      services: 'Minh họa Sách & Tạp chí | Bìa sách, tranh minh họa toàn trang (Spread), truyện tranh thiếu nhi và tiểu thuyết\nMinh họa Bao bì & Thương hiệu | Vẽ tay độc bản cho hộp trà, cà phê, mỹ phẩm thiên nhiên, khăn lụa và quà tặng\nCommission Cá nhân & Art Print | Tranh chân dung màu nước, thiệp cưới vẽ tay và tranh trang trí giới hạn',
      pricing: 'Commission Minh họa Lẻ | 3.500.000đ – 6.000.000đ | 1 tranh vẽ tay/kỹ thuật số chi tiết; 2 vòng phác thảo chì; Bàn giao file in TIFF/PSD 600 DPI\nGói Minh họa Bao bì Thương hiệu | 18.000.000đ – 35.000.000đ | Bộ 3–5 tranh chủ đạo theo câu chuyện thương hiệu; Bản quyền thương mại độc quyền; Hỗ trợ kỹ thuật nhà in\nGói Sách Tranh / Dự án Dài kỳ | Báo giá theo quyển | Lên kịch bản hình ảnh (Storyboard); Tạo hình nhân vật; Vẽ hoàn thiện toàn bộ sách',
      process: 'Trò chuyện & Cảm hứng | Lắng nghe câu chuyện, tông cảm xúc và mục đích ứng dụng của tác phẩm\nPhác thảo Bút chì (Rough Sketch) | Gửi 2–3 bố cục nét chì để bạn chọn góc nhìn và thần thái ưng ý nhất\nThử màu (Color Study) | Pha bảng màu nước thử nghiệm ánh sáng trước khi vẽ bản chính thức\nVẽ hoàn thiện & Số hóa | Tô màu chi tiết, scan độ phân giải siêu cao và tinh chỉnh file chuẩn in ấn',
      experience: '2022 – nay | Họa sĩ Minh họa Độc lập | Xưởng Vẽ Mây | Sáng tác sách tranh và nhận dự án quốc tế\n2019 – 2022 | Illustrator | Nhà xuất bản & Studio Sáng tạo',
      awards: '2025 | Giải Nhất Minh họa Sách Thiếu nhi | Hội Xuất bản\n2024 | Tác phẩm Màu nước Nổi bật | Triển lãm Minh họa Cộng đồng',
      testimonials: 'Từng nét cọ đều mềm mại và có hồn đến mức khách hàng của chúng tôi mua trà xong đều đóng khung vỏ hộp treo lên tường. | Nguyễn Thanh Tùng | Founder, Trà Cổ Thụ',
      clients: 'Studio Mây, Nhà sách Gió, Trà Cổ Thụ, Lam Coffee, Bloom Coffee'
    },
    en: {
      role: 'Freelance Illustrator & Picture Book Author',
      availability: '🎨 Open for Book Cover, Packaging & Editorial Illustration Commissions',
      manifesto: 'Every watercolor wash and pencil line preserves the warmth of the human hand.',
      signature: 'Maya Atelier ✦',
      paperTexture: 'watercolor',
      handSticker: 'doodle',
      bio: 'Crafting hand-painted watercolor, colored pencil and tactile digital illustrations for literary publishers, artisanal packaging and soulful brands.',
      skills: 'Watercolor Painting, Book Illustration, Procreate, Botanical Drawing, Character Design, Illustrated Packaging, Risograph Print',
      projects: 'Garden in the Clouds | Picture Book | 2026 | 36 hand-painted watercolor spreads published in Vietnam & France |\nHighland Heritage Tea | Illustrated Packaging | 2025 | 6 embossed collector tins depicting cloud-forest flora and fauna |\nAutumn Chronicles | Book Cover Series | 2025 | 12 illustrated literary fiction covers |\nFour Seasons Riso Calendar | Art Print | 2024 | Crowdfunded 2,500-copy Risograph art calendar (320% funded) |',
      projectDetails: [
        { challenge: 'An artisanal tea label needed to stand apart from mass-market packaging as a collectible cultural gift.', solution: 'Spent 10 days sketching ancient mountain tea trees in watercolor on 300gsm cotton paper.', result: '180% retail price uplift and 5,000 collector tins sold out.' }
      ],
      stats: '7+ | Years illustrating\n15 | Published books\n35+ | Brand clients\n2,500+ | Prints collected',
      services: 'Editorial & Book Illustration | Covers, picture book spreads and spot illustrations\nArtisanal Packaging | Bespoke hand-painted worlds for tea, coffee, chocolate and cosmetics\nPrivate Commissions & Prints | Custom portraits and limited-edition archival prints',
      pricing: 'Single Editorial / Spot Illustration | $300 – $650 | 1 custom high-res illustration; 2 pencil sketch rounds; 600 DPI layered master file\nIllustrated Packaging Suite | $1,500 – $3,200 | 3–5 cohesive illustrations; Commercial buyout license; Print press color proofing\nPicture Book / Long-Form Series | Custom Project Rate | Full character sheets, storyboard animatic and finished spreads',
      process: 'Story & Mood | Understand the emotional core and format\nPencil Thumbnails | 2–3 compositions for layout approval\nColor Wash Study | Palette and lighting test\nFinal Painting & Scan | 1200 DPI archival scan and print prep',
      experience: '2022 – Present | Independent Illustrator | Cloud Atelier',
      awards: '2024 | Community Illustration Showcase | Watercolor Series',
      testimonials: 'Customers frame our tea boxes on their walls because the artwork is so soulful. | Tung Nguyen | Founder, Highland Tea',
      clients: 'Nova Games, Saffron Media, Hoa Tea House, Lumen Labs'
    }
  },
  {
    id: 'oriental_craft', icon: '🖌', style: 'inkwash', color: '#b91c1c',
    label: { vi: 'Thư pháp, Thủy mặc, Gốm & Xăm Nghệ thuật', en: 'Ink Wash, Calligraphy, Ceramic & Tattoo' },
    vi: {
      role: 'Nghệ sĩ Thủy Mặc, Gốm Thủ Công & Oriental Art',
      availability: '🉐 Nhận chế tác độc bản, vẽ tranh thủy mặc & thiết kế hình xăm/nhận diện Á Đông',
      manifesto: 'Giữa khoảng trắng của giấy dó và sắc đen của mực tàu là vạn vật sinh sôi.',
      signature: 'Mạc Hiên Ấn 印',
      paperTexture: 'kraft',
      handSticker: 'inkseal',
      bio: 'Kết hợp tinh thần hội họa thủy mặc Đông phương, thư pháp bút lông và chất liệu truyền thống (giấy dó, sơn mài, gốm nung củi) vào không gian và thương hiệu đương đại.',
      skills: 'Hội họa Thủy mặc, Thư pháp Bút lông, Thiết kế Ấn chương, Gốm Nung Củi, Sơn mài, Minh họa Á Đông, Fine-line Tattoo Art',
      projects: 'Trăng Đáy Nước | Triển lãm Thủy mặc | 2026 | Bộ 18 bức thủy mặc trên giấy dó lụa trưng bày tại không gian nghệ thuật đương đại |\nBộ Trà Cụ An Nhiên | Gốm Thủ công | 2025 | 50 bộ ấm chén nung củi men tro trấu tự nhiên độc bản |\n Long Phụng Hội | Nhận diện Nhà hàng | 2025 | Bộ chữ thư pháp chủ đạo và tranh tường mực tàu cho nhà hàng Fine Dining |\nSơn Hà Cổ Tự | Thiết kế Ấn phẩm | 2024 | Bộ sưu tập bao lì xì và lịch nghệ thuật khắc gỗ truyền thống |',
      projectDetails: [
        { challenge: 'Không gian nhà hàng Fine Dining cần một điểm nhấn thị giác vừa uy nghi đậm chất Á Đông vừa tối giản, không bị rườm rà cổ hủ.', solution: 'Vẽ trực tiếp bức trường quyển thủy mặc dài 6 mét trên nền giấy dó bồi vải gai kết hợp chữ thư pháp phóng khoáng.', result: 'Trở thành góc biểu tượng được toàn bộ thực khách chụp ảnh và đăng tải trên tạp chí kiến trúc.' }
      ],
      stats: '9+ | Năm thực hành nghệ thuật\n3 | Triển lãm cá nhân\n120+ | Tác phẩm độc bản\n100% | Chế tác thủ công',
      services: 'Tranh Thủy mặc & Thư pháp Độc bản | Sáng tác theo kích thước không gian trà thất, khách sạn, biệt thự\nThiết kế Chữ Thư pháp Thương hiệu | Viết tên thương hiệu, tiêu đề phim, bao bì rượu/trà bằng bút lông thật\nChế tác Gốm & Ấn chương | Khắc dấu triện đá tự nhiên và chế tác trà cụ thủ công',
      pricing: 'Thiết kế Chữ Thư pháp / Ấn chương | Từ 4.500.000đ | 5 phương án nét bút lông thật; Khắc dấu triện riêng; File vector & ảnh gốc độ phân giải cao\nTranh Thủy mặc Độc bản Theo Không gian | Từ 12.000.000đ | Vẽ trên giấy dó/lụa cao cấp; Đóng khung gỗ tự nhiên; Giấy chứng nhận tác phẩm độc bản',
      process: 'Thưởng trà & Đàm đạo | Tìm hiểu triết lý, mệnh lý và không gian trưng bày của gia chủ\nThử mực & Phác ý | Luyện bút tạo nhiều thần thái nét chữ và bố cục khoảng trắng\nHạ bút Độc bản | Thực hiện tác phẩm trong trạng thái tĩnh tâm cao nhất\nĐóng triện & Bồi biểu | Đóng ấn chương son đỏ, bồi lụa/đóng khung và bàn giao',
      experience: '2018 – nay | Nghệ sĩ Độc lập | Mạc Hiên Trà & Họa Xưởng',
      awards: '2025 | Giải Tác phẩm Truyền thống Đương đại Xuất sắc | Triển lãm Mỹ thuật',
      testimonials: 'Bức tranh thủy mặc treo ở sảnh chính đã nâng tầm toàn bộ không gian tĩnh lặng của khu nghỉ dưỡng. | Lê Minh | Chủ đầu tư Retreat',
      clients: 'An Yên Retreat, Nhà hàng Vân Các, Trà Việt'
    },
    en: {
      role: 'Oriental Ink Artist, Calligrapher & Ceramicist',
      availability: '🉐 Accepting Bespoke Ink Paintings, Brand Calligraphy & Ceramic Commissions',
      manifesto: 'Between the emptiness of handmade paper and a single stroke of sumi ink lies an entire universe.',
      signature: 'Mac Hien Seal 印',
      paperTexture: 'kraft',
      handSticker: 'inkseal',
      bio: 'Bridging classical East Asian ink-wash painting, brush calligraphy and wood-fired ceramics with contemporary spatial and brand design.',
      skills: 'Sumi Ink Wash, Brush Calligraphy, Stone Seal Carving, Wood-fired Ceramics, Lacquerware, Oriental Illustration',
      projects: 'Moon in the Water | Solo Exhibition | 2026 | 18 ink-on-mulberry-paper scrolls |\nAsh Glaze Teaware | Ceramics | 2025 | 50 wood-fired teapots with natural rice-husk ash glaze |\nDragon & Cloud | Hospitality Identity | 2025 | Bespoke brush logotype and 6-meter ink mural |\nWoodblock Almanac | Print Series | 2024 | Hand-carved woodblock calendar edition |',
      projectDetails: [
        { challenge: 'A contemporary fine-dining space needed an authentic Eastern focal point without feeling dated.', solution: 'Painted a single-breath 6-meter sumi ink scroll mounted on raw hemp.', result: 'Featured in regional architecture digests as the restaurant’s signature centerpiece.' }
      ],
      stats: '9+ | Years of practice\n3 | Solo exhibitions\n120+ | Collected works\n100% | Handcrafted',
      services: 'Bespoke Ink Scrolls & Murals | Site-specific paintings for residences, tea houses and hotels\nBrush Logotypes & Title Art | Authentic calligraphy digitized for packaging and film\nSeal Carving & Ceramics | Hand-carved soapstone seals and wood-fired vessels',
      pricing: 'Bespoke Brush Logotype | $400+ | Multiple live brush variations; Custom red seal; Vector & raw scan delivery\nOriginal Ink Painting | $950+ | Archival mulberry paper or silk; Custom wood framing; Certificate of authenticity',
      process: 'Dialogue | Space, philosophy and energy alignment\nInk Studies | Rhythm and negative-space explorations\nFinal Stroke | Executed in a single meditative session\nSeal & Mount | Vermilion seal stamping and traditional silk mounting',
      experience: '2018 – Present | Founder & Resident Artist | Mac Hien Studio',
      awards: '2025 | Contemporary Craft Prize | Asian Art Biennale',
      testimonials: 'The 6-meter scroll anchors our entire dining room in quiet power. | Minh Le | Founder',
      clients: 'An Yen Retreat, Van Cac Dining, Heritage Tea'
    }
  },
  {
    id: 'comic_game', icon: '💥', style: 'comic', color: '#e11d48',
    label: { vi: 'Truyện tranh, Webtoon & Concept Art', en: 'Comic, Manga & Concept Artist' },
    vi: {
      role: 'Comic Artist, Storyboarder & Character Designer',
      availability: '💥 Nhận vẽ Webtoon, Storyboard Quảng cáo/Phim & Thiết kế Nhân vật Game',
      manifesto: 'Biến từng khung tranh tĩnh thành một bộ phim hành động sống động trong tâm trí người đọc!',
      signature: 'Kaito Kid Art ⚡',
      paperTexture: 'dotgrid',
      handSticker: 'doodle',
      bio: 'Sáng tác truyện tranh độc lập (Indie Comic/Webtoon), vẽ Storyboard tốc độ cao cho đạo diễn TVC/Phim điện ảnh và thiết kế Concept nhân vật cho các studio game.',
      skills: 'Comic & Manga Framing, Character Sheet, Storyboard Phim/TVC, Clip Studio Paint, Environment Concept, Biểu cảm & Action Pose',
      projects: 'Bóng Ma Sài Gòn 2088 | Cyberpunk Comic | 2026 | Bộ truyện tranh 5 tập phát hành bản in màu & Webtoon đạt 1.2M lượt đọc |\nChiến Thần Cổ Đại | Game Concept Art | 2025 | Thiết kế 18 nhân vật anh hùng, vũ khí và trang phục cho game RPG |\nTVC Nước Tăng Lực | Shooting Storyboard | 2025 | 85 khung hình Storyboard динамиc cho đạo diễn quay kỹ xảo hành động |\nBiệt Đội Mèo Hoang | Sticker & Merch | 2024 | Bộ artbook và mô hình Art Toy bán hết 1.500 hộp tại Comic Con |',
      projectDetails: [
        { challenge: 'Đoàn làm phim quảng cáo cần chốt góc máy quay hành động phức tạp với 40 nhân sự chỉ trong 48 giờ trước ngày bấm máy.', solution: 'Vẽ bộ Shooting Storyboard 85 khung có đầy đủ mũi tên chuyển động camera, tiêu cự ống kính và ánh sáng tương phản.', result: 'Giúp đoàn phim tiết kiệm 6 tiếng quay ngoài hiện trường và lên hình chuẩn 100% ý đồ đạo diễn.' }
      ],
      stats: '6+ | Năm vẽ Comic & Concept\n1.2M+ | Độc giả Webtoon\n40+ | TVC & Phim đã vẽ Storyboard\n120+ | Nhân vật đã tạo hình',
      services: 'Thiết kế Nhân vật (Character Sheet) | Vẽ xoay 3 góc (Turnaround), bảng biểu cảm khuôn mặt, trang phục và đạo cụ\nVẽ Truyện tranh & Webtoon | Chuyển thể kịch bản chữ thành khung tranh có nhịp điệu kịch tính, đi nét và tô màu hoàn chỉnh\nStoryboard Quảng cáo & Phim | Phác thảo phân cảnh nhanh, chuẩn ngôn ngữ điện ảnh cho Agency và Đạo diễn',
      pricing: 'Bảng Thiết kế Nhân vật (Character Sheet) | 4.000.000đ – 8.000.000đ | Góc chính diện + sau + nghiêng; 4 biểu cảm; Tách lớp PSD chuẩn để làm Live2D/3D\nStoryboard TVC / MV (15–30 khung) | Từ 5.000.000đ | Bàn giao nhanh trong 24–48h; Rõ góc máy & chuyển động\nVẽ Truyện tranh / Webtoon | Tính theo trang/tập | Từ kịch bản thô đến bản hoàn thiện chữ và hiệu ứng SFX',
      process: 'Đọc Kịch bản & Nhịp điệu | Phân tích cao trào và cá tính nhân vật\nThumbnail & Layout Khung | Dựng bố cục dẫn dắt mắt người đọc và góc máy\nĐi nét Mực (Inking) | Đi nét G-Pen sắc sảo kèm hiệu ứng tốc độ và bóng đổ\nLên màu & Hiệu ứng SFX | Tô màu Cel-shading hoặc Halftone và chèn chữ tượng thanh',
      experience: '2021 – nay | Lead Concept & Comic Artist | NeoInk Studio\n2019 – 2021 | Storyboard Artist | Production House Sài Gòn',
      awards: '2025 | Giải Bạc Silent Manga Audition | Quốc tế\n2024 | Best Indie Booth | Vietnam Comic Fiesta',
      testimonials: 'Tốc độ phác thảo cực nhanh và góc máy động (Dynamic angle) đẹp như phim hoạt hình Nhật Bản. | Đạo diễn Trần Khôi | Film Maker',
      clients: 'River Press, Kite Studio, Delta Audio, NeoInk'
    },
    en: {
      role: 'Comic Artist, Storyboarder & Character Designer',
      availability: '💥 Open for Character Design, Webtoons & Commercial Storyboards',
      manifesto: 'Turning static ink panels into high-octane cinema in the reader’s mind!',
      signature: 'Kaito Art ⚡',
      paperTexture: 'dotgrid',
      handSticker: 'doodle',
      bio: 'Creating indie graphic novels, expressive game character sheets and rapid shooting storyboards for directors and studios.',
      skills: 'Sequential Comic Art, Character Turnarounds, Commercial Storyboarding, Clip Studio Paint, Action Posing, Worldbuilding',
      projects: 'Saigon Phantom 2088 | Graphic Novel | 2026 | 5-volume cyberpunk comic series with 1.2M webtoon reads |\nAncient Vanguard | Game Concept Art | 2025 | 18 hero character sheets and weapon props for an action RPG |\nHyperVolt Commercial | Storyboard | 2025 | 85-frame action shooting board delivered in 48 hours |\nStray Cat Squad | Art Toy & Zine | 2024 | Sold out 1,500 blind-box figures and artbooks at Comic Con |',
      projectDetails: [
        { challenge: 'Film crew needed an 85-frame VFX action storyboard locked within 48 hours of shoot day.', solution: 'Drafted dynamic camera-move boards with lens callouts and lighting keys.', result: 'Saved 6 hours on set with 100% shot accuracy.' }
      ],
      stats: '6+ | Years in comics\n1.2M+ | Webtoon readers\n40+ | Commercial boards\n120+ | Characters designed',
      services: 'Character Design Sheets | Full turnarounds, expression matrices and costume callouts\nComics & Webtoons | Pencils, expressive G-pen inks, colouring and SFX lettering\nShooting Storyboards | Fast, cinematic boards for directors and agencies',
      pricing: 'Full Character Sheet | $350 – $700 | Front/back/side views, 4 expressions & prop callouts\nCommercial Storyboard (20 frames) | $450+ | 48-hour turnaround with camera movement arrows\nComic / Webtoon Page | Per-page rate | Thumbnails through final lettered art',
      process: 'Script Breakdown | Pacing and emotional beats\nThumbnails | Panel flow and camera angles\nInking | Expressive line weights and hatching\nColour & SFX | Cel-shading, halftones and hand-lettered sound effects',
      experience: '2021 – Present | Lead Comic & Concept Artist | NeoInk Studio',
      awards: '2025 | Silent Manga Audition Silver Award',
      testimonials: 'Lightning-fast thumbnails and cinematic camera angles. | Khoi Tran | Film Director',
      clients: 'Mộc Bakery, Sol Records, Atlas Retail'
    }
  },
  {
    id: 'behance_art', icon: '★', style: 'behance', color: '#0057ff',
    label: { vi: 'Giám đốc Nghệ thuật', en: 'Art Director' },
    vi: {
      role: 'Creative & Art Director',
      bio: 'Định hình ngôn ngữ thị giác và chiến dịch thương hiệu đa điểm chạm cho các tập đoàn công nghệ, F&B và văn hóa đương đại. 8 năm kinh nghiệm, nhiều dự án được giới thiệu tại triển lãm thiết kế (Interaction & Branding).',
      skills: 'Art Direction, Brand Architecture, Design Systems, 3D Key Visual, Packaging, Editorial Typography, Figma, Cinema 4D',
      projects: 'Kuro Matcha Flagship | Brand Identity | 2026 | Tái định vị chuỗi Matcha thủ công Nhật Bản tại 18 cửa hàng châu Á |\n Solaris OS 2.0 | Design System | 2025 | Hệ thống ngôn ngữ thiết kế đa thiết bị cho nền tảng AI đám mây |\n Bảo tàng Giao hưởng Đương đại | Exhibition | 2025 | Nhận diện thị giác động (Kinetic Identity) và không gian trưng bày tương tác |\n Vệt Nắng Đông Dương | Packaging | 2024 | Bộ sưu tập bao bì cà phê đặc sản đạt giải Giải Bạc bao bì |',
      projectDetails: [
        { challenge: 'Thị trường trà Matcha bão hòa với tông màu xanh lá truyền thống khiến thương hiệu khó tạo dấu ấn cao cấp đối với nhóm khách hàng Gen Z thành thị.', solution: 'Xây dựng hệ nhận diện tối giản lấy cảm hứng từ gốm đen Raku (Kuro) kết hợp sắc xanh lục bảo neon, hệ thống chữ custom lấy cảm hứng từ nét chổi Chasen và bao bì nhôm tái chế 100%.', result: 'Doanh thu cửa hàng Flagship tăng 210% trong quý đầu ra mắt; dự án đạt huy hiệu Behance Featured mảng Branding với 18.400 lượt xem.' },
        { challenge: 'Hơn 40 sản phẩm con của hệ sinh thái Solaris thiếu sự đồng nhất về giao diện, làm chậm tốc độ phát triển tính năng mới của đội ngũ 120 kỹ sư.', solution: 'Kiến trúc bộ Design Token mã nguồn mở đa tầng, 180+ component chuẩn WCAG AAA, kèm tài liệu tương tác trực tiếp.', result: 'Rút ngắn 55% thời gian chuyển giao từ thiết kế sang lập trình (Design-to-Dev handoff) trên toàn tập đoàn.' },
        { challenge: 'Làm sao để biến tần số âm thanh giao hưởng thành ngôn ngữ đồ họa có thể in ấn lẫn trình chiếu thời gian thực.', solution: 'Viết thuật toán WebGL chuyển đổi cường độ âm thanh thành hệ lưới hình học biến thiên theo từng chương nhạc.', result: 'Thu hút 45.000 khách tham quan triển lãm trong 2 tháng và được vinh danh tại Tokyo TDC.' }
      ],
      stats: '8+ | Năm kinh nghiệm\n6 | Dự án tiêu biểu\n55+ | Thương hiệu dẫn dắt\n4 | Giải thưởng quốc tế',
      services: 'Chỉ đạo nghệ thuật (Art Direction) | Định hướng concept, moodboard, nhiếp ảnh và ngôn ngữ hình ảnh xuyên suốt chiến dịch\nHệ thống Nhận diện Thương hiệu | Logo, hệ lưới, bảng màu, custom typeface và cẩm nang thương hiệu toàn diện\nThiết kế Bao bì & Trải nghiệm | Cấu trúc hộp độc bản, chất liệu bền vững và trải nghiệm mở hộp (unboxing)',
      process: 'Khảo sát & Định vị | Phân tích văn hóa thương hiệu, đối thủ và tâm lý thị giác người dùng mục tiêu\nConcept & Moodboard | Xây dựng 3 hướng tiếp cận thẩm mỹ kèm nguyên mẫu chất liệu thực tế\nThực thi Hệ thống | Phát triển chi tiết từ bộ chữ, màu sắc, 3D render đến quy chuẩn ứng dụng\nChuyển giao & Giám sát | Bàn giao guideline, giám sát sản xuất in ấn và ra mắt chiến dịch',
      experience: '2023 – nay | Creative Director | Atelier Studio Sài Gòn | Dẫn dắt đội ngũ 14 nhà thiết kế đa ngành\n2020 – 2023 | Senior Art Director | Ogilvy & Mather | Phụ trách nhóm khách hàng FMCG & Tech\n2018 – 2020 | Brand Designer | M—N Associates | Thiết kế nhận diện và bao bì',
      awards: '2025 | Giải Bạc Thiết kế Bao bì (ví dụ) | Sustainable Packaging Design\n2024 | Dự án tiêu biểu (ví dụ) | Branding, Graphic Design & Packaging\n2023 | Giải Thiết kế Thương hiệu (ví dụ) | Brand & Communication Design',
      testimonials: 'Tư duy hệ thống và gu thẩm mỹ vượt trội, biến bài toán kinh doanh khó thành câu chuyện thị giác đầy cảm xúc. | Lê Minh Quân | CMO, Kuro Group\nBộ nhận diện mới giúp sản phẩm của chúng tôi nổi bật hoàn toàn trên kệ hàng quốc tế. | Sarah Jenkins | Brand VP, Solaris',
      clients: 'Kuro Matcha, Solaris AI, Pine Magazine, Vela Fashion, Studio Mây, Nhà sách Gió'
    },
    en: {
      role: 'Creative & Art Director',
      bio: 'Shaping multi-touchpoint brand worlds and visual systems for technology, hospitality and cultural institutions. 8 years of craft, with featured work across Branding & Interaction.',
      skills: 'Art Direction, Brand Architecture, Design Systems, 3D Key Visual, Packaging, Editorial Typography, Figma, Cinema 4D',
      projects: 'Kuro Matcha Flagship | Brand Identity | 2026 | Reimagining craft Japanese matcha across 18 Asian flagship stores |\nSolaris OS 2.0 | Design System | 2025 | Cross-platform design language for an enterprise AI cloud |\nSymphony of Light | Exhibition | 2025 | Audio-reactive kinetic identity and spatial exhibition |\nIndochine Roast | Packaging | 2024 | Specialty coffee packaging series, packaging award winner |',
      projectDetails: [
        { challenge: 'A saturated matcha market dominated by predictable green palettes made premium differentiation difficult for urban Gen-Z consumers.', solution: 'Crafted a brutalist-zen identity inspired by black Raku pottery paired with electric emerald, custom Chasen-stroke typography, and 100% recyclable brushed aluminum tins.', result: '+210% flagship store revenue in Q1; awarded Behance Featured in Branding with 18.4k views.' },
        { challenge: 'Over 40 sub-products lacked visual cohesion, slowing feature delivery across 120 engineers.', solution: 'Architected an open-source multi-tier token system and 180+ WCAG AAA accessible components.', result: 'Cut design-to-engineering handoff time by 55% org-wide.' }
      ],
      stats: '8+ | Years leading craft\n6 | Dự án tiêu biểu\n55+ | Brands shipped\n4 | Global awards',
      services: 'Art Direction | Campaign concepts, visual worlds, film & photography direction\nBrand Identity Systems | Strategy, logo systems, custom type and living brand guidelines\nPackaging & Spatial | Structural packaging, sustainable materials and retail experiences',
      process: 'Discovery & Audit | Cultural research, competitive audit and strategic positioning\nVisual Territory | Three distinct art direction routes and tactile prototypes\nSystem Craft | Full identity rollout, 3D visualization and motion rules\nDelivery & Stewardship | Comprehensive brand book and production supervision',
      experience: '2023 – Present | Creative Director | Atelier Studio | Leading a 14-person multidisciplinary team\n2020 – 2023 | Senior Art Director | Ogilvy | Regional tech & lifestyle accounts',
      awards: '2025 | Packaging Design Silver (sample) | Packaging Design\n2024 | Featured projects (sample) | Branding & Interaction',
      testimonials: 'Rare combination of strategic rigor and unforgettable visual craft. | Sarah Jenkins | VP Brand, Solaris',
      clients: 'Kuro Matcha, Solaris AI, Lam Coffee, Nova Games, Saffron Media'
    }
  },
  {
    id: 'ai_ds', icon: '✦', style: 'claude', color: '#d97757',
    label: { vi: 'Kỹ sư AI / Thiết kế Ấm áp', en: 'AI Engineer / Warm Editorial' },
    vi: {
      role: 'AI Systems Architect & Open-Source Researcher',
      bio: 'Nghiên cứu và xây dựng các hệ thống Agentic AI, giao diện tương tác ngôn ngữ tự nhiên theo triết lý thiết kế ấm áp, minh bạch.',
      skills: 'LLM Agents, Python, TypeScript, RAG Architecture, PyTorch, WebGPU, Design Systems, Open-Source',
      projects: 'VietRAG Studio | Open-Source AI | 2026 | Engine truy xuất tri thức tiếng Việt độ trễ dưới 80ms, 3.200+ GitHub Stars |\nWarm-UI Kit | Design System | 2025 | Bộ thư viện giao diện ấm áp phong cách học thuật cho ứng dụng AI |\nDocuMind Agent | Enterprise AI | 2025 | Hệ thống tự động bóc tách và đối soát hợp đồng pháp lý đa ngôn ngữ |\nLocalVoice Whisper | Edge AI | 2024 | Mô hình nhận diện giọng nói chạy 100% trên trình duyệt bằng WebGPU |',
      projectDetails: [
        { challenge: 'Các mô hình RAG đa ngôn ngữ thường hiểu sai ngữ cảnh văn bản pháp lý và tài chính tiếng Việt phức tạp.', solution: 'Thiết kế kiến trúc Hybrid Semantic + BM25 kết hợp bộ phân tách câu chuyên biệt tiếng Việt và giao diện trích dẫn nguồn minh bạch.', result: 'Đạt độ chính xác 94.8% trên tập benchmark nội bộ và thu hút hơn 3.200 sao trên GitHub sau 3 tháng mở mã nguồn.' },
        { challenge: 'Giao diện các công cụ AI hiện tại thường lạnh lẽo, rối mắt và thiếu cảm giác tin cậy khi đọc văn bản dài.', solution: 'Phát triển hệ thống thiết kế mã nguồn mở lấy cảm hứng từ giấy in cổ điển (#f4f0e8), font Source Serif 4 và thẻ Artifact trực quan.', result: 'Được hơn 450 dự án mã nguồn mở tích hợp, tăng 38% thời gian đọc sâu của người dùng.' }
      ],
      stats: '4.8k+ | GitHub Stars\n18 | Dự án Mã nguồn mở\n94.8% | Độ chính xác RAG\n6+ | Năm làm AI & Web',
      services: 'Kiến trúc Hệ thống AI & RAG | Thiết kế pipeline dữ liệu, вектор database và tối ưu hóa độ trễ LLM\nThiết kế Giao diện AI (Human-AI UX) | Xây dựng trải nghiệm hội thoại, Artifact canvas và luồng làm việc thông minh\nĐào tạo & Tư vấn Mã nguồn mở | Chuẩn hóa quy trình đánh giá (Evals) và triển khai mô hình nội bộ an toàn',
      process: 'Định nghĩa Bài toán & Bộ đo (Evals) | Xây dựng tập dữ liệu kiểm thử chuẩn xác trước khi chọn mô hình\nKiến trúc & Nguyên mẫu | Kết hợp thuật toán cổ điển và LLM để tối ưu chi phí – tốc độ\nThiết kế Trải nghiệm Minh bạch | Hiển thị rõ nguồn trích dẫn, độ tin cậy và khả năng chỉnh sửa\nKiểm thử & Mở Mã nguồn | Đánh giá tải thực tế, viết tài liệu chuẩn chỉnh cho cộng đồng',
      experience: '2024 – nay | Principal AI Engineer | OpenLab VN | Kiến trúc sư trưởng mảng Agentic Workflow\n2021 – 2024 | Senior Full-stack & ML Engineer | TechCorp | Phát triển nền tảng tìm kiếm ngữ nghĩa',
      awards: '2025 | GitHub Trending Developer | TypeScript & Python\n2024 | Giải Nhất Hackathon AI Quốc gia | Hạng mục Ứng dụng Doanh nghiệp',
      testimonials: 'Hệ thống RAG do bạn thiết kế đã giảm 70% thời gian tra cứu quy định nội bộ cho 2.000 nhân sự của chúng tôi. | Trần Quốc Bảo | CTO, FinBank',
      clients: 'FinBank, OpenLab, Hoa Tea House, Techvina'
    },
    en: {
      role: 'AI Systems Architect & Design Engineer',
      bio: 'Building reliable agentic workflows, local-first AI tools, and warm human-centered interfaces inspired by open-source research and editorial typography.',
      skills: 'LLM Agents, Python, TypeScript, RAG Systems, PyTorch, WebGPU, Design Engineering, Open-Source',
      projects: 'OpenRAG Studio | Open-Source AI | 2026 | Sub-80ms hybrid retrieval engine with 3,200+ GitHub Stars |\nWarmth UI | Design System | 2025 | Open-source editorial component library inspired by literary print |\nDocuMind Agent | Enterprise AI | 2025 | Multi-step contract verification agent with verifiable citations |\nBrowserWhisper | Edge AI | 2024 | 100% client-side speech-to-text powered by WebGPU |',
      projectDetails: [
        { challenge: 'Standard vector search struggled with dense legal clauses and multi-table financial documents.', solution: 'Built a hybrid lexical-semantic retrieval pipeline with layout-aware chunking and inline citation cards.', result: '94.8% citation precision and 3.2k+ stars on GitHub.' }
      ],
      stats: '4.8k+ | GitHub Stars\n18 | Open-Source Repos\n94.8% | Eval Precision\n6+ | Years in AI & Web',
      services: 'Agentic & RAG Architecture | Low-latency retrieval, evaluation harnesses and tool-use pipelines\nAI Interface Design | Artifact canvases, streaming typography and trustworthy human-in-the-loop UX\nOpen-Source Advisory | Model optimization, WebGPU inference and developer documentation',
      process: 'Eval-First Framing | Define measurable benchmarks before model selection\nHybrid Prototyping | Combine deterministic code with structured LLM outputs\nHuman-Centered Craft | Warm, readable interfaces with clear provenance\nProduction & Open Release | Load testing, telemetry and community docs',
      experience: '2024 – Present | Principal AI Engineer | OpenLab | Leading agentic platform architecture\n2021 – 2024 | Staff ML & Frontend Engineer | CloudScale | Semantic search infrastructure',
      awards: '2025 | GitHub Trending Maintainer | Open-Source AI Tools',
      testimonials: 'Cut our internal knowledge lookup time by 70% while keeping every answer verifiable. | Alex Rivera | VP Engineering',
      clients: 'OpenLab, CloudScale, DevTools Collective'
    }
  },
  {
    id: 'design', icon: '✦', style: 'graphic', color: '#e11d48',
    label: { vi: 'Thiết kế Đồ họa & Thương hiệu', en: 'Graphic & Brand Design' },
    vi: {
      role: 'Graphic & Motion Designer',
      bio: 'Mình thiết kế nhận diện thương hiệu, bao bì và chuyển động cho các thương hiệu trẻ. 6 năm kinh nghiệm, 40+ dự án cho F&B, thời trang và công nghệ.',
      skills: 'Branding, Motion Graphics, After Effects, Illustration, Figma, Blender 3D, Packaging, Typography',
      projects: 'Bloom Coffee | Branding | 2026 | Bộ nhận diện cho chuỗi cà phê 12 cửa hàng |\nNeon Nights | Motion | 2025 | Video quảng cáo 30s cho lễ hội âm nhạc |\nLeaf Packaging | Packaging | 2025 | Bao bì trà hữu cơ, giải A Design Award |\nPixel Pets | Illustration | 2024 | Bộ 40 sticker vẽ tay cho ứng dụng chat |\nOrbit App | UI/UX | 2024 | Ứng dụng đặt lịch, tăng 32% tỷ lệ chuyển đổi |\nCube World | 3D | 2023 | Loạt ảnh 3D isometric cho chiến dịch Tết |',
      projectDetails: [
        { challenge: 'Chuỗi 12 quán cà phê Bloom cần diện mạo mới trẻ trung nhưng vẫn giữ được nét thủ công ấm áp.', solution: 'Phát triển bộ linh vật minh họa nét cọ tự nhiên kết hợp bảng màu cam đất – kem bơ trên toàn bộ ly giấy, túi vải và biển hiệu.', result: 'Lượng check-in mạng xã hội tự nhiên tăng 145% sau 1 tháng đổi nhận diện.' },
        { challenge: 'Bao bì trà truyền thống thường sử dụng nhiều màng nilon khó phân hủy.', solution: 'Thiết kế cấu trúc hộp giấy gài origami không dùng keo dán, in mực đậu nành thân thiện môi trường.', result: 'Đoạt giải A\' Design Award 2025 và giúp thương hiệu xuất khẩu sang 4 thị trường châu Âu.' }
      ],
      stats: '6+ | Năm kinh nghiệm\n40+ | Dự án hoàn thành\n25 | Thương hiệu hợp tác\n3 | Giải thưởng thiết kế',
      services: 'Nhận diện thương hiệu | Logo, bảng màu, typography và bộ quy chuẩn sử dụng\nMotion graphics | Video ngắn, logo động, nội dung mạng xã hội\nBao bì sản phẩm | Thiết kế bao bì từ ý tưởng đến file in',
      process: 'Thấu hiểu | Gặp gỡ, tìm hiểu mục tiêu và người dùng\nNghiên cứu | Phân tích đối thủ, moodboard, insight\nÝ tưởng | Phác thảo nhiều hướng, chọn hướng tốt nhất\nThiết kế | Hoàn thiện chi tiết, thử nghiệm thực tế\nBàn giao | File chuẩn, hướng dẫn sử dụng, hỗ trợ sau',
      experience: '2023 – nay | Senior Brand Designer | Bloom Studio | Chủ trì thiết kế cho 20+ khách hàng F&B\n2020 – 2023 | Graphic Designer | Creative Box Agency',
      awards: '2025 | A\' Design Award | Sustainable Packaging\n2024 | Vietnam Halography Feature | Best Brand Identity',
      testimonials: 'File bàn giao cực kỳ chỉn chu, đội in ấn làm việc rất nhàn vì thông số chuẩn tuyệt đối. | Nguyễn Lan Anh | Founder, Bloom Coffee',
      clients: 'Bloom Coffee, Leaf Tea, Orbit, Lumen Labs'
    },
    en: {
      role: 'Graphic & Motion Designer',
      bio: 'I design brand identities, packaging and motion for young brands. 6 years, 40+ projects in F&B, fashion and tech.',
      skills: 'Branding, Motion Graphics, After Effects, Illustration, Figma, Blender 3D, Packaging, Typography',
      projects: 'Bloom Coffee | Branding | 2026 | Identity for a 12-store coffee chain |\nNeon Nights | Motion | 2025 | 30s spot for a music festival |\nLeaf Packaging | Packaging | 2025 | Organic tea packaging, A\' Design Award |\nPixel Pets | Illustration | 2024 | 40 hand-drawn stickers for a chat app |\nOrbit App | UI/UX | 2024 | Booking app, +32% conversion |\nCube World | 3D | 2023 | Isometric 3D series for a campaign |',
      projectDetails: [
        { challenge: 'A 12-store coffee chain needed a fresh identity that felt playful yet artisanal.', solution: 'Created a modular illustration system and warm terracotta palette across cups, totes and signage.', result: '+145% organic social shares within the first month.' }
      ],
      stats: '6+ | Years of experience\n40+ | Projects shipped\n25 | Brands served\n3 | Design awards',
      services: 'Brand identity | Logo, colour, typography and guidelines\nMotion graphics | Short videos, animated logos, social content\nPackaging | From concept to print-ready files',
      process: 'Empathise | Understand goals and users\nResearch | Competitors, moodboard, insights\nIdeate | Sketch many directions, pick the best\nDesign | Refine and test in context\nDeliver | Final files, guidelines, support',
      experience: '2023 – Present | Senior Brand Designer | Bloom Studio\n2020 – 2023 | Graphic Designer | Creative Box',
      awards: '2025 | A\' Design Award | Packaging Design',
      testimonials: 'Print-ready files were flawless and the new packaging flew off the shelves. | Maya Lin | Founder, Leaf Tea',
      clients: 'Bloom Coffee, Leaf Tea, Orbit'
    }
  },
  {
    id: 'uiux', icon: '◈', style: 'uiux', color: '#7c3aed',
    label: { vi: 'UI/UX & Thiết kế Sản phẩm', en: 'UI/UX & Product Design' },
    vi: {
      role: 'Senior Product Designer (UI/UX)',
      bio: 'Thiết kế sản phẩm số dễ dùng, đo lường bằng số liệu thực tế. Từ nghiên cứu người dùng, luồng trải nghiệm đến hệ thống thiết kế (Design System) quy mô lớn.',
      skills: 'Product Design, User Research, Figma, Design Systems, Prototyping, Usability Testing, Design Tokens, HTML/CSS',
      projects: 'FinTrack SuperApp | Mobile App | 2026 | Ứng dụng quản lý chi tiêu cá nhân, 500k lượt tải, 4.8★ App Store |\nMediBook Clinic | Healthcare UX | 2025 | Đặt lịch khám bệnh 3 bước, giảm 45% tỷ lệ bỏ dở |\nAtlas Design System | Design System | 2025 | 140+ component đa nền tảng cho 6 sản phẩm nội bộ |\nLearnFlow LMS | EdTech | 2024 | Nền tảng học trực tuyến, tăng 28% tỷ lệ hoàn thành khóa học |',
      projectDetails: [
        { challenge: 'Người dùng mới của ứng dụng tài chính thường bỏ cuộc ở bước liên kết ngân hàng và phân loại giao dịch thủ công.', solution: 'Thiết kế lại luồng Onboarding trong 45 giây kèm tính năng quét hóa đơn tự động và biểu đồ dòng tiền trực quan.', result: 'Tăng tỷ lệ kích hoạt người dùng ngày đầu (D1 Activation) từ 34% lên 68%, đạt 4.8★ trên App Store.' },
        { challenge: 'Bệnh nhân lớn tuổi gặp khó khăn khi đặt lịch khám chuyên khoa trên điện thoại vì chữ nhỏ và quá nhiều trường thông tin.', solution: 'Áp dụng chế độ hiển thị tương phản cao, trợ lý giọng nói hướng dẫn từng bước và rút gọn form từ 11 bước xuống 3 bước.', result: 'Giảm 45% tỷ lệ thoát trang đặt lịch và giảm 60% cuộc gọi nhờ hỗ trợ tổng đài.' }
      ],
      stats: '5+ | Năm thiết kế sản phẩm\n3 | Sản phẩm >100k người dùng\n140+ | Component trong Design System\n+38% | Tăng chuyển đổi trung bình',
      services: 'UX Audit & Nghiên cứu | Đánh giá sản phẩm hiện tại, phỏng vấn người dùng, bản đồ hành trình\nThiết kế UI & Prototype | Giao diện web/app chuẩn chỉnh, nguyên mẫu tương tác mượt mà trên Figma\nDesign System | Xây dựng thư viện component, biến màu/chữ (Tokens) đồng bộ với đội ngũ Dev',
      process: 'Khám phá | Phân tích số liệu phễu (Funnel), phỏng vấn người dùng\nXác định vấn đề | Luồng người dùng, kiến trúc thông tin\nThiết kế & Prototype | Wireframe, UI chi tiết, nguyên mẫu có thể bấm thử\nKiểm thử & Đo lường | Usability test, theo dõi chỉ số sau khi ra mắt',
      experience: '2023 – nay | Lead Product Designer | FinTrack | Phụ trách trải nghiệm Core Banking & Wealth\n2021 – 2023 | Product Designer | MediTech VN',
      awards: '2025 | Golden App Award | Best Financial UX\n2024 | UI Kit Cộng đồng Tiêu biểu (ví dụ) | Atlas UI Kit',
      testimonials: 'Mỗi quyết định thiết kế đều đi kèm dữ liệu thuyết phục và sự thấu cảm sâu sắc với người dùng cuối. | Hoàng Minh Tuấn | CPO, FinTrack',
      clients: 'FinTrack, MediBook, LearnFlow, River Press, Kite Studio'
    },
    en: {
      role: 'Senior Product Designer (UI/UX)',
      bio: 'Designing digital products people understand at a glance and businesses can measure. From user research to scalable multi-brand design systems.',
      skills: 'Product Design, User Research, Figma, Design Systems, Prototyping, Usability Testing, Design Tokens, HTML/CSS',
      projects: 'FinTrack SuperApp | Mobile App | 2026 | Personal finance app, 500k downloads, 4.8★ rating |\nMediBook Clinic | Healthcare UX | 2025 | 3-step clinic booking, -45% drop-off |\nAtlas Design System | Design System | 2025 | 140+ components across 6 products |\nLearnFlow LMS | EdTech | 2024 | Online learning platform, +28% course completion |',
      projectDetails: [
        { challenge: 'New users dropped off during manual expense categorization.', solution: 'Redesigned a 45-second onboarding flow with receipt scanning and visual cashflow rings.', result: 'Lifted Day-1 activation from 34% to 68%.' }
      ],
      stats: '5+ | Years in product\n3 | Apps over 100k users\n140+ | System components\n+38% | Avg. conversion lift',
      services: 'UX Audit & Research | Heuristic review, user interviews, journey mapping\nUI & Interactive Prototyping | High-craft web and mobile interfaces\nDesign Systems | Token architecture and Figma component libraries',
      process: 'Discover | Analytics review and user interviews\nDefine | Flows and information architecture\nDesign | Wireframes, high-fidelity UI and interactive prototypes\nValidate | Usability testing and post-launch metrics',
      experience: '2023 – Present | Lead Product Designer | FinTrack\n2021 – 2023 | Product Designer | MediTech',
      awards: '2025 | Community UI Kit (sample) | Atlas UI Kit',
      testimonials: 'Every design decision was backed by clear user evidence and measurable business impact. | David Kim | VP Product',
      clients: 'FinTrack, MediBook, LearnFlow'
    }
  },
  {
    id: 'dev', icon: '</>', style: 'opensource', color: '#10b981',
    label: { vi: 'Lập trình viên & Open Source', en: 'Developer & Open Source' },
    vi: {
      role: 'Full-Stack & Open-Source Engineer',
      bio: 'Xây dựng ứng dụng web tốc độ cao, kiến trúc Cloud-native và đóng góp mã nguồn mở. Ưu tiên code sạch, tự động hóa và trải nghiệm người dùng mượt mà.',
      skills: 'TypeScript, React, Astro, Node.js, Go, PostgreSQL, Docker, Cloudflare Workers',
      projects: 'Pulse Monitor | SaaS / Open-Source | 2026 | Hệ thống giám sát uptime cho 1.200+ website, thông báo tức thì |\nMarkdown Studio | Open Source | 2025 | Trình soạn thảo Markdown local-first, 1.800★ trên GitHub |\nVietPay SDK | FinTech Library | 2025 | Thư viện tích hợp thanh toán QR đa ngân hàng cho Node.js |\nFastCart Edge | E-commerce | 2024 | Nền tảng thương mại điện tử tải trang dưới 0.4 giây trên Cloudflare |',
      projectDetails: [
        { challenge: 'Các công cụ kiểm tra uptime truyền thống tốn nhiều tài nguyên máy chủ và chi phí cao khi kiểm tra từ nhiều khu vực.', solution: 'Viết engine kiểm tra phân tán chạy trên Cloudflare Workers kết hợp cơ sở dữ liệu Time-series siêu nhẹ.', result: 'Xử lý 5 triệu lượt ping/ngày với chi phí hạ tầng dưới 15 USD/tháng.' }
      ],
      stats: '5+ | Năm lập trình\n25+ | Dự án hoàn thành\n2.4k+ | GitHub Stars\n99.95% | Uptime hệ thống',
      services: 'Phát triển Web Full-stack | Từ giao diện chuẩn SEO đến API và cơ sở dữ liệu chịu tải cao\nTối ưu hiệu năng & Edge | Tăng tốc trang web đạt 100 điểm Core Web Vitals, giảm chi phí server\nTích hợp API & Tự động hóa | Kết nối cổng thanh toán, CRM, Webhook và CI/CD',
      process: 'Phân tích kỹ thuật | Chốt yêu cầu, kiến trúc dữ liệu và bảo mật\nKhởi tạo & CI/CD | Dựng khung dự án, kiểm thử tự động\nPhát triển từng phân hệ | Giao sản phẩm chạy được mỗi tuần\nTriển khai & Giám sát | Đưa lên môi trường thật, theo dõi log và tối ưu',
      experience: '2022 – nay | Senior Software Engineer | CloudEdge | Kiến trúc hệ thống phân tán\n2020 – 2022 | Backend Developer | PayTech VN',
      awards: '2025 | GitHub Star Program Nominee | Open-Source Contributions',
      testimonials: 'Tốc độ tải trang giảm từ 4.2s xuống 0.35s ngay sau đợt tái cấu trúc. | Lê Hoàng Nam | CTO, FastCart',
      clients: 'FastCart, PayTech, CloudEdge'
    },
    en: {
      role: 'Full-Stack & Open-Source Engineer',
      bio: 'Building fast, reliable web applications and open-source developer tools. Focused on clean architecture, edge computing and crisp interfaces.',
      skills: 'TypeScript, React, Astro, Node.js, Go, PostgreSQL, Docker, Cloudflare Workers',
      projects: 'Pulse Monitor | SaaS | 2026 | Distributed uptime monitoring for 1,200+ sites |\nMarkdown Studio | Open Source | 2025 | Local-first Markdown editor, 1,800★ on GitHub |\nPayKit SDK | FinTech | 2025 | Unified payment gateway SDK for Node.js |\nFastCart Edge | E-commerce | 2024 | Sub-400ms storefront running at the edge |',
      projectDetails: [
        { challenge: 'Multi-region uptime checks were expensive on traditional VMs.', solution: 'Built a stateless edge worker scheduler with lightweight time-series aggregation.', result: '5M daily checks under $15/mo infrastructure cost.' }
      ],
      stats: '5+ | Years coding\n25+ | Projects shipped\n2.4k+ | GitHub stars\n99.95% | Uptime maintained',
      services: 'Full-stack web apps | From SEO-ready frontend to database & APIs\nPerformance & Edge | Core Web Vitals optimization and serverless migration\nIntegrations | Payments, third-party APIs and CI/CD automation',
      process: 'Scope | Requirements and data model\nScaffold | Project setup and automated tests\nIterate | Working increments every week\nShip | Production deploy and monitoring',
      experience: '2022 – Present | Senior Software Engineer | CloudEdge',
      awards: '2025 | Open-Source Maintainer Fellowship',
      testimonials: 'Cut our storefront load time from 4.2s to 350ms. | Chris Taylor | CTO, FastCart',
      clients: 'FastCart, CloudEdge'
    }
  },
  {
    id: 'arch', icon: '⌂', style: 'blueprint', color: '#0284c7',
    label: { vi: 'Kiến trúc & Nội thất', en: 'Architecture & Interior' },
    vi: {
      role: 'Kiến trúc sư & Thiết kế Nội thất',
      bio: 'Thiết kế không gian sống và thương mại chú trọng ánh sáng tự nhiên, thông gió nhiệt đới và vật liệu bản địa bền vững. 7 năm hành nghề tại TP.HCM và Đà Nẵng.',
      skills: 'Kiến trúc nhà ở, Nội thất thương mại, AutoCAD, Revit, SketchUp, Lumion, V-Ray, Giám sát tác giả',
      projects: 'Nhà Trong Ngõ | Nhà phố nhiệt đới | 2026 | Nhà ống 4×16m ngập nắng nhờ 3 khoảng giếng trời lệch tầng |\nAn Yên Retreat | Resort nghỉ dưỡng | 2025 | 14 bungalow tre, đá tổ ong và đất nện tại Bảo Lộc |\nTiệm Trà Mộc | F&B Interior | 2025 | Không gian 120m² từ gỗ thông tái chế và gạch bông cổ điển |\nCăn hộ Thảo Điền | Nội thất Penthouse | 2024 | Cải tạo căn hộ 180m² phong cách Wabi-Sabi đương đại |',
      projectDetails: [
        { challenge: 'Khu đất 4×16m nằm sâu trong hẻm nhỏ Sài Gòn, bị vây kín 3 mặt bởi nhà cao tầng nên thiếu sáng và bí khí.', solution: 'Tạo hệ thông tầng chéo kết hợp mặt đứng gạch thông gió đất nung và vườn treo ở giữa nhà.', result: 'Giảm 4°C nhiệt độ phòng vào mùa khô mà không cần bật điều hòa ban ngày; đăng tải trên ArchDaily.' }
      ],
      stats: '7+ | Năm hành nghề\n32 | Công trình hoàn thiện\n4.800m² | Tổng diện tích thiết kế\n2 | Công trình đăng ArchDaily',
      services: 'Thiết kế kiến trúc | Hồ sơ ý tưởng, bản vẽ kỹ thuật thi công và xin phép xây dựng\nThiết kế nội thất | Bố trí mặt bằng, phối cảnh 3D, hồ sơ chi tiết đồ rời và vật liệu\nGiám sát tác giả | Đồng hành cùng chủ đầu tư tại công trường đảm bảo đúng thiết kế',
      process: 'Khảo sát hiện trạng | Đo đạc khu đất, hướng nắng gió và lắng nghe nếp sinh hoạt gia đình\nPhương án mặt bằng | Đề xuất tổ chức không gian và phối cảnh khối sơ bộ\nHồ sơ kỹ thuật | Triển khai chi tiết kiến trúc, kết cấu, điện nước và dự toán\nGiám sát hoàn thiện | Kiểm tra vật liệu mẫu và nghiệm thu từng giai đoạn',
      experience: '2022 – nay | Chủ trì thiết kế | Hiên Atelier | Chuyên biệt kiến trúc nhiệt đới\n2019 – 2022 | Kiến trúc sư | Tropical Space Studio',
      awards: '2025 | Ashui Awards | Dự án Nhà ở của Năm (Đề cử)\n2024 | ArchDaily Building of the Year | Featured Vietnam Entry',
      testimonials: 'Ngôi nhà luôn tràn ngập gió mát và ánh nắng dịu đúng như những gì gia đình tôi hằng mơ ước. | Gia đình anh Minh | Chủ đầu tư Nhà Trong Ngõ',
      clients: 'An Yên Retreat, Tiệm Trà Mộc, Sơn Hà Group'
    },
    en: {
      role: 'Architect & Interior Designer',
      bio: 'Designing residential and hospitality spaces rooted in natural daylight, passive tropical ventilation and honest local materials.',
      skills: 'Residential Architecture, Commercial Interior, AutoCAD, Revit, SketchUp, Lumion, V-Ray, Site Supervision',
      projects: 'Alley Courtyard House | Residential | 2026 | 4×16m tube house lit by three staggered courtyards |\nAn Yen Retreat | Hospitality | 2025 | 14 bamboo and rammed-earth bungalows in the highlands |\nMoc Tea House | F&B Interior | 2025 | 120m² teahouse built with reclaimed pine and handmade tiles |\nThao Dien Residence | Interior | 2024 | 180m² contemporary Wabi-Sabi apartment renovation |',
      projectDetails: [
        { challenge: 'A narrow 4×16m urban plot hemmed in on three sides with zero natural cross-ventilation.', solution: 'Inserted diagonal lightwells and a perforated terracotta facade.', result: 'Reduced indoor peak temperature by 4°C passively; featured on ArchDaily.' }
      ],
      stats: '7+ | Years in practice\n32 | Built works\n4,800m² | Designed area\n2 | ArchDaily features',
      services: 'Architectural design | Concept through construction drawings\nInterior design | Space planning, 3D visualization, custom millwork\nSite supervision | Material reviews and on-site quality control',
      process: 'Site & Brief | Climate study and lifestyle interviews\nConcept | Plans, massing and material palette\nTechnical Docs | Detailed drawings and BOQ\nSite Stewardship | Regular site visits through handover',
      experience: '2022 – Present | Principal Architect | Hien Atelier',
      awards: '2024 | ArchDaily Featured Project | Residential Architecture',
      testimonials: 'Our home breathes with daylight and breeze all day long. | Mr. Minh | Homeowner',
      clients: 'An Yen Retreat, Moc Tea House'
    }
  },
  {
    id: 'industrial', icon: '⚙', style: 'industrial', color: '#ea580c',
    label: { vi: 'Thiết kế Công nghiệp & 3D', en: 'Industrial & 3D Product' },
    vi: {
      role: 'Industrial & Hardware Product Designer',
      bio: 'Thiết kế kiểu dáng công nghiệp, thiết bị điện tử tiêu dùng và đồ gia dụng thông minh theo triết lý công năng "Ít nhưng tốt hơn".',
      skills: 'Industrial Design, SolidWorks, Rhino 3D, KeyShot, CMF Design, Rapid Prototyping, In 3D SLA, DFM',
      projects: 'MonoBrew Espresso | Thiết bị gia dụng | 2026 | Máy pha cà phê nhôm nguyên khối CNC tối giản cho căn hộ nhỏ |\nAether Headphones | Âm thanh cá nhân | 2025 | Tai nghe mô-đun có thể tự thay thế đệm tai và pin trong 10 giây |\nKrono Desk Clock | Phụ kiện bàn làm việc | 2025 | Đồng hồ cơ học kết hợp bộ đếm Pomodoro bằng núm xoay xúc giác |\nTerra Air Purifier | Điện tử tiêu dùng | 2024 | Máy lọc không khí vỏ gốm nung thủ công hòa hợp nội thất |',
      projectDetails: [
        { challenge: 'Hầu hết tai nghe chống ồn hiện nay đều bị vứt bỏ sau 2 năm khi pin chai hoặc bong tróc đệm da vì dán keo chết.', solution: 'Thiết kế khớp khóa từ tính cơ học cho phép tháo rời củ loa, viên pin chuẩn USB-C và đệm tai mà không cần tua-vít.', result: 'Gọi vốn thành công 420.000 USD qua gọi vốn cộng đồng và đạt một giải thiết kế sản phẩm 2025.' }
      ],
      stats: '6+ | Năm thiết kế phần cứng\n14 | Sản phẩm thương mại hóa\n3 | Bằng sáng chế kiểu dáng\n2 | Giải thiết kế sản phẩm',
      services: 'Kiểu dáng Công nghiệp (ID) | Phác thảo ý tưởng, dựng hình bề mặt Class-A và nguyên mẫu thực tế\nThiết kế Vật liệu & Hoàn thiện (CMF) | Tuyển chọn hợp kim, nhựa kỹ thuật, xử lý bề mặt anodize và màu sắc\nTối ưu Sản xuất Hàng loạt (DFM) | Làm việc trực tiếp với nhà máy khuôn mẫu để tối ưu giá thành lắp ráp',
      process: 'Nghiên cứu Công thái học | Khảo sát thao tác cầm nắm và thói quen sử dụng thực tế\nPhác thảo & In 3D | Tạo 10+ mẫu mockup bọt xốp và nhựa SLA để kiểm tra tỷ lệ\nKỹ thuật Cơ khí & CMF | Dựng CAD chi tiết, mô phỏng va đập và chọn vật liệu\nChuyển giao Khuôn mẫu | Giám sát ép thử (T0/T1) và kiểm định chất lượng lô đầu',
      experience: '2022 – nay | Lead Industrial Designer | Objekt Studio | Thiết kế phần cứng cho thị trường Âu – Mỹ\n2019 – 2022 | CAD & Product Engineer | Precision Tech',
      awards: '2025 | Product Design Award (sample) | Product Discipline\n2024 | Design Concept Award (sample) | Sustainable Electronics',
      testimonials: 'Thiết kế vừa mang vẻ đẹp vượt thời gian vừa giúp nhà máy giảm 22% số lượng linh kiện lắp ráp. | Hans Weber | VP Hardware, Aether Audio',
      clients: 'Aether Audio, MonoBrew, Terra Home'
    },
    en: {
      role: 'Industrial & Hardware Product Designer',
      bio: 'Crafting tactile consumer electronics, modular audio gear and home appliances guided by functionalist clarity and sustainable manufacturing.',
      skills: 'Industrial Design, SolidWorks, Rhino 3D, KeyShot, CMF Design, Rapid Prototyping, SLA 3D Printing, DFM',
      projects: 'MonoBrew Espresso | Home Appliance | 2026 | CNC-machined anodized aluminum lever espresso maker |\nAether Modular Headphones | Consumer Audio | 2025 | Tool-free repairable wireless headphones |\nKrono Tactile Timer | Desk Object | 2025 | Mechanical Pomodoro timer with knurled brass dial |\nTerra Ceramic Purifier | Smart Home | 2024 | Slip-cast stoneware air purifier |',
      projectDetails: [
        { challenge: 'Most wireless headphones become e-waste within 2 years due to glued batteries and earpads.', solution: 'Engineered a magnetic bayonet latch allowing 10-second battery and cushion swaps.', result: '$420k raised via crowdfunding and a 2025 product design award.' }
      ],
      stats: '6+ | Years in hardware\n14 | Mass-produced products\n3 | Design patents\n2 | Product design awards',
      services: 'Industrial Design | Concept sketching, ergonomic studies and CAD surfacing\nCMF Specification | Material sourcing, anodizing and tactile finishes\nDesign for Manufacturing (DFM) | Tooling liaison and assembly optimization',
      process: 'Ergonomic Study | Human factors and tactile mockups\n3D Prototyping | Iterative SLA prints and mechanism tests\nCAD & CMF | Production-grade surfacing and finish boards\nTooling Support | T0/T1 factory sampling through mass production',
      experience: '2022 – Present | Lead Industrial Designer | Objekt Studio',
      awards: '2025 | Product Design Award (sample) | Consumer Audio',
      testimonials: 'Timeless aesthetic paired with a 22% reduction in part count for our assembly line. | Hans Weber | VP Hardware',
      clients: 'Aether Audio, MonoBrew, Terra Home'
    }
  },
  {
    id: 'photo', icon: '◎', style: 'photo', color: '#f59e0b',
    label: { vi: 'Nhiếp ảnh gia', en: 'Photographer' },
    vi: {
      role: 'Nhiếp ảnh gia Thương mại & Chân dung',
      bio: 'Kể chuyện bằng ánh sáng tự nhiên và bố cục điện ảnh. Chuyên chụp lookbook thời trang, ẩm thực cao cấp và chân dung nghệ sĩ.',
      skills: 'Chân dung, Lookbook Thời trang, Nhiếp ảnh Ẩm thực, Ánh sáng Studio, Capture One, Lightroom, Retouching',
      projects: 'Mùa Hè Ở Đảo | Editorial | 2026 | Bộ ảnh 24 tấm trên tạp chí Đẹp số tháng 6 |\nBếp Nhà Hàng Xóm | Ẩm thực | 2025 | Bộ ảnh thực đơn cho chuỗi 8 nhà hàng |\nChân Dung Nghệ Sĩ | Portrait | 2025 | Series chân dung đen trắng 15 nhạc sĩ độc lập |\nLụa Tân Châu | Lookbook | 2024 | Chiến dịch thu đông cho thương hiệu lụa thủ công |',
      projectDetails: [
        { challenge: 'Chụp bộ sưu tập lụa đen truyền thống dưới nắng gắt miền Tây mà vẫn giữ được độ bóng mềm mại của sợi tơ tự nhiên.', solution: 'Sử dụng hệ khung vải khuếch tán lớn kết hợp chụp vào khung giờ vàng 5h30 sáng bên bờ sông Tiền.', result: 'Bộ ảnh được chọn làm trang bìa tạp chí và giúp bộ sưu tập cháy hàng sau 2 tuần mở bán.' }
      ],
      stats: '8+ | Năm cầm máy\n180+ | Buổi chụp thương mại\n12 | Tạp chí đăng tải\n35 | Thương hiệu đồng hành',
      services: 'Chụp thương mại & sản phẩm | Lookbook, ẩm thực, nội thất phục vụ chiến dịch quảng cáo\nChân dung cá nhân & doanh nghiệp | Profile lãnh đạo, nghệ sĩ, ảnh bìa album\nHậu kỳ & Chỉnh màu | Retouch giữ kết cấu da tự nhiên, dựng màu riêng cho thương hiệu',
      process: 'Moodboard & Concept | Thống nhất tông màu, bối cảnh, ánh sáng\nTiền kỳ | Khảo sát địa điểm, thiết bị, ekip styling\nBuổi chụp | Chụp kết nối màn hình trực tiếp (Tethering) để khách duyệt tại chỗ\nHậu kỳ | Chọn lọc và bàn giao file chất lượng in ấn & digital',
      experience: '2020 – nay | Founder & Lead Photographer | Свет Studio Sài Gòn',
      awards: '2025 | Monochrome Awards | Honorable Mention in Portrait',
      testimonials: 'Ánh sáng trong trẻo và khả năng bắt khoảnh khắc tự nhiên đáng kinh ngạc. | Minh Hạnh | Creative Director',
      clients: 'Delta Audio, Mộc Bakery, Lụa Tân Châu, Sol Records'
    },
    en: {
      role: 'Commercial & Portrait Photographer',
      bio: 'Telling stories with natural light and cinematic framing. Fashion lookbooks, culinary campaigns and artist portraits.',
      skills: 'Portrait, Fashion Lookbook, Food Photography, Studio Lighting, Capture One, Lightroom, High-end Retouching',
      projects: 'Island Summer | Editorial | 2026 | 24-page magazine spread |\nNeighbour Kitchen | Culinary | 2025 | Menu photography for an 8-restaurant group |\nIndependent Voices | Portrait | 2025 | Black-and-white series of 15 musicians |\nTan Chau Silk | Lookbook | 2024 | Autumn/Winter campaign for a heritage silk label |',
      projectDetails: [
        { challenge: 'Capturing raw black artisanal silk under harsh tropical midday sun without losing delicate weave highlights.', solution: 'Built overhead silk scrims on riverboats at dawn.', result: 'Featured on magazine cover; collection sold out in 2 weeks.' }
      ],
      stats: '8+ | Years shooting\n180+ | Commercial shoots\n12 | Magazine features\n35 | Brands',
      services: 'Commercial & campaign | Fashion, food and interior photography\nPortraiture | Editorial, artist and executive portraits\nRetouching & colour | Natural skin texture and custom colour grading',
      process: 'Moodboard | Visual direction and lighting references\nPre-production | Locations, casting and crew\nShoot day | Tethered capture with live client review\nPost | Selection and print/web delivery',
      experience: '2020 – Present | Lead Photographer | Svet Studio',
      awards: '2025 | Monochrome Awards | Portrait Selection',
      testimonials: 'Effortless direction on set and luminous, timeless colour grading. | Claire Dubois | Art Buyer',
      clients: 'Atlas Retail, Pine Magazine, Vela Fashion'
    }
  },
  {
    id: 'sound', icon: '♫', style: 'sound', color: '#10b981',
    label: { vi: 'Sản xuất Âm nhạc & Sound Design', en: 'Music Producer & Sound Design' },
    vi: {
      role: 'Music Producer & Spatial Sound Designer',
      bio: 'Sáng tác nhạc phim, thiết kế âm thanh tương tác cho game/ứng dụng và hậu kỳ Dolby Atmos. Biến tần số âm thanh thành dấu ấn nhận diện thương hiệu (Sonic Branding).',
      skills: 'Sound Design, Ableton Live, Pro Tools, Dolby Atmos, Wwise (Game Audio), Modular Synth, Mixing & Mastering, Sonic Branding',
      projects: 'Echoes of Saigon | Original Score | 2026 | Nhạc nền phim tài liệu nghệ thuật đạt giải LHP Quốc tế |\nCyberDrift 2099 | Game Audio | 2025 | Hệ thống hơn 600 hiệu ứng âm thanh động cơ và vũ khí tương tác trong Wwise |\nVinaPay Sonic Logo | Sonic Branding | 2025 | Âm thanh báo giao dịch thành công vang lên 5 triệu lần mỗi ngày |\nAnalog Dreams EP | Ambient Album | 2024 | Album nhạc điện tử kết hợp đàn tranh truyền thống và Modular Synth |',
      projectDetails: [
        { challenge: 'Tạo ra âm thanh thông báo thanh toán dài đúng 1.2 giây, vừa mang âm hưởng ngũ cung Việt Nam vừa nghe rõ trên loa điện thoại nhỏ nơi ồn ào.', solution: 'Kết hợp âm bồi của chuông đồng Huế với hợp âm synth ấm ở dải tần 800Hz–2.5kHz tối ưu cho loa di động.', result: 'Tăng 42% mức độ nhận biết thương hiệu qua âm thanh theo khảo sát người dùng.' }
      ],
      stats: '7+ | Năm trong phòng thu\n50+ | Chiến dịch & Phim\n12M+ | Lượt nghe trực tuyến\n600+ | Sound Assets độc quyền',
      services: 'Sonic Branding | Thiết kế logo âm thanh, nhạc chờ và hệ thống âm thanh giao diện ứng dụng (UI Sounds)\nNhạc phim & Quảng cáo | Sáng tác nhạc độc quyền (Original Score) cho TVC, phim ngắn và tài liệu\nGame Audio & Mixing | Thiết kế hiệu ứng SFX, tích hợp Wwise/FMOD và chuẩn hóa âm thanh vòm Dolby Atmos',
      process: 'Sonic Moodboard | Xác định cá tính âm thanh, nhịp điệu và chất liệu nhạc cụ\nThu âm & Tổng hợp (Synthesis) | Thu âm thực địa (Foley), nhạc cụ dân tộc và lập trình Modular Synth\nDàn dựng & Phối khí | Kết hợp âm thanh khớp từng khung hình chuyển động\nMastering Đa nền tảng | Tối ưu chuẩn âm lượng LUFS cho rạp chiếu, Spotify, TV và thiết bị di động',
      experience: '2021 – nay | Founder & Lead Composer | Frequency Lab Studio\n2018 – 2021 | Senior Sound Designer | GlassEgg / Virtuos',
      awards: '2025 | Best Sound Design | Vietnam Indie Film Fest',
      testimonials: 'Chỉ cần nghe 2 nốt nhạc đầu tiên là khách hàng nhận ra ngay thương hiệu của chúng tôi. | Đặng Thu Hà | Brand Director, VinaPay',
      clients: 'VinaPay, Studio Mây, Nhà sách Gió, Lam Coffee'
    },
    en: {
      role: 'Music Producer & Spatial Sound Designer',
      bio: 'Composing original scores, interactive game audio and sonic brand identities. Blending acoustic Vietnamese instruments with modular synthesis.',
      skills: 'Sound Design, Ableton Live, Pro Tools, Dolby Atmos, Wwise, Modular Synth, Mixing & Mastering, Sonic Branding',
      projects: 'Echoes of Saigon | Film Score | 2026 | Original score for an award-winning feature documentary |\nCyberDrift 2099 | Game Audio | 2025 | 600+ adaptive vehicle & weapon SFX in Wwise |\nVinaPay Sonic ID | Sonic Branding | 2025 | Transaction chime heard 5M+ times daily |\nAnalog Dreams | Album | 2024 | Ambient LP blending traditional Dan Tranh zither with Eurorack synths |',
      projectDetails: [
        { challenge: 'Craft a 1.2-second payment confirmation chime that cuts through street noise on tiny phone speakers.', solution: 'Layered a resonant bronze bell harmonic with a warm pentatonic synth triad.', result: '42% lift in unaided brand recall.' }
      ],
      stats: '7+ | Years in studio\n50+ | Films & campaigns\n12M+ | Streams\n600+ | Custom SFX',
      services: 'Sonic Branding | Audio logos, UI sound systems and brand anthems\nOriginal Scoring | Custom music for film, commercial and animation\nGame Audio & Atmos | Foley, Wwise integration and spatial mixing',
      process: 'Sonic Brief | Palette, tempo and emotional territory\nField & Synth Capture | Custom foley and modular synthesis\nPicture Lock Mix | Frame-accurate arrangement\nMulti-Format Master | Broadcast, streaming and mobile calibration',
      experience: '2021 – Present | Lead Composer | Frequency Lab',
      awards: '2025 | Best Sound Design | Indie Film Festival',
      testimonials: 'Two notes and customers immediately recognize our app. | Thu Ha | Brand Director',
      clients: 'VinaPay, Nova Games, Saffron Media'
    }
  },
  {
    id: 'fashion', icon: '❖', style: 'fashion', color: '#be185d',
    label: { vi: 'Thời trang & Stylist', en: 'Fashion & Styling' },
    vi: {
      role: 'Nhà thiết kế Thời trang & Creative Stylist',
      bio: 'Kết hợp kỹ thuật dựng phom cấu trúc (Draping) với chất liệu thủ công bản địa như lụa Lãnh Mỹ A, gai dầu và nhuộm chàm tự nhiên.',
      skills: 'Thiết kế Rập & Draping, Chọn chất liệu bền vững, Styling thương mại, Chỉ đạo sàn diễn, CLO 3D, Minh họa thời trang',
      projects: 'Khói Lam Chiều | Resort Collection | 2026 | Bộ sưu tập 22 thiết kế từ lụa tơ tằm và vải gai nhuộm vỏ cây |\nHồn Đá | Avant-Garde | 2025 | BST trình diễn tại Tuần lễ Thời trang, lấy cảm hứng từ điêu khắc cổ |\nDòng Chảy Đô Thị | Ready-to-Wear | 2025 | Dòng trang phục công sở phi giới tính tối giản |\nTơ Vàng | Bridal Capsule | 2024 | 10 mẫu váy cưới thêu tay thủ công truyền thống |',
      projectDetails: [
        { challenge: 'Chất liệu Lãnh Mỹ A truyền thống có độ đơ cứng nhất định, khó tạo những đường rũ mềm mại theo chuyển động cơ thể.', solution: 'Ứng dụng kỹ thuật cắt xéo canh vải (Bias-cut) kết hợp xử lý làm mềm tự nhiên bằng nước trái mặc nưa.', result: 'Bộ sưu tập được giới thiệu trên Vogue Talents và đặt hàng tại 3 boutique ở Paris và Tokyo.' }
      ],
      stats: '5+ | Năm làm nghề\n8 | Bộ sưu tập ra mắt\n40+ | Dự án Styling thương mại\n100% | Vải nguồn gốc tự nhiên',
      services: 'Thiết kế Bộ sưu tập & Capsule | Từ bảng cảm hứng, chọn vải, dựng mẫu rập đến hoàn thiện mẫu may\nStyling Quảng cáo & Nghệ sĩ | Định hình phong cách trang phục cho MV, tạp chí và chiến dịch thương hiệu\nMô phỏng Thời trang 3D (CLO 3D) | Dựng mẫu số giảm 60% lượng vải may mẫu thử',
      process: 'Nghiên cứu Chất liệu | Tìm kiếm làng nghề dệt nhuộm và thử nghiệm bề mặt vải\nPhác thảo & Draping 3D | Dựng phom trực tiếp trên cốt манекен và mô phỏng CLO 3D\nMay mẫu & Tinh chỉnh | Cắt may thủ công từng đường kim và fitting trên người mẫu thật\nLookbook & Ra mắt | Chỉ đạo hình ảnh chiến dịch và tổ chức trunkshow',
      experience: '2022 – nay | Creative Founder | Atelier Lụa\n2020 – 2022 | Senior Stylist | Elle Vietnam Cộng tác',
      awards: '2025 | Vogue Talents Asia | Emerging Sustainable Designer',
      testimonials: 'Từng đường cắt đều tôn vinh vẻ đẹp hình thể và kể một câu chuyện văn hóa đầy tự hào. | Thanh Hằng | Fashion Editor',
      clients: 'Hoa Tea House, Lumen Labs, Atelier Lụa'
    },
    en: {
      role: 'Fashion Designer & Creative Stylist',
      bio: 'Merging architectural draping with indigenous Vietnamese textiles—Lanh My A lacquered silk, hemp and botanical indigo.',
      skills: 'Pattern Making & Draping, Sustainable Textiles, Editorial Styling, Runway Direction, CLO 3D, Fashion Illustration',
      projects: 'Evening Smoke | Resort 2026 | 22-look collection in raw silk and bark-dyed hemp |\nStone Soul | Avant-Garde | 2025 | Runway collection inspired by ancient sandstone sculpture |\nUrban Flow | Ready-to-Wear | 2025 | Gender-fluid tailored essentials |\nGolden Thread | Bridal Capsule | 2024 | 10 hand-embroidered heirloom gowns |',
      projectDetails: [
        { challenge: 'Traditional lacquered silk is structured and stiff, resisting fluid movement.', solution: 'Pioneered diagonal bias-cut panelling paired with botanical softening.', result: 'Spotlit by Vogue Talents and stocked in Paris and Tokyo boutiques.' }
      ],
      stats: '5+ | Years in fashion\n8 | Collections shown\n40+ | Styling campaigns\n100% | Natural fibres',
      services: 'Collection Design | Concept, textile sourcing, pattern development and sampling\nEditorial & Artist Styling | Wardrobe direction for campaigns, film and red carpet\n3D Garment Prototyping | CLO 3D digital sampling to cut fabric waste by 60%',
      process: 'Textile Research | Artisan loom sourcing and dye trials\nDraping & 3D | Mannequin draping and CLO 3D simulation\nAtelier Fitting | Bespoke tailoring and movement tests\nRunway & Lookbook | Show direction and campaign production',
      experience: '2022 – Present | Creative Founder | Atelier Lua',
      awards: '2025 | Vogue Talents Asia | Sustainable Designer Shortlist',
      testimonials: 'Architectural silhouettes with unmistakable cultural soul. | Linh Dan | Fashion Editor',
      clients: 'River Press, Kite Studio, Atelier Lua'
    }
  },
  {
    id: 'motion', icon: '▶', style: 'showreel', color: '#8b5cf6',
    label: { vi: 'Motion, Video & VFX', en: 'Motion, Video & VFX' },
    vi: {
      role: 'Motion Director & 3D Generalist',
      bio: 'Đạo diễn hình ảnh động, dựng phim quảng cáo, 3D Houdini/Cinema 4D và trình chiếu ánh sáng (Projection Mapping) cho các sự kiện lớn.',
      skills: 'After Effects, Cinema 4D, Redshift, Houdini, DaVinci Resolve, Blender, Storyboard, Projection Mapping',
      projects: 'Future Pulse | Event Visual | 2026 | Trình chiếu màn LED 40m cho đại nhạc hội 20.000 khán giả |\nHydro Sneaker | 3D Product Film | 2025 | TVC 3D mô phỏng chất lỏng và hạt cho dòng giày thể thao mới |\nTết Đoàn Viên | Brand Film | 2025 | Phim ngắn hoạt hình 2D/3D hỗn hợp đạt 8 triệu lượt xem |\nShowreel 2026 | Showreel | 2026 | Tổng hợp các cảnh quay và kỹ xảo tâm đắc nhất trong năm |',
      projectDetails: [
        { challenge: 'Kết xuất (render) màn hình LED độ phân giải siêu rộng 12K ở tốc độ 60fps cho sân khấu ngoài trời trong thời gian gấp rút 3 tuần.', solution: 'Tối ưu pipeline Redshift Proxy kết hợp hệ thống render farm đám mây và lập trình shader thời gian thực.', result: 'Bàn giao đúng hạn 100% khung hình không lỗi, tạo hiệu ứng thị giác bùng nổ tại đêm nhạc.' }
      ],
      stats: '6+ | Năm làm Motion & 3D\n70+ | Video & TVC xuất xưởng\n25M+ | Tổng lượt xem chiến dịch\n12K | Độ phân giải sân khấu lớn nhất',
      services: '3D Product Animation | Phim quảng cáo sản phẩm công nghệ, mỹ phẩm, thời trang bằng kỹ xảo 3D chân thực\nVisual Sân khấu & Lễ hội | Thiết kế visual LED, Projection Mapping đồng bộ nhạc (Timecode)\nDựng phim & Chỉnh màu | Hậu kỳ trọn gói từ cắt dựng, VFX đến调 màu điện ảnh trên DaVinci Resolve',
      process: 'Storyboard & Animatic | Vẽ kịch bản phân cảnh và dựng nhịp chuyển động nháp theo âm nhạc\nStyleframe & Lookdev | Chốt ánh sáng, vật liệu 3D và tông màu ở khung hình tiêu biểu\nAnimation & Simulation | Diễn hoạt chuyển động, mô phỏng khói lửa/chất lỏng và kết xuất\nCompositing & Sound | Ghép lớp kỹ xảo, chỉnh màu và lồng tiếng hoàn chỉnh',
      experience: '2022 – nay | Motion Director | Kinetic Lab\n2019 – 2022 | Senior 3D Motion Artist | Lumina VFX',
      awards: '2025 | Phim Sản phẩm 3D Tiêu biểu (ví dụ) | 3D Product Film',
      testimonials: 'Nhịp cắt dựng cực kỳ bắt tai và chất lượng render 3D không thua kém các studio quốc tế. | Vũ Hoàng | Executive Producer',
      clients: 'Delta Audio, Mộc Bakery, Sol Records, Atlas Retail'
    },
    en: {
      role: 'Motion Director & 3D Artist',
      bio: 'Directing kinetic brand films, 3D product simulations and large-scale festival stage visuals.',
      skills: 'After Effects, Cinema 4D, Redshift, Houdini, DaVinci Resolve, Blender, Storyboarding, Projection Mapping',
      projects: 'Future Pulse | Stage Visuals | 2026 | 40m widescreen LED visuals for a 20,000-seat music festival |\nHydro Sneaker | 3D Product Film | 2025 | Houdini fluid & cloth simulation spot |\nLunar Homecoming | Mixed-Media Film | 2025 | 2D/3D hybrid short with 8M organic views |\nDirector Showreel | Showreel | 2026 | 90-second montage of commercial and experimental work |',
      projectDetails: [
        { challenge: 'Delivering 12K-resolution 60fps stage visuals under a 3-week deadline.', solution: 'Built a procedural Redshift proxy pipeline with automated cloud rendering.', result: 'Zero dropped frames on a 40-meter festival stage.' }
      ],
      stats: '6+ | Years in motion\n70+ | Films delivered\n25M+ | Campaign views\n12K | Max stage resolution',
      services: '3D Product Films | Photorealistic simulations and dynamic camera choreography\nStage & Festival Visuals | Timecode-synced LED and projection mapping packages\nPost & Colour | Editing, compositing and DaVinci Resolve grading',
      process: 'Storyboard & Animatic | Pacing and camera timing locked to music\nStyleframes | Lighting, shaders and art direction sign-off\n3D Animation & Sim | Keyframe craft and Houdini FX\nComposite & Grade | Final polish and sound sync',
      experience: '2022 – Present | Motion Director | Kinetic Lab',
      awards: '2025 | Featured Motion Work (sample)',
      testimonials: 'Razor-sharp pacing and world-class 3D lookdev. | Marcus Vance | Executive Producer',
      clients: 'Pine Magazine, Vela Fashion, Studio Mây'
    }
  },
  {
    id: 'writer', icon: '✎', style: 'magazine', color: '#78350f',
    label: { vi: 'Biên tập viên, Copywriter & Tác giả', en: 'Copywriter, Editor & Author' },
    vi: {
      role: 'Creative Copywriter & Managing Editor',
      bio: 'Chắp bút cho các chiến dịch thương hiệu chạm cảm xúc, bài viết chuyên khảo dài kỳ (Long-form Journalism) và định hình giọng văn thương hiệu (Tone of Voice).',
      skills: 'Creative Copywriting, Brand Storytelling, Long-form Editorial, Content Strategy, SEO Chuyên sâu, Kịch bản TVC, UX Writing',
      projects: 'Đi Tìm Hương Vị Nguyên Bản | Chuyên khảo | 2026 | Loạt bài điều tra văn hóa ẩm thực 12 kỳ đạt 1.5 triệu lượt đọc |\nNgân Hàng Số Thấu Cảm | UX Writing | 2025 | Chuẩn hóa từ điển ngôn ngữ giao diện cho ứng dụng 3 triệu người dùng |\nVề Nhà Ăn Tết | Kịch bản Chiến dịch | 2025 | Ý tưởng chủ đạo và kịch bản phim ngắn đạt Top 3 chiến dịch Tết |\nCẩm Nang Người Sáng Tạo | Xuất bản sách | 2024 | Tác giả sách kỹ năng viết sáng tạo (Tái bản lần 3 với 15.000 bản) |',
      projectDetails: [
        { challenge: 'Thông báo lỗi kỹ thuật trên ứng dụng ngân hàng dùng nhiều thuật ngữ chuyên ngành khiến khách hàng hoang mang khi giao dịch chậm.', solution: 'Viết lại toàn bộ 450 thông điệp trạng thái theo nguyên tắc "Bình tĩnh – Minh bạch – Hướng dẫn hành động ngay".', result: 'Giảm 38% lượng khiếu nại qua tổng đài liên quan đến lỗi giao dịch chờ xử lý.' }
      ],
      stats: '8+ | Năm viết & biên tập\n15.000 | Bản sách xuất bản\n45+ | Chiến dịch thương hiệu\n3M+ | Độc giả tiếp cận',
      services: 'Chiến lược Nội dung & Giọng văn | Xây dựng cẩm nang ngôn ngữ thương hiệu (Brand Voice & Tone Guidelines)\nCopywriting Chiến dịch & Kịch bản | Slogan, Manifesto, kịch bản TVC/Video và bài PR báo chí\nUX Writing & Microcopy | Tối ưu câu chữ trên ứng dụng/website giúp tăng tỷ lệ chuyển đổi',
      process: 'Thấu cảm Độc giả | Nghiên cứu ngôn ngữ đời thực và nỗi đau của nhóm độc giả mục tiêu\nĐịnh hình Góc tiếp cận | Tìm "Big Idea" và cấu trúc kể chuyện khác biệt\nChắp bút & Gọt giũa | Viết nháp nhanh, biên tập chặt chẽ từng từ ngữ và nhịp điệu câu\nĐo lường & Tối ưu | Thử nghiệm A/B tiêu đề và theo dõi thời gian đọc thực tế',
      experience: '2022 – nay | Managing Editor & Lead Copywriter | Chữ Xưởng\n2018 – 2022 | Senior Feature Writer | Vietcetera',
      awards: '2025 | Giải Bạc Chiến dịch Nội dung Sáng tạo | MMA Smarties',
      testimonials: 'Một câu slogan vỏn vẹn 6 chữ của bạn đã định hình toàn bộ linh hồn chiến dịch năm nay của chúng tôi. | Nguyễn Hải Yến | Brand Manager',
      clients: 'Nhà sách Gió, Lam Coffee, Nova Games, Saffron Media'
    },
    en: {
      role: 'Creative Copywriter & Managing Editor',
      bio: 'Crafting resonant brand manifestos, long-form cultural essays and humane product microcopy.',
      skills: 'Creative Copywriting, Brand Storytelling, Long-form Editorial, Content Strategy, UX Writing, Scriptwriting',
      projects: 'Origins of Taste | Feature Series | 2026 | 12-part culinary journalism series with 1.5M readers |\nHumane Banking | UX Writing | 2025 | Voice & tone overhaul for a 3M-user fintech app |\nHomeward Bound | Campaign Script | 2025 | Integrated holiday film script, Top 3 campaign of the year |\nThe Craft of Clear Words | Book | 2024 | Authored creative writing handbook (15,000 copies in print) |',
      projectDetails: [
        { challenge: 'Cryptic banking error codes caused user panic and flooded customer support lines.', solution: 'Rewrote 450+ system messages around calm transparency and clear next steps.', result: '38% drop in support tickets for pending transfers.' }
      ],
      stats: '8+ | Years writing\n15,000 | Books in print\n45+ | Brand campaigns\n3M+ | Readers reached',
      services: 'Brand Voice & Messaging | Tone-of-voice playbooks, manifestos and naming\nCampaign Copy & Scripts | Headlines, film scripts and editorial essays\nUX Writing | Product microcopy and onboarding flows',
      process: 'Listen | Audience language research and stakeholder interviews\nAngle | Find the narrative hook and structural arc\nDraft & Edit | Ruthless line editing for rhythm and clarity\nMeasure | Headline testing and reader engagement review',
      experience: '2022 – Present | Managing Editor | Wordcraft Studio',
      awards: '2025 | MMA Smarties Silver | Brand Storytelling',
      testimonials: 'Six words captured what our company spent two years trying to explain. | Elena Rostova | CMO',
      clients: 'Nhà xuất bản Độc lập, Tạp chí Thiết kế, Studio Sách'
    }
  },
  {
    id: 'culinary', icon: '☕', style: 'editorial', color: '#b45309',
    label: { vi: 'Đầu bếp, F&B Concept & Barista', en: 'Chef, F&B Concept & Hospitality' },
    vi: {
      role: 'Executive Chef & F&B Concept Creator',
      bio: 'Sáng tạo thực đơn đương đại tôn vinh nông sản bản địa Việt Nam, tư vấn vận hành bếp tiêu chuẩn Michelin và phát triển chuỗi F&B bền vững.',
      skills: 'Fine Dining Menu, Nông sản Bản địa, Lên men Thủ công (Fermentation), Tư vấn Vận hành Bếp, Food Costing, R&D Đồ uống',
      projects: 'Mùa Gặt Tasting Menu | Fine Dining | 2026 | Thực đơn 9 món theo mùa từ nguyên liệu Tây Bắc và đồng bằng sông Cửu Long |\nKombucha Bản Địa | R&D Đồ uống | 2025 | Dòng trà lên men từ vỏ cà phê Cascara và thảo mộc rừng |\nBếp Mở Sài Gòn | F&B Concept | 2025 | Tư vấn concept, thiết kế dây chuyền bếp và đào tạo cho nhà hàng 80 chỗ |\nHạt Gạo Làng Ta | Culinary Pop-up | 2024 | Chuỗi sự kiện ẩm thực kết hợp kể chuyện nông nghiệp bền vững |',
      projectDetails: [
        { challenge: 'Tỷ lệ hao hụt nguyên liệu tươi sống tại nhà hàng đối tác lên tới 24%, làm giảm biên lợi nhuận ròng.', solution: 'Áp dụng quy trình bếp không rác thải (Zero-waste kitchen): tận dụng gốc rau củ làm nước dùng dashi, ủ tương miso từ hạt thừa và chuẩn hóa định lượng.', result: 'Giảm tỷ lệ Food Cost từ 38% xuống 27% trong khi điểm đánh giá thực khách tăng lên 4.9/5.' }
      ],
      stats: '10+ | Năm đứng bếp\n18 | Thực đơn & Concept ra mắt\n-11% | Tối ưu chi phí nguyên liệu\n100% | Nông sản truy xuất nguồn gốc',
      services: 'Sáng tạo Thực đơn (Menu R&D) | Thiết kế món ăn đặc trưng, định lượng chuẩn và tính toán giá vốn (Food Cost)\nTư vấn Mở Nhà hàng / Quán | Xây dựng concept, thiết kế luồng bếp một chiều và tuyển chọn thiết bị\nĐào tạo Đội ngũ Bếp & Bar | Chuẩn hóa quy trình vệ sinh ATTP, kỹ thuật nấu hiện đại và trình bày món',
      process: 'Khảo sát Nguyên liệu & Thị trường | Tìm kiếm nguồn nông sản tươi ngon và phân tích khẩu vị khách mục tiêu\nThử nghiệm Món (Tasting Lab) | Sáng tạo công thức, cân bằng hương vị và chụp ảnh định lượng\nThiết lập Quy trình Bếp | Viết cẩm nang công thức chuẩn (SOP) và đào tạo nhân sự\nVận hành Thử & Tinh chỉnh | Đồng hành tuần đầu khai trương (Soft Opening) và tối ưu tốc độ ra món',
      experience: '2022 – nay | Executive Chef & Founder | Hạt Atelier\n2017 – 2022 | Sous Chef | Nhà hàngได้รับ Michelin Selected tại TP.HCM',
      awards: '2025 | Michelin Guide Selected | Đội ngũ Bếp Sáng tạo',
      testimonials: 'Không chỉ tạo ra những món ăn đẹp như tranh mà còn giúp bếp của chúng tôi vận hành trơn tru, lời ngay từ tháng thứ hai. | Trần Trọng Nghĩa | Chủ đầu tư Bếp Mở',
      clients: 'Hạt Atelier, Bếp Mở, Đà Lạt Organic Farm'
    },
    en: {
      role: 'Executive Chef & F&B Concept Creator',
      bio: 'Crafting seasonal tasting menus rooted in indigenous Vietnamese produce, natural fermentation and zero-waste kitchen operations.',
      skills: 'Tasting Menu R&D, Indigenous Sourcing, Fermentation, Kitchen Workflow Design, Food Cost Control, Beverage R&D',
      projects: 'Harvest 9-Course | Fine Dining | 2026 | Seasonal tasting menu celebrating highland herbs and Mekong heirloom grains |\nCascara Kombucha | Beverage R&D | 2025 | Fermented botanical tea line brewed from upcycled coffee cherry husks |\nSaigon Open Fire | Restaurant Concept | 2025 | Full concept, kitchen layout and SOPs for an 80-seat wood-fired bistro |\nHeirloom Rice Table | Culinary Pop-up | 2024 | Farm-to-table dinner series across 5 cities |',
      projectDetails: [
        { challenge: 'Partner bistro suffered 24% fresh-produce spoilage and high food cost.', solution: 'Implemented a zero-waste fermentation program turning trimmings into house misos, garums and stocks.', result: 'Reduced food cost from 38% to 27% while achieving a 4.9★ guest rating.' }
      ],
      stats: '10+ | Years in kitchens\n18 | Concepts launched\n-11% | Avg. food cost saved\n100% | Traceable farms',
      services: 'Menu R&D & Costing | Signature dishes, recipe SOPs and margin engineering\nRestaurant Concept & Layout | Ergonomic kitchen line design and equipment specs\nBrigade Training | Pre-opening training and quality standards',
      process: 'Farm Sourcing | Direct relationships with local growers and fishers\nTasting Lab | Iterative recipe development and plating\nSOP & Training | Standardized prep sheets and line drills\nSoft Launch | On-site service supervision and refinement',
      experience: '2022 – Present | Executive Chef | Hat Atelier',
      awards: '2025 | Michelin Guide Selected Kitchen',
      testimonials: 'Turned our kitchen into a disciplined, profitable creative engine. | Thomas Nguyen | Restaurateur',
      clients: 'Hat Atelier, Saigon Open Fire, Dalat Farms'
    }
  },
  {
    id: 'business', icon: '↗', style: 'bento', color: '#2563eb',
    label: { vi: 'Marketing, Growth & Kinh doanh', en: 'Marketing, Growth & Strategy' },
    vi: {
      role: 'Growth Marketing & Brand Strategist',
      bio: 'Xây dựng chiến lược tăng trưởng bền vững kết hợp nội dung sáng tạo, tối ưu tỷ lệ chuyển đổi (CRO) và hiệu quả chi phí quảng cáo (ROAS).',
      skills: 'Growth Strategy, Performance Marketing, Content Marketing, SEO, Google Analytics 4, CRM & Lifecycle, Brand Positioning, CRO',
      projects: 'Ra Mắt Dòng Mỹ Phẩm Thuần Chay | Go-to-Market | 2026 | Đạt 4,2 tỷ doanh thu tháng đầu, ROAS 5.4× |\nTái Cấu Trúc SEO Chuỗi Nha Khoa | Organic Growth | 2025 | Tăng 310% lưu lượng tìm kiếm tự nhiên sau 5 tháng |\nChiến Dịch Tết Đa Kênh | Integrated Campaign | 2025 | 12M lượt tiếp cận, giảm 28% chi phí thu hút khách mới (CAC) |\nHệ Thống Tự Động Chăm Sóc Khách | CRM Lifecycle | 2024 | Tăng 34% tỷ lệ khách quay lại mua lần 2 |',
      projectDetails: [
        { challenge: 'Chi phí quảng cáo trả phí (CPC) ngành mỹ phẩm tăng 65% khiến biên lợi nhuận chiến dịch ra mắt bị thu hẹp.', solution: 'Kết hợp 80 Micro-KOC trải nghiệm thật trước ngày mở bán cùng phễu minigame nhận mẫu thử qua Zalo Mini App.', result: 'Thu về 18.000 khách hàng tiềm năng với CAC thấp hơn 42% so với trung bình ngành, đạt ROAS 5.4×.' }
      ],
      stats: '6+ | Năm làm Growth & Brand\n4.8× | ROAS trung bình\n+310% | Tăng trưởng SEO đỉnh cao\n25+ | Nhãn hàng đã tư vấn',
      services: 'Chiến lược Ra mắt Sản phẩm (GTM) | Định vị thị trường, thông điệp chủ đạo và kế hoạch đa kênh\nTăng trưởng Tự nhiên & SEO | Xây dựng cụm nội dung chuẩn SEO và tối ưu chuyển đổi trên website\nTối ưu Phễu & Giữ chân Khách (CRM) | Thiết lập kịch bản chăm sóc tự động tăng giá trị vòng đời khách hàng (LTV)',
      process: 'Chẩn đoán Số liệu | Kiểm toán toàn diện kênh hiện tại, CAC, LTV và điểm nghẽn chuyển đổi\nThiết kế Thử nghiệm | Lập giả thuyết tăng trưởng và kế hoạch nội dung/quảng cáo\nTriển khai & Đo lường | Chạy chiến dịch với bảng theo dõi số liệu thời gian thực\nNhân rộng Kênh Thắng | Dồn ngân sách vào kênh hiệu quả nhất và tối ưu liên tục',
      experience: '2022 – nay | Head of Growth | ScaleUp Agency\n2019 – 2022 | Senior Brand Marketer | Unilever VN (Chương trình Quản trị viên)',
      awards: '2025 | MMA Smarties Gold | E-Commerce Growth Marketing',
      testimonials: 'Mọi đồng ngân sách marketing đều được giải trình rõ ràng bằng doanh thu thực tế. | Phạm Minh Đức | CEO, PureSkin',
      clients: 'PureSkin, Nha Khoa Quốc Tế, Hoa Tea House'
    },
    en: {
      role: 'Growth Marketing & Brand Strategist',
      bio: 'Driving profitable brand growth through creative storytelling, conversion rate optimization and full-funnel analytics.',
      skills: 'Growth Strategy, Performance Marketing, Content Strategy, Technical SEO, GA4, Lifecycle CRM, Brand Positioning, CRO',
      projects: 'Vegan Skincare Launch | Go-to-Market | 2026 | $170k month-one revenue at 5.4× ROAS |\nDental Group SEO Overhaul | Organic Growth | 2025 | +310% non-brand organic traffic in 5 months |\nHoliday Omnichannel | Integrated Campaign | 2025 | 12M reach, -28% customer acquisition cost |\nRetention Engine | Lifecycle CRM | 2024 | +34% repeat purchase rate within 90 days |',
      projectDetails: [
        { challenge: 'Rising paid social CPMs threatened launch profitability.', solution: 'Seeded 80 micro-creators paired with an interactive skin-quiz lead magnet.', result: '18,000 qualified leads at -42% CAC and 5.4× ROAS.' }
      ],
      stats: '6+ | Years in growth\n4.8× | Avg. ROAS\n+310% | Peak SEO lift\n25+ | Brands scaled',
      services: 'Go-to-Market Strategy | Positioning, messaging and channel mix\nOrganic & Conversion (SEO/CRO) | Programmatic content and landing page experiments\nLifecycle & Retention | Automated email/SMS flows that lift LTV',
      process: 'Audit | Full-funnel data and unit economics review\nHypothesize | Prioritized experiment roadmap\nExecute | Creative production and live dashboards\nScale | Double down on winning channels',
      experience: '2022 – Present | Head of Growth | ScaleUp Collective',
      awards: '2025 | MMA Smarties Gold | Growth Marketing',
      testimonials: 'Every marketing dollar was tied directly to measurable pipeline and revenue. | Daniel Park | CEO, PureSkin',
      clients: 'PureSkin, ScaleUp, CommercePlus'
    }
  }
];
