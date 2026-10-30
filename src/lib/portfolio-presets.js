// Industry starter kits: sample content written for each discipline, plus the style and accent that suit it.
// Applying one fills the form; everything stays editable. Sample text only, no real people or clients.
export const PORTFOLIO_PRESETS = [
  {
    id: 'design', icon: '🎨', style: 'bento', color: '#ea580c',
    vi: {
      label: 'Graphic Designer', role: 'Graphic Designer · Branding',
      bio: 'Mình giúp thương hiệu trẻ có diện mạo nhất quán và dễ nhớ – từ logo, bao bì đến ấn phẩm truyền thông.',
      skills: 'Branding, Logo, Typography, Packaging, Illustrator, Photoshop, InDesign',
      projects: 'Mộc Trà | Branding | 2026 | Bộ nhận diện cho thương hiệu trà thủ công |\nSóng Festival | Poster | 2025 | Hệ thống poster cho lễ hội âm nhạc biển |\nBếp Nhà Bông | Packaging | 2025 | Bao bì hộp quà Tết cho tiệm bánh |\nGreenly | Logo | 2024 | Logo và bảng màu cho startup sống xanh |',
      services: 'Nhận diện thương hiệu | Logo, màu sắc, phông chữ, bộ quy chuẩn\nBao bì | Thiết kế bao bì từ ý tưởng đến file in\nẤn phẩm | Poster, brochure, menu, social post',
      process: 'Brief | Hiểu thương hiệu, khách hàng mục tiêu\nNghiên cứu | Moodboard, đối thủ, insight\nPhác thảo | 3 hướng ý tưởng\nHoàn thiện | Chỉnh sửa, bộ file chuẩn\nBàn giao | Guideline sử dụng',
      stats: '5+ | Năm kinh nghiệm\n60+ | Logo đã thiết kế\n30 | Thương hiệu đồng hành'
    },
    en: {
      label: 'Graphic designer', role: 'Graphic Designer · Branding',
      bio: 'I help young brands look consistent and memorable – from logos and packaging to campaigns.',
      skills: 'Branding, Logo, Typography, Packaging, Illustrator, Photoshop, InDesign',
      projects: 'Moc Tea | Branding | 2026 | Identity for a craft tea brand |\nWave Festival | Poster | 2025 | Poster system for a beach music festival |\nBloom Bakery | Packaging | 2025 | Gift box packaging |\nGreenly | Logo | 2024 | Logo and palette for a green startup |',
      services: 'Brand identity | Logo, colour, type, guidelines\nPackaging | Concept to print-ready files\nPrint & social | Posters, brochures, menus, social posts',
      process: 'Brief | Understand brand and audience\nResearch | Moodboard, competitors, insight\nSketch | 3 directions\nRefine | Polish and final files\nDeliver | Usage guidelines',
      stats: '5+ | Years\n60+ | Logos designed\n30 | Brands served'
    }
  },
  {
    id: 'arch', icon: '🏛', style: 'blueprint', color: '#0d9488',
    vi: {
      label: 'Kiến trúc – Nội thất', role: 'Kiến trúc sư · Thiết kế nội thất',
      bio: 'Thiết kế không gian sống tối ưu ánh sáng tự nhiên và công năng, phù hợp khí hậu nhiệt đới Việt Nam.',
      skills: 'Revit, AutoCAD, SketchUp, Lumion, 3ds Max, Thiết kế bền vững',
      projects: 'Nhà phố Gió | Nhà ở | 2026 | Nhà phố 4x16m với giếng trời thông gió |\nCafé Gạch | Thương mại | 2025 | Cải tạo nhà cũ thành quán cà phê 80 chỗ |\nCăn hộ Tối Giản | Nội thất | 2025 | Căn hộ 70m² phong cách Japandi |\nTrường Mầm Xanh | Công cộng | 2024 | Phương án trường mầm non 12 lớp |',
      services: 'Thiết kế kiến trúc | Nhà phố, biệt thự, công trình nhỏ\nThiết kế nội thất | Căn hộ, văn phòng, quán\nDiễn họa 3D | Phối cảnh, video walkthrough',
      process: 'Khảo sát | Hiện trạng, nhu cầu, ngân sách\nÝ tưởng | Mặt bằng công năng, concept\nPhương án | Hồ sơ 3D, vật liệu\nHồ sơ kỹ thuật | Bản vẽ thi công\nGiám sát | Hỗ trợ thi công',
      stats: '8+ | Năm hành nghề\n45 | Công trình hoàn thành\n12.000 | m² đã thiết kế'
    },
    en: {
      label: 'Architecture & interiors', role: 'Architect · Interior Designer',
      bio: 'I design homes that make the most of daylight and airflow, tuned for tropical climates.',
      skills: 'Revit, AutoCAD, SketchUp, Lumion, 3ds Max, Sustainable design',
      projects: 'Wind House | Residential | 2026 | 4x16m townhouse with a ventilation lightwell |\nBrick Café | Commercial | 2025 | Old house turned 80-seat café |\nMinimal Flat | Interior | 2025 | 70m² Japandi apartment |\nGreen Kindergarten | Public | 2024 | 12-class kindergarten proposal |',
      services: 'Architecture | Houses, villas, small buildings\nInteriors | Apartments, offices, cafés\n3D visualisation | Renders and walkthroughs',
      process: 'Survey | Site, needs, budget\nConcept | Layout and idea\nDesign | 3D and materials\nTechnical | Construction drawings\nSupervision | Build support',
      stats: '8+ | Years in practice\n45 | Projects built\n12,000 | m² designed'
    }
  },
  {
    id: 'photo', icon: '📷', style: 'photo', color: '#18181b',
    vi: {
      label: 'Nhiếp ảnh', role: 'Nhiếp ảnh gia · Chân dung & Sản phẩm',
      bio: 'Kể câu chuyện bằng ánh sáng – chụp chân dung, sản phẩm và sự kiện với phong cách tự nhiên, ấm áp.',
      skills: 'Chân dung, Sản phẩm, Sự kiện, Lightroom, Photoshop, Ánh sáng studio',
      projects: 'Mùa Lúa | Phong cảnh | 2026 | Bộ ảnh ruộng bậc thang Mù Cang Chải |\nGốm Bát Tràng | Sản phẩm | 2025 | Ảnh catalog cho xưởng gốm |\nNgười Hà Nội | Chân dung | 2025 | Loạt chân dung đường phố |\nLễ cưới An & Minh | Sự kiện | 2024 | Phóng sự cưới tự nhiên |',
      services: 'Chụp chân dung | Cá nhân, profile, gia đình\nChụp sản phẩm | Catalog, thương mại điện tử\nSự kiện | Cưới, hội nghị, ra mắt sản phẩm',
      process: 'Trao đổi | Mục đích, phong cách, địa điểm\nLên kế hoạch | Moodboard, lịch chụp\nChụp | Buổi chụp thực tế\nHậu kỳ | Chọn ảnh, chỉnh màu\nGiao ảnh | Online gallery',
      stats: '7+ | Năm cầm máy\n300+ | Buổi chụp\n50.000+ | Ảnh đã giao'
    },
    en: {
      label: 'Photography', role: 'Photographer · Portrait & Product',
      bio: 'Telling stories with light – natural, warm portraits, products and events.',
      skills: 'Portrait, Product, Events, Lightroom, Photoshop, Studio lighting',
      projects: 'Rice Season | Landscape | 2026 | Terraced fields series |\nCeramics | Product | 2025 | Catalog for a pottery studio |\nCity People | Portrait | 2025 | Street portrait series |\nAn & Minh | Event | 2024 | Documentary wedding |',
      services: 'Portraits | Personal, profile, family\nProduct | Catalog, e-commerce\nEvents | Weddings, conferences, launches',
      process: 'Talk | Purpose, style, location\nPlan | Moodboard, schedule\nShoot | The session\nEdit | Selection and grading\nDeliver | Online gallery',
      stats: '7+ | Years shooting\n300+ | Sessions\n50,000+ | Photos delivered'
    }
  },
  {
    id: 'dev', icon: '💻', style: 'developer', color: '#16a34a',
    vi: {
      label: 'Lập trình viên', role: 'Full-stack Developer',
      bio: 'Xây dựng web và ứng dụng nhanh, ổn định, dễ bảo trì. Yêu thích hiệu năng và trải nghiệm người dùng.',
      skills: 'TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Testing',
      projects: 'ShopNhanh | Thương mại điện tử | 2026 | Web bán hàng tải trang dưới 1 giây |\nLịch Khám | Ứng dụng | 2025 | Đặt lịch phòng khám, 5.000 người dùng |\nOpen Viet NLP | Mã nguồn mở | 2025 | Thư viện xử lý tiếng Việt, 800 sao GitHub |\nDashboard Kho | Nội bộ | 2024 | Theo dõi tồn kho thời gian thực |',
      services: 'Phát triển web | Website, web app, landing page\nAPI & Backend | Thiết kế API, cơ sở dữ liệu\nTối ưu hiệu năng | Tăng tốc, giảm chi phí hạ tầng',
      process: 'Phân tích | Yêu cầu, phạm vi\nThiết kế | Kiến trúc, cơ sở dữ liệu\nPhát triển | Sprint 2 tuần, demo liên tục\nKiểm thử | Test tự động, review\nTriển khai | CI/CD, giám sát',
      stats: '6+ | Năm kinh nghiệm\n25 | Sản phẩm ra mắt\n99,9% | Uptime trung bình'
    },
    en: {
      label: 'Developer', role: 'Full-stack Developer',
      bio: 'I build fast, reliable, maintainable web apps. I care about performance and UX.',
      skills: 'TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Testing',
      projects: 'QuickShop | E-commerce | 2026 | Store with sub-second page loads |\nClinicBook | App | 2025 | Clinic booking, 5,000 users |\nOpen NLP | Open source | 2025 | Language library, 800 GitHub stars |\nStock Dashboard | Internal | 2024 | Real-time inventory |',
      services: 'Web development | Sites, web apps, landing pages\nAPI & backend | API and database design\nPerformance | Faster, cheaper infrastructure',
      process: 'Analyse | Requirements, scope\nDesign | Architecture, data\nBuild | 2-week sprints, demos\nTest | Automated tests, review\nShip | CI/CD, monitoring',
      stats: '6+ | Years\n25 | Products shipped\n99.9% | Average uptime'
    }
  },
  {
    id: 'uiux', icon: '📱', style: 'casestudy', color: '#7c3aed',
    vi: {
      label: 'UI/UX Designer', role: 'Product Designer · UI/UX',
      bio: 'Thiết kế sản phẩm số dựa trên nghiên cứu người dùng – đơn giản, dễ dùng và tạo ra kết quả đo được.',
      skills: 'Figma, User Research, Wireframe, Prototype, Design System, Usability Test',
      projects: 'Ví Xanh | Fintech | 2026 | Thiết kế lại luồng chuyển tiền, giảm 40% bước |\nHọc Vui | Edtech | 2025 | Ứng dụng học tiếng Anh cho trẻ em |\nĐặt Sân | Thể thao | 2025 | Đặt sân bóng trong 30 giây |\nDesign System Lotus | Hệ thống | 2024 | 120 component cho 5 sản phẩm |',
      services: 'Nghiên cứu người dùng | Phỏng vấn, khảo sát, persona\nThiết kế UI/UX | Wireframe, prototype, giao diện\nDesign System | Thư viện component nhất quán',
      process: 'Thấu hiểu | Phỏng vấn người dùng\nXác định | Vấn đề cốt lõi, mục tiêu\nÝ tưởng | Luồng, wireframe\nPrototype | Bản mẫu tương tác\nKiểm thử | Test với người dùng thật',
      stats: '5+ | Năm thiết kế sản phẩm\n2 triệu+ | Người dùng chạm tới\n18 | Ứng dụng ra mắt'
    },
    en: {
      label: 'UI/UX designer', role: 'Product Designer · UI/UX',
      bio: 'Research-led product design – simple, usable and measurable.',
      skills: 'Figma, User research, Wireframes, Prototyping, Design systems, Usability testing',
      projects: 'Green Wallet | Fintech | 2026 | Transfer flow redesign, 40% fewer steps |\nFunLearn | Edtech | 2025 | English app for kids |\nPitchBook | Sport | 2025 | Book a pitch in 30 seconds |\nLotus DS | System | 2024 | 120 components for 5 products |',
      services: 'User research | Interviews, surveys, personas\nUI/UX design | Wireframes, prototypes, UI\nDesign systems | Consistent component libraries',
      process: 'Empathise | User interviews\nDefine | Core problem, goals\nIdeate | Flows, wireframes\nPrototype | Interactive mockups\nTest | With real users',
      stats: '5+ | Years in product\n2M+ | Users reached\n18 | Apps launched'
    }
  },
  {
    id: 'fashion', icon: '👗', style: 'fashion', color: '#9f1239',
    vi: {
      label: 'Thời trang', role: 'Nhà thiết kế thời trang',
      bio: 'Thiết kế thời trang bền vững kết hợp chất liệu truyền thống Việt như lụa, thổ cẩm với phom dáng hiện đại.',
      skills: 'Thiết kế rập, Draping, Phối màu, CLO 3D, Styling, Chất liệu bền vững',
      projects: 'Lụa Sương | Bộ sưu tập | 2026 | BST Xuân Hè 18 mẫu từ lụa tơ tằm |\nThổ Cẩm Phố | Capsule | 2025 | Ứng dụng thổ cẩm vào đồ công sở |\nÁo Dài Mới | Áo dài | 2025 | Áo dài cách tân cho Gen Z |\nTái Sinh | Upcycle | 2024 | BST từ vải tồn kho |',
      services: 'Thiết kế BST | Ý tưởng, phác thảo, rập mẫu\nStyling | Lookbook, chụp ảnh, sự kiện\nTư vấn thương hiệu | Định hướng phong cách, chất liệu',
      process: 'Cảm hứng | Moodboard, câu chuyện\nPhác thảo | Bản vẽ thời trang\nChất liệu | Chọn vải, thử màu\nRập & may mẫu | Hoàn thiện phom\nTrình diễn | Lookbook, show',
      stats: '6 | Bộ sưu tập\n120+ | Thiết kế\n3 | Tuần lễ thời trang'
    },
    en: {
      label: 'Fashion', role: 'Fashion Designer',
      bio: 'Sustainable fashion blending traditional silk and brocade with modern silhouettes.',
      skills: 'Pattern making, Draping, Colour, CLO 3D, Styling, Sustainable materials',
      projects: 'Mist Silk | Collection | 2026 | 18-look SS collection in silk |\nCity Brocade | Capsule | 2025 | Brocade for workwear |\nNew Ao Dai | Ao dai | 2025 | Modern ao dai for Gen Z |\nReborn | Upcycle | 2024 | Collection from deadstock |',
      services: 'Collections | Concept, sketches, patterns\nStyling | Lookbooks, shoots, events\nBrand advice | Style and material direction',
      process: 'Inspire | Moodboard, story\nSketch | Fashion drawings\nMaterial | Fabric and colour\nPattern & sample | Fit\nShow | Lookbook, runway',
      stats: '6 | Collections\n120+ | Designs\n3 | Fashion weeks'
    }
  },
  {
    id: 'motion', icon: '🎬', style: 'showreel', color: '#db2777',
    vi: {
      label: 'Motion – Video', role: 'Motion Designer · Video Editor',
      bio: 'Biến ý tưởng thành chuyển động cuốn hút – video quảng cáo, logo động và nội dung mạng xã hội.',
      skills: 'After Effects, Premiere Pro, Cinema 4D, DaVinci Resolve, Storyboard, Sound design',
      projects: 'Hè Rực Rỡ | TVC | 2026 | TVC 30s cho thương hiệu nước giải khát |\nLogo Động Nova | Motion | 2025 | Bộ logo động cho kênh YouTube |\nExplainer Pay | Animation | 2025 | Video giải thích ví điện tử 90s |\nReels Tết | Social | 2024 | 20 video ngắn cho chiến dịch Tết |',
      services: 'Video quảng cáo | TVC, video sản phẩm\nMotion graphics | Logo động, infographic\nNội dung mạng xã hội | Reels, TikTok, Shorts',
      process: 'Kịch bản | Thông điệp, kịch bản\nStoryboard | Khung hình chính\nStyleframe | Phong cách hình ảnh\nAnimation | Dựng chuyển động\nHậu kỳ | Âm thanh, màu, xuất bản',
      stats: '200+ | Video đã sản xuất\n50 triệu+ | Lượt xem\n4 | Giải thưởng sáng tạo'
    },
    en: {
      label: 'Motion & video', role: 'Motion Designer · Video Editor',
      bio: 'Turning ideas into captivating motion – ads, animated logos and social content.',
      skills: 'After Effects, Premiere Pro, Cinema 4D, DaVinci Resolve, Storyboarding, Sound design',
      projects: 'Bright Summer | TVC | 2026 | 30s spot for a drinks brand |\nNova Logo | Motion | 2025 | Animated logo pack |\nPay Explainer | Animation | 2025 | 90s wallet explainer |\nNew Year Reels | Social | 2024 | 20 short videos |',
      services: 'Ads | TVCs, product videos\nMotion graphics | Logos, infographics\nSocial content | Reels, TikTok, Shorts',
      process: 'Script | Message and script\nStoryboard | Key frames\nStyleframes | Look\nAnimate | Motion\nFinish | Sound, colour, export',
      stats: '200+ | Videos made\n50M+ | Views\n4 | Creative awards'
    }
  },
  {
    id: 'business', icon: '📈', style: 'split', color: '#2563eb',
    vi: {
      label: 'Marketing – Kinh doanh', role: 'Digital Marketing Specialist',
      bio: 'Lập kế hoạch và triển khai chiến dịch digital dựa trên dữ liệu – tăng trưởng thật, đo lường rõ ràng.',
      skills: 'SEO, Google Ads, Facebook Ads, Content, Google Analytics, Email marketing',
      projects: 'Mỹ Phẩm Lá | Performance | 2026 | Giảm 35% chi phí mỗi đơn hàng trong 3 tháng |\nEdu Plus | SEO | 2025 | Tăng 4 lần lượt truy cập tự nhiên |\nRa mắt App Fit | Chiến dịch | 2025 | 100.000 lượt tải tuần đầu |\nCafé Chuỗi | Content | 2024 | Xây kênh TikTok 200.000 người theo dõi |',
      services: 'Chiến lược digital | Kế hoạch kênh, ngân sách\nQuảng cáo hiệu suất | Google, Meta, TikTok Ads\nSEO & Content | Nội dung tăng trưởng bền vững',
      process: 'Phân tích | Thị trường, đối thủ, dữ liệu\nMục tiêu | KPI rõ ràng\nKế hoạch | Kênh, thông điệp, ngân sách\nTriển khai | Chạy và tối ưu hằng tuần\nBáo cáo | Đo lường, bài học',
      stats: '7+ | Năm kinh nghiệm\n30 tỷ+ | Ngân sách quảng cáo đã quản lý\n3,8x | ROAS trung bình'
    },
    en: {
      label: 'Marketing & business', role: 'Digital Marketing Specialist',
      bio: 'Data-driven digital campaigns – real growth, clearly measured.',
      skills: 'SEO, Google Ads, Meta Ads, Content, Google Analytics, Email marketing',
      projects: 'Leaf Cosmetics | Performance | 2026 | 35% lower cost per order in 3 months |\nEdu Plus | SEO | 2025 | 4x organic traffic |\nFit App launch | Campaign | 2025 | 100,000 installs in week one |\nCafé Chain | Content | 2024 | TikTok channel to 200k followers |',
      services: 'Digital strategy | Channels and budget\nPerformance ads | Google, Meta, TikTok\nSEO & content | Sustainable growth',
      process: 'Analyse | Market, competitors, data\nGoals | Clear KPIs\nPlan | Channels, message, budget\nRun | Weekly optimisation\nReport | Measure and learn',
      stats: '7+ | Years\n$1M+ | Ad spend managed\n3.8x | Average ROAS'
    }
  }
];
