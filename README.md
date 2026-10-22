# छिमेकी बजार (Chhimeki Bazar) — 네팔 동네 중고거래 웹앱

옆집마켓 최신 버전을 네팔용으로 현지화한 React + Vite 프로젝트입니다. 화면 전체가 네팔어(देवनागरी)이며 백엔드 없이 브라우저 localStorage에 데이터를 저장합니다.

## 실행 / 배포
```bash
npm install
npm run dev
npm run build
```
Vercel: GitHub에 push → vercel.com에서 Import → Framework **Vite** → Deploy. `vercel.json`이 SPA 새로고침 404를 막아 줍니다.

## 네팔 현지화 내용
- **언어**: 전 화면 네팔어. 숫자·시간은 데바나가리 숫자(५ मिनेट अघि), 가격은 루피 + 라크 단위 쉼표(रू 1,45,000), 차·집 가격은 लाख/करोड 표기
- **폰트**: Google Fonts *Mukta* (데바나가리 + 라틴 모두 지원)
- **지역**: ठमेल, नयाँ बानेश्वर, पाटन, झम्सिखेल, कोटेश्वर, बौद्ध, भक्तपुर, लेकसाइड(पोखरा)
- **카테고리**: 바이크/스쿠터, 수공예(हस्तकला), 스포츠/트레킹 등 네팔 수요 반영
- **트렌드 상품**: 스쿠터·Royal Enfield, 전기 스쿠터·BYD 전기차(EV 붐), 태양광+인버터, 싱잉볼, 파시미나, 트레킹 배낭·텐트, 크리켓 배트(NPL 열기), 사리(다사인·티하르), 모모 찜기, 공무원(लोक सेवा) 시험 교재
- **동네생활 주제**: 정전·단수 안내(बिजुली/पानी सूचना), 축제(चाडपर्व), 모모 맛집 등
- **안전 안내**: eSewa·Khalti 선입금 사기 경고, 차량 거래 시 블루북·명의이전 확인
- **디자인**: 네팔 국기 크림슨(#B3261E)과 블루, 다사인·티하르 시즌 배너

## v2.0 — 사업기획서 반영 변경 사항

| 기획서 항목 | 구현 내용 | 관련 파일 |
| --- | --- | --- |
| 단계별 출시 (카트만두 우선) | 동네별 오픈/대기 상태, 미오픈 동네는 대기자 명단 신청, 글쓰기 제한 | `data/mock.js`(REGION_INFO), `pages/Home.jsx` |
| +977 휴대폰 OTP 가입 | 번호 검증(97/98로 시작 10자리) → OTP → 닉네임·동네·약관 동의. 글쓰기·채팅·가격제안은 로그인 필요 | `pages/Auth.jsx`, `components/UI.jsx`(useRequireLogin) |
| 수익: 유료 끌어올리기·강조 | 하루 1회 무료, 이후 रू 50 / ⭐विशेष 3일 रू 100 (상단 노출) | `pages/ProductDetail.jsx` |
| 수익: 프리미엄 게시 | 차량 카테고리 7일 상단 + 배지 रू 500 (글쓰기 시 선택 가능) | `pages/Write.jsx` |
| 수익: 동네가게 광고 | 피드 6개마다 '프로모션' 광고, 가게 페이지·쿠폰 발급 | `components/UI.jsx`(AdCard), `pages/Business.jsx` |
| 수익: 사업자 계정·광고 집행 | 사업자 계정 रू 999/월, 반경 1~3km 광고 रू 1,500/월, 노출·클릭 표시 | `pages/Business.jsx` |
| 결제 | eSewa·Khalti·Fonepay QR 선택 결제창 (데모) | `components/UI.jsx`(Checkout) |
| 신뢰·안전 | 금지 물품 자동 차단, 차량 거래 블루북 안내, 판매업자 배지, 신고 → 운영 대기열 | `pages/Write.jsx`, `pages/ProductDetail.jsx` |
| 운영 KPI | 주간 신규 매물, 채팅 발생률, 미처리 신고(2시간 기준 초과 표시), 매출, 대기자 명단 | `pages/Admin.jsx` |
| 전자상거래법 대응 | 약관·개인정보·커뮤니티 규칙, 온라인 민원 접수(접수번호), 사업자 정보 표시 | `pages/Legal.jsx` |
| 해외 이주 매물 캠페인 | '✈️ विदेश जाँदै सेल' 필터와 배지 | `pages/Home.jsx`, `pages/Write.jsx` |
| 로마자 검색 | scooter → स्कुटर, saree → साडी 등 | `data/mock.js`(ROMAN_MAP), `pages/Search.jsx` |
| 저사양·데이터 절약 | '데이터 절약 모드'에서 사진을 320px로 요청 | `components/UI.jsx`(Img), 설정 |
| 공유 | Viber·WhatsApp·링크 복사 | `pages/ProductDetail.jsx` |

**출시 전 반드시 교체할 것**: `COMPANY`(등록번호·PAN·전자상거래 등록번호), 약관 문구(현지 변호사 검토), 데모 OTP·결제(실제 SMS·결제 게이트웨이), 운영 대시보드(관리자 권한이 있는 별도 시스템).

**아직 넣지 않은 것**: 영어 보조 언어, 안전결제·배달(기획서상 2년 차 이후), 실제 서버·다중 사용자 데이터.

## 실서비스 확장 시 참고
- 결제: eSewa, Khalti 결제 API
- 인증: 네팔 휴대폰 번호(+977) SMS OTP
- 지도: OpenStreetMap / Leaflet (네팔 지역 데이터가 충실함)
- 백엔드: Supabase / Firebase로 Store.jsx의 dispatch를 API 호출로 교체
