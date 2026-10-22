// 실사 이미지: Unsplash (무료 사용 라이선스)
// u(): images.unsplash.com 직접 주소 / ud(): unsplash 다운로드 주소(신규 ID 형식, 640px)
// 각 상품에는 같은 분야의 예비 사진(fb)이 있어 첫 사진이 안 열리면 자동으로 바뀝니다.
export const u = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
export const ud = (id) => `https://unsplash.com/photos/${id}/download?force=true&w=640`;

export const REGIONS = ['ठमेल', 'नयाँ बानेश्वर', 'पाटन', 'झम्सिखेल', 'कोटेश्वर', 'बौद्ध', 'भक्तपुर', 'लेकसाइड, पोखरा'];

export const CATEGORIES = [
  { id: 'digital', name: 'मोबाइल/इलेक्ट्रोनिक्स', icon: '📱' },
  { id: 'vehicles', name: 'बाइक/स्कुटर', icon: '🛵' },
  { id: 'appliance', name: 'घरायसी उपकरण', icon: '🔌' },
  { id: 'furniture', name: 'फर्निचर', icon: '🛋️' },
  { id: 'kitchen', name: 'भान्सा सामान', icon: '🍳' },
  { id: 'fashion', name: 'लुगा/फेसन', icon: '🥻' },
  { id: 'handicraft', name: 'हस्तकला', icon: '🪷' },
  { id: 'sports', name: 'खेलकुद/ट्रेकिङ', icon: '🏏' },
  { id: 'hobby', name: 'गेम/संगीत', icon: '🎸' },
  { id: 'books', name: 'किताब/पढाइ', icon: '📚' },
  { id: 'kids', name: 'बालबालिका', icon: '🧸' },
  { id: 'etc', name: 'अन्य', icon: '📦' },
];

export const USERS = {
  me: { id: 'me', nickname: 'नयाँ छिमेकी', temp: 36.5, region: 'ठमेल', joined: '2026-08-02', color: '#B3261E' },
  u1: { id: 'u1', nickname: 'ठमेलको_बिरालो', temp: 42.3, region: 'ठमेल', joined: '2023-05-11', color: '#C2410C', responseRate: 98 },
  u2: { id: 'u2', nickname: 'पोखरेली ट्रेकर', temp: 38.9, region: 'लेकसाइड, पोखरा', joined: '2024-01-20', color: '#1D4ED8', responseRate: 91 },
  u3: { id: 'u3', nickname: 'सुनिता_पाटन', temp: 51.2, region: 'पाटन', joined: '2021-09-03', color: '#7E22CE', responseRate: 100 },
  u4: { id: 'u4', nickname: 'मोमो प्रेमी', temp: 36.8, region: 'ठमेल', joined: '2025-07-15', color: '#15803D', responseRate: 85 },
  u5: { id: 'u5', nickname: 'घर_सर्दैछु', temp: 40.1, region: 'नयाँ बानेश्वर', joined: '2022-02-28', color: '#BE185D', responseRate: 95 },
  u6: { id: 'u6', nickname: 'बौद्धकी आमा', temp: 45.6, region: 'बौद्ध', joined: '2022-11-08', color: '#B45309', responseRate: 97 },
  u7: { id: 'u7', nickname: 'गेमर_दाइ', temp: 37.4, region: 'कोटेश्वर', joined: '2024-06-30', color: '#4338CA', responseRate: 88 },
};

const H = 3600 * 1000;
const D = 24 * H;
const now = Date.now();

const P = (id, o) => ({
  id, status: 'selling', views: 20 + ((id.length * 37) % 180), baseLikes: (id.charCodeAt(1) * 7) % 25,
  chatCount: (id.charCodeAt(1) * 3) % 9, offerable: true, nanum: false, ...o,
});

// 분야별 예비 사진
const FB = {
  phone: u('1598327105666-5b89351aff97'), bike: u('1558981806-ec527fa84c39'), laptop: u('1496181133206-80ce9b88a853'),
  outdoor: u('1504280390367-361c6d9f38f4'), sport: u('1579952363873-27f3bade9f55'), fabric: u('1610030469983-98e550d6193c'),
  food: u('1496116218417-1a781b1c416c'), music: u('1525201548942-d8732f6617a0'),
};

export const PRODUCTS = [
  P('p1', { title: 'iPhone 15 Pro 256GB नेचुरल टाइटेनियम', price: 145000, category: 'digital', sellerId: 'u1', region: 'ठमेल', createdAt: now - 12 * 60000, fb: FB.phone,
    images: [u('1511707171634-5f897ff02aa9'), u('1512499617640-c74ae3a79d37')],
    desc: 'गत वर्ष दशैंमा किनेको। सधैं कभर र स्क्रिन गार्ड लगाएर चलाएको, कतै कोरिएको छैन।\nब्याट्री हेल्थ ९३%\nबक्स, चार्जर, बिल सबै छ।\nठमेल चोक नजिक भेटेर लिन सकिन्छ।' }),
  P('p2', { abroad: true, title: 'Samsung Galaxy S24 Ultra 12/256', price: 128000, category: 'digital', sellerId: 'u3', region: 'पाटन', createdAt: now - 2 * H, fb: FB.phone,
    images: [u('1610945415295-d9bbf067e59c'), u('1598327105666-5b89351aff97')],
    desc: 'अफिसियल सेट, वारेन्टी ४ महिना बाँकी। S Pen सहित।\nविदेश जाँदै भएकाले बेच्दैछु।' }),
  P('p3', { premium: true, highlightUntil: now + 2 * D, title: 'Honda Dio स्कुटर २०२२ (बागमती प्रदेश नम्बर)', price: 185000, category: 'vehicles', sellerId: 'u5', region: 'नयाँ बानेश्वर', createdAt: now - 40 * 60000, fb: FB.bike,
    images: [u('1558981806-ec527fa84c39'), u('1449426468159-d96dbf08f19f')],
    desc: '१२,००० कि.मि. मात्र चलेको। ब्लुबुक, बीमा अपडेट छ।\nनियमित सर्भिसिङ गरेको। नामसारी गर्न सहयोग गर्छु।' }),
  P('p4', { premium: true, title: 'Royal Enfield Classic 350 (२०२१)', price: 520000, category: 'vehicles', sellerId: 'u2', region: 'लेकसाइड, पोखरा', createdAt: now - 5 * H, status: 'reserved', fb: FB.bike,
    images: [u('1568772585407-9361f9bf3a87'), u('1558981403-c5f9899a28bc')],
    desc: 'मुस्ताङ ट्रिप दुई पटक गरेको, इन्जिन एकदम राम्रो।\nक्र्यास गार्ड र लगेज र्‍याक थपिएको।' }),
  P('p5', { title: 'इलेक्ट्रिक स्कुटर — एक चार्जमा ११० कि.मि.', price: 210000, category: 'vehicles', sellerId: 'u7', region: 'कोटेश्वर', createdAt: now - 3 * H, fb: FB.bike,
    images: [u('1593941707882-a5bba14938c7')],
    desc: 'पेट्रोल खर्च बचाउन किनेको थिएँ, अब कार किनेकाले बेच्दैछु।\nहोम चार्जर सहित। ब्याट्री वारेन्टी २०२८ सम्म।' }),
  P('p6', { abroad: true, title: 'MacBook Air M2 13 इन्च मिडनाइट', price: 118000, category: 'digital', sellerId: 'u3', region: 'पाटन', createdAt: now - 9 * H, fb: FB.laptop,
    images: [u('1517336714731-489689fd1ca8'), u('1496181133206-80ce9b88a853')],
    desc: 'साइकल काउन्ट १२०। अर्को महिना अस्ट्रेलिया पढ्न जाँदै भएकाले बेच्दैछु। चार्जर र स्लिभ सहित।' }),
  P('p7', { title: 'हातले बनाएको सिंगिङ बाउल (१२ से.मि.)', price: 4500, category: 'handicraft', sellerId: 'u6', region: 'बौद्ध', createdAt: now - 25 * 60000, fb: FB.music,
    images: [ud('y0wkjVGUT9s'), ud('d-xbK1qfCVY')],
    desc: 'बौद्धका कारिगरले बनाएको सात धातुको बाउल। काठको स्टिक र कुसन सहित।\nध्यान र योगका लागि उत्तम।' }),
  P('p8', { title: 'शुद्ध पश्मिना सल (हातले बुनेको)', price: 6500, category: 'fashion', sellerId: 'u6', region: 'बौद्ध', createdAt: now - 6 * H, fb: FB.fabric,
    images: [u('1520903920243-00d872a2d1c9')],
    desc: 'उपहारमा पाएको, एक पटक पनि प्रयोग नगरेको। जाडोका लागि एकदम न्यानो।' }),
  P('p9', { title: 'ट्रेकिङ ब्याकप्याक ६० लिटर', price: 7500, category: 'sports', sellerId: 'u2', region: 'लेकसाइड, पोखरा', createdAt: now - 1 * D, fb: FB.outdoor,
    images: [u('1553062407-98eeb64c6a62')],
    desc: 'अन्नपूर्ण बेस क्याम्प एक पटक गएको। रेन कभर सहित।' }),
  P('p10', { title: 'क्याम्पिङ टेन्ट (२ जना)', price: 0, nanum: true, offerable: false, category: 'sports', sellerId: 'u2', region: 'लेकसाइड, पोखरा', createdAt: now - 90 * 60000, fb: FB.outdoor,
    images: [u('1504280390367-361c6d9f38f4')],
    desc: 'निःशुल्क दिँदैछु! एउटा पोल अलि बाङ्गिएको छ, बाँकी सबै ठीक। आफैं आएर लैजानुहोस् 🙂' }),
  P('p11', { title: 'इङ्लिस विलो क्रिकेट ब्याट', price: 9000, category: 'sports', sellerId: 'u7', region: 'कोटेश्वर', createdAt: now - 4 * H, fb: FB.sport,
    images: [u('1531415074968-036ba1b575da')],
    desc: 'NPL हेरेर जोसमा किनेको 😅 दुई पटक मात्र खेलेको। ग्रिप नयाँ छ।' }),
  P('p12', { title: 'फुटबल बुट साइज ४२', price: 3500, category: 'sports', sellerId: 'u4', region: 'ठमेल', createdAt: now - 7 * H, fb: FB.sport,
    images: [u('1511886929837-354d827aae26')],
    desc: 'फुटसलमा ३–४ पटक लगाएको। साइज नमिलेकाले बेच्दैछु।' }),
  P('p13', { title: 'सोलार प्यानल + इन्भर्टर सेट', price: 45000, category: 'appliance', sellerId: 'u5', region: 'नयाँ बानेश्वर', createdAt: now - 20 * H, fb: u('1508514177221-188b1cf16e9d'),
    images: [u('1509391366360-2e959784a276')],
    desc: '२ वटा ३३०W प्यानल, १ kVA इन्भर्टर, ब्याट्री सहित।\nघर सर्दै भएकाले सबै एकैपटक बेच्ने।' }),
  P('p14', { title: 'अकुस्टिक गितार (ब्याग सहित)', price: 12000, category: 'hobby', sellerId: 'u4', region: 'ठमेल', createdAt: now - 15 * H, fb: FB.music,
    images: [u('1510915361894-db8b60106cb1')],
    desc: 'नयाँ तार हालेको। सिक्नेलाई उपयुक्त। कापो र पिक फ्री।' }),
  P('p15', { title: 'बनारसी साडी — दशैं/तिहार विशेष', price: 8500, category: 'fashion', sellerId: 'u3', region: 'पाटन', createdAt: now - 30 * 60000, fb: FB.fabric,
    images: [u('1610030469983-98e550d6193c')],
    desc: 'एक पटक बिहेमा लगाएको। ब्लाउज पिस सहित। टीकाका लागि एकदम राम्रो।' }),
  P('p16', { title: '३ सिटको सोफा (खैरो)', price: 22000, category: 'furniture', sellerId: 'u5', region: 'नयाँ बानेश्वर', createdAt: now - 2 * D, fb: u('1586023492125-27b2c045efd7'),
    images: [u('1555041469-a586c61ea9bc')],
    desc: 'घर सर्दैछु, छिटो बेच्नुपर्ने। आफैं लैजानुपर्छ (लिफ्ट छ)।' }),
  P('p17', { title: 'गेमिङ कन्ट्रोलर — PUBG/फ्रि फायरका लागि', price: 6500, category: 'hobby', sellerId: 'u7', region: 'कोटेश्वर', createdAt: now - 11 * H, fb: u('1587829741301-dc798b83add3'),
    images: [u('1606813907291-d86efa9b94db')],
    desc: 'उपहारमा पाएको, पहिले नै एउटा भएकाले बेच्दैछु।' }),
  P('p18', { title: '३ तले स्टिल मोमो स्टिमर', price: 2200, category: 'kitchen', sellerId: 'u4', region: 'ठमेल', createdAt: now - 3 * D, status: 'sold', fb: u('1556909114-f6e7ad7d3136'),
    images: [u('1496116218417-1a781b1c416c')],
    desc: 'घरमै मोमो बनाउन एकदम सजिलो। ५० वटासम्म एकैपटक पाक्छ।' }),
  P('p19', { title: '४३ इन्च स्मार्ट टिभी', price: 32000, category: 'appliance', sellerId: 'u1', region: 'ठमेल', createdAt: now - 30 * H, fb: u('1527443224154-c4a3942d3acf'),
    images: [u('1593359677879-a4bb92f829d1')],
    desc: 'वाल ब्र्याकेट र रिमोट सहित। नेटफ्लिक्स/युट्युब चल्छ।' }),
  P('p20', { title: 'लोक सेवा तयारी किताब सेट (१२ थान)', price: 2500, category: 'books', sellerId: 'u3', region: 'पाटन', createdAt: now - 50 * H, fb: u('1512820790803-83ca734da794'),
    images: [u('1544947950-fa07a98d237f')],
    desc: 'खरिदार र नायब सुब्बा तयारीका किताब। केही ठाउँमा मात्र हाइलाइट गरेको।' }),
  P('p21', { title: 'छालाको ज्याकेट (L साइज)', price: 7000, category: 'fashion', sellerId: 'u1', region: 'ठमेल', createdAt: now - 4 * D, fb: FB.fabric,
    images: [u('1551028719-00167b16eac5')],
    desc: 'जाडो आउँदैछ! दुई सिजन मात्र लगाएको।' }),
  P('p22', { title: 'बच्चाको साइकल (५–८ वर्ष)', price: 0, nanum: true, offerable: false, category: 'kids', sellerId: 'u6', region: 'बौद्ध', createdAt: now - 60 * 60000, fb: u('1485965120184-e220f721d03e'),
    images: [u('1532298229144-0ec0c57515c7')],
    desc: 'छोरा ठूलो भयो, निःशुल्क दिँदैछु। साँझ ६ बजेपछि आउनुहोस्।' }),
];

export const COMMUNITY_TOPICS = ['सबै', 'छिमेकी प्रश्न', 'खाना/मोमो', 'दैनिकी', 'हराएको/भेटिएको', 'बिजुली/पानी सूचना', 'चाडपर्व', 'घरपालुवा जनावर'];

export const POSTS = [
  { id: 'c1', topic: 'खाना/मोमो', authorId: 'u4', region: 'ठमेल', createdAt: now - 2 * H, title: 'ठमेल नजिक सबैभन्दा मीठो झोल मोमो कहाँ पाइन्छ?',
    body: 'साथीहरू विदेशबाट आउँदैछन्, राम्रो झोल मोमो खुवाउन मन छ। सुझाव दिनुहोस् न 🙏', image: u('1496116218417-1a781b1c416c'), likes: 24,
    comments: [{ id: 'cm1', authorId: 'u1', text: 'चोकको दोस्रो तलामा रहेको सानो पसल ट्राइ गर्नुहोस्, झोल एकदम पिरो र मीठो छ!', createdAt: now - 90 * 60000 }] },
  { id: 'c2', topic: 'बिजुली/पानी सूचना', authorId: 'u5', region: 'नयाँ बानेश्वर', createdAt: now - 5 * H, title: 'भोलि बिहान १० देखि ४ बजेसम्म बत्ती जाने',
    body: 'मर्मतका कारण बानेश्वर क्षेत्रमा बत्ती काटिने सूचना आएको छ। मोबाइल चार्ज गरेर राख्नुहोला।', likes: 31, comments: [] },
  { id: 'c3', topic: 'दैनिकी', authorId: 'u2', region: 'लेकसाइड, पोखरा', createdAt: now - 1 * D, title: 'आज बिहान हिमाल एकदम सफा देखियो',
    body: 'फेवा तालको किनारबाट खिचेको फोटो ☀️ असोजको आकाश नै छुट्टै हुन्छ।', image: u('1486911278844-a81c5267e227'), likes: 58,
    comments: [{ id: 'cm2', authorId: 'u3', text: 'वाह! एकदम राम्रो फोटो', createdAt: now - 20 * H }] },
  { id: 'c4', topic: 'चाडपर्व', authorId: 'u3', region: 'पाटन', createdAt: now - 7 * H, title: 'दशैंको लागि सस्तो र राम्रो खसी कहाँ पाइन्छ?',
    body: 'पाटन वरपर भरपर्दो ठाउँ थाहा भए बताइदिनुहोस्।', likes: 9, comments: [] },
  { id: 'c5', topic: 'हराएको/भेटिएको', authorId: 'u6', region: 'बौद्ध', createdAt: now - 30 * H, title: 'कालो कुकुर हराएको 🐶',
    body: 'बौद्ध स्तुपा पछाडिबाट हिजो साँझ हरायो। रातो पट्टा लगाएको छ, नाम "भोटे"। देख्नुभए सम्पर्क गर्नुहोला।', likes: 42, comments: [] },
];

export const STORES = [
  { id: 's1', name: 'हिमालयन कफी हाउस', category: 'क्याफे', region: 'ठमेल', distance: '३२० मि.', rating: 4.8, reviews: 214, image: u('1509042239860-f550ce710b93'), desc: 'नेपाली पहाडमा फलेको अर्गानिक कफी, ताजा भुटेको। कफी र दूध चिया दुवै पाइन्छ।', coupon: 'अमेरिकानोमा रू ५० छुट' },
  { id: 's2', name: 'दाइको मोमो पसल', category: 'रेस्टुरेन्ट', region: 'ठमेल', distance: '५४० मि.', rating: 4.7, reviews: 389, image: u('1496116218417-1a781b1c416c'), desc: 'झोल मोमो, सी मोमो, कोठे मोमो — दिनभरि ताजा' },
  { id: 's3', name: 'थकाली भान्सा', category: 'रेस्टुरेन्ट', region: 'झम्सिखेल', distance: '१.१ कि.मि.', rating: 4.6, reviews: 156, image: u('1517248135467-4c7edcad34c4'), desc: 'थकाली दालभात, फापरको रोटी र घरको अचार', coupon: 'पहिलो पटक आउँदा लस्सी फ्री' },
];

export const JOBS = [
  { id: 'j1', title: 'क्याफेमा पार्ट-टाइम बरिस्ता चाहियो', place: 'हिमालयन कफी हाउस', region: 'ठमेल', pay: 'प्रति घण्टा रू २५०', schedule: 'शनिबार र आइतबार, १०:०० – ४:००', createdAt: now - 3 * H },
  { id: 'j2', title: 'फुड डेलिभरी राइडर (आफ्नै बाइक)', place: 'स्थानीय रेस्टुरेन्ट', region: 'नयाँ बानेश्वर', pay: 'मासिक रू ३०,००० + कमिसन', schedule: 'दिउँसो १२ – राति ९', createdAt: now - 8 * H },
  { id: 'j3', title: 'कक्षा ८ को गणित/अङ्ग्रेजी ट्युसन', place: 'व्यक्तिगत', region: 'पाटन', pay: 'मासिक रू १२,०००', schedule: 'आइत–शुक्र, साँझ ५ – ६:३०', createdAt: now - 1 * D },
];

export const HOMES = [
  { id: 'h1', type: '२ कोठा + भान्सा', deal: 'भाडामा', price: 'रू १८,०००/महिना', size: '२४ घण्टा पानी', floor: 'दोस्रो तला', region: 'ठमेल', image: u('1522708323590-d24dbb6b0267'), createdAt: now - 6 * H },
  { id: 'h2', type: 'फ्ल्याट 2BHK', deal: 'भाडामा', price: 'रू ३५,०००/महिना', size: 'पार्किङ सहित', floor: 'पाँचौं तला', region: 'झम्सिखेल', image: u('1502672260266-1c1ef2d93688'), createdAt: now - 1 * D },
  { id: 'h3', type: '२.५ तले घर (४ आना)', deal: 'बिक्रीमा', price: 'रू २ करोड ८० लाख', size: '१३ फिट बाटो', floor: '५ कोठा', region: 'भक्तपुर', image: u('1493809842364-78817add7ffb'), createdAt: now - 2 * D },
];

export const CARS = [
  { id: 'v1', title: 'BYD Atto 3 इलेक्ट्रिक (२०२४)', km: '१८,००० कि.मि.', fuel: 'इलेक्ट्रिक', price: 5800000, region: 'कोटेश्वर', image: u('1560958089-b8a1929cea89'), createdAt: now - 10 * H },
  { id: 'v2', title: 'Hyundai Creta (२०२०)', km: '५२,००० कि.मि.', fuel: 'पेट्रोल', price: 4200000, region: 'नयाँ बानेश्वर', image: u('1549317661-bd32c8ce0db2'), createdAt: now - 2 * D },
  { id: 'v3', title: 'Suzuki Swift (२०१८)', km: '७१,२०० कि.मि.', fuel: 'पेट्रोल', price: 2600000, region: 'पाटन', image: u('1541899481282-d53bffe3c35d'), createdAt: now - 3 * D },
];

export const INITIAL_CHATS = [
  { id: 'ch1', productId: 'p4', partnerId: 'u2', unread: 1, updatedAt: now - 30 * 60000,
    messages: [
      { id: 'm1', from: 'me', text: 'नमस्ते! बुलेट अझै उपलब्ध छ?', at: now - 60 * 60000 },
      { id: 'm2', from: 'u2', text: 'छ हजुर। भोलि बिहान लेकसाइडमा टेस्ट राइड गर्न आउनुहोस् न।', at: now - 30 * 60000 },
    ] },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'activity', text: 'ठमेलको_बिरालोले राखेको "iPhone 15 Pro" को मूल्य घट्यो।', at: now - 50 * 60000, read: false, link: '/products/p1' },
  { id: 'n2', type: 'keyword', text: 'किवर्ड "स्कुटर" सम्बन्धी नयाँ पोस्ट: Honda Dio स्कुटर २०२२', at: now - 40 * 60000, read: false, link: '/products/p3' },
  { id: 'n3', type: 'activity', text: 'छिमेकी बजारमा स्वागत छ! टोल प्रमाणीकरण गरेपछि छिमेकीसँग किनबेच गर्न सकिन्छ।', at: now - 2 * D, read: true, link: '/my/region' },
];

export const AUTO_REPLIES = [
  'नमस्ते! हजुर, अझै उपलब्ध छ 🙂',
  'कहिले भेट्न मिल्छ भन्नुहोस्, म मिलाउँछु।',
  'थप फोटो चाहिए भन्नुहोस् है।',
  'मूल्य अलि घटाउन गाह्रो छ, माफ गर्नुहोला 🙏',
  'हुन्छ! त्यसो भए त्यहीँ भेटौं।',
];
export const OFFER_REPLIES = ['प्रस्तावका लागि धन्यवाद! त्यो मूल्यमा दिन्छु 🙂', 'अलिकति मात्र बढाउनुभयो भने सोचौंला!'];

export const MANNER_TAGS = ['समयमै आउनुहुन्छ', 'विनम्र र राम्रो व्यवहार', 'छिटो जवाफ दिनुहुन्छ', 'सामान विवरण अनुसारै छ', 'राम्रो सामान सस्तोमा बेच्नुहुन्छ'];
export const POPULAR_SEARCHES = ['स्कुटर', 'iPhone', 'सिंगिङ बाउल', 'ट्रेकिङ', 'साडी', 'निःशुल्क'];
export const REPORT_REASONS = ['बेच्न निषेध गरिएको सामान', 'नक्कली पोस्ट', 'व्यापारी जस्तो देखिन्छ', 'ठगी जस्तो देखिन्छ', 'अपमानजनक भाषा'];
export const SAMPLE_PHOTOS = ['1449426468159-d96dbf08f19f', '1553062407-98eeb64c6a62', '1510915361894-db8b60106cb1', '1531415074968-036ba1b575da', '1509391366360-2e959784a276', '1551028719-00167b16eac5'].map((id) => u(id));

// ───────── 사업기획서 반영 (v2) ─────────

// 단계별 출시: 1단계는 카트만두 밸리 핵심 동네만 공개, 나머지는 대기자 명단(관문 G2 통과 후 오픈)
export const REGION_INFO = {
  'ठमेल': { city: 'काठमाडौं', open: true },
  'नयाँ बानेश्वर': { city: 'काठमाडौं', open: true },
  'पाटन': { city: 'ललितपुर', open: true },
  'कोटेश्वर': { city: 'काठमाडौं', open: true },
  'झम्सिखेल': { city: 'ललितपुर', open: false },
  'बौद्ध': { city: 'काठमाडौं', open: false },
  'भक्तपुर': { city: 'भक्तपुर', open: false },
  'लेकसाइड, पोखरा': { city: 'पोखरा', open: false },
};

// 금지 물품 자동 필터
export const PROHIBITED = ['बन्दुक', 'पेस्तोल', 'हतियार', 'गोली', 'औषधि', 'ट्याब्लेट', 'गाँजा', 'चरेस', 'लागूपदार्थ', 'बाघको छाला', 'गैंडाको सिङ', 'हात्तीको दाँत', 'कस्तुरी', 'नक्कली नोट',
  'gun', 'pistol', 'weapon', 'ganja', 'charas', 'drugs', 'tiger skin', 'rhino horn', 'ivory', 'musk'];

// 로마자 네팔어·영어 검색 → 데바나가리 키워드
export const ROMAN_MAP = {
  scooter: 'स्कुटर', scooty: 'स्कुटर', bike: 'बाइक', motorbike: 'बाइक', bullet: 'Royal Enfield', cycle: 'साइकल', saikal: 'साइकल',
  mobile: 'मोबाइल', phone: 'iPhone', laptop: 'MacBook', tv: 'टिभी', solar: 'सोलार', inverter: 'इन्भर्टर',
  saree: 'साडी', sari: 'साडी', sadi: 'साडी', pashmina: 'पश्मिना', shawl: 'सल', jacket: 'ज्याकेट', juta: 'बुट', shoes: 'बुट',
  momo: 'मोमो', bowl: 'बाउल', singing: 'सिंगिङ', trekking: 'ट्रेकिङ', tent: 'टेन्ट', bag: 'ब्याकप्याक', cricket: 'क्रिकेट', football: 'फुटबल',
  guitar: 'गितार', sofa: 'सोफा', kitab: 'किताब', book: 'किताब', loksewa: 'लोक सेवा', free: 'निःशुल्क', nishulka: 'निःशुल्क',
  ghar: 'घर', kotha: 'कोठा', bideshi: 'विदेश', bidesh: 'विदेश',
};

// 유료 상품 가격 (रू)
export const PRICES = { bump: 50, highlight: 100, premium: 500, business: 999, adMonthly: 1500 };
export const HIGHLIGHT_DAYS = 3;
export const PREMIUM_CATEGORIES = ['vehicles'];

export const PAY_METHODS = [
  { id: 'esewa', name: 'eSewa', color: '#60BB46' },
  { id: 'khalti', name: 'Khalti', color: '#5C2D91' },
  { id: 'fonepay', name: 'Fonepay QR', color: '#C8102E' },
];

// 동네가게 광고 (피드 안 'प्रायोजित' 카드)
export const AD_SLOTS = [
  { id: 'ad1', storeId: 's1', headline: 'बिहानको पहिलो कफी — अमेरिकानोमा रू ५० छुट' },
  { id: 'ad2', storeId: 's2', headline: 'दशैं विशेष: झोल मोमो २ प्लेटमा १ प्लेट निःशुल्क' },
  { id: 'ad3', storeId: 's3', headline: 'परिवारसँग थकाली खाना — १०% छुट' },
];

// 전자상거래법상 표시 의무 정보 (등록 후 실제 번호로 교체)
export const COMPANY = {
  name: 'छिमेकी बजार प्रा. लि.',
  address: 'नयाँ बानेश्वर, काठमाडौं, नेपाल',
  reg: 'कम्पनी दर्ता नं. — (दर्तापछि भर्नुहोस्)',
  pan: 'PAN नं. — (दर्तापछि भर्नुहोस्)',
  ecom: 'विद्युतीय व्यापार सूचीकरण नं. — (दर्तापछि भर्नुहोस्)',
  email: 'gunaso@chhimeki.example',
  phone: '+977-1-XXXXXXX',
};
