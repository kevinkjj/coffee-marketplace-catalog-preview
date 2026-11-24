// The customer website reads the same approved, read-only catalogue as the App.
// It never sends customer details or creates an order.
const CATALOG_URL = 'https://charsiu-approved-catalog.onrender.com/api/platform/approved-catalog';
const SNAPSHOT_URL = '/api/platform/approved-catalog.json';
const LOCALES = { en: 'en-AU', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR' };
const COPY = {
  en: {
    title: 'Good coffee, from good cafés', skip: 'Skip to products', navProducts: 'Products', navAbout: 'About', languageLabel: 'Language', homeLabel: 'Charsiu home', categoriesLabel: 'Product categories', closeDetail: 'Close product details',
    previewNotice: 'BROWSING PREVIEW · Products are not live for ordering.', heroEyebrow: 'A BETTER DAILY RITUAL', heroLineOne: 'Good coffee,', heroLineTwo: 'from good cafés.', heroDescription: 'Discover beans, brew gear and your next cup from independent cafés.', explore: 'Explore the collection',
    collectionEyebrow: 'CHOSEN FOR YOU', collectionTitle: 'Explore good coffee', searchLabel: 'Search products', searchPlaceholder: 'Search coffee, gear or cafés', filterAll: 'All', filterBeans: 'Coffee beans', filterDrinks: 'Drinks', filterGear: 'Brew gear', loading: 'Loading the collection…', loadError: 'The café catalogue is unavailable right now. Please try again.', retry: 'Try again', emptyResults: 'No products match your search.', count: '{count} products', countOne: '1 product', snapshotNotice: 'Showing an earlier catalogue snapshot. Product details may have changed.', refreshLive: 'Retry live catalogue',
    aboutEyebrow: 'FROM INDEPENDENT CAFÉS', aboutTitle: 'A better way to discover your next cup.', aboutBody: "Charsiu brings together considered coffee and the people behind it. This preview features Café Faducci's approved selection. Product names and descriptions are shown as the café wrote them.", aboutNote: 'Ordering and payment are not available on this website yet.', footerNote: 'Independent coffee, thoughtfully found.',
    descriptionTitle: 'From the café', detailNotice: 'Browsing preview only. Orders and payments are not available yet.', openDetails: 'View details', kindBeans: 'Coffee beans', kindDrink: 'Drink', kindRetail: 'Brew gear', pickup: 'Pickup eligible', shipping: 'Shipping eligible', unavailable: 'Currently unavailable', fromPrice: 'From {price}',
  },
  'zh-Hans': {
    title: '好咖啡，来自好咖啡馆', skip: '跳至商品', navProducts: '商品', navAbout: '关于', languageLabel: '语言', homeLabel: 'Charsiu 首页', categoriesLabel: '商品分类', closeDetail: '关闭商品详情',
    previewNotice: '浏览预览 · 商品尚未开放下单。', heroEyebrow: '每天的一杯好咖啡', heroLineOne: '好咖啡，', heroLineTwo: '来自好咖啡馆。', heroDescription: '发现独立咖啡馆的咖啡豆、冲煮器具和下一杯好咖啡。', explore: '探索精选商品',
    collectionEyebrow: '为你精选', collectionTitle: '探索精选商品', searchLabel: '搜索商品', searchPlaceholder: '搜索咖啡、器具或咖啡馆', filterAll: '全部', filterBeans: '咖啡豆', filterDrinks: '饮品', filterGear: '冲煮器具', loading: '正在载入商品…', loadError: '暂时无法载入咖啡馆商品，请稍后重试。', retry: '重试', emptyResults: '没有符合搜索条件的商品。', count: '{count} 件商品', snapshotNotice: '正在显示较早的商品快照，商品资料可能已有变化。', refreshLive: '重试实时目录',
    aboutEyebrow: '来自独立咖啡馆', aboutTitle: '更轻松地发现下一杯好咖啡。', aboutBody: 'Charsiu 汇集用心制作的咖啡和背后的咖啡馆。本预览展示 Cafe Faducci 已审核的商品；商品名称与介绍保留咖啡馆原文。', aboutNote: '本网站目前尚未开放下单或付款。', footerNote: '用心发现独立咖啡馆的好咖啡。',
    descriptionTitle: '咖啡馆介绍', detailNotice: '仅供浏览预览，尚未开放下单或付款。', openDetails: '查看详情', kindBeans: '咖啡豆', kindDrink: '饮品', kindRetail: '冲煮器具', pickup: '适合到店自取', shipping: '适合邮寄', unavailable: '暂不可售', fromPrice: '{price} 起',
  },
  'zh-Hant': {
    title: '好咖啡，來自好咖啡館', skip: '跳至商品', navProducts: '商品', navAbout: '關於', languageLabel: '語言', homeLabel: 'Charsiu 首頁', categoriesLabel: '商品分類', closeDetail: '關閉商品詳情',
    previewNotice: '瀏覽預覽 · 商品尚未開放下單。', heroEyebrow: '每天的一杯好咖啡', heroLineOne: '好咖啡，', heroLineTwo: '來自好咖啡館。', heroDescription: '探索獨立咖啡館的咖啡豆、沖煮器具和下一杯好咖啡。', explore: '探索精選商品',
    collectionEyebrow: '為你精選', collectionTitle: '探索精選商品', searchLabel: '搜尋商品', searchPlaceholder: '搜尋咖啡、器具或咖啡館', filterAll: '全部', filterBeans: '咖啡豆', filterDrinks: '飲品', filterGear: '沖煮器具', loading: '正在載入商品…', loadError: '暫時無法載入咖啡館商品，請稍後重試。', retry: '重試', emptyResults: '沒有符合搜尋條件的商品。', count: '{count} 件商品', snapshotNotice: '目前顯示較早的商品快照，商品資料可能已有變更。', refreshLive: '重試即時目錄',
    aboutEyebrow: '來自獨立咖啡館', aboutTitle: '更輕鬆地發現下一杯好咖啡。', aboutBody: 'Charsiu 匯集用心製作的咖啡和背後的咖啡館。本預覽展示 Cafe Faducci 已審核的商品；商品名稱與介紹保留咖啡館原文。', aboutNote: '本網站目前尚未開放下單或付款。', footerNote: '用心發現獨立咖啡館的好咖啡。',
    descriptionTitle: '咖啡館介紹', detailNotice: '僅供瀏覽預覽，尚未開放下單或付款。', openDetails: '查看詳情', kindBeans: '咖啡豆', kindDrink: '飲品', kindRetail: '沖煮器具', pickup: '適合到店自取', shipping: '適合郵寄', unavailable: '暫不可售', fromPrice: '{price} 起',
  },
  ja: {
    title: '良いカフェから、良いコーヒーを', skip: '商品へ移動', navProducts: '商品', navAbout: '紹介', languageLabel: '言語', homeLabel: 'Charsiu ホーム', categoriesLabel: '商品カテゴリー', closeDetail: '商品詳細を閉じる',
    previewNotice: '閲覧プレビュー · まだ注文できません。', heroEyebrow: '毎日の一杯をもっと豊かに', heroLineOne: '良いコーヒーを、', heroLineTwo: '良いカフェから。', heroDescription: '個性豊かなカフェの豆、抽出器具、次の一杯を見つけましょう。', explore: '商品を見る',
    collectionEyebrow: 'おすすめ', collectionTitle: 'コーヒーを探す', searchLabel: '商品を検索', searchPlaceholder: 'コーヒー、器具、カフェを検索', filterAll: 'すべて', filterBeans: 'コーヒー豆', filterDrinks: 'ドリンク', filterGear: '抽出器具', loading: '商品を読み込み中…', loadError: 'カフェの商品を読み込めません。しばらくしてからお試しください。', retry: '再試行', emptyResults: '該当する商品はありません。', count: '{count} 件の商品', snapshotNotice: '以前のカタログを表示しています。商品情報が変更されている場合があります。', refreshLive: '最新のカタログを再試行',
    aboutEyebrow: '個性豊かなカフェから', aboutTitle: '次の一杯との出会いを、もっと身近に。', aboutBody: 'Charsiuは、こだわりのコーヒーとその作り手を紹介します。このプレビューではCafe Faducciの承認済み商品を掲載しています。商品名と説明はカフェの原文のまま表示します。', aboutNote: 'このウェブサイトでは、まだ注文・決済できません。', footerNote: '個性豊かなカフェのコーヒーを見つけよう。',
    descriptionTitle: 'カフェからの紹介', detailNotice: '閲覧プレビューです。注文・決済はまだできません。', openDetails: '詳細を見る', kindBeans: 'コーヒー豆', kindDrink: 'ドリンク', kindRetail: '抽出器具', pickup: '店頭受取に対応予定', shipping: '配送に対応予定', unavailable: '現在利用できません', fromPrice: '{price}から',
  },
  ko: {
    title: '좋은 카페에서 만나는 좋은 커피', skip: '상품으로 이동', navProducts: '상품', navAbout: '소개', languageLabel: '언어', homeLabel: 'Charsiu 홈', categoriesLabel: '상품 카테고리', closeDetail: '상품 상세 닫기',
    previewNotice: '둘러보기 미리보기 · 아직 주문할 수 없습니다.', heroEyebrow: '매일의 더 좋은 커피', heroLineOne: '좋은 커피를,', heroLineTwo: '좋은 카페에서.', heroDescription: '독립 카페의 원두, 추출 도구, 다음 한 잔을 만나보세요.', explore: '상품 둘러보기',
    collectionEyebrow: '추천 상품', collectionTitle: '좋은 커피 찾기', searchLabel: '상품 검색', searchPlaceholder: '커피, 도구 또는 카페 검색', filterAll: '전체', filterBeans: '원두', filterDrinks: '음료', filterGear: '추출 도구', loading: '상품을 불러오는 중…', loadError: '카페 상품을 불러올 수 없습니다. 잠시 후 다시 시도하세요.', retry: '다시 시도', emptyResults: '검색 결과가 없습니다.', count: '상품 {count}개', snapshotNotice: '이전 카탈로그를 표시하고 있습니다. 상품 정보가 변경되었을 수 있습니다.', refreshLive: '실시간 카탈로그 다시 시도',
    aboutEyebrow: '독립 카페에서', aboutTitle: '다음 한 잔을 더 쉽게 발견하세요.', aboutBody: 'Charsiu는 정성스럽게 만든 커피와 그 뒤의 카페를 소개합니다. 이 미리보기에는 Cafe Faducci가 승인한 상품이 표시됩니다. 상품명과 설명은 카페의 원문 그대로 제공됩니다.', aboutNote: '이 웹사이트에서는 아직 주문하거나 결제할 수 없습니다.', footerNote: '독립 카페의 커피를 발견하세요.',
    descriptionTitle: '카페의 소개', detailNotice: '둘러보기 미리보기입니다. 주문과 결제는 아직 제공되지 않습니다.', openDetails: '상세 보기', kindBeans: '원두', kindDrink: '음료', kindRetail: '추출 도구', pickup: '픽업 가능 예정', shipping: '배송 가능 예정', unavailable: '현재 이용할 수 없음', fromPrice: '{price}부터',
  },
};

const nodes = {
  language: document.querySelector('#language'), search: document.querySelector('#search'),
  grid: document.querySelector('#catalog-grid'), count: document.querySelector('#catalog-count'),
  status: document.querySelector('#catalog-status'), error: document.querySelector('#catalog-error'),
  empty: document.querySelector('#empty-results'), snapshot: document.querySelector('#snapshot-note'),
  dialog: document.querySelector('#product-dialog'),
};
let language = preferredLanguage();
let products = [];
let kind = 'all';
let selectedProduct = null;

function preferredLanguage() {
  try {
    const saved = localStorage.getItem('charsiu.web.language');
    if (saved && Object.hasOwn(COPY, saved)) return saved;
  } catch { /* Browser storage is optional. */ }
  const locale = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  if (locale.startsWith('zh')) return /tw|hk|mo|hant/.test(locale) ? 'zh-Hant' : 'zh-Hans';
  if (locale.startsWith('ja')) return 'ja';
  if (locale.startsWith('ko')) return 'ko';
  return 'en';
}
function t(key, values = {}) {
  return COPY[language][key].replace(/\{(\w+)\}/g,
    (match, name) => values[name] === undefined ? match : String(values[name]));
}
function money(cents) {
  return new Intl.NumberFormat(LOCALES[language], { style: 'currency', currency: 'AUD' }).format(cents / 100);
}
function kindLabel(value) {
  return t({ beans: 'kindBeans', drink: 'kindDrink', retail: 'kindRetail' }[value]);
}
function imageUrl(product) {
  const candidate = product.imageUrls?.[0] || product.variations[0]?.imageUrls?.[0];
  try { return new URL(candidate).protocol === 'https:' ? candidate : null; } catch { return null; }
}
function catalogProducts(payload) {
  if (payload?.publication !== 'approved_local_pilot' ||
    !Array.isArray(payload.products) || payload.products.length < 1 ||
    payload.products.length > 100) throw new Error('invalid_catalogue');
  const ids = new Set();
  for (const product of payload.products) {
    if (typeof product?.platformProductId !== 'string' || !product.platformProductId ||
      ids.has(product.platformProductId) || typeof product.name !== 'string' ||
      !product.name.trim() || typeof product.description !== 'string' ||
      typeof product.locationName !== 'string' ||
      !['beans', 'drink', 'retail'].includes(product.kind) ||
      !Array.isArray(product.variations) || !product.variations.length ||
      product.variations.some((variation) => !Number.isSafeInteger(variation?.priceCents) ||
        variation.priceCents <= 0 || typeof variation.canOrder !== 'boolean')) {
      throw new Error('invalid_catalogue');
    }
    ids.add(product.platformProductId);
  }
  return payload.products;
}
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function media(product) {
  const holder = element('div', 'product-media');
  const fallback = element('span', 'media-fallback', 'CHARSIU');
  const url = imageUrl(product);
  if (url) {
    const picture = document.createElement('img');
    picture.src = url;
    picture.alt = '';
    picture.loading = 'lazy';
    picture.addEventListener('error', () => { picture.remove(); holder.append(fallback); }, { once: true });
    holder.append(picture);
  } else holder.append(fallback);
  return holder;
}
function renderCatalog() {
  if (!products.length) return;
  const query = nodes.search.value.trim().toLocaleLowerCase();
  const shown = products.filter((product) =>
    (kind === 'all' || product.kind === kind) &&
    (!query || `${product.name} ${product.description} ${product.locationName}`
      .toLocaleLowerCase().includes(query)));
  nodes.grid.replaceChildren(...shown.map((product) => {
    const card = element('button', 'product-card');
    card.type = 'button';
    card.setAttribute('aria-label', `${t('openDetails')}: ${product.name}`);
    card.append(media(product));
    const info = element('div', 'product-info');
    info.append(element('p', 'product-kind', kindLabel(product.kind)),
      element('h3', 'product-name', product.name),
      element('p', 'product-location', product.locationName));
    const bottom = element('div', 'product-bottom');
    const minPrice = Math.min(...product.variations.map((variation) => variation.priceCents));
    bottom.append(element('span', 'product-price', product.variations.length > 1
      ? t('fromPrice', { price: money(minPrice) }) : money(minPrice)),
    element('span', 'product-open', t('openDetails')));
    info.append(bottom);
    card.append(info);
    card.addEventListener('click', () => openDetails(product));
    return card;
  }));
  nodes.count.textContent = language === 'en' && shown.length === 1
    ? t('countOne') : t('count', { count: shown.length });
  nodes.empty.hidden = shown.length > 0;
}
function renderDetails() {
  const product = selectedProduct;
  if (!product) return;
  document.querySelector('#detail-kind').textContent = kindLabel(product.kind);
  document.querySelector('#detail-title').textContent = product.name;
  document.querySelector('#detail-location').textContent = product.locationName;
  const minPrice = Math.min(...product.variations.map((variation) => variation.priceCents));
  document.querySelector('#detail-price').textContent = product.variations.length > 1
    ? t('fromPrice', { price: money(minPrice) }) : money(minPrice);
  document.querySelector('#detail-description').textContent = product.description;
  const fulfillment = document.querySelector('#detail-fulfillment');
  const labels = [];
  if (product.pickup) labels.push(t('pickup'));
  if (product.shipping) labels.push(t('shipping'));
  if (!product.variations.some((variation) => variation.canOrder)) labels.push(t('unavailable'));
  fulfillment.replaceChildren(...labels.map((label) => element('span', '', label)));
  const picture = document.querySelector('#detail-image');
  const fallback = document.querySelector('#detail-fallback');
  const url = imageUrl(product);
  picture.hidden = !url;
  fallback.hidden = Boolean(url);
  picture.alt = product.name;
  if (url) picture.src = url;
  picture.onerror = () => { picture.hidden = true; fallback.hidden = false; };
}
function openDetails(product) {
  selectedProduct = product;
  renderDetails();
  nodes.dialog.showModal();
}
function applyLanguage() {
  const locale = LOCALES[language];
  document.documentElement.lang = locale;
  document.title = `Charsiu · ${t('title')}`;
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  nodes.language.value = language;
  nodes.language.setAttribute('aria-label', t('languageLabel'));
  nodes.search.placeholder = t('searchPlaceholder');
  nodes.search.setAttribute('aria-label', t('searchLabel'));
  document.querySelector('.brand').setAttribute('aria-label', t('homeLabel'));
  document.querySelector('.filters').setAttribute('aria-label', t('categoriesLabel'));
  document.querySelector('#close-detail').setAttribute('aria-label', t('closeDetail'));
  renderCatalog();
  renderDetails();
}
async function fetchProducts(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error('catalogue_unavailable');
    return catalogProducts(await response.json());
  } finally { clearTimeout(timer); }
}
async function loadCatalog() {
  nodes.status.hidden = false;
  nodes.error.hidden = true;
  nodes.empty.hidden = true;
  nodes.snapshot.hidden = true;
  nodes.count.textContent = '';
  nodes.grid.replaceChildren();
  products = [];
  try {
    products = await fetchProducts(CATALOG_URL, 10000);
  } catch {
    try {
      products = await fetchProducts(SNAPSHOT_URL, 5000);
      nodes.snapshot.hidden = false;
    } catch { nodes.error.hidden = false; }
  }
  nodes.status.hidden = true;
  if (products.length) renderCatalog();
}

document.querySelector('#year').textContent = new Date().getFullYear();
nodes.language.addEventListener('change', (event) => {
  if (!Object.hasOwn(COPY, event.target.value)) return;
  language = event.target.value;
  try { localStorage.setItem('charsiu.web.language', language); } catch { /* Optional. */ }
  applyLanguage();
});
nodes.search.addEventListener('input', renderCatalog);
for (const button of document.querySelectorAll('.filters button')) {
  button.addEventListener('click', () => {
    kind = button.dataset.kind;
    for (const item of document.querySelectorAll('.filters button'))
      item.setAttribute('aria-pressed', String(item === button));
    renderCatalog();
  });
}
document.querySelector('#retry').addEventListener('click', loadCatalog);
document.querySelector('#refresh-live').addEventListener('click', loadCatalog);
document.querySelector('#close-detail').addEventListener('click', () => nodes.dialog.close());
nodes.dialog.addEventListener('click', (event) => { if (event.target === nodes.dialog) nodes.dialog.close(); });
nodes.dialog.addEventListener('close', () => { selectedProduct = null; });
applyLanguage();
void loadCatalog();
