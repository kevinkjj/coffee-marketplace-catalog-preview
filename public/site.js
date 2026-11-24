import { addDraftBagLine, draftBagPreview,
  normalizeDraftBag } from './bag-model.mjs';

// The website uses the approved catalogue for a browser-local draft bag.
// No customer details, order, payment, or quoted total leave this page.
const CATALOG_URL = 'https://charsiu-approved-catalog.onrender.com/api/platform/approved-catalog';
const SNAPSHOT_URL = '/api/platform/approved-catalog.json';
const BAG_KEY = 'charsiu.web.draftBag.v1';
const LOCALES = { en: 'en-AU', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR' };
const COPY = {
  en: {
    title: 'Good coffee, from good cafés', skip: 'Skip to products', navProducts: 'Products', navAbout: 'About', languageLabel: 'Language', homeLabel: 'Charsiu home', categoriesLabel: 'Product categories', closeDetail: 'Close product details',
    previewNotice: 'BROWSING PREVIEW · Products are not live for ordering.', heroEyebrow: 'A BETTER DAILY RITUAL', heroLineOne: 'Good coffee,', heroLineTwo: 'from good cafés.', heroDescription: 'Discover beans, brew gear and your next cup from independent cafés.', explore: 'Explore the collection',
    collectionEyebrow: 'CHOSEN FOR YOU', collectionTitle: 'Explore good coffee', searchLabel: 'Search products', searchPlaceholder: 'Search coffee, gear or cafés', filterAll: 'All', filterBeans: 'Coffee beans', filterDrinks: 'Drinks', filterGear: 'Brew gear', loading: 'Loading the collection…', loadError: 'The café catalogue is unavailable right now. Please try again.', retry: 'Try again', emptyResults: 'No products match your search.', count: '{count} products', countOne: '1 product', snapshotNotice: 'Showing an earlier catalogue snapshot. Product details may have changed.', refreshLive: 'Retry live catalogue',
    aboutEyebrow: 'FROM INDEPENDENT CAFÉS', aboutTitle: 'A better way to discover your next cup.', aboutBody: "Charsiu brings together considered coffee and the people behind it. This preview features Café Faducci's approved selection. Product names and descriptions are shown as the café wrote them.", aboutNote: 'Ordering and payment are not available on this website yet.', footerNote: 'Independent coffee, thoughtfully found.',
    descriptionTitle: 'From the café', detailNotice: 'Browsing preview only. Orders and payments are not available yet.', openDetails: 'View details', kindBeans: 'Coffee beans', kindDrink: 'Drink', kindRetail: 'Brew gear', pickup: 'Pickup eligible', shipping: 'Shipping eligible', unavailable: 'Currently unavailable', fromPrice: 'From {price}',
    navBag: 'Bag', bagEyebrow: 'YOUR SELECTION', bagTitle: 'Your bag', bagIntro: 'Save a draft selection on this device. No order or payment will be made.', bagEmpty: 'Your bag is empty. Explore the collection to add products.', bagCatalogWait: 'Your draft bag is saved. Reload the catalogue to see its products.', goodsSubtotal: 'Goods subtotal', bagEstimate: 'Catalogue goods estimate only. Tax breakdown, shipping and final total need a fresh server quote.', bagUnavailable: 'Some products are unavailable. Remove them before reviewing.', reviewBag: 'Review draft bag', reviewTitle: 'Draft order review', reviewNotice: 'This is a draft only. Pickup times, stock, tax breakdown, shipping and the final total require a fresh server quote. Ordering and payment are closed.', variationLabel: 'Variation', quantityLabel: 'Quantity', fulfillmentLabel: 'Delivery method', addToBag: 'Add to bag', addedToBag: 'Added to your bag.', bagLimit: 'Choose 1–99 items; your bag can hold up to 30 different lines.', remove: 'Remove', unavailableItem: 'Product unavailable', methodPickup: 'Pick up at café', methodShipping: 'Shipping',
  },
  'zh-Hans': {
    title: '好咖啡，来自好咖啡馆', skip: '跳至商品', navProducts: '商品', navAbout: '关于', languageLabel: '语言', homeLabel: 'Charsiu 首页', categoriesLabel: '商品分类', closeDetail: '关闭商品详情',
    previewNotice: '浏览预览 · 商品尚未开放下单。', heroEyebrow: '每天的一杯好咖啡', heroLineOne: '好咖啡，', heroLineTwo: '来自好咖啡馆。', heroDescription: '发现独立咖啡馆的咖啡豆、冲煮器具和下一杯好咖啡。', explore: '探索精选商品',
    collectionEyebrow: '为你精选', collectionTitle: '探索精选商品', searchLabel: '搜索商品', searchPlaceholder: '搜索咖啡、器具或咖啡馆', filterAll: '全部', filterBeans: '咖啡豆', filterDrinks: '饮品', filterGear: '冲煮器具', loading: '正在载入商品…', loadError: '暂时无法载入咖啡馆商品，请稍后重试。', retry: '重试', emptyResults: '没有符合搜索条件的商品。', count: '{count} 件商品', snapshotNotice: '正在显示较早的商品快照，商品资料可能已有变化。', refreshLive: '重试实时目录',
    aboutEyebrow: '来自独立咖啡馆', aboutTitle: '更轻松地发现下一杯好咖啡。', aboutBody: 'Charsiu 汇集用心制作的咖啡和背后的咖啡馆。本预览展示 Cafe Faducci 已审核的商品；商品名称与介绍保留咖啡馆原文。', aboutNote: '本网站目前尚未开放下单或付款。', footerNote: '用心发现独立咖啡馆的好咖啡。',
    descriptionTitle: '咖啡馆介绍', detailNotice: '仅供浏览预览，尚未开放下单或付款。', openDetails: '查看详情', kindBeans: '咖啡豆', kindDrink: '饮品', kindRetail: '冲煮器具', pickup: '适合到店自取', shipping: '适合邮寄', unavailable: '暂不可售', fromPrice: '{price} 起',
    navBag: '购物袋', bagEyebrow: '你的选择', bagTitle: '购物袋', bagIntro: '在此设备保存选购草稿；不会创建订单或付款。', bagEmpty: '购物袋还是空的，去挑选商品吧。', bagCatalogWait: '选购草稿已保存。请重新载入目录查看商品。', goodsSubtotal: '商品小计', bagEstimate: '仅根据目录估算商品金额。税额明细、运费及最终总额须由服务器重新报价。', bagUnavailable: '部分商品已不可用，请移除后再核对。', reviewBag: '核对选购草稿', reviewTitle: '订单草稿核对', reviewNotice: '这只是草稿。自取时段、库存、税额明细、运费及最终总额须由服务器重新报价；目前不能下单或付款。', variationLabel: '规格', quantityLabel: '数量', fulfillmentLabel: '交付方式', addToBag: '加入购物袋', addedToBag: '已加入购物袋。', bagLimit: '每项请选择 1–99 件；购物袋最多容纳 30 种商品行。', remove: '移除', unavailableItem: '商品不可用', methodPickup: '到店自取', methodShipping: '邮寄',
  },
  'zh-Hant': {
    title: '好咖啡，來自好咖啡館', skip: '跳至商品', navProducts: '商品', navAbout: '關於', languageLabel: '語言', homeLabel: 'Charsiu 首頁', categoriesLabel: '商品分類', closeDetail: '關閉商品詳情',
    previewNotice: '瀏覽預覽 · 商品尚未開放下單。', heroEyebrow: '每天的一杯好咖啡', heroLineOne: '好咖啡，', heroLineTwo: '來自好咖啡館。', heroDescription: '探索獨立咖啡館的咖啡豆、沖煮器具和下一杯好咖啡。', explore: '探索精選商品',
    collectionEyebrow: '為你精選', collectionTitle: '探索精選商品', searchLabel: '搜尋商品', searchPlaceholder: '搜尋咖啡、器具或咖啡館', filterAll: '全部', filterBeans: '咖啡豆', filterDrinks: '飲品', filterGear: '沖煮器具', loading: '正在載入商品…', loadError: '暫時無法載入咖啡館商品，請稍後重試。', retry: '重試', emptyResults: '沒有符合搜尋條件的商品。', count: '{count} 件商品', snapshotNotice: '目前顯示較早的商品快照，商品資料可能已有變更。', refreshLive: '重試即時目錄',
    aboutEyebrow: '來自獨立咖啡館', aboutTitle: '更輕鬆地發現下一杯好咖啡。', aboutBody: 'Charsiu 匯集用心製作的咖啡和背後的咖啡館。本預覽展示 Cafe Faducci 已審核的商品；商品名稱與介紹保留咖啡館原文。', aboutNote: '本網站目前尚未開放下單或付款。', footerNote: '用心發現獨立咖啡館的好咖啡。',
    descriptionTitle: '咖啡館介紹', detailNotice: '僅供瀏覽預覽，尚未開放下單或付款。', openDetails: '查看詳情', kindBeans: '咖啡豆', kindDrink: '飲品', kindRetail: '沖煮器具', pickup: '適合到店自取', shipping: '適合郵寄', unavailable: '暫不可售', fromPrice: '{price} 起',
    navBag: '購物袋', bagEyebrow: '你的選擇', bagTitle: '購物袋', bagIntro: '在此裝置儲存選購草稿；不會建立訂單或付款。', bagEmpty: '購物袋還是空的，去挑選商品吧。', bagCatalogWait: '選購草稿已儲存。請重新載入目錄查看商品。', goodsSubtotal: '商品小計', bagEstimate: '僅根據目錄估算商品金額。稅額明細、運費及最終總額須由伺服器重新報價。', bagUnavailable: '部分商品已無法購買，請移除後再核對。', reviewBag: '核對選購草稿', reviewTitle: '訂單草稿核對', reviewNotice: '這只是草稿。自取時段、庫存、稅額明細、運費及最終總額須由伺服器重新報價；目前不能下單或付款。', variationLabel: '規格', quantityLabel: '數量', fulfillmentLabel: '交付方式', addToBag: '加入購物袋', addedToBag: '已加入購物袋。', bagLimit: '每項請選擇 1–99 件；購物袋最多容納 30 種商品行。', remove: '移除', unavailableItem: '商品無法購買', methodPickup: '到店自取', methodShipping: '郵寄',
  },
  ja: {
    title: '良いカフェから、良いコーヒーを', skip: '商品へ移動', navProducts: '商品', navAbout: '紹介', languageLabel: '言語', homeLabel: 'Charsiu ホーム', categoriesLabel: '商品カテゴリー', closeDetail: '商品詳細を閉じる',
    previewNotice: '閲覧プレビュー · まだ注文できません。', heroEyebrow: '毎日の一杯をもっと豊かに', heroLineOne: '良いコーヒーを、', heroLineTwo: '良いカフェから。', heroDescription: '個性豊かなカフェの豆、抽出器具、次の一杯を見つけましょう。', explore: '商品を見る',
    collectionEyebrow: 'おすすめ', collectionTitle: 'コーヒーを探す', searchLabel: '商品を検索', searchPlaceholder: 'コーヒー、器具、カフェを検索', filterAll: 'すべて', filterBeans: 'コーヒー豆', filterDrinks: 'ドリンク', filterGear: '抽出器具', loading: '商品を読み込み中…', loadError: 'カフェの商品を読み込めません。しばらくしてからお試しください。', retry: '再試行', emptyResults: '該当する商品はありません。', count: '{count} 件の商品', snapshotNotice: '以前のカタログを表示しています。商品情報が変更されている場合があります。', refreshLive: '最新のカタログを再試行',
    aboutEyebrow: '個性豊かなカフェから', aboutTitle: '次の一杯との出会いを、もっと身近に。', aboutBody: 'Charsiuは、こだわりのコーヒーとその作り手を紹介します。このプレビューではCafe Faducciの承認済み商品を掲載しています。商品名と説明はカフェの原文のまま表示します。', aboutNote: 'このウェブサイトでは、まだ注文・決済できません。', footerNote: '個性豊かなカフェのコーヒーを見つけよう。',
    descriptionTitle: 'カフェからの紹介', detailNotice: '閲覧プレビューです。注文・決済はまだできません。', openDetails: '詳細を見る', kindBeans: 'コーヒー豆', kindDrink: 'ドリンク', kindRetail: '抽出器具', pickup: '店頭受取に対応予定', shipping: '配送に対応予定', unavailable: '現在利用できません', fromPrice: '{price}から',
    navBag: 'バッグ', bagEyebrow: '選んだ商品', bagTitle: 'バッグ', bagIntro: 'この端末に下書きを保存します。注文や決済は行われません。', bagEmpty: 'バッグは空です。商品を探して追加してください。', bagCatalogWait: '下書きは保存されています。商品を見るにはカタログを再読み込みしてください。', goodsSubtotal: '商品小計', bagEstimate: 'カタログに基づく商品金額の目安です。税額の内訳、送料、最終合計はサーバーで再見積もりが必要です。', bagUnavailable: '利用できない商品があります。削除してから確認してください。', reviewBag: '下書きを確認', reviewTitle: '注文内容の下書き', reviewNotice: 'これは下書きです。受取日時、在庫、税額の内訳、送料、最終合計はサーバーで再確認が必要です。注文と決済はまだできません。', variationLabel: '種類', quantityLabel: '数量', fulfillmentLabel: '受取方法', addToBag: 'バッグに追加', addedToBag: 'バッグに追加しました。', bagLimit: '1項目につき1～99点、最大30項目まで選べます。', remove: '削除', unavailableItem: '利用できない商品', methodPickup: 'カフェで受取', methodShipping: '配送',
  },
  ko: {
    title: '좋은 카페에서 만나는 좋은 커피', skip: '상품으로 이동', navProducts: '상품', navAbout: '소개', languageLabel: '언어', homeLabel: 'Charsiu 홈', categoriesLabel: '상품 카테고리', closeDetail: '상품 상세 닫기',
    previewNotice: '둘러보기 미리보기 · 아직 주문할 수 없습니다.', heroEyebrow: '매일의 더 좋은 커피', heroLineOne: '좋은 커피를,', heroLineTwo: '좋은 카페에서.', heroDescription: '독립 카페의 원두, 추출 도구, 다음 한 잔을 만나보세요.', explore: '상품 둘러보기',
    collectionEyebrow: '추천 상품', collectionTitle: '좋은 커피 찾기', searchLabel: '상품 검색', searchPlaceholder: '커피, 도구 또는 카페 검색', filterAll: '전체', filterBeans: '원두', filterDrinks: '음료', filterGear: '추출 도구', loading: '상품을 불러오는 중…', loadError: '카페 상품을 불러올 수 없습니다. 잠시 후 다시 시도하세요.', retry: '다시 시도', emptyResults: '검색 결과가 없습니다.', count: '상품 {count}개', snapshotNotice: '이전 카탈로그를 표시하고 있습니다. 상품 정보가 변경되었을 수 있습니다.', refreshLive: '실시간 카탈로그 다시 시도',
    aboutEyebrow: '독립 카페에서', aboutTitle: '다음 한 잔을 더 쉽게 발견하세요.', aboutBody: 'Charsiu는 정성스럽게 만든 커피와 그 뒤의 카페를 소개합니다. 이 미리보기에는 Cafe Faducci가 승인한 상품이 표시됩니다. 상품명과 설명은 카페의 원문 그대로 제공됩니다.', aboutNote: '이 웹사이트에서는 아직 주문하거나 결제할 수 없습니다.', footerNote: '독립 카페의 커피를 발견하세요.',
    descriptionTitle: '카페의 소개', detailNotice: '둘러보기 미리보기입니다. 주문과 결제는 아직 제공되지 않습니다.', openDetails: '상세 보기', kindBeans: '원두', kindDrink: '음료', kindRetail: '추출 도구', pickup: '픽업 가능 예정', shipping: '배송 가능 예정', unavailable: '현재 이용할 수 없음', fromPrice: '{price}부터',
    navBag: '장바구니', bagEyebrow: '선택한 상품', bagTitle: '장바구니', bagIntro: '이 기기에 상품 선택 초안을 저장합니다. 주문이나 결제는 진행되지 않습니다.', bagEmpty: '장바구니가 비어 있습니다. 상품을 둘러보고 담아 보세요.', bagCatalogWait: '선택 초안이 저장되었습니다. 상품을 보려면 카탈로그를 다시 불러오세요.', goodsSubtotal: '상품 소계', bagEstimate: '카탈로그 기준 상품 금액의 예상치입니다. 세금 내역, 배송비, 최종 합계는 서버에서 다시 확인해야 합니다.', bagUnavailable: '이용할 수 없는 상품이 있습니다. 삭제한 뒤 확인하세요.', reviewBag: '선택 초안 확인', reviewTitle: '주문 초안 확인', reviewNotice: '이 화면은 초안입니다. 픽업 시간, 재고, 세금 내역, 배송비, 최종 합계는 서버 견적이 필요합니다. 주문과 결제는 아직 제공되지 않습니다.', variationLabel: '옵션', quantityLabel: '수량', fulfillmentLabel: '수령 방법', addToBag: '장바구니에 담기', addedToBag: '장바구니에 담았습니다.', bagLimit: '상품별 1~99개, 최대 30개 상품 항목을 담을 수 있습니다.', remove: '삭제', unavailableItem: '이용할 수 없는 상품', methodPickup: '카페 픽업', methodShipping: '배송',
  },
};

const nodes = {
  language: document.querySelector('#language'), search: document.querySelector('#search'),
  grid: document.querySelector('#catalog-grid'), count: document.querySelector('#catalog-count'),
  status: document.querySelector('#catalog-status'), error: document.querySelector('#catalog-error'),
  empty: document.querySelector('#empty-results'), snapshot: document.querySelector('#snapshot-note'),
  dialog: document.querySelector('#product-dialog'),
  bagCount: document.querySelector('#bag-count'),
  bagEmpty: document.querySelector('#bag-empty'),
  bagContent: document.querySelector('#bag-content'),
  bagLines: document.querySelector('#bag-lines'),
  bagSubtotal: document.querySelector('#bag-subtotal'),
  bagWarning: document.querySelector('#bag-warning'),
  bagReview: document.querySelector('#bag-review'),
  bagGroups: document.querySelector('#bag-groups'),
  reviewSubtotal: document.querySelector('#review-subtotal'),
  reviewButton: document.querySelector('#review-bag'),
  detailVariation: document.querySelector('#detail-variation'),
  detailQuantity: document.querySelector('#detail-quantity'),
  detailMethod: document.querySelector('#detail-method'),
  detailBagMessage: document.querySelector('#detail-bag-message'),
};
let language = preferredLanguage();
let products = [];
let kind = 'all';
let selectedProduct = null;
let draftBag = readDraftBag();
let reviewOpen = false;

function readDraftBag() {
  try { return normalizeDraftBag(JSON.parse(localStorage.getItem(BAG_KEY))); }
  catch { return []; }
}
function saveDraftBag() {
  try { localStorage.setItem(BAG_KEY, JSON.stringify(draftBag)); }
  catch { /* The in-memory draft remains usable. */ }
}
function changeDraftBag(next) {
  draftBag = normalizeDraftBag(next);
  reviewOpen = false;
  saveDraftBag();
  renderBag();
}

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
      typeof product.platformMerchantId !== 'string' ||
      typeof product.platformLocationId !== 'string' ||
      ids.has(product.platformProductId) || typeof product.name !== 'string' ||
      !product.name.trim() || typeof product.description !== 'string' ||
      typeof product.locationName !== 'string' ||
      !['beans', 'drink', 'retail'].includes(product.kind) ||
      !Array.isArray(product.variations) || !product.variations.length ||
      product.variations.some((variation) =>
        typeof variation?.platformVariationId !== 'string' ||
        !variation.platformVariationId ||
        !Number.isSafeInteger(variation.priceCents) ||
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
function renderBagReview(preview) {
  nodes.bagGroups.replaceChildren(...preview.groups.map((group) => {
    const card = element('section', 'bag-group');
    card.append(element('h4', '', `${group.locationName} · ${t(
      group.fulfillment === 'pickup' ? 'methodPickup' : 'methodShipping')}`));
    for (const line of group.lines) {
      const row = element('div', 'bag-group-row');
      row.append(element('span', '', `${line.product.name} · ` +
        `${line.variation.name} × ${line.quantity}`),
      element('strong', '', money(line.lineTotalCents)));
      card.append(row);
    }
    const subtotal = element('div', 'bag-group-row');
    subtotal.append(element('span', '', t('goodsSubtotal')),
      element('strong', '', money(group.subtotalCents)));
    card.append(subtotal);
    return card;
  }));
  nodes.reviewSubtotal.textContent = money(preview.subtotalCents);
}
function renderBag() {
  nodes.bagCount.textContent = String(draftBag.reduce((sum, line) =>
    sum + line.quantity, 0));
  if (!draftBag.length || !products.length) {
    nodes.bagEmpty.textContent = t(draftBag.length ?
      'bagCatalogWait' : 'bagEmpty');
    nodes.bagEmpty.hidden = false;
    nodes.bagContent.hidden = true;
    nodes.bagReview.hidden = true;
    return;
  }
  const preview = draftBagPreview(products, draftBag);
  nodes.bagEmpty.hidden = true;
  nodes.bagContent.hidden = false;
  nodes.bagLines.replaceChildren(...preview.lines.map((line) => {
    const card = element('div', 'bag-line');
    const name = line.product?.name ?? t('unavailableItem');
    const info = element('div', '');
    const metadata = [line.variation?.name, line.product?.locationName,
      t(line.fulfillment === 'pickup' ? 'methodPickup' : 'methodShipping'),
      ...(!line.available ? [t('unavailable')] : [])].filter(Boolean);
    info.append(element('strong', '', name),
      element('span', 'bag-line-meta', metadata.join(' · ')));
    const controls = element('div', 'bag-line-controls');
    const quantityLabel = element('label', '', t('quantityLabel'));
    const quantity = document.createElement('input');
    quantity.type = 'number'; quantity.min = '1'; quantity.max = '99';
    quantity.inputMode = 'numeric'; quantity.value = String(line.quantity);
    quantity.setAttribute('aria-label', `${t('quantityLabel')}: ${name}`);
    quantity.addEventListener('change', () => {
      const next = Number(quantity.value);
      if (!Number.isSafeInteger(next) || next < 1 || next > 99) {
        quantity.value = String(line.quantity); return;
      }
      changeDraftBag(draftBag.map((entry) =>
        entry.productId === line.productId &&
        entry.variationId === line.variationId &&
        entry.fulfillment === line.fulfillment
          ? { ...entry, quantity: next } : entry));
    });
    quantityLabel.append(quantity);
    const remove = element('button', '', t('remove'));
    remove.type = 'button';
    remove.setAttribute('aria-label', `${t('remove')}: ${name}`);
    remove.addEventListener('click', () => changeDraftBag(draftBag.filter(
      (entry) => entry.productId !== line.productId ||
        entry.variationId !== line.variationId ||
        entry.fulfillment !== line.fulfillment)));
    controls.append(quantityLabel, remove,
      element('strong', 'bag-line-price', line.available ?
        money(line.lineTotalCents) : '—'));
    card.append(info, controls);
    return card;
  }));
  nodes.bagSubtotal.textContent = money(preview.subtotalCents);
  nodes.bagWarning.hidden = !preview.hasUnavailable;
  nodes.reviewButton.disabled = preview.hasUnavailable;
  nodes.bagReview.hidden = !reviewOpen || preview.hasUnavailable;
  if (!nodes.bagReview.hidden) renderBagReview(preview);
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
  const selectedVariation = nodes.detailVariation.value;
  nodes.detailVariation.replaceChildren(...product.variations.map((variation) => {
    const option = document.createElement('option');
    option.value = variation.platformVariationId;
    option.textContent = `${variation.name} · ${money(variation.priceCents)}`;
    option.disabled = !variation.canOrder;
    return option;
  }));
  if (product.variations.some((variation) =>
    variation.platformVariationId === selectedVariation &&
    variation.canOrder)) nodes.detailVariation.value = selectedVariation;
  else nodes.detailVariation.value = product.variations.find((variation) =>
    variation.canOrder)?.platformVariationId ?? '';
  const selectedMethod = nodes.detailMethod.value;
  nodes.detailMethod.replaceChildren(...['pickup', 'shipping']
    .filter((method) => product[method]).map((method) => {
      const option = document.createElement('option');
      option.value = method;
      option.textContent = t(method === 'pickup' ?
        'methodPickup' : 'methodShipping');
      return option;
    }));
  if (product[selectedMethod]) nodes.detailMethod.value = selectedMethod;
  document.querySelector('#add-to-bag').disabled =
    !product.variations.some((variation) => variation.canOrder) ||
    !nodes.detailMethod.value;
}
function openDetails(product) {
  selectedProduct = product;
  nodes.detailVariation.value = '';
  nodes.detailMethod.value = '';
  nodes.detailQuantity.value = '1';
  nodes.detailBagMessage.textContent = '';
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
  renderBag();
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
  renderBag();
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
  renderBag();
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
document.querySelector('#add-to-bag').addEventListener('click', () => {
  const product = selectedProduct;
  const variation = product?.variations.find((value) =>
    value.platformVariationId === nodes.detailVariation.value);
  const method = nodes.detailMethod.value;
  const quantity = Number(nodes.detailQuantity.value);
  if (!product || !variation?.canOrder || !product[method] ||
    !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
    nodes.detailBagMessage.textContent = t('bagLimit'); return;
  }
  const next = addDraftBagLine(draftBag, {
    productId: product.platformProductId,
    variationId: variation.platformVariationId,
    fulfillment: method, quantity });
  if (!next) {
    nodes.detailBagMessage.textContent = t('bagLimit'); return;
  }
  changeDraftBag(next);
  nodes.detailBagMessage.textContent = t('addedToBag');
});
nodes.reviewButton.addEventListener('click', () => {
  reviewOpen = true;
  renderBag();
  nodes.bagReview.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
nodes.dialog.addEventListener('click', (event) => { if (event.target === nodes.dialog) nodes.dialog.close(); });
nodes.dialog.addEventListener('close', () => { selectedProduct = null; });
applyLanguage();
void loadCatalog();
