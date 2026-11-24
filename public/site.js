import { addDraftBagLine, draftBagPreview,
  normalizeDraftBag } from './bag-model.mjs';

// The website uses the approved catalogue for a browser-local draft bag.
// Only product IDs, quantities, pickup times, and postcodes reach the read-only quote API.
// No customer details, order, or payment data leave this page.
const CATALOG_URL = 'https://charsiu-approved-catalog.onrender.com/api/platform/approved-catalog';
const QUOTE_BASE = ['127.0.0.1', 'localhost'].includes(location.hostname)
  ? 'http://127.0.0.1:8795' : new URL(CATALOG_URL).origin;
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

const QUOTE_COPY = {
  en: { reviewNotice: 'Choose a pickup time or shipping postcode for a read-only server quote. Ordering and payment are closed.', pickupTimeLabel: 'Pickup time', pickupTimeChoose: 'Choose a pickup time', pickupTimeLoading: 'Loading pickup times…', pickupTimeUnavailable: 'Pickup times are unavailable right now.', postcodeLabel: 'Shipping postcode', postcodePlaceholder: '4-digit Australian postcode', requestQuote: 'Check live quote', quoteLoading: 'Checking current prices and availability…', quoteMissing: 'Choose a pickup time or enter a 4-digit postcode for each group.', quoteFailed: 'A live quote is unavailable right now. Please try again.', quoteTitle: 'Read-only server quote', quoteShipping: 'Shipping', quoteTax: 'Tax calculated by Square', quoteTotal: 'Quoted total', quoteBlocked: 'This group cannot be fully quoted with the current choices.', quotePackageMissing: 'A parcel size has not been set for this item combination. Choose pickup or another combination.', quoteRateUnavailable: 'A shipping rate is unavailable right now. Please try again later.', quoteNote: 'Prices and availability can change. This quote does not create an order or payment.' },
  'zh-Hans': { reviewNotice: '选择自取时段或填写邮编，可获取服务器只读报价；目前不能下单或付款。', pickupTimeLabel: '自取时段', pickupTimeChoose: '请选择自取时段', pickupTimeLoading: '正在载入自取时段…', pickupTimeUnavailable: '暂时无法取得自取时段。', postcodeLabel: '收件邮编', postcodePlaceholder: '澳洲四位邮编', requestQuote: '核对实时报价', quoteLoading: '正在核对当前价格和库存…', quoteMissing: '请为每组选择自取时段或填写四位邮编。', quoteFailed: '暂时无法取得实时报价，请重试。', quoteTitle: '服务器只读报价', quoteShipping: '运费', quoteTax: 'Square 计算税额', quoteTotal: '报价总额', quoteBlocked: '当前选项无法取得此组完整报价。', quotePackageMissing: '此商品组合尚未设置包裹尺寸。请选择自取或其他组合。', quoteRateUnavailable: '暂时无法取得邮寄运费，请稍后重试。', quoteNote: '价格和库存可能变化。此报价不会创建订单或付款。' },
  'zh-Hant': { reviewNotice: '選擇自取時段或填寫郵遞區號，可取得伺服器唯讀報價；目前不能下單或付款。', pickupTimeLabel: '自取時段', pickupTimeChoose: '請選擇自取時段', pickupTimeLoading: '正在載入自取時段…', pickupTimeUnavailable: '暫時無法取得自取時段。', postcodeLabel: '收件郵遞區號', postcodePlaceholder: '澳洲四位郵遞區號', requestQuote: '核對即時報價', quoteLoading: '正在核對目前價格和庫存…', quoteMissing: '請為每組選擇自取時段或填寫四位郵遞區號。', quoteFailed: '暫時無法取得即時報價，請重試。', quoteTitle: '伺服器唯讀報價', quoteShipping: '運費', quoteTax: 'Square 計算稅額', quoteTotal: '報價總額', quoteBlocked: '目前選項無法取得此組完整報價。', quotePackageMissing: '此商品組合尚未設定包裹尺寸。請選擇自取或其他組合。', quoteRateUnavailable: '暫時無法取得郵寄運費，請稍後再試。', quoteNote: '價格和庫存可能變動。此報價不會建立訂單或付款。' },
  ja: { reviewNotice: '受取日時か配送先の郵便番号を選ぶと、サーバーの参照専用見積もりを取得できます。注文と決済はまだできません。', pickupTimeLabel: '受取日時', pickupTimeChoose: '受取日時を選択', pickupTimeLoading: '受取日時を読み込み中…', pickupTimeUnavailable: '受取日時を取得できません。', postcodeLabel: '配送先の郵便番号', postcodePlaceholder: 'オーストラリアの4桁', requestQuote: '最新の見積もりを確認', quoteLoading: '現在の価格と在庫を確認中…', quoteMissing: '各グループの受取日時または4桁の郵便番号を入力してください。', quoteFailed: '最新の見積もりを取得できません。再試行してください。', quoteTitle: 'サーバーの参照専用見積もり', quoteShipping: '送料', quoteTax: 'Squareが計算した税額', quoteTotal: '見積もり合計', quoteBlocked: '現在の選択内容では、このグループの見積もりを完了できません。', quotePackageMissing: 'この商品の組み合わせには梱包サイズが設定されていません。店頭受取か別の組み合わせを選んでください。', quoteRateUnavailable: '現在、送料を取得できません。時間をおいて再試行してください。', quoteNote: '価格と在庫は変わる場合があります。注文や決済は行われません。' },
  ko: { reviewNotice: '픽업 시간이나 배송지 우편번호를 선택하면 서버의 읽기 전용 견적을 받을 수 있습니다. 주문과 결제는 아직 제공되지 않습니다.', pickupTimeLabel: '픽업 시간', pickupTimeChoose: '픽업 시간을 선택하세요', pickupTimeLoading: '픽업 시간을 불러오는 중…', quoteMissing: '각 그룹의 픽업 시간 또는 4자리 우편번호를 입력하세요.', pickupTimeUnavailable: '현재 픽업 시간을 불러올 수 없습니다.', postcodeLabel: '배송지 우편번호', postcodePlaceholder: '호주 4자리 우편번호', requestQuote: '현재 견적 확인', quoteLoading: '현재 가격과 재고 확인 중…', quoteFailed: '현재 견적을 불러올 수 없습니다. 다시 시도하세요.', quoteTitle: '서버 읽기 전용 견적', quoteShipping: '배송비', quoteTax: 'Square가 계산한 세금', quoteTotal: '견적 합계', quoteBlocked: '현재 선택으로는 이 그룹의 전체 견적을 확인할 수 없습니다.', quotePackageMissing: '이 상품 조합의 포장 크기가 아직 설정되지 않았습니다. 매장 픽업이나 다른 조합을 선택해 주세요.', quoteRateUnavailable: '현재 배송비를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.', quoteNote: '가격과 재고는 변경될 수 있습니다. 주문이나 결제는 진행되지 않습니다.' },
};
for (const [locale, copy] of Object.entries(QUOTE_COPY)) Object.assign(COPY[locale], copy);

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
  quoteButton: document.querySelector('#request-quote'),
  quoteMessage: document.querySelector('#quote-message'),
  quoteResult: document.querySelector('#quote-result'),
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
let quoteVersion = 0;
let quoteBusy = false;
let quoteMessageKey = '';
let serverQuote = null;
let pickupLoadVersion = 0;
const pickupSlots = new Map();
const reviewDetails = new Map();

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
  quoteVersion += 1;
  quoteBusy = false;
  serverQuote = null;
  quoteMessageKey = '';
  pickupLoadVersion += 1;
  pickupSlots.clear();
  reviewDetails.clear();
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
function bagGroupKey(group) {
  return `${group.merchantId}:${group.locationId}:${group.fulfillment}`;
}
function updateQuoteDetail(key, value) {
  reviewDetails.set(key, value);
  quoteVersion += 1;
  quoteBusy = false;
  serverQuote = null;
  quoteMessageKey = '';
  renderQuoteResult();
}
function quoteRow(label, value, extraClass = '') {
  const row = element('div', `bag-group-row ${extraClass}`.trim());
  row.append(element('span', '', label), element('strong', '', money(value)));
  return row;
}
function quoteBlockMessage(group) {
  if (group.blockers.some((blocker) => [
    'shipping_package_not_configured',
    'shipping_combined_package_not_configured',
  ].includes(blocker))) return t('quotePackageMissing');
  if (group.blockers.some((blocker) => [
    'auspost_api_key_not_configured', 'auspost_rate_unavailable',
  ].includes(blocker))) return t('quoteRateUnavailable');
  return t('quoteBlocked');
}
function renderQuoteResult() {
  nodes.quoteButton.disabled = quoteBusy;
  nodes.quoteMessage.textContent = quoteMessageKey ? t(quoteMessageKey) : '';
  nodes.quoteResult.hidden = !serverQuote;
  if (!serverQuote) {
    nodes.quoteResult.replaceChildren();
    return;
  }
  const content = [element('h4', '', t('quoteTitle'))];
  let allQuoted = true;
  let combinedTotal = 0;
  for (const group of serverQuote.groups) {
    const section = element('section', 'bag-group');
    section.append(element('h4', '', `${group.locationName} · ${t(
      group.fulfillment === 'pickup' ? 'methodPickup' : 'methodShipping')}`));
    if (group.blockers.length || group.totalCents === null) {
      allQuoted = false;
      section.append(element('p', '', quoteBlockMessage(group)));
    } else {
      section.append(quoteRow(t('goodsSubtotal'), group.subtotalCents),
        quoteRow(t('quoteShipping'), group.shippingCents),
        quoteRow(t('quoteTax'), group.taxCents),
        quoteRow(t('quoteTotal'), group.totalCents, 'quote-total'));
      combinedTotal += group.totalCents;
    }
    content.push(section);
  }
  if (allQuoted && serverQuote.groups.length > 1) {
    content.push(quoteRow(t('quoteTotal'), combinedTotal, 'quote-total'));
  }
  content.push(element('p', 'quote-note', t('quoteNote')));
  nodes.quoteResult.replaceChildren(...content);
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
    const key = bagGroupKey(group);
    if (group.fulfillment === 'pickup') {
      const label = element('label', 'quote-field');
      label.append(element('span', '', t('pickupTimeLabel')));
      const select = document.createElement('select');
      const slots = pickupSlots.get(key);
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = slots === undefined || slots === null
        ? t('pickupTimeLoading') : slots.length
          ? t('pickupTimeChoose') : t('pickupTimeUnavailable');
      select.append(placeholder);
      for (const slot of slots ?? []) {
        const option = document.createElement('option');
        option.value = slot.pickupAt;
        option.textContent = `${slot.localDate} ${slot.localTime} · ${slot.timeZone}`;
        select.append(option);
      }
      select.value = reviewDetails.get(key)?.pickupAt ?? '';
      select.disabled = !slots?.length;
      select.addEventListener('change', () => updateQuoteDetail(key,
        { pickupAt: select.value }));
      label.append(select);
      card.append(label);
    } else {
      const label = element('label', 'quote-field');
      label.append(element('span', '', t('postcodeLabel')));
      const input = document.createElement('input');
      input.type = 'text'; input.inputMode = 'numeric';
      input.maxLength = 4; input.pattern = '[0-9]{4}';
      input.autocomplete = 'postal-code';
      input.placeholder = t('postcodePlaceholder');
      input.value = reviewDetails.get(key)?.destinationPostcode ?? '';
      input.addEventListener('input', () => updateQuoteDetail(key,
        { destinationPostcode: input.value.trim() }));
      label.append(input);
      card.append(label);
    }
    return card;
  }));
  nodes.reviewSubtotal.textContent = money(preview.subtotalCents);
  renderQuoteResult();
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
async function previewJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(url, { ...options, cache: 'no-store',
      signal: controller.signal });
    if (!response.ok) throw new Error('preview_unavailable');
    return response.json();
  } finally { clearTimeout(timer); }
}
async function loadPickupSlots(groups) {
  const loadVersion = ++pickupLoadVersion;
  const pickups = groups.filter((group) => group.fulfillment === 'pickup');
  for (const group of pickups) pickupSlots.set(bagGroupKey(group), null);
  if (reviewOpen) renderBagReview(draftBagPreview(products, draftBag));
  await Promise.all(pickups.map(async (group) => {
    let slots = [];
    try {
      const query = new URLSearchParams({ platformMerchantId: group.merchantId,
        platformLocationId: group.locationId });
      const result = await previewJson(`${QUOTE_BASE}/api/platform/pickup-slots?${query}`);
      if (Array.isArray(result.slots)) slots = result.slots.filter((slot) =>
        typeof slot.pickupAt === 'string' &&
        typeof slot.localDate === 'string' &&
        typeof slot.localTime === 'string' &&
        typeof slot.timeZone === 'string');
    } catch { /* The unavailable state is shown beside this group. */ }
    if (loadVersion !== pickupLoadVersion || !reviewOpen) return;
    pickupSlots.set(bagGroupKey(group), slots);
    renderBagReview(draftBagPreview(products, draftBag));
  }));
}
async function requestLiveQuote() {
  if (quoteBusy || !reviewOpen) return;
  const preview = draftBagPreview(products, draftBag);
  if (preview.hasUnavailable || !preview.lines.length) return;
  const platformFulfillmentDetails = [];
  for (const group of preview.groups) {
    const detail = reviewDetails.get(bagGroupKey(group));
    if (group.fulfillment === 'pickup' && !detail?.pickupAt ||
      group.fulfillment === 'shipping' &&
        !/^\d{4}$/.test(detail?.destinationPostcode ?? '')) {
      quoteMessageKey = 'quoteMissing';
      renderQuoteResult();
      return;
    }
    platformFulfillmentDetails.push({ platformMerchantId: group.merchantId,
      platformLocationId: group.locationId, fulfillment: group.fulfillment,
      ...(group.fulfillment === 'pickup'
        ? { pickupAt: detail.pickupAt }
        : { destinationPostcode: detail.destinationPostcode }) });
  }
  const platformLines = preview.lines.map((line) => ({
    platformMerchantId: line.product.platformMerchantId,
    platformProductId: line.product.platformProductId,
    platformVariationId: line.variation.platformVariationId,
    quantity: line.quantity, fulfillment: line.fulfillment,
  }));
  const version = quoteVersion;
  quoteBusy = true;
  serverQuote = null;
  quoteMessageKey = 'quoteLoading';
  renderQuoteResult();
  try {
    const result = await previewJson(`${QUOTE_BASE}/api/platform/quote-preview`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformLines, platformFulfillmentDetails }),
    });
    if (version !== quoteVersion) return;
    if (result.status !== 'preview_only' || result.canPlaceOrder !== false ||
      !Array.isArray(result.groups) || result.groups.length !== preview.groups.length ||
      result.groups.some((group) => !Array.isArray(group.blockers) ||
        !Number.isSafeInteger(group.subtotalCents) ||
        group.totalCents !== null && !Number.isSafeInteger(group.totalCents))) {
      throw new Error('invalid_quote');
    }
    serverQuote = result;
    quoteMessageKey = '';
  } catch {
    if (version === quoteVersion) quoteMessageKey = 'quoteFailed';
  } finally {
    if (version === quoteVersion) {
      quoteBusy = false;
      renderQuoteResult();
    }
  }
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
  reviewOpen = false;
  quoteVersion += 1;
  quoteBusy = false;
  quoteMessageKey = '';
  serverQuote = null;
  pickupLoadVersion += 1;
  pickupSlots.clear();
  reviewDetails.clear();
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
  const wasOpen = reviewOpen;
  reviewOpen = true;
  renderBag();
  nodes.bagReview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (!wasOpen) void loadPickupSlots(draftBagPreview(products, draftBag).groups);
});
nodes.quoteButton.addEventListener('click', () => { void requestLiveQuote(); });
nodes.dialog.addEventListener('click', (event) => { if (event.target === nodes.dialog) nodes.dialog.close(); });
nodes.dialog.addEventListener('close', () => { selectedProduct = null; });
applyLanguage();
void loadCatalog();
