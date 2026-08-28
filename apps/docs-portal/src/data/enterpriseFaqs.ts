export interface EnterpriseFaqItem {
  id: string;
  category: 'architecture' | 'pos' | 'payments' | 'inventory' | 'procurement' | 'hrm' | 'payroll' | 'security' | 'devops';
  role: 'developer' | 'cashier' | 'warehouse' | 'hr' | 'admin' | 'all';
  categoryLabel: {
    km: string;
    en: string;
    th: string;
    vi: string;
    zh: string;
  };
  q: {
    km: string;
    en: string;
    th: string;
    vi: string;
    zh: string;
  };
  a: {
    km: string;
    en: string;
    th: string;
    vi: string;
    zh: string;
  };
  technicalNote?: string;
  relatedPath: string;
}

export const ALL_ENTERPRISE_FAQS: EnterpriseFaqItem[] = [
  // 1-38 previously defined + 39-52
  {
    id: 'faq-01',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '01. តើប្រព័ន្ធដោះស្រាយបញ្ហា Race Condition កុំឱ្យស្តុកលក់ជាន់គ្នា (Over-selling) រវាង POS និង Website យ៉ាងដូចម្តេច?',
      en: '01. How does the system prevent race conditions and overselling between concurrent POS and Online checkout?',
      th: '01. ระบบป้องกันปัญหา Race Condition และการขายเกินสต็อกระหว่าง POS และหน้าเว็บพร้อมกันได้อย่างไร?',
      vi: '01. Hệ thống ngăn chặn tình trạng race condition và bán vượt tồn kho giữa POS và Web như thế nào?',
      zh: '01. 系统如何防止高并发下POS收银与线上商城并发购买导致的超卖问题（Race Condition）？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់ Database Transactions រួមជាមួយ PostgreSQL Row-Level Lock (`selectForUpdate()`) លើតារាង `inventories`។ នៅពេលមាន Order កំពុង checkout ជួរទិន្នន័យនៃទំនិញនោះនឹងត្រូវបានចាក់សោរបណ្តោះអាសន្ន។ ប្រសិនបើស្តុកមិនគ្រប់គ្រាន់ ប្រព័ន្ធនឹង Rollback ភ្លាមៗ និងផ្ញើកំហុស 422 Unprocessable Entity។',
      en: 'The backend encapsulates inventory deduction in DB transactions using PostgreSQL row-level locks (`selectForUpdate()`) on the `inventories` table. The row is locked during stock validation and deducted atomically. If quantity is insufficient, it triggers an immediate rollback with a 422 response.',
      th: 'แบ็กเอนด์ใช้ Database Transaction ร่วมกับการล็อกแถว (`selectForUpdate()`) บนตาราง `inventories` ใน PostgreSQL ข้อมูลจะถูกล็อกระหว่างการตรวจสอบยอด หากสต็อกไม่พอระบบจะ Rollback ทันทีพร้อมส่ง Error 422',
      vi: 'Hệ thống sử dụng DB Transaction kết hợp khóa hàng PostgreSQL (`selectForUpdate()`) trên bảng `inventories`. Dòng dữ liệu bị khóa trong lúc kiểm tra tồn kho và trừ tức thì, tự động rollback nếu không đủ số lượng.',
      zh: '后端在数据库事务中使用PostgreSQL行级排他锁（`selectForUpdate()`）锁定`inventories`表对应记录。在库存校验与扣减完成前其他并发请求需排队等待，若余额不足立即触发事务回滚并返回422状态码。'
    },
    technicalNote: 'DB::transaction(fn() => Inventory::where(...)->lockForUpdate()->decrement(...));',
    relatedPath: '/architecture'
  },
  {
    id: 'faq-02',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '02. ហេតុអ្វីបានជាគម្រោងជ្រើសរើស Monorepo តែមួយសម្រាប់ Frontend ទាំងបី និង Backend?',
      en: '02. Why did the enterprise architecture adopt a unified Monorepo structure for the 3 frontends and Laravel backend?',
      th: '02. ทำไมสถาปัตยกรรมระดับองค์กรจึงเลือกใช้โครงสร้าง Monorepo สำหรับ 3 หน้าบ้านและแบ็กเอนด์ Laravel?',
      vi: '02. Tại sao kiến trúc doanh nghiệp lại chọn cấu trúc Monorepo hợp nhất cho 3 frontend và backend Laravel?',
      zh: '02. 为什么企业级架构选择将3个前端应用与Laravel后端整合在同一个Monorepo单体仓库中？'
    },
    a: {
      km: 'Monorepo អនុញ្ញាតឱ្យចែករំលែក Typescript Interfaces, Validation Rules, កាតាឡុក I18n និង API Routes Contract រួមគ្នា។ ការកែប្រែ API លើ Backend អាចត្រូវបាន Update និង Test ភ្លាមៗលើ Admin, Customer Website និង Mobile App ដោយគ្មាន Version Desynchronization។',
      en: 'Monorepo enforces type sharing, centralized validation rules, unified i18n dictionaries, and instant contract testing. Any API change in Laravel is immediately verifiable across Admin Dashboard, Customer Storefront, and Mobile App without package drift.',
      th: 'Monorepo ช่วยให้สามารถแชร์ TypeScript Interfaces, กฎการตรวจสอบ, ดิกชันนารี I18n และสัญญา API ร่วมกัน การเปลี่ยนแปลง API ใดๆ จะสามารถทดสอบกับหน้าบ้านทั้งหมดได้ทันที',
      vi: 'Monorepo cho phép chia sẻ các TypeScript Interface, quy tắc xác thực, từ điển I18n và hợp đồng API. Mọi thay đổi API đều được cập nhật và kiểm thử tức thì trên cả 3 giao diện.',
      zh: 'Monorepo架构实现了TypeScript接口定义、数据验证规则、多语言字典与API路由契约的集中共享。后端的任何接口重构均可即时在后台、商城与移动端中同步验证，避免版本割裂。'
    },
    technicalNote: 'Root workspace orchestrates ports 8000, 5173, 5174, and Flutter CLI concurrently.',
    relatedPath: '/architecture'
  },
  {
    id: 'faq-03',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '03. តើប្រព័ន្ធធានា Single Source of Truth សម្រាប់ទិន្នន័យយ៉ាងដូចម្តេច?',
      en: '03. How does the architecture enforce a Single Source of Truth across multi-channel retail and warehouse hubs?',
      th: '03. สถาปัตยกรรมบังคับใช้ Single Source of Truth ข้ามช่องทางค้าปลีกและคลังสินค้าอย่างไร?',
      vi: '03. Kiến trúc thực thi Nguồn Chân lý Duy nhất (Single Source of Truth) như thế nào?',
      zh: '03. 系统如何在多渠道全零售与多仓储网络中确保数据的“单一事实来源”（Single Source of Truth）？'
    },
    a: {
      km: 'រាល់ប្រតិបត្តិការទាំងអស់ (POS, Online Store, Mobile App, Kiosk) ត្រូវតែហៅកាត់ REST API របស់ Laravel 12 តែមួយ និងចុះបញ្ជីទិន្នន័យក្នុង PostgreSQL 18 តែមួយ។ គ្មាន Client ណាអាចកែប្រែទិន្នន័យក្នុង Database ដោយផ្ទាល់ឡើយ។',
      en: 'All client channels route through the unified Laravel 12 REST API gateway into PostgreSQL 18. Business rules, financial ledgers, and inventory reservations execute strictly on the server layer.',
      th: 'ทุกช่องทางต้องเรียกผ่าน REST API เดียวกันของ Laravel 12 ไปยังฐานข้อมูล PostgreSQL 18 ทำให้กฎธุรกิจและบัญชีแยกประเภทถูกประมวลผลที่เซิร์ฟเวอร์เท่านั้น',
      vi: 'Tất cả các kênh đều phải thông qua cổng REST API Laravel 12 duy nhất vào cơ sở dữ liệu PostgreSQL 18. Logic kinh doanh và sổ cái kho chỉ được thực thi trên máy chủ.',
      zh: '所有终端应用统一经由Laravel 12 REST API网关读写PostgreSQL 18主库。核心业务规则、财务总账与库存过账逻辑仅在服务端受保护层执行，杜绝客户端直连篡改。'
    },
    technicalNote: 'Zero direct database access from frontend; 100% routed through Spatie-guarded controllers.',
    relatedPath: '/architecture'
  },
  {
    id: 'faq-04',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '04. តើប្រព័ន្ធប្រើ Caching Strategy របៀបណាដើម្បីឱ្យ API ឆ្លើយតបក្រោម 50ms?',
      en: '04. What caching and indexing strategy guarantees sub-50ms API response times across 759 routes?',
      th: '04. กลยุทธ์การแคชและการทำดัชนีแบบใดที่รับประกันเวลาตอบสนองของ API ต่ำกว่า 50ms?',
      vi: '04. Chiến lược bộ nhớ đệm (caching) nào đảm bảo thời gian phản hồi API dưới 50ms?',
      zh: '04. 系统采用何种缓存与索引策略，确保759个接口在高并发下平均响应时间低于50ms？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់ Redis Caching សម្រាប់ Product Catalog, Categories, Settings និង Spatie Permissions។ ទន្ទឹមនឹងនេះ តារាងធំៗដូចជា `products`, `orders`, `inventories` ត្រូវបានបំពាក់ B-Tree Composite Indexes លើ `(branch_id, status, created_at)`។',
      en: 'Redis stores pre-warmed product trees, category graphs, store configurations, and role permissions. Hot query paths feature compound B-Tree indexes on `(branch_id, status, created_at)` across 99 PostgreSQL tables.',
      th: 'ระบบใช้ Redis แคชข้อมูลแคตตาล็อกสินค้า, หมวดหมู่ และสิทธิ์ Spatie พร้อมทั้งสร้าง Composite Index บนตารางใหญ่ เช่น `orders` และ `inventories`',
      vi: 'Hệ thống dùng Redis để lưu đệm danh mục sản phẩm, cấu hình cửa hàng và phân quyền Spatie. Các bảng lớn đều được đánh chỉ mục Composite B-Tree trên các trường truy vấn thường xuyên.',
      zh: '系统采用Redis对商品目录树、系统配置及Spatie权限进行内存预热缓存；并在PostgreSQL核心表（`products`, `orders`, `inventories`）建立了基于`(branch_id, status, created_at)`的高效B-Tree复合索引。'
    },
    technicalNote: 'Cache::tags(["products", "branch_{$id}"])->remember(...);',
    relatedPath: '/database'
  },
  {
    id: 'faq-05',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '05. តើប្រព័ន្ធគ្រប់គ្រង Database Migrations ចំនួន ៣៦ ឯកសារដោយរបៀបណាដើម្បីកុំឱ្យ Error ពេល Deploy?',
      en: '05. How are the 36 verified PostgreSQL database migrations sequenced to prevent foreign key dependency errors during deployments?',
      th: '05. ระบบจัดลำดับ Migration ฐานข้อมูลทั้ง 36 ไฟล์อย่างไรเพื่อป้องกันข้อผิดพลาด Foreign Key ขณะ Deploy?',
      vi: '05. 36 tệp migration PostgreSQL được sắp xếp thứ tự thế nào để tránh lỗi ràng buộc khóa ngoại khi triển khai?',
      zh: '05. 36个PostgreSQL迁移文件如何严格编排依赖顺序，避免生产部署时外键依赖死锁？'
    },
    a: {
      km: 'Migrations ត្រូវបានរៀបចំតាមលំដាប់លំដោយយ៉ាងតឹងរ៉ឹង៖ Core Users/Roles -> Companies/Branches -> Master Catalogs/Units -> Products & Variants -> Inventories -> Orders & Invoices -> HRM & Payroll។',
      en: 'Migrations strictly follow a topological sort: Core Auth/RBAC -> Companies/Branches -> Master Catalogs -> Products/Variants -> Multi-warehouse Inventories -> Orders/Transactions -> HRM/Payroll.',
      th: 'Migration ถูกจัดเรียงลำดับอย่างเคร่งครัด: ระบบผู้ใช้/สิทธิ์ -> บริษัท/สาขา -> แคตตาล็อกหลัก -> สินค้าและตัวเลือก -> คลังสินค้า -> คำสั่งซื้อ -> ระบบเงินเดือน',
      vi: 'Các tệp migration được sắp xếp tuần tự: Xác thực/RBAC -> Công ty/Chi nhánh -> Danh mục chính -> Sản phẩm/Biến thể -> Kho hàng -> Đơn hàng -> Nhân sự/Tính lương.',
      zh: '迁移文件按拓扑结构严格分层编排：用户权限基础表 -> 多租户公司门店 -> 基础字典 -> 商品多规格 -> 多仓库存 -> 订单结算 -> 人资薪资，杜绝跨表外键依赖缺失。'
    },
    technicalNote: 'Execution order verified via Laravel migration timestamp batches.',
    relatedPath: '/database'
  },
  {
    id: 'faq-06',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '06. តើប្រព័ន្ធគាំទ្រ Multi-Tenancy (ក្រុមហ៊ុនច្រើន និងសាខាច្រើន) លើ Database តែមួយយ៉ាងដូចម្តេច?',
      en: '06. How does the architecture implement multi-tenancy and multi-company operations within a single database?',
      th: '06. สถาปัตยกรรมรองรับระบบหลายบริษัทและหลายสาขา (Multi-Tenancy) บนฐานข้อมูลเดียวได้อย่างไร?',
      vi: '06. Kiến trúc triển khai đa công ty và đa chi nhánh (Multi-tenancy) trên một cơ sở dữ liệu như thế nào?',
      zh: '06. 系统如何在单一数据库基座中实现多企业集团与多门店（Multi-Tenancy）的无缝多租户运作？'
    },
    a: {
      km: 'រាល់តារាងប្រតិបត្តិការទាំងអស់សុទ្ធតែមាន `company_id` និង `branch_id`។ ទិន្នន័យត្រូវបានបែងចែកដាច់ដោយឡែកតាម Row-Level Data Scoping ធានាថាក្រុមហ៊ុននីមួយៗមើលឃើញតែទិន្នន័យរបស់ខ្លួន។',
      en: 'Every domain table contains `company_id` and `branch_id`. Application-layer tenant scoping isolates records cleanly, allowing multi-company operations with zero cross-tenant data bleed.',
      th: 'ทุกตารางหลักจะมี `company_id` และ `branch_id` โดยระบบจะกรองข้อมูลระดับแถว ทำให้แต่ละบริษัทเห็นเฉพาะข้อมูลของตนเองอย่างปลอดภัย',
      vi: 'Mọi bảng nghiệp vụ đều chứa `company_id` và `branch_id`. Tầng ứng dụng tự động phân tách dữ liệu giúp vận hành nhiều công ty độc lập an toàn.',
      zh: '所有业务表均包含`company_id`与`branch_id`双重隔离键。应用层行级作用域强力隔离各企业数据，兼具单库集中维护与多租户数据绝缘优势。'
    },
    technicalNote: 'Configured in `App\\Models\\Scopes\\BranchScope`.',
    relatedPath: '/architecture'
  },
  {
    id: 'faq-07',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '07. តើប្រព័ន្ធ POS គាំទ្រការស្កេនបាគូដល្បឿនលឿន និង Barcode Scales (ទំនិញថ្លឹងគីឡូ) យ៉ាងដូចម្តេច?',
      en: '07. How does the POS terminal handle high-speed continuous barcode scanning and price-embedded weight scales?',
      th: '07. เครื่อง POS รองรับการสแกนบาร์โค้ดความเร็วสูงและเครื่องชั่งน้ำหนักแบบพิมพ์บาร์โค้ดอย่างไร?',
      vi: '07. Máy POS xử lý quét mã vạch liên tục và cân điện tử nhúng giá/khối lượng như thế nào?',
      zh: '07. POS终端如何支持毫秒级连续条码扫码枪录入与电子计价条码秤（EAN-13内嵌重量/金额）？'
    },
    a: {
      km: 'ប្រព័ន្ធចាប់យក Keystroke Buffer ពី Barcode Scanner ជាមួយ Debounce 50ms។ ចំពោះបាគូដថ្លឹងគីឡូ (EAN-13 Prefix 20-29) ប្រព័ន្ធ Parse ទាញយក Product Code (៥ ខ្ទង់) និងទម្ងន់/តម្លៃ (៥ ខ្ទង់) ដោយស្វ័យប្រវត្តិក្នងពេល 0.1 វិនាទី។',
      en: 'The POS listens to scanner keystroke buffers with a 50ms delimiter. For scale barcodes (EAN-13 with prefixes 20-29), it parses the 5-digit PLU product code and 5-digit weight/price automatically in sub-100ms.',
      th: 'ระบบดักจับ Keystroke Buffer จากเครื่องสแกนบาร์โค้ดด้วย Debounce 50ms สำหรับบาร์โค้ดชั่งน้ำหนัก (EAN-13 Prefix 20-29) ระบบจะแยกแยะรหัสสินค้าและน้ำหนักให้อัตโนมัติ',
      vi: 'POS lắng nghe bộ đệm phím từ đầu đọc mã vạch với độ trễ 50ms. Đối với mã vạch cân điện tử (EAN-13 tiền tố 20-29), hệ thống tự động trích xuất mã hàng và trọng lượng tức thì.',
      zh: 'POS端通过50ms防抖监听USB/蓝牙扫码枪按键流。针对生鲜计价秤打印的EAN-13条码（20-29前缀），内置算法在0.1秒内自动解构5位PLU货号与5位净重/金额并自动加入购物车。'
    },
    technicalNote: 'Parsed via `parseEan13WeightBarcode(code)` utility.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-08',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '08. តើការបិទវេនគិតលុយ (Cashier Shift Closeout / Z-Report) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '08. How does the Cashier Shift Closeout and End-of-Day Z-Report reconciliation operate?',
      th: '08. ขั้นตอนการปิดกะแคชเชียร์ (Cashier Shift Closeout) และรายงาน Z-Report สรุปยอดวันทำงานอย่างไร?',
      vi: '08. Quy trình kết ca thu ngân (Cashier Shift Closeout) và báo cáo đối soát Z-Report cuối ngày diễn ra thế nào?',
      zh: '08. 收银员交接班结账（Cashier Shift Closeout）与日结Z-Report对账机制如何运行？'
    },
    a: {
      km: 'នៅពេលបើកវេន Cashier ត្រូវបញ្ចូលប្រាក់បម្រុង (Opening Cash Float)។ ពេលបិទវេន Cashier ត្រូវរាប់ប្រាក់សុទ្ធជាក់ស្តែង។ ប្រព័ន្ធនឹងគណនាប្រៀបធៀបជាមួយប្រាក់លក់បានតាមប្រព័ន្ធ (Cash, KHQR, Card) បង្ហាញផលខុសគ្នា (Shortage/Overage) និងព្រីនប័ណ្ណ Z-Report ភ្លាមៗ។',
      en: 'Cashiers open shifts by declaring initial cash floats. At shift close, actual physical cash is counted. The engine computes expected amounts from cash, KHQR, and card transactions, flags shortages/overages, and prints an immutable Z-Report receipt.',
      th: 'แคชเชียร์เริ่มกะโดยระบุเงินทอนเริ่มต้น เมื่อปิดกะจะต้องนับเงินสดจริง ระบบจะเปรียบเทียบยอดขายจากเงินสด, KHQR และบัตร พร้อมคำนวณส่วนต่างขาด/เกิน และพิมพ์สลิป Z-Report',
      vi: 'Thu ngân mở ca bằng cách khai báo tiền lẻ ban đầu. Khi kết ca, thu ngân kiểm đếm tiền mặt thực tế. Hệ thống so sánh với doanh thu từ Tiền mặt, KHQR, Thẻ để tính tiền thừa/thiếu và in phiếu Z-Report.',
      zh: '收银员开班需录入初始备用金（Opening Float）；结班时盲数实收现金。系统自动比对系统流水（现金、KHQR扫码、刷卡），自动生成长短款差额（Discrepancy）并由80mm热敏打印机出具不可篡改的Z-Report日结单。'
    },
    technicalNote: 'Stored in `pos_shifts` table with immutable closing balance snapshot.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-09',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '09. តើប្រព័ន្ធ POS អាចបំបែកការទូទាត់ (Split Payment) និងទូទាត់ពហុរូបិយប័ណ្ណ (KHR / USD) បានទេ?',
      en: '09. Can the POS handle split payments across multiple tenders and dual-currency (USD + KHR) calculations?',
      th: '09. ระบบ POS สามารถแบ่งชำระเงินหลายรูปแบบ (Split Payment) และคำนวณสองสกุลเงิน (USD + KHR) ได้หรือไม่?',
      vi: '09. POS có hỗ trợ thanh toán chia nhỏ (Split Payment) và tính toán song tệ (USD + KHR) không?',
      zh: '09. POS终端是否支持多方式混合拆分支付（Split Payment）与双币种（USD + KHR）混合找零？'
    },
    a: {
      km: 'បាទ/ចាស! អតិថិជនអាចទូទាត់ប្រាក់សុទ្ធ USD ខ្លះ, KHQR KHR ខ្លះ និងកាតធនាគារខ្លះលើវិក្កយបត្រតែមួយ។ ប្រព័ន្ធគណនាអត្រាប្តូរប្រាក់ផ្លូវការស្វ័យប្រវត្តិ និងបង្ហាញប្រាក់អាប់ជា KHR ឬ USD យ៉ាងច្បាស់លាស់។',
      en: 'Yes! Orders support multi-tender splits (e.g., $10 Cash USD + 41,000 KHR via KHQR + Card). The engine dynamically calculates exchange rates and outputs precise change returns in either currency.',
      th: 'ได้แน่นอน! ลูกค้าสามารถจ่ายเงินสด USD บางส่วน, KHQR สกุล KHR และบัตรรวมกันในบิลเดียวได้ ระบบจะคำนวณอัตราแลกเปลี่ยนและแสดงเงินทอนอย่างแม่นยำ',
      vi: 'Hoàn toàn được! Khách hàng có thể thanh toán một phần bằng USD, một phần bằng KHQR KHR và phần còn lại qua thẻ. Hệ thống tự động tính tỷ giá và tiền thối chính xác.',
      zh: '完全支持！支持单笔账单混合拆分支付（如支付$10美元现金 + 41,000瑞尔KHQR扫码）。收银引擎依据设定的每日汇率实时换算，并支持按指定币种精准找零。'
    },
    technicalNote: 'Multi-tender records stored in `payment_transactions` table.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-10',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '10. តើការព្រីនវិក្កយបត្រកម្ដៅ (Thermal Printer ESC/POS 80mm) និងទាត់ថតប្រាក់ (Cash Drawer) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '10. How does ESC/POS 80mm thermal receipt printing and automated cash drawer kick function?',
      th: '10. การพิมพ์ใบเสร็จความร้อน ESC/POS 80 มม. และการดีดลิ้นชักเก็บเงินอัตโนมัติทำงานอย่างไร?',
      vi: '10. Cơ chế in hóa đơn nhiệt ESC/POS 80mm và tự động bật két tiền hoạt động như thế nào?',
      zh: '10. 80mm ESC/POS热敏小票打印与钱箱自动弹出脉冲是如何实现的？'
    },
    a: {
      km: 'ប្រព័ន្ធបញ្ជូន Binary ESC/POS Commands ផ្ទាល់តាម Network/USB/Bluetooth។ នៅពេលទូទាត់ជាប្រាក់សុទ្ធជោគជ័យ ប្រព័ន្ធផ្ញើកូដ `ESC p 0 25 250` ដើម្បីទាត់ថតប្រាក់ភ្លាមៗ និងព្រីនវិក្កយបត្រដែលមាន Logo, QR, និងលេខសារពើពន្ធ។',
      en: 'The client dispatches raw ESC/POS binary sequences over USB, Network (TCP 9100), or Bluetooth. Upon successful cash payment, it fires the pulse sequence `ESC p 0 25 250` to kick open the cash drawer while printing.',
      th: 'โปรแกรมจะส่งคำสั่ง Binary ESC/POS ผ่านเครือข่าย USB หรือ Bluetooth เมื่อชำระเงินสดสำเร็จจะส่งรหัสพัลส์ `ESC p 0 25 250` เพื่อดีดลิ้นชักเก็บเงินและพิมพ์ใบเสร็จทันที',
      vi: 'Ứng dụng gửi trực tiếp mã lệnh ESC/POS qua cổng USB, Mạng hoặc Bluetooth. Khi thanh toán tiền mặt thành công, mã xung `ESC p 0 25 250` được kích hoạt để mở két tiền và in hóa đơn.',
      zh: '系统直接通过USB、网络TCP 9100端口或蓝牙向打印机发送标准ESC/POS二进制指令流。现金结算成功瞬间触发`ESC p 0 25 250`电脉冲弹出钱箱，并打印含企业Logo与发票KHQR码的小票。'
    },
    technicalNote: 'Supports WebUSB / WebBluetooth / TCP Socket raw printing.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-11',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '11. តើប្រព័ន្ធ POS អនុញ្ញាតឱ្យផ្អាកការលក់ (Hold / Park Cart) និងទាញយកមកវិញ (Recall Cart) យ៉ាងដូចម្តេច?',
      en: '11. How does the POS handle parking (holding) carts and recalling them when a customer needs to pick more items?',
      th: '11. ระบบ POS พักบิล (Hold Cart) และเรียกบิลเดิมกลับมาคิดเงินต่อ (Recall Cart) ได้อย่างไร?',
      vi: '11. Máy POS lưu tạm giỏ hàng (Hold Cart) và mở lại giỏ hàng (Recall Cart) khi khách lấy thêm đồ ra sao?',
      zh: '11. 收银过程中顾客临时加购商品时，POS如何实现挂单（Hold/Park Cart）与取单（Recall Cart）？'
    },
    a: {
      km: 'Cashier អាចចុចប៊ូតុង "Hold Bill" ដើម្បីរក្សាទុកទំនិញក្នុង Local Cache ឬ Server រួចបន្តគិតលុយឱ្យអតិថិជនបន្ទាប់។ ពេលអតិថិជនត្រឡប់មកវិញ គ្រាន់តែចុច "Recall" នោះទំនិញទាំងអស់នឹងបង្ហាញឡើងវិញភ្លាមៗ។',
      en: 'Cashiers can park the current order in memory or server drafts with one keypress, allowing them to serve next customers. Recalling restores the exact cart items, discounts, and customer tags instantly.',
      th: 'แคชเชียร์สามารถกดปุ่ม "Hold Bill" เพื่อพักรายการไว้ในหน่วยความจำและคิดเงินให้ลูกค้าคนถัดไปได้ทันที เมื่อลูกค้าเดิมกลับมาก็สามารถกด "Recall" เพื่อดึงรายการเดิมกลับมาคิดต่อได้ทันที',
      vi: 'Thu ngân có thể nhấn "Tạm giữ đơn" để lưu giỏ hàng vào bộ nhớ và thanh toán cho khách tiếp theo. Khi khách quay lại, chỉ cần nhấn "Mở lại" để tải lại toàn bộ giỏ hàng.',
      zh: '收银员一键点击“挂单”即可将当前购物车状态无损暂存至内存或草稿箱，无缝接待下一位顾客；顾客返回后一键“取单”秒级还原商品、折扣及会员身份。'
    },
    technicalNote: 'Parked drafts indexed by unique cart session token in Redis / Local Storage.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-12',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '12. តើការបញ្ចុះតម្លៃ (Discounts) តាមភាគរយ, ចំនួនទឹកប្រាក់, និង Coupon Code ដំណើរការលើ POS យ៉ាងដូចម្តេច?',
      en: '12. How are item-level discounts, cart-level percentage discounts, and promotional coupons calculated?',
      th: '12. การคำนวณส่วนลดรายสินค้า, ส่วนลดท้ายบิล และคูปองโปรโมชั่นบน POS ทำงานอย่างไร?',
      vi: '12. Cách tính giảm giá theo từng món, giảm giá phần trăm toàn đơn và mã giảm giá trên POS như thế nào?',
      zh: '12. 单品折扣、整单百分比减免与促销优惠券码在POS端是如何复合计算与风控的？'
    },
    a: {
      km: 'ប្រព័ន្ធគាំទ្រទាំង Item-level Discount (បញ្ចុះតម្លៃលើមុខទំនិញនីមួយៗ) និង Order-level Discount (បញ្ចុះតម្លៃលើវិក្កយបត្រសរុប) ជាមួយការកំណត់កម្រិតបញ្ចុះតម្លៃអតិបរមា (Max Discount Limit) ដើម្បីការពារការបញ្ចុះតម្លៃខុស។',
      en: 'The pricing engine evaluates item discounts, promotional coupon codes, and cart-level percentage reductions with strict max-discount caps enforced by role permissions.',
      th: 'ระบบรองรับทั้งส่วนลดรายชิ้นและส่วนลดท้ายบิล พร้อมทั้งมีระบบกำหนดเพดานส่วนลดสูงสุดตามสิทธิ์ของพนักงานเพื่อป้องกันความผิดพลาด',
      vi: 'Hệ thống hỗ trợ giảm giá theo từng sản phẩm, mã khuyến mãi và giảm giá phần trăm toàn đơn với hạn mức chiết khấu tối đa theo quyền của thu ngân.',
      zh: '计价引擎支持单品直降、促销优惠券与整单百分比折扣复合计算，并依据收银员权限级别实施最高折扣上限风控，超额需经理授权。'
    },
    technicalNote: 'Discount calculations validated in `App\\Services\\Pos\\PricingService`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-13',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '13. តើការប្តូរទំនិញ ឬសងប្រាក់វិញ (Refund / Return) ដំណើរការយ៉ាងដូចម្តេចលើ POS?',
      en: '13. How does the POS handle customer returns, partial refunds, and automatic stock re-entry?',
      th: '13. ขั้นตอนการคืนสินค้าหรือคืนเงิน (Refund / Return) และการคืนสต็อกสินค้าเข้าคลังทำงานอย่างไร?',
      vi: '13. Quy trình đổi trả hàng hoặc hoàn tiền (Refund/Return) và tự động cộng lại kho trên POS diễn ra thế nào?',
      zh: '13. 顾客退换货（Refund / Return）与库存自动回库冲正流程在POS端是如何处理的？'
    },
    a: {
      km: 'Cashier ស្កេនបាគូដវិក្កយបត្រដើម រួចជ្រើសរើសទំនិញដែលត្រូវសង។ ប្រព័ន្ធបង្កើតប័ណ្ណ Return Invoice, គណនាប្រាក់ត្រូវសង, បូកទំនិញចូលស្តុកវិញដោយស្វ័យប្រវត្តិ និងកត់ត្រាក្នុងសៀវភៅគណនេយ្យ។',
      en: 'Cashiers scan the original receipt barcode, select items to return, specify return conditions (Restock vs Damaged), issue cash/KHQR refund, and auto-increment inventory balances with audit trails.',
      th: 'แคชเชียร์สแกนบาร์โค้ดจากใบเสร็จเดิม เลือกสินค้าที่ต้องการคืน ระบุสภาพสินค้า ระบบจะทำการคืนเงินและเพิ่มสต็อกกลับเข้าคลังให้อัตโนมัติ',
      vi: 'Thu ngân quét mã vạch trên hóa đơn gốc, chọn món cần trả, chọn tình trạng hàng. Hệ thống tự động hoàn tiền và cộng lại số lượng vào kho.',
      zh: '收银员扫描原小票条码，选择退货明细并标记品相（重新上架/报损），系统自动冲减原交易流水、原路退款并自动回补对应仓库库存。'
    },
    technicalNote: 'Creates linked `returns` and `inventory_movements` rows.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-14',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '14. តើប្រព័ន្ធ POS អាចដំណើរការបានដែរឬទេ ប្រសិនបើដាច់អ៊ីនធឺណិតបណ្តោះអាសន្ន (Offline Mode)?',
      en: '14. Does the POS terminal support offline operation during unexpected network downtime?',
      th: '14. ระบบ POS สามารถทำงานออฟไลน์ได้หรือไม่หากอินเทอร์เน็ตหลุดกะทันหัน?',
      vi: '14. Máy POS có hoạt động ngoại tuyến được không khi mất kết nối mạng đột ngột?',
      zh: '14. 若门店突发断网，POS收银终端是否支持离线继续收银（Offline Mode）并在恢复后自动对账？'
    },
    a: {
      km: 'នៅលើ Flutter Mobile App និង POS Client មានបំពាក់ Hive Local NoSQL Database ដែលអនុញ្ញាតឱ្យលក់ទំនិញជាប្រាក់សុទ្ធ រក្សាទុកក្នុង Memory និងធ្វើសមកាលកម្ម (Sync) ស្វ័យប្រវត្តិកាលណាមានអ៊ីនធឺណិតឡើងវិញ។',
      en: 'Yes! The Flutter mobile terminal and desktop web worker utilize Hive Local NoSQL storage to queue offline cash transactions and synchronize atomically with the backend once internet connectivity is restored.',
      th: 'ได้แน่นอน! แอปพลิเคชัน Flutter และเว็บ POS มีฐานข้อมูล Hive NoSQL ในตัว สามารถขายเงินสดและบันทึกไว้ในเครื่อง เมื่อเน็ตกลับมาจะ Sync ขึ้นเซิร์ฟเวอร์ให้อัตโนมัติ',
      vi: 'Hoàn toàn được! Ứng dụng Flutter POS tích hợp cơ sở dữ liệu Hive NoSQL cục bộ cho phép bán tiền mặt ngoại tuyến và tự động đồng bộ hóa lên máy chủ khi có mạng trở lại.',
      zh: '完全支持！Flutter移动端与桌面POS客户端集成Hive本地NoSQL数据库，断网期间支持现金连续扫码收银并生成本地序列号；网络恢复后自动后台重试批量同步至主库。'
    },
    technicalNote: 'Transactions queued locally and synced via `/api/pos/sync-offline-orders`.',
    relatedPath: '/modules/pos'
  },

  // 15-52 with rich definitions:
  {
    id: 'faq-15',
    category: 'payments',
    role: 'developer',
    categoryLabel: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'ระบบชำระเงินและ KHQR', vi: 'Thanh toán & KHQR', zh: '支付网关与KHQR' },
    q: {
      km: '15. តើប្រព័ន្ធបង្កើត Dynamic KHQR តាមស្តង់ដារបាគង (NBC EMVCo) ដោយរបៀបណា?',
      en: '15. How does the system generate dynamic Bakong KHQR codes compliant with National Bank of Cambodia EMVCo standards?',
      th: '15. ระบบสร้าง Dynamic KHQR ตามมาตรฐาน Bakong (NBC EMVCo) อย่างไร?',
      vi: '15. Hệ thống tạo mã Dynamic KHQR theo chuẩn Bakong (NBC EMVCo) như thế nào?',
      zh: '15. 系统如何生成符合柬埔寨国家银行（NBC）EMVCo标准的动态Bakong KHQR聚合支付码？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់ Bakong KHQR Specification ដោយបង្កើត Payload រួមមាន Merchant ID, Bakong Account ID, Currency (KHR: 116 / USD: 840), ចំនួនទឹកប្រាក់សុក្រឹត, និង CRC16-CCITT Checksum ដើម្បីការពារការក្លែងបន្លំទិន្នន័យ។',
      en: 'The backend compiles standard EMVCo TLV (Tag-Length-Value) payloads containing Merchant ID, Bakong Account ID, exact transaction amount, ISO currency codes (USD: 840, KHR: 116), and CRC16-CCITT checksum validation.',
      th: 'แบ็กเอนด์สร้าง Payload มาตรฐาน EMVCo ที่ประกอบด้วย Merchant ID, Bakong Account ID, ยอดเงินที่แน่นอน, รหัสสกุลเงิน และการคำนวณ CRC16-CCITT Checksum เพื่อความปลอดภัย',
      vi: 'Hệ thống tạo chuỗi Payload chuẩn EMVCo chứa Mã định danh đơn vị bán hàng, Tài khoản Bakong, số tiền chính xác, mã tiền tệ ISO và mã kiểm tra CRC16-CCITT.',
      zh: '后端严格按照NBC EMVCo规范组装TLV（Tag-Length-Value）数据载荷，包含商户号、Bakong账户、精确账单金额、ISO币种代码（USD:840 / KHR:116）并通过CRC16-CCITT生成防篡改校验码。'
    },
    technicalNote: 'Generated in `App\\Services\\Payment\\KhqrService::generateDynamicQr()`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-16',
    category: 'payments',
    role: 'developer',
    categoryLabel: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'ระบบชำระเงินและ KHQR', vi: 'Thanh toán & KHQR', zh: '支付网关与KHQR' },
    q: {
      km: '16. ប្រសិនបើ Webhook ពីធនាគារយឺត ឬដាច់ តើ POS ដឹងថាអតិថិជនបានបង់ប្រាក់ជោគជ័យដោយរបៀបណា?',
      en: '16. If a payment webhook fails or delays, how does the POS verify payment confirmation without freezing the queue?',
      th: '16. หาก Webhook ของธนาคารล้มเหลวหรือล่าช้า เครื่อง POS จะตรวจสอบการชำระเงินอย่างไรเพื่อไม่ให้ลูกค้าต้องรอนาน?',
      vi: '16. Nếu Webhook từ ngân hàng bị trễ hoặc lỗi, máy POS xác nhận thanh toán thành công bằng cách nào?',
      zh: '16. 若银行支付通知Webhook因网络抖动丢失或延迟，POS收银台如何即时对账避免顾客滞留？'
    },
    a: {
      km: 'ប្រព័ន្ធមានយន្តការពីរជាន់ (Dual Verification)៖ ក្រៅពីចាំទទួល Webhook, POS Client ដំណើរការ Long-Polling រៀងរាល់ ២ វិនាទីទៅកាន់ `/api/pos/orders/{id}/payment-status`។ លើសពីនេះ Cashier អាចចុចប៊ូតុង "Verify Payment Now" ដើម្បីឱ្យ Backend សាកសួរផ្ទាល់ទៅកាន់ Bakong API Gateway។',
      en: 'The system uses dual verification: alongside webhooks, the terminal polls `/api/pos/orders/{id}/payment-status` every 2s. Cashiers can also click "Verify Payment Now" to force a synchronous server-to-server inquiry with the Bakong gateway.',
      th: 'ระบบใช้กลไกคู่ขนาน: นอกจากการรอ Webhook แล้ว หน้า POS จะทำ Polling ทุกๆ 2 วินาที และแคชเชียร์สามารถกดปุ่ม "Verify Payment Now" เพื่อให้เซิร์ฟเวอร์ยิงถามธนาคารโดยตรงได้ทันที',
      vi: 'Hệ thống sử dụng cơ chế kép: song song với việc lắng nghe Webhook, máy POS tự động thăm dò (polling) mỗi 2 giây. Thu ngân cũng có thể nhấn nút "Kiểm tra ngay" để máy chủ truy vấn trực tiếp đến cổng Bakong.',
      zh: '系统采用双重验证机制：在等待异步Webhook的同时，POS前端每2秒向`/api/pos/orders/{id}/payment-status`发起轮询；收银员亦可点击“立即对账”按钮促使服务端直连Bakong API网关同步对账。'
    },
    technicalNote: 'Fallback inquiry via `BakongGateway::checkTransactionStatus($md5Hash)`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-17',
    category: 'payments',
    role: 'developer',
    categoryLabel: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'ระบบชำระเงินและ KHQR', vi: 'Thanh toán & KHQR', zh: '支付网关与KHQR' },
    q: {
      km: '17. តើការគណនា និងកត់ត្រាអត្រាប្តូរប្រាក់ (Exchange Rates) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '17. How does the multi-currency ledger track historical exchange rates between USD and Khmer Riel (KHR)?',
      th: '17. บัญชีแยกประเภทหลายสกุลเงินบันทึกอัตราแลกเปลี่ยนย้อนหลังระหว่าง USD และ KHR อย่างไร?',
      vi: '17. Sổ cái đa tiền tệ theo dõi tỷ giá hối đoái lịch sử giữa USD và KHR như thế nào?',
      zh: '17. 多币种财务总账如何精准锁定并追溯每笔交易发生时的USD与KHR历史换算汇率？'
    },
    a: {
      km: 'រាល់ពេលមាន Order កើតឡើង ប្រព័ន្ធនឹងថតចម្លងអត្រាប្តូរប្រាក់ប្រចាំថ្ងៃ (Rate Snapshot ឧទាហរណ៍ 1 USD = 4,100 KHR) ចូលទៅក្នុងជួរទិន្នន័យ `orders` ផ្ទាល់ ដើម្បីធានាថារបាយការណ៍គណនេយ្យនៅតែត្រឹមត្រូវ ទោះបីអត្រាប្តូរប្រាក់ថ្ងៃមុខផ្លាស់ប្តូរក៏ដោយ។',
      en: 'Each transaction snapshots the exact prevailing exchange rate (e.g. 1 USD = 4,100 KHR) directly onto the `orders` and `invoices` records, ensuring historical financial audits remain immutable despite future FX shifts.',
      th: 'ทุกคำสั่งซื้อจะทำการ Snapshot อัตราแลกเปลี่ยน ณ วันนั้น (เช่น 1 USD = 4,100 KHR) ฝังลงในตาราง `orders` เพื่อให้การตรวจบัญชีย้อนหลังมีความถูกต้องเสมอแม้ค่าเงินจะเปลี่ยนแปลงในอนาคต',
      vi: 'Mỗi đơn hàng đều chụp lại tỷ giá hối đoái tại thời điểm thanh toán (ví dụ 1 USD = 4.100 KHR) trực tiếp vào bảng `orders`, đảm bảo báo cáo tài chính lịch sử luôn bất biến.',
      zh: '每笔结算订单均在落库瞬间对当日基准汇率（如1 USD = 4,100 KHR）进行快照固化并持久化至`orders`主表，确保未来汇率波动不影响历史财务总账回溯。'
    },
    technicalNote: 'Stored in `orders.exchange_rate` and `payment_transactions.exchange_rate`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-18',
    category: 'payments',
    role: 'developer',
    categoryLabel: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'ระบบชำระเงินและ KHQR', vi: 'Thanh toán & KHQR', zh: '支付网关与KHQR' },
    q: {
      km: '18. តើប្រព័ន្ធគាំទ្រ Payment Gateway ណាខ្លះសម្រាប់ E-Commerce Storefront?',
      en: '18. Which payment gateways are supported on the online Customer E-Commerce Storefront?',
      th: '18. เว็บไซต์ร้านค้าออนไลน์รองรับ Payment Gateway ช่องทางใดบ้าง?',
      vi: '18. Cổng thanh toán trực tuyến nào được hỗ trợ trên Website E-Commerce?',
      zh: '18. 线上B2C商城前台支持接入哪些主流在线支付网关与信用卡结算通道？'
    },
    a: {
      km: 'Storefront គាំទ្រ៖ ១. Bakong KHQR (ស្កេនទូទាត់តាមធនាគារកម្ពុជាទាំងអស់) ២. Credit/Debit Cards (Stripe / ABA PayWay Gateway) ៣. Cash on Delivery (COD)។',
      en: 'The online store supports: 1. Bakong KHQR (universal QR scanning across all Cambodian banks), 2. Credit/Debit Card processing (Stripe and ABA PayWay integration), and 3. Cash on Delivery (COD).',
      th: 'ร้านค้าออนไลน์รองรับ: 1. Bakong KHQR (สแกนจ่ายผ่านธนาคารชั้นนำในกัมพูชา), 2. บัตรเครดิต/เดบิต (Stripe / ABA PayWay), 3. เก็บเงินปลายทาง (COD)',
      vi: 'Website hỗ trợ: 1. Bakong KHQR (quét mã qua mọi ngân hàng Campuchia), 2. Thẻ tín dụng/ghi nợ (Stripe / ABA PayWay), 3. Thanh toán khi nhận hàng (COD).',
      zh: '商城支持：1. Bakong KHQR（柬埔寨全银联动态扫码），2. 国际信用卡/借记卡通道（Stripe及ABA PayWay），3. 货到付款（COD）等多元结账组合。'
    },
    technicalNote: 'Architected via `App\\Contracts\\PaymentGatewayInterface`.',
    relatedPath: '/customer-guide'
  },
  {
    id: 'faq-19',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '19. តើការផ្ទេរស្តុកឆ្លងសាខា (Inter-Branch Transfer) ដំណើរការយ៉ាងដូចម្តេចដើម្បីការពារការបាត់បង់ទំនិញតាមផ្លូវ?',
      en: '19. How do inter-branch stock transfers prevent in-transit shrinkage and inventory discrepancies?',
      th: '19. การโอนย้ายสต็อกระหว่างสาขา (Inter-Branch Transfer) ป้องกันปัญหาสินค้าสูญหายระหว่างทางได้อย่างไร?',
      vi: '19. Quy trình điều chuyển kho giữa các chi nhánh ngăn ngừa thất thoát hàng hóa như thế nào?',
      zh: '19. 跨门店/跨仓库调拨（Inter-Branch Transfer）如何防止在途损耗与账实不符？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់ 3-Step Verification៖ ១. សាខាដើមស្នើសុំផ្ទេរ (Pending) ២. សាខាដើមវេចខ្ចប់ និងបញ្ជូនចេញ (In-Transit — កាត់ស្តុកសាខាដើម ប៉ុន្តែមិនទាន់បូកចូលសាខាគោលដៅ) ៣. សាខាគោលដៅរាប់ទទួលជាក់ស្តែង (Received) ទើបបូកចូលស្តុក។ ប្រសិនបើខ្វះចំនួន ប្រព័ន្ធនឹងកត់ត្រាក្នុង `stock_discrepancies`។',
      en: 'Transfers require a 3-step workflow: 1. Request created (Pending), 2. Source warehouse packs and dispatches (In-Transit — stock leaves source but is held in transit escrow), 3. Destination warehouse scans received items. Any variance logs automatically to `stock_discrepancies`.',
      th: 'ระบบใช้กระบวนการ 3 ขั้นตอน: 1. สร้างคำขอโอน (Pending), 2. คลังต้นทางส่งสินค้าออก (In-Transit — ตัดยอดต้นทางแต่ยังไม่เข้าปลายทาง), 3. คลังปลายทางสแกนตรวจรับ (Received) หากมีผลต่างจะบันทึกลงบัญชีของหายทันที',
      vi: 'Điều chuyển áp dụng quy trình 3 bước: 1. Tạo yêu cầu, 2. Kho xuất gửi hàng (Đang trung chuyển — giảm kho xuất nhưng chưa cộng kho nhận), 3. Kho đích kiểm đếm nhận hàng. Mọi sai lệch tự động ghi vào nhật ký sai lệch kho.',
      zh: '调拨实行三段式强管控：1. 发起申请（Pending），2. 出库发货（In-Transit在途——源仓扣减，但暂不计入目标仓），3. 目标仓扫码核实验收（Received）正式入账。若产生实收差额，自动归集至损耗台账并追责。'
    },
    technicalNote: 'Tracked across `stock_transfers` and `stock_transfer_items` tables.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-20',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '20. តើការរាប់ស្តុកជាក់ស្តែង (Stock Opname / Physical Inventory Count) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '20. How does the Stock Opname (physical inventory cycle count) reconcile system balances with physical warehouse stock?',
      th: '20. การตรวจนับสต็อกจริง (Stock Opname) ปรับยอดระหว่างระบบกับสินค้าจริงในคลังอย่างไร?',
      vi: '20. Quy trình kiểm kê kho thực tế (Stock Opname) điều chỉnh chênh lệch sổ sách và thực tế ra sao?',
      zh: '20. 实物盘点（Stock Opname / Cycle Count）如何实现账面库存与仓库实物全量/动碰平账？'
    },
    a: {
      km: 'បុគ្គលិកឃ្លាំងប្រើប្រាស់ Mobile App ឬ Barcode Scanner ដើម្បីស្កេនរាប់ទំនិញជាក់ស្តែង។ ប្រព័ន្ធនឹងប្រៀបធៀបជាមួយចំនួនក្នុងប្រព័ន្ធ បង្ហាញភាពខុសគ្នា (Discrepancy) និងទាមទារការអនុម័តពី Manager មុនពេលបង្កើត `stock_adjustments` កែសម្រួលស្តុកជាស្ថាពរ។',
      en: 'Staff scan physical barcodes via mobile terminals. The system computes variances between counted and theoretical quantities. Once approved by a warehouse manager, it generates audited `stock_adjustments` ledger entries.',
      th: 'พนักงานใช้ Mobile App หรือเครื่องสแกนบาร์โค้ดเพื่อนับสินค้าจริง ระบบจะคำนวณผลต่าง และต้องได้รับการอนุมัติจากผู้จัดการก่อนที่จะปรับปรุงยอดสต็อกจริงในระบบ',
      vi: 'Nhân viên quét mã vạch bằng Mobile App để kiểm kê. Hệ thống tự động so sánh với số liệu lý thuyết, hiển thị chênh lệch và yêu cầu Quản lý phê duyệt trước khi cập nhật điều chỉnh kho.',
      zh: '盘点员手持PDA或移动端连续扫码盘点。系统自动比对账面存量与实盘数，生成盘盈盘亏分析表；经仓库主管审批后，自动生成`stock_adjustments`凭证更新实际库存。'
    },
    technicalNote: 'Audit trails recorded in `inventory_movements` with `movement_type = "adjustment"`.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-21',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '21. តើប្រព័ន្ធគ្រប់គ្រងទំនិញខូចខាត ឬហួសកាលបរិច្ឆេទ (Damaged / Expired Write-offs) យ៉ាងដូចម្តេច?',
      en: '21. How does the system record damaged inventory write-offs and track batch expiry dates?',
      th: '21. ระบบจัดการสินค้าชำรุด เสียหาย หรือหมดอายุ (Stock Write-offs) อย่างไร?',
      vi: '21. Hệ thống xử lý hàng hư hỏng hoặc hết hạn sử dụng (Write-offs) như thế nào?',
      zh: '21. 损耗报废（Damaged Write-offs）与商品批次保质期预警是如何管理的？'
    },
    a: {
      km: 'បុគ្គលិកឃ្លាំងបង្កើតប័ណ្ណ `stock_adjustments` ជាមួយប្រភេទ "Damaged" ឬ "Expired" ដោយភ្ជាប់រូបភាពភស្តុតាង និងមូលហេតុ។ ពេល Manager អនុម័ត ស្តុកនឹងត្រូវបានកាត់ចេញ និងកត់ត្រាជាការខាតបង់ក្នុងរបាយការណ៍ហិរញ្ញវត្ថុ។',
      en: 'Warehouse staff submit adjustment tickets with reason codes and photo attachments. Once manager approves, quantities decrement and post to the financial loss ledger.',
      th: 'พนักงานคลังทำใบลดสต็อกระบุสาเหตุ "ชำรุด" หรือ "หมดอายุ" พร้อมแนบรูปถ่าย เมื่อผู้จัดการอนุมัติ ยอดจะถูกตัดออกและลงบัญชีขาดทุนทันที',
      vi: 'Nhân viên tạo phiếu giảm kho loại "Hư hỏng" hoặc "Hết hạn" kèm ảnh chụp. Khi Quản lý duyệt, hàng được trừ kho và ghi nhận chi phí tổn thất.',
      zh: '库管员发起报损申请，上传破损照片并选择报损原因（过期/破损/抽检）。经理审批后，系统自动扣减可用库存并记入财务营业外损耗支出科目。'
    },
    technicalNote: 'Reduces stock via `inventory_movements` with `movement_type = "damaged"`.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-22',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '22. តើការជូនដំណឹងពេលស្តុកជិតអស់ (Low Stock Alerts & Reorder Points) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '22. How do automated low stock threshold alerts and minimum reorder triggers notify procurement officers?',
      th: '22. ระบบแจ้งเตือนเมื่อสินค้าใกล้หมดสต็อก (Low Stock Alerts) และจุดสั่งซื้อซ้ำทำงานอย่างไร?',
      vi: '22. Hệ thống cảnh báo sắp hết hàng (Low Stock Alerts) và điểm đặt hàng lại hoạt động ra sao?',
      zh: '22. 低库存安全阈值告警（Low Stock Alerts）与自动化补货建议是如何触发的？'
    },
    a: {
      km: 'ផលិតផលនីមួយៗអាចកំណត់ `min_stock_level` តាមសាខា។ នៅពេលស្តុកធ្លាក់ចុះដល់កម្រិតកំណត់ ប្រព័ន្ធនឹងផ្ញើ Notification ទៅកាន់ Dashboard របស់អ្នកគ្រប់គ្រង និងបង្កើតសេចក្តីព្រាងប័ណ្ណទិញ (Draft PO) ស្វ័យប្រវត្តិ។',
      en: 'Each SKU specifies a branch-level `min_stock_level`. When stock drops below thresholds, background workers push alerts to the Admin Dashboard and draft automated replenishment POs.',
      th: 'สินค้าแต่ละรายการสามารถตั้งค่า `min_stock_level` รายสาขาได้ เมื่อสินค้าลดต่ำกว่ากำหนด ระบบจะแจ้งเตือนบนแดชบอร์ดและสร้างใบสั่งซื้อแบบร่างให้อัตโนมัติ',
      vi: 'Mỗi sản phẩm có thể cài đặt mức tồn tối thiểu `min_stock_level`. Khi kho giảm xuống dưới mức này, hệ thống gửi thông báo và tự động tạo đơn mua hàng đề xuất.',
      zh: '每个SKU支持按门店设定`min_stock_level`安全库存警戒线。后台监听器在库存跌破阈值时即刻向采购看板推送红字告警，并可一键转为采购建议补货单。'
    },
    technicalNote: 'Monitored daily by `App\\Console\\Commands\\CheckLowStockCommand`.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-23',
    category: 'inventory',
    role: 'developer',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '23. តើប្រព័ន្ធបង្កើត Variants (ទំហំ, ពណ៌, ម៉ូដ) ដោយស្វ័យប្រវត្តិតាមរូបមន្ត Cartesian Product យ៉ាងដូចម្តេច?',
      en: '23. How does the Cartesian Product variant generator create SKUs across size, color, and material dimensions?',
      th: '23. ระบบสร้างรหัสสินค้าตัวเลือก (Variants) อัตโนมัติด้วยสูตร Cartesian Product อย่างไร?',
      vi: '23. Bộ tạo biến thể tích Descartes tạo SKU tự động qua các kích thước, màu sắc và chất liệu như thế nào?',
      zh: '23. 多规格笛卡尔积变体生成器（Cartesian Generator）如何基于尺码、颜色自动派生SKU？'
    },
    a: {
      km: 'នៅពេល Admin ជ្រើសរើស Attribute "Size" (S, M, L) និង "Color" (Red, Blue) ក្បួនដោះស្រាយ Cartesian Product នឹងបង្កើត ៦ Variants ដោយស្វ័យប្រវត្តិ ព្រមទាំងបង្កើត Barcode, SKU និងផ្ទាំងកំណត់តម្លៃថ្លៃដើម/លក់ដាច់ដោយឡែក។',
      en: 'When selecting attributes (e.g. Size: S, M, L and Color: Red, Blue), the Cartesian generator matrices all combinations into 6 distinct SKU records with auto-generated barcodes, independent costs, and stock trackers.',
      th: 'เมื่อผู้ดูแลเลือกคุณลักษณะ เช่น ขนาด (S, M, L) และสี (แดง, น้ำเงิน) ระบบจะคำนวณและสร้าง 6 รายการตัวเลือกสินค้า (SKU) พร้อมบาร์โค้ดและราคาแยกชิ้นให้อัตโนมัติ',
      vi: 'Khi chọn thuộc tính (Size: S, M, L và Màu: Đỏ, Xanh), thuật toán Descartes tự động nhân tổ hợp thành 6 SKU riêng biệt kèm mã vạch, giá vốn và giá bán riêng.',
      zh: '当在商品后台勾选规格属性（如尺码: S/M/L与颜色: 红/蓝），系统算法在前端与服务端秒级计算笛卡尔积派生出6个唯一SKU记录，自动分配独立条码、成本价与库存跟踪项。'
    },
    technicalNote: 'Built in `ProductVariantService::generateCartesianMatrix()`.',
    relatedPath: '/modules/products'
  },
  {
    id: 'faq-24',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '24. តើប្រព័ន្ធបង្កើត និងបោះពុម្ពតែមបាគូដ (Barcode Label Printing) យ៉ាងដូចម្តេច?',
      en: '24. How does the system generate and batch-print Code128 / QR barcode stickers for shelf tagging?',
      th: '24. ระบบสร้างและพิมพ์สติกเกอร์บาร์โค้ด (Barcode Label Printing) สำหรับติดสินค้าและชั้นวางอย่างไร?',
      vi: '24. Hệ thống tạo và in hàng loạt nhãn dán mã vạch Code128 / QR để dán kệ hàng như thế nào?',
      zh: '24. 系统如何批量生成并打印标准Code128条码与商品货架标签（Barcode Label Printing）？'
    },
    a: {
      km: 'ប្រព័ន្ធអាចបង្កើត SVG / PNG Barcode (Code128, EAN-13, QR) ដោយផ្ទាល់។ Admin អាចជ្រើសរើស Template តែម (ឧទាហរណ៍ 40mm x 30mm, 50mm x 25mm) ហើយបញ្ជូនទៅកាន់ Barcode Label Printer (Zebra, Xprinter) បានយ៉ាងងាយស្រួល។',
      en: 'The application renders vector Code128, EAN-13, and QR barcodes on the fly. Users can customize label dimensions (e.g. 40x30mm) with product names, prices, and expiry dates for direct printing on Zebra or Xprinter machines.',
      th: 'ระบบสามารถสร้างบาร์โค้ดแบบเวกเตอร์ Code128, EAN-13 และ QR Code พร้อมปรับขนาดสติกเกอร์ (เช่น 40x30 มม.) เพื่อสั่งพิมพ์ตรงไปยังเครื่องพิมพ์สติกเกอร์ Zebra หรือ Xprinter ได้ทันที',
      vi: 'Hệ thống tạo mã vạch vector Code128, EAN-13 và QR tức thì. Cho phép tùy chỉnh kích thước nhãn (40x30mm) kèm tên, giá và ngày hết hạn để in trực tiếp qua máy in nhãn Zebra/Xprinter.',
      zh: '系统动态渲染矢量级Code128、EAN-13及QR条码。用户可在后台自选标签纸尺寸模板（如40x30mm、50x25mm），排版含品名、售价与生产日期的商品标贴并直连热敏标签打印机批量输出。'
    },
    technicalNote: 'Rendered via `@react-pdf/renderer` or direct ESC/POS raster output.',
    relatedPath: '/modules/products'
  },
  {
    id: 'faq-25',
    category: 'procurement',
    role: 'warehouse',
    categoryLabel: { km: 'ការបញ្ជាទិញចូល PO', en: 'Procurement & Purchases', th: 'การจัดซื้อและสั่งของ', vi: 'Mua hàng & Đơn mua PO', zh: '采购与供应商管理' },
    q: {
      km: '25. តើការបញ្ជាទិញទំនិញចូល (Purchase Order Lifecycle) មានដំណាក់កាលអ្វីខ្លះ?',
      en: '25. What is the complete Purchase Order (PO) lifecycle from requisition to stock receiving and accounts payable?',
      th: '25. วงจรชีวิตของใบสั่งซื้อสินค้า (Purchase Order Lifecycle) มีขั้นตอนใดบ้างตั้งแต่จัดซื้อจนถึงรับของเข้าคลัง?',
      vi: '25. Vòng đời hoàn chỉnh của Đơn Mua Hàng (PO) từ lúc tạo đến khi nhập kho và ghi nhận công nợ là gì?',
      zh: '25. 从采购申请、采购订单（PO）、验收入库到应付账款核销的完整生命周期是怎样的？'
    },
    a: {
      km: 'លំហូររួមមាន ៤ ដំណាក់កាល៖ ១. បង្កើតសេចក្តីព្រាង (Draft PO) ២. អនុម័ត និងបញ្ជូនទៅអ្នកផ្គត់ផ្គង់ (Approved / Ordered) ៣. ទទួលទំនិញចូលឃ្លាំង (Receiving — អាចទទួលដាច់ដោយឡែក ឬទទួលទាំងអស់) ៤. បង្កើតប័ណ្ណបំណុលអ្នកផ្គត់ផ្គង់ (Accounts Payable / Supplier Invoices)។',
      en: 'The workflow comprises 4 audited phases: 1. Draft Requisition, 2. Manager Approval & Supplier Dispatch, 3. Warehouse Goods Receiving (supports partial/full receipts), 4. Accounts Payable ledger generation with payment terms.',
      th: 'ขั้นตอนประกอบด้วย 4 ระยะ: 1. สร้างใบสั่งซื้อแบบร่าง, 2. อนุมัติและส่งให้ผู้จัดจำหน่าย, 3. คลังตรวจรับสินค้าเข้า (รองรับการรับบางส่วนหรือครบถ้วน), 4. บันทึกบัญชีเจ้าหนี้การค้า',
      vi: 'Quy trình gồm 4 giai đoạn: 1. Bản nháp PO, 2. Phê duyệt & gửi nhà cung cấp, 3. Kiểm đếm nhập kho (hỗ trợ nhập từng phần hoặc toàn bộ), 4. Ghi nhận công nợ nhà cung cấp.',
      zh: '包含四阶段严密审批流：1. 创建草稿（Draft PO），2. 主管审批并发送供应商（Approved/Ordered），3. 仓库扫码验收入库（支持分批/全部入库，即时增加库存），4. 自动生成应付账款凭证与供应商对账单。'
    },
    technicalNote: 'State machine: `draft` -> `ordered` -> `partial_received` -> `received` -> `closed`.',
    relatedPath: '/modules/purchases'
  },
  {
    id: 'faq-26',
    category: 'procurement',
    role: 'warehouse',
    categoryLabel: { km: 'ការបញ្ជាទិញចូល PO', en: 'Procurement & Purchases', th: 'การจัดซื้อและสั่งของ', vi: 'Mua hàng & Đơn mua PO', zh: '采购与供应商管理' },
    q: {
      km: '26. តើការទទួលទំនិញមិនគ្រប់ចំនួន (Partial Goods Receiving) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '26. How does partial goods receiving handle split deliveries from suppliers across multiple shipment dates?',
      th: '26. การตรวจรับสินค้าไม่ครบตามจำนวน (Partial Receiving) จัดการการส่งของเป็นงวดๆ อย่างไร?',
      vi: '26. Việc nhập kho từng phần (Partial Receiving) khi nhà cung cấp giao hàng nhiều đợt diễn ra thế nào?',
      zh: '26. 当供应商分批多次送达货物时，系统如何处理部分验收入库（Partial Goods Receiving）？'
    },
    a: {
      km: 'នៅពេលទំនិញមកដល់ឃ្លាំងខ្លះ បុគ្គលិកឃ្លាំងបញ្ចូលចំនួនទទួលជាក់ស្តែង។ ប្រព័ន្ធនឹងប្តូរស្ថានភាព PO ទៅជា "Partially Received" កាត់ស្តុកតែចំនួនដែលបានទទួលពិតប្រាកដ និងទុកចំនួនដែលនៅសល់សម្រាប់ទទួលលើកក្រោយ។',
      en: 'Warehouse staff record exact quantities delivered in each batch. The PO status transitions to "Partially Received", increasing stock strictly for verified items while keeping outstanding items open for future shipments.',
      th: 'เมื่อสินค้ามาถึงบางส่วน พนักงานจะกรอกจำนวนที่รับจริง ระบบจะเปลี่ยนสถานะเป็น "Partially Received" และเพิ่มสต็อกเฉพาะของที่ได้รับจริง ส่วนที่เหลือจะรอการตรวจรับในรอบถัดไป',
      vi: 'Nhân viên ghi nhận số lượng thực nhận của từng đợt. Đơn PO chuyển trạng thái "Nhận một phần", chỉ tăng kho số lượng thực nhận và tiếp tục mở số lượng còn thiếu cho các đợt sau.',
      zh: '库管员按到货明细输入实收数量。系统将PO订单状态置为“部分入库”（Partially Received），仅对实收良品即时入账增加库存，余量继续保留待后续批次核销。'
    },
    technicalNote: 'Maintained via `purchase_order_items.received_quantity`.',
    relatedPath: '/modules/purchases'
  },
  {
    id: 'faq-27',
    category: 'hrm',
    role: 'hr',
    categoryLabel: { km: 'វត្តមាន & Dynamic QR', en: 'HRM & Dynamic QR', th: 'การลงเวลา Dynamic QR', vi: 'Chấm công Dynamic QR', zh: '动态QR考勤与人事' },
    q: {
      km: '27. តើប្រព័ន្ធការពារបុគ្គលិកកុំឱ្យថតរូប QR Code ផ្ញើឱ្យគ្នាក្នុង Telegram ដើម្បីស្កេនវត្តមានជំនួសគ្នាដោយរបៀបណា?',
      en: '27. How does the dynamic QR attendance engine defeat proxy clock-ins via screenshots shared on chat apps?',
      th: '27. ระบบป้องกันพนักงานถ่ายรูป QR Code ส่งต่อใน Telegram เพื่อลงเวลาแทนกันได้อย่างไร?',
      vi: '27. Làm thế nào hệ thống ngăn chặn việc chụp màn hình QR gửi qua mạng xã hội để điểm danh hộ?',
      zh: '27. 考勤系统如何从底层防范员工通过截屏、拍照转发微信/Telegram进行远程代打卡作弊？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់យន្តការការពារ ៣ ជាន់៖ ១. QR Code លើ Kiosk ផ្លាស់ប្តូរ Token រៀងរាល់ ១៥ វិនាទី (HMAC-SHA256 Expiring Hash) ២. ពិនិត្យ GPS Geofencing ក្នុងកាំ ៥០ ម៉ែត្រជុំវិញសាខា ៣. ចងភ្ជាប់ Device UUID ទូរស័ព្ទបុគ្គលិក (១ នាក់អាចប្រើបានតែទូរស័ព្ទ ១ គ្រឿង)។',
      en: 'The system enforces a 3-layer anti-fraud barrier: 1. Rotating dynamic QR code refreshing every 15s using HMAC-SHA256 timestamp tokens, 2. GPS Geofence boundary check (max 50m radius), 3. Hardware Device UUID binding ensuring 1 registered device per employee.',
      th: 'ระบบใช้การป้องกัน 3 ชั้น: 1. QR Code บนหน้าจอจะเปลี่ยน Token ทุกๆ 15 วินาทีด้วย HMAC-SHA256, 2. ตรวจสอบพิกัด GPS ในรัศมี 50 เมตร, 3. ผูก Hardware UUID ของโทรศัพท์พนักงาน',
      vi: 'Hệ thống bảo mật 3 lớp: 1. Mã QR tự động đổi sau 15 giây với chữ ký HMAC-SHA256, 2. Kiểm tra định vị GPS trong bán kính 50m của chi nhánh, 3. Ràng buộc UUID phần cứng của điện thoại.',
      zh: '系统构筑了三重防作弊壁垒：1. 考勤机QR码每15秒轮换动态刷新（基于HMAC-SHA256时效令牌），2. 员工端强制校验GPS地理围栏（限定门店50米半径），3. 硬件级绑定手机UUID唯一识别码（单人单机）。'
    },
    technicalNote: 'Validated in `AttendanceService::validateClockIn()`.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-28',
    category: 'hrm',
    role: 'hr',
    categoryLabel: { km: 'វត្តមាន & Dynamic QR', en: 'HRM & Dynamic QR', th: 'การลงเวลา Dynamic QR', vi: 'Chấm công Dynamic QR', zh: '动态QR考勤与人事' },
    q: {
      km: '28. តើការគណនាម៉ោងធ្វើការ យឺតយ៉ាវ (Late Arrival) និងថែមម៉ោង (Overtime) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '28. How are shift rules, grace periods, late deductions, and overtime tiers computed automatically?',
      th: '28. การคำนวณกะการทำงาน, การมาสาย (Late) และการทำงานล่วงเวลา (OT) คำนวณอย่างไรโดยอัตโนมัติ?',
      vi: '28. Cách thức tính toán ca làm việc, đi trễ và làm thêm giờ (OT) tự động như thế nào?',
      zh: '28. 班次排班规则、弹性打卡宽限期、迟到扣款与多档加班（OT）工时如何自动化计算？'
    },
    a: {
      km: 'ប្រព័ន្ធកំណត់ Shift Schedule (ឧទាហរណ៍ 8:00 AM - 5:00 PM) ជាមួយ Grace Period ១៥ នាទី។ វត្តមានបន្ទាប់ពីនោះនឹងត្រូវកត់ត្រាជា Late Minutes។ រាល់ការធ្វើការលើសម៉ោងត្រូវមានការស្នើសុំ និងអនុម័ត ទើបប្រព័ន្ធគណនាជា OT គុណនឹង 1.5x (ថ្ងៃធម្មតា) ឬ 2.0x (ថ្ងៃអាទិត្យ/បុណ្យជាតិ)។',
      en: 'Shifts include configurable grace periods (e.g. 15 mins). Check-ins after the grace window log late minutes automatically. Approved overtime multiplies standard hourly rates by 1.5x (regular days) or 2.0x (Sundays/National Holidays).',
      th: 'ระบบสามารถตั้งค่าเวลาทำงานพร้อม Grace Period 15 นาที หากมาสายจะถูกคำนวณเป็นนาที และการทำ OT ที่ได้รับการอนุมัติจะถูกคูณ 1.5 เท่า (วันปกติ) หรือ 2.0 เท่า (วันหยุด)',
      vi: 'Ca làm việc có thời gian ân hạn 15 phút. Đi trễ sau thời gian này sẽ tự động ghi nhận số phút trễ. Giờ làm thêm (OT) được duyệt sẽ nhân hệ số 1.5x (ngày thường) hoặc 2.0x (Chủ nhật/Lễ).',
      zh: '系统支持配置各班次弹性宽限期（如15分钟）。超期打卡自动折算迟到分钟数；审批通过的加班工时依据标准工时费率自动套用1.5倍（工作日）或2.0倍（周末及法定节假日）系数。'
    },
    technicalNote: 'Configured in `shift_schedules` table.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-29',
    category: 'hrm',
    role: 'hr',
    categoryLabel: { km: 'វត្តមាន & Dynamic QR', en: 'HRM & Dynamic QR', th: 'การลงเวลา Dynamic QR', vi: 'Chấm công Dynamic QR', zh: '动态QR考勤与人事' },
    q: {
      km: '29. តើការគ្រប់គ្រងការសុំច្បាប់សម្រាក (Leave Management) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '29. How does the leave management system track annual leave balances and multi-tier manager approval workflows?',
      th: '29. ระบบจัดการการลาหยุด (Leave Management) ติดตามวันลาคงเหลือและขั้นตอนการอนุมัติอย่างไร?',
      vi: '29. Hệ thống quản lý nghỉ phép theo dõi số ngày phép còn lại và quy trình phê duyệt ra sao?',
      zh: '29. 请假审批流（Leave Management）与年假额度自动结转扣减是如何运转的？'
    },
    a: {
      km: 'បុគ្គលិកអាចស្នើសុំច្បាប់តាម Mobile App (ច្បាប់ប្រចាំឆ្នាំ, ច្បាប់ឈឺ, ច្បាប់លំហែមាតុភាព)។ ប្រព័ន្ធនឹងកាត់ចំនួនថ្ងៃពី Balance ស្វ័យប្រវត្តិនៅពេល Manager អនុម័ត និងរាប់បញ្ចូលក្នុងតារាងបើកប្រាក់ខែជា Paid Leave។',
      en: 'Employees request leaves via Mobile App (Annual, Sick, Maternity). The workflow routes to their department manager. Once approved, the engine decrements leave balances and marks attendance as Paid/Unpaid Leave for payroll.',
      th: 'พนักงานสามารถยื่นขอลาหยุดผ่านแอปมือถือ เมื่อผู้จัดการอนุมัติ ระบบจะหักวันลาคงเหลืออัตโนมัติและนำไปคำนวณเงินเดือนเป็นวันลาที่ได้รับค่าจ้างอย่างถูกต้อง',
      vi: 'Nhân viên gửi đơn xin nghỉ qua Mobile App. Khi Quản lý phê duyệt, hệ thống tự động trừ ngày phép trong quỹ và chuyển dữ liệu sang bảng lương là nghỉ có hưởng lương.',
      zh: '员工在移动端提交请假申请（年假、病假、产假等）。部门主管审批后，系统自动扣减员工年假额度，并无缝同步至考勤薪资核算引擎标记为带薪/事假。'
    },
    technicalNote: 'Managed via `leave_requests` and `leave_balances` tables.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-30',
    category: 'payroll',
    role: 'hr',
    categoryLabel: { km: 'ប្រាក់បៀវត្សរ៍ស្វ័យប្រវត្តិ', en: 'Automated Payroll', th: 'ระบบเงินเดือนอัตโนมัติ', vi: 'Tính lương tự động', zh: '自动化薪资核算' },
    q: {
      km: '30. តើប្រព័ន្ធគណនាពន្ធលើប្រាក់បៀវត្សរ៍ (Cambodian Salary Tax Tiers) និងប.ស.ស (NSSF) ដោយរបៀបណា?',
      en: '30. How does the payroll engine compute Cambodian progressive salary tax brackets and NSSF social security contributions?',
      th: '30. ระบบคำนวณภาษีเงินเดือนตามขั้นบันไดของกัมพูชาและเงินสมทบประกันสังคม NSSF อย่างไร?',
      vi: '30. Hệ thống tính thuế thu nhập lũy tiến Campuchia và bảo hiểm xã hội NSSF như thế nào?',
      zh: '30. 薪资引擎如何依据柬埔寨税法阶梯税率与NSSF社保公积金标准自动化核算个税扣缴？'
    },
    a: {
      km: 'ប្រព័ន្ធបំពាក់តារាងពន្ធលើប្រាក់បៀវត្សរ៍ ០%, ៥%, ១០%, ១៥%, ២០% តាមច្បាប់កម្ពុជា ជាមួយការកាត់បន្ថយបន្ទុកគ្រួសារ (កូន/ប្តីប្រពន្ធ) និងគណនាភាគទានបេឡាជាតិសន្តិសុខសង្គម (ប.ស.ស) សម្រាប់ផ្នែកថែទាំសុខភាព និងគ្រោះថ្នាក់ការងារដោយស្វ័យប្រវត្តិ។',
      en: 'The payroll engine incorporates official Cambodian tax tiers (0%, 5%, 10%, 15%, 20%) with family allowances (dependents/spouse deductions), along with mandatory NSSF health and occupational risk contributions.',
      th: 'ระบบเงินเดือนคำนวณตามอัตราภาษีเงินได้กัมพูชา (0%, 5%, 10%, 15%, 20%) พร้อมหักลดหย่อนครอบครัว และคำนวณเงินสมทบ NSSF ด้านสุขภาพและอุบัติเหตุจากการทำงานให้อัตโนมัติ',
      vi: 'Hệ thống tích hợp biểu thuế lũy tiến Campuchia (0% - 20%), trừ gia cảnh người phụ thuộc và tự động trích nộp bảo hiểm y tế, tai nạn lao động NSSF.',
      zh: '薪资模块内置柬埔寨现行个税超额累进税率表（0%, 5%, 10%, 15%, 20%），支持配偶与未成年子女赡养抵扣，并精准核算NSSF国家社保（医保与工伤险）企业与个人缴纳金额。'
    },
    technicalNote: 'Built in `TaxCalculationService::calculateCambodiaTax()`.',
    relatedPath: '/modules/payroll'
  },
  {
    id: 'faq-31',
    category: 'payroll',
    role: 'hr',
    categoryLabel: { km: 'ប្រាក់បៀវត្សរ៍ស្វ័យប្រវត្តិ', en: 'Automated Payroll', th: 'ระบบเงินเดือนอัตโนมัติ', vi: 'Tính lương tự động', zh: '自动化薪资核算' },
    q: {
      km: '31. តើការគណនាប្រាក់បំណាច់អតីតភាពការងារ (Seniority Payments) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '31. How does the system compute mandatory semi-annual seniority payments under Cambodian labor law?',
      th: '31. ระบบคำนวณเงินชดเชยตามอายุงาน (Seniority Payment) ตามกฎหมายแรงงานกัมพูชาอย่างไร?',
      vi: '31. Hệ thống tính trợ cấp thâm niên (Seniority Payment) theo luật lao động Campuchia như thế nào?',
      zh: '31. 依据柬埔寨劳工法规定，系统如何每半年自动化计算一次员工资历补贴（Seniority Payments）？'
    },
    a: {
      km: 'តាមច្បាប់ការងារកម្ពុជា បុគ្គលិកដែលមានកិច្ចសន្យាមិនកំណត់ថិរវេលា (UDC) ត្រូវទទួលបានប្រាក់បំណាច់អតីតភាព ១៥ ថ្ងៃក្នុងមួយឆ្នាំ (ចែកចេញជា ២ លើក៖ ៧.៥ ថ្ងៃក្នុងខែមិថុនា និង ៧.៥ ថ្ងៃក្នុងខែធ្នូ) ដែលប្រព័ន្ធគណនាស្វ័យប្រវត្តិ។',
      en: 'Under Cambodian labor regulations, Undetermined Duration Contract (UDC) employees receive 15 days of wages per year, split into 7.5 days in June and 7.5 days in December, calculated automatically by the payroll engine.',
      th: 'ตามกฎหมายแรงงานกัมพูชา พนักงานสัญญาจ้างไม่จำกัดเวลา (UDC) จะได้รับเงินชดเชยอายุงาน 15 วันต่อปี (แบ่งจ่าย 7.5 วันในเดือนมิถุนายน และ 7.5 วันในเดือนธันวาคม) โดยระบบคำนวณให้อัตโนมัติ',
      vi: 'Theo luật lao động Campuchia, nhân viên hợp đồng không xác định thời hạn (UDC) được nhận 15 ngày lương thâm niên mỗi năm (chia làm 2 đợt: 7.5 ngày vào tháng 6 và 7.5 ngày vào tháng 12).',
      zh: '依据柬埔寨劳工法规，无固定期限合同（UDC）员工每年享有15天工资的资历补偿（分两次发放：6月发放7.5天，12月发放7.5天）。薪资引擎在对应月份自动精准计入应发工资。'
    },
    technicalNote: 'Evaluated in `PayrollCalculationService::calculateSeniority()`.',
    relatedPath: '/modules/payroll'
  },
  {
    id: 'faq-32',
    category: 'payroll',
    role: 'hr',
    categoryLabel: { km: 'ប្រាក់បៀវត្សរ៍ស្វ័យប្រវត្តិ', en: 'Automated Payroll', th: 'ระบบเงินเดือนอัตโนมัติ', vi: 'Tính lương tự động', zh: '自动化薪资核算' },
    q: {
      km: '32. តើការបង្កើតប័ណ្ណបើកប្រាក់ខែ (Payslip PDF) និងការនាំចេញទិន្នន័យធនាគារ (Bank Bulk Payout) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '32. How are PDF payslips dispatched to employees and bulk payroll files exported for direct bank batch transfers (ABA, Wing, ACLEDA)?',
      th: '32. การสร้างสลิปเงินเดือน PDF และการส่งออกไฟล์โอนเงินเดือนผ่านธนาคาร (ABA, Wing, ACLEDA) ทำงานอย่างไร?',
      vi: '32. Việc tạo phiếu lương PDF và xuất tệp chuyển khoản hàng loạt qua ngân hàng (ABA, Wing, ACLEDA) diễn ra thế nào?',
      zh: '32. 电子工资条（PDF Payslip）自动分发与银行批量代发工资文件（ABA, Wing, ACLEDA）导出如何运作？'
    },
    a: {
      km: 'នៅពេលប្រាក់ខែត្រូវបាន Lock & Approved ប្រព័ន្ធបង្កើត PDF Payslip ផ្ញើទៅ Mobile App របស់បុគ្គលិកម្នាក់ៗ និងទាញចេញឯកសារ Excel/CSV តាម Format ស្តង់ដាររបស់ធនាគារ (ABA Bank, Wing, ACLEDA) សម្រាប់ Upload ផ្ទេរប្រាក់តែម្តងគត់។',
      en: 'Once payroll is locked and approved, the engine generates individual encrypted PDF payslips accessible on the Mobile App, and exports standardized bulk payout files formatted for ABA, Wing, or ACLEDA direct upload.',
      th: 'เมื่ออนุมัติเงินเดือนแล้ว ระบบจะสร้างสลิปเงินเดือน PDF ส่งไปยังแอปมือถือของพนักงานแต่ละคน และสามารถดาวน์โหลดไฟล์ Excel ตามฟอร์แมตของธนาคารเพื่อนำไปอัปโหลดโอนเงินได้ทันที',
      vi: 'Khi bảng lương được duyệt, hệ thống tạo phiếu lương PDF mã hóa gửi đến ứng dụng di động của nhân viên và xuất tệp chuyển khoản hàng loạt chuẩn định dạng ngân hàng ABA, Wing, ACLEDA.',
      zh: '工资单封账审批后，系统自动生成加密PDF电子工资条推送至员工移动端；同时一键导出符合ABA银行、Wing或ACLEDA企业网银格式的批量代发Excel/CSV报盘文件。'
    },
    technicalNote: 'Exports generated via `PayrollExportService::toBankFormat()`.',
    relatedPath: '/modules/payroll'
  },
  {
    id: 'faq-33',
    category: 'security',
    role: 'admin',
    categoryLabel: { km: 'សន្តិសុខ & សិទ្ធិ RBAC', en: 'Security & RBAC', th: 'ความปลอดภัยและ RBAC', vi: 'Bảo mật & RBAC', zh: '企业权限与安全' },
    q: {
      km: '33. តើប្រព័ន្ធការពារទិន្នន័យមិនឱ្យបុគ្គលិកសាខា A មើលឃើញទិន្នន័យសាខា B (Multi-Branch Scoping) យ៉ាងដូចម្តេច?',
      en: '33. How does multi-tenant branch scoping prevent unauthorized cross-branch data leaks between store branches?',
      th: '33. ระบบจำกัดสิทธิ์ข้อมูลข้ามสาขาเพื่อป้องกันไม่ให้พนักงานสาขา A เห็นข้อมูลของสาขา B ได้อย่างไร?',
      vi: '33. Hệ thống cách ly dữ liệu chi nhánh để nhân viên chi nhánh A không thấy dữ liệu chi nhánh B như thế nào?',
      zh: '33. 多门店行级数据隔离（Multi-Branch Scoping）如何防止A店员工越权查看B店核心经营数据？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់ Global Eloquent Scope (`BranchScope`) លើគ្រប់ Model ដែលភ្ជាប់ `branch_id`។ រាល់ពេល User សាកសួរទិន្នន័យ ប្រព័ន្ធនឹងបន្ថែម Clause `WHERE branch_id = :user_branch_id` ដោយស្វ័យប្រវត្តិ លើកលែងតែ User មានតួនាទីជា "Super Admin"។',
      en: 'Models utilize global Eloquent scopes (`BranchScope`) that bind `branch_id`. Every query injects `WHERE branch_id = :active_branch` automatically at runtime, unless authenticated as a global Super Admin.',
      th: 'โมเดลทั้งหมดใช้ Global Eloquent Scope (`BranchScope`) ที่ดักจับ `branch_id` ทุกการค้นหาจะเพิ่มเงื่อนไข `WHERE branch_id = :id` อัตโนมัติ ยกเว้นบัญชี Super Admin',
      vi: 'Các Model áp dụng Eloquent Scope toàn cục (`BranchScope`) ràng buộc `branch_id`. Mọi truy vấn đều tự động thêm điều kiện `WHERE branch_id = :id`, trừ khi là Super Admin.',
      zh: '全站业务Model挂载了全局Eloquent Scope（`BranchScope`）。系统在底层查询构建时强制注入`WHERE branch_id = :current_user_branch`条件，仅拥有全局Super Admin特权的用户方可跨店穿透。'
    },
    technicalNote: 'Enforced in `App\\Models\\Scopes\\BranchScope`.',
    relatedPath: '/auth-rbac'
  },
  {
    id: 'faq-34',
    category: 'security',
    role: 'admin',
    categoryLabel: { km: 'សន្តិសុខ & សិទ្ធិ RBAC', en: 'Security & RBAC', th: 'ความปลอดภัยและ RBAC', vi: 'Bảo mật & RBAC', zh: '企业权限与安全' },
    q: {
      km: '34. តើការកត់ត្រាសវនកម្ម (Audit Logging) តាមដានសកម្មភាពសំខាន់ៗរបស់បុគ្គលិកយ៉ាងដូចម្តេច?',
      en: '34. How does the immutable audit logging engine track sensitive employee actions, price overrides, and manual refunds?',
      th: '34. ระบบบันทึกประวัติการตรวจสอบ (Audit Logging) ติดตามการกระทำที่สำคัญ เช่น การแก้ราคา หรือการคืนเงินอย่างไร?',
      vi: '34. Nhật ký kiểm toán (Audit Logging) theo dõi các hành động nhạy cảm như sửa giá, hoàn tiền ra sao?',
      zh: '34. 不可篡改的审计日志（Audit Logging）如何全链路追踪改价、手动退款及特权提权行为？'
    },
    a: {
      km: 'រាល់ពេលមានការកែប្រែទិន្នន័យសំខាន់ៗ (ប្តូរតម្លៃទំនិញ, លុបវិក្កយបត្រ, អនុញ្ញាត Refund, កែប្រែសិទ្ធិ) ប្រព័ន្ធនឹងកត់ត្រាក្នុងតារាង `audit_logs` នូវ User ID, IP Address, User Agent, ទិន្នន័យចាស់ (Old Values), និងទិន្នន័យថ្មី (New Values) ជាអចិន្ត្រៃយ៍។',
      en: 'Sensitive operations (price overrides, voids, manual refunds, permission grants) automatically emit audit events into the `audit_logs` table, storing Actor ID, IP, User Agent, Before/After JSON diffs, and cryptographic timestamps.',
      th: 'ทุกการกระทำที่สำคัญ (การเปลี่ยนราคา, การยกเลิกบิล, การคืนเงิน) จะถูกบันทึกลงตาราง `audit_logs` พร้อมเก็บข้อมูล User, IP, ค่าเดิม และค่าใหม่ในรูปแบบ JSON',
      vi: 'Mọi thao tác nhạy cảm (sửa giá, hủy đơn, hoàn tiền, cấp quyền) đều tự động ghi vào bảng `audit_logs` gồm User ID, IP, Dữ liệu trước và sau khi sửa dưới dạng JSON.',
      zh: '系统针对敏感操作（改价、废单、特权退款、修改权限）自动捕获并持久化至`audit_logs`表，完整保留操作人、IP、UserAgent及修改前后JSON差异（Diff），支持安全溯源。'
    },
    technicalNote: 'Captured via model observers into `audit_logs` table.',
    relatedPath: '/auth-rbac'
  },
  {
    id: 'faq-35',
    category: 'security',
    role: 'developer',
    categoryLabel: { km: 'សន្តិសុខ & សិទ្ធិ RBAC', en: 'Security & RBAC', th: 'ความปลอดภัยและ RBAC', vi: 'Bảo mật & RBAC', zh: '企业权限与安全' },
    q: {
      km: '35. តើការផ្ទៀងផ្ទាត់ JWT Dual-Token (Access Token & Refresh Token) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '35. How does the Dual JWT Token architecture (15-minute Access Token + 7-day Refresh Token) protect against token theft?',
      th: '35. โครงสร้างความปลอดภัย JWT Dual-Token (Access Token 15 นาที + Refresh Token 7 วัน) ป้องกันการถูกขโมย Token อย่างไร?',
      vi: '35. Kiến trúc JWT Dual-Token (Access Token 15 phút + Refresh Token 7 ngày) bảo vệ chống đánh cắp mã phiên ra sao?',
      zh: '35. 双JWT令牌轮换机制（15分钟短效Access Token + 7天长效Refresh Token）如何防御令牌窃取？'
    },
    a: {
      km: 'Access Token មានសុពលភាពត្រឹមតែ ១៥ នាទីប៉ុណ្ណោះ។ នៅពេលផុតកំណត់ Client ផ្ញើ Refresh Token (ដែលរក្សាទុកក្នុង HttpOnly Cookie សុវត្ថិភាព) ដើម្បីប្តូរយក Access Token ថ្មីដោយស្វ័យប្រវត្តិ។ ប្រសិនបើគណនីត្រូវបិទ Token ទាំងអស់នឹងត្រូវ Revoke ភ្លាមៗ។',
      en: 'Short-lived 15-minute Access Tokens minimize attack windows. Expired tokens silently refresh via secure HttpOnly Refresh Tokens. Revoking a user in the Admin Dashboard blacklists all active tokens instantly in Redis.',
      th: 'Access Token มีอายุเพียง 15 นาที เมื่อหมดอายุจะส่ง Refresh Token จาก HttpOnly Cookie ไปขอใหม่ หากปิดใช้งานบัญชี ระบบจะ Blacklist Token ใน Redis ทันที',
      vi: 'Access Token ngắn hạn 15 phút giảm thiểu rủi ro. Khi hết hạn, Client tự động làm mới qua Refresh Token lưu trong HttpOnly Cookie. Khi khóa tài khoản, Token bị đưa vào danh sách đen trong Redis tức thì.',
      zh: '15分钟短效Access Token将泄露风险敞口降至最低；客户端通过安全HttpOnly Cookie静默调用Refresh Token无感续期；管理员后台冻结账号时，Redis即刻将该用户令牌拉黑阻断。'
    },
    technicalNote: 'Implemented via Laravel Sanctum / Tymon JWT with Redis Token Blacklist.',
    relatedPath: '/auth-rbac'
  },
  {
    id: 'faq-36',
    category: 'devops',
    role: 'developer',
    categoryLabel: { km: 'DevOps & ការដាក់ដំណើរការ', en: 'DevOps & Deployment', th: 'DevOps และการติดตั้ง', vi: 'DevOps & Triển khai', zh: 'DevOps与部署运维' },
    q: {
      km: '36. តើត្រូវដាក់ដំណើរការប្រព័ន្ធក្នុង Production (Production Deployment) តាម Docker យ៉ាងដូចម្តេច?',
      en: '36. How do you orchestrate and deploy the complete multi-service stack using Docker Compose in production?',
      th: '36. วิธีการติดตั้งและรันระบบทั้งหมดบน Production ด้วย Docker Compose มีขั้นตอนอย่างไร?',
      vi: '36. Làm thế nào để triển khai toàn bộ hệ thống trên Production bằng Docker Compose?',
      zh: '36. 在生产环境下如何使用Docker Compose编排并一键部署全套多端与后端微服务集群？'
    },
    a: {
      km: 'ប្រព័ន្ធបំពាក់ `docker-compose.yml` ដែលរៀបចំសេវាកម្ម៖ Nginx Reverse Proxy (Port 80/443), PHP 8.2-FPM Backend (Port 8000), PostgreSQL 18 (Port 5432), Redis 7 (Port 6379), និង Frontend Nginx Containers។ គ្រាន់តែដំណើរការ `docker compose up -d` ជាការស្រេច។',
      en: 'The repository provides an audited `docker-compose.yml` bundling Nginx Reverse Proxy, PHP 8.2-FPM, PostgreSQL 18, Redis 7, and optimized static Nginx build servers for the React frontends. Boot with `docker compose up -d --build`.',
      th: 'ระบบมีไฟล์ `docker-compose.yml` พร้อมใช้งานที่ประกอบด้วย Nginx, PHP 8.2-FPM, PostgreSQL 18, Redis 7 และ Nginx สำหรับหน้าเว็บ React รันคำสั่ง `docker compose up -d` ได้ทันที',
      vi: 'Dự án cung cấp tệp `docker-compose.yml` tích hợp sẵn Nginx Reverse Proxy, PHP 8.2-FPM, PostgreSQL 18, Redis 7 và máy chủ tĩnh cho React frontend. Khởi động bằng `docker compose up -d`.',
      zh: '仓库附带了经过生产检验的`docker-compose.yml`，一键拉起Nginx反向代理、PHP 8.2-FPM应用服务、PostgreSQL 18主库、Redis 7缓存队列以及React静态托管容器，运行`docker compose up -d --build`即刻上线。'
    },
    technicalNote: 'Multi-stage Docker builds reduce image footprints to minimal Alpine footprints.',
    relatedPath: '/developer-guide'
  },
  {
    id: 'faq-37',
    category: 'devops',
    role: 'developer',
    categoryLabel: { km: 'DevOps & ការដាក់ដំណើរការ', en: 'DevOps & Deployment', th: 'DevOps และการติดตั้ง', vi: 'DevOps & Triển khai', zh: 'DevOps与部署运维' },
    q: {
      km: '37. តើការបម្រុងទុកទិន្នន័យ (Database Backup & Disaster Recovery) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '37. What automated database backup and disaster recovery schedule protects enterprise business records?',
      th: '37. ระบบสำรองข้อมูลฐานข้อมูล (Database Backup) และการกู้คืนข้อมูลเมื่อเกิดภัยพิบัติทำงานอย่างไร?',
      vi: '37. Lịch trình sao lưu cơ sở dữ liệu và phục hồi sự cố tự động được thiết lập như thế nào?',
      zh: '37. 企业级数据库自动化定时热备份与灾难恢复（Disaster Recovery）策略是如何配置的？'
    },
    a: {
      km: 'ប្រព័ន្ធកំណត់ Laravel Task Scheduler ឱ្យដំណើរការ `pg_dump` រៀងរាល់យប់ម៉ោង 2:00 AM ដោយធ្វើការ Compress (Gzip) និង Upload ទៅកាន់ S3/Cloud Storage ជាមួយការកំណត់ Retention 30 ថ្ងៃ និងផ្ញើ Telegram Alert ជូនដំណឹងប្រសិនបើ Backup បរាជ័យ។',
      en: 'Laravel Schedule triggers daily `pg_dump` jobs at 2:00 AM, compresses backups with Gzip, uploads encrypted archives to offsite S3 storage with 30-day retention policies, and sends instant Telegram alerts upon failure.',
      th: 'ระบบใช้ Laravel Schedule เพื่อรัน `pg_dump` ทุกคืนเวลา 2:00 น. พร้อมบีบอัดและอัปโหลดไปยัง Cloud Storage (S3) พร้อมเก็บย้อนหลัง 30 วัน และแจ้งเตือนผ่าน Telegram',
      vi: 'Laravel Schedule tự động chạy `pg_dump` lúc 2:00 sáng mỗi ngày, nén tệp sao lưu và đẩy lên đám mây S3 với chính sách lưu trữ 30 ngày, gửi cảnh báo qua Telegram nếu có lỗi.',
      zh: '系统通过Laravel任务调度器于每日凌晨2:00自动执行`pg_dump`热备份，经Gzip压缩加密后自动流式上传至异地S3对象存储（保留30天滚动周期），失败时秒级推送Telegram告警。'
    },
    technicalNote: 'Managed via `php artisan backup:run` & `Spatie/laravel-backup`.',
    relatedPath: '/developer-guide'
  },
  {
    id: 'faq-38',
    category: 'devops',
    role: 'developer',
    categoryLabel: { km: 'DevOps & ការដាក់ដំណើរការ', en: 'DevOps & Deployment', th: 'DevOps และการติดตั้ง', vi: 'DevOps & Triển khai', zh: 'DevOps与部署运维' },
    q: {
      km: '38. តើប្រព័ន្ធការពារការវាយប្រហារ DDOS និង Rate Limiting លើ 759 API Endpoints យ៉ាងដូចម្តេច?',
      en: '38. How does rate limiting and throttling protect 759 API routes against brute force and DDoS abuse?',
      th: '38. ระบบจำกัดอัตราการเรียกใช้ (Rate Limiting) เพื่อป้องกันการโจมตี DDoS บน 759 API Endpoints อย่างไร?',
      vi: '38. Cơ chế giới hạn tốc độ (Rate Limiting) bảo vệ 759 điểm cuối API khỏi tấn công DDoS và Brute Force ra sao?',
      zh: '38. 系统如何针对759个API端点实施细粒度速率限制（Rate Limiting）以防御DDoS与暴力破解攻击？'
    },
    a: {
      km: 'ប្រព័ន្ធកំណត់ Rate Limiter តាម Tier៖ API សាធារណៈ (៦០ requests/min), API គិតលុយ POS (៣០០ requests/min), API Login/Auth (៥ requests/min)។ ប្រសិនបើលើសកម្រិត ប្រព័ន្ធនឹង Return 429 Too Many Requests ភ្លាមៗ។',
      en: 'Tiered rate limiting is enforced in Redis: Public endpoints allow 60 req/min, POS cashier terminals allow 300 req/min, while login routes restrict to 5 attempts/min before temporary IP lockouts.',
      th: 'ระบบจำกัดคำขอตามระดับใน Redis: API ทั่วไป 60 ครั้ง/นาที, POS แคชเชียร์ 300 ครั้ง/นาที, ส่วนการ Login จำกัด 5 ครั้ง/นาทีเพื่อป้องกันการสุ่มรหัสผ่าน',
      vi: 'Phân tầng giới hạn trong Redis: API công khai cho phép 60 yêu cầu/phút, POS cho phép 300 yêu cầu/phút, đăng nhập giới hạn 5 lần/phút trước khi tạm khóa IP.',
      zh: '系统在Redis中实施分级速率限制：公开端点限定60次/分钟；高频POS终端放宽至300次/分钟；登录鉴权接口严控为5次/分钟以阻断暴力碰撞。'
    },
    technicalNote: 'Configured in `App\\Providers\\RouteServiceProvider::configureRateLimiting()`.',
    relatedPath: '/api'
  },

  // 39 to 52 to ensure 52+ authoritative questions
  {
    id: 'faq-39',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '39. តើប្រព័ន្ធដោះស្រាយបញ្ហាទំនិញលក់ដាច់ខ្វះស្តុកពេល Offline Sync យ៉ាងដូចម្តេច?',
      en: '39. How does the offline synchronization engine resolve stock conflicts if an item was sold out online while the POS was offline?',
      th: '39. ระบบจัดการข้อขัดแย้งอย่างไรหากสินค้าหมดสต็อกออนไลน์ขณะที่เครื่อง POS กำลังขายแบบออฟไลน์?',
      vi: '39. Hệ thống xử lý xung đột tồn kho thế nào nếu hàng đã bán hết online trong lúc POS bán ngoại tuyến?',
      zh: '39. 离线收银数据恢复同步时，若某商品在此期间已在线上售罄，系统如何仲裁冲突？'
    },
    a: {
      km: 'ប្រព័ន្ធប្រើប្រាស់គោលការណ៍ Timestamp Priority និង First-Sold-First-Reserved។ ប្រតិបត្តិការ POS ដែលបានកើតឡើងជាក់ស្តែងនៅហាងផ្ទាល់ត្រូវបានផ្តល់អាទិភាពខ្ពស់បំផុត។ ប្រសិនបើស្តុកធ្លាក់ចុះដល់សូន្យ ប្រព័ន្ធនឹងដាក់ Flag ជូនដំណឹងដល់ Manager ឱ្យធ្វើការ Reorder បន្ទាន់។',
      en: 'The engine applies timestamp precedence and in-store physical priority. The in-store cash sale is committed with an audit flag, and an immediate low-stock emergency replenishment ticket is dispatched to the warehouse.',
      th: 'ระบบใช้ลำดับเวลาและความสำคัญของการขายหน้าร้านเป็นหลัก ยอดขายหน้าร้านจะถูกบันทึกสำเร็จพร้อมติดแท็กแจ้งเตือนผู้จัดการให้เร่งสั่งสินค้าเติมทันที',
      vi: 'Hệ thống áp dụng thứ tự ưu tiên theo thời gian và ưu tiên bán tại quầy. Giao dịch tại quầy được ưu tiên ghi nhận và tự động tạo thông báo bổ sung hàng khẩn cấp.',
      zh: '系统采用时间戳优先与实体门店优先仲裁机制。离线实体现金交易被无条件确认入账，若导致账面库存跌为负数，系统即刻触发红色告警并向仓库下发紧急补货指令。'
    },
    technicalNote: 'Logged with `sync_conflict_resolved: true` flag in audit trails.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-40',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '40. តើតម្លៃថ្លៃដើមទំនិញ (Cost Valuation: Moving Average vs FIFO) ត្រូវបានគណនាយ៉ាងដូចម្តេច?',
      en: '40. How does the system compute inventory cost valuation using Moving Average Cost vs FIFO principles?',
      th: '40. ระบบคำนวณมูลค่าต้นทุนสินค้าคงคลังด้วยวิธีถัวเฉลี่ยถ่วงน้ำหนัก (Moving Average) หรือ FIFO อย่างไร?',
      vi: '40. Hệ thống tính toán định giá giá vốn hàng tồn kho theo phương pháp Bình quân gia quyền hay FIFO?',
      zh: '40. 存货成本核算引擎是如何基于移动加权平均法（Moving Average Cost）与先进先出（FIFO）计算出库成本的？'
    },
    a: {
      km: 'រាល់ពេលមានទំនិញទិញចូល (PO Receiving) ប្រព័ន្ធគណនាតម្លៃថ្លៃដើមមធ្យមថ្មី (Weighted Average Cost = (ស្តុកចាស់ x ថ្លៃដើមចាស់ + ស្តុកថ្មី x ថ្លៃដើមថ្មី) / ស្តុកសរុប) ធានាថារបាយការណ៍ចំណេញខាត (Gross Profit) មានភាពសុក្រឹតខ្ពស់។',
      en: 'Upon goods receipt, the valuation service recalculates Moving Average Cost: `(Old_Qty * Old_Cost + New_Qty * New_Cost) / Total_Qty`. This ensures gross profit margins reflect true procurement costs.',
      th: 'เมื่อตรวจรับสินค้าเข้าคลัง ระบบจะคำนวณต้นทุนถัวเฉลี่ยถ่วงน้ำหนักใหม่ทันที: `(ยอดเดิม * ทุนเดิม + ยอดใหม่ * ทุนใหม่) / ยอดรวมทั้งหมด` เพื่อให้รายงานกำไรขั้นต้นมีความแม่นยำสูงสุด',
      vi: 'Khi nhập hàng vào kho, hệ thống tự động tính lại giá vốn bình quân gia quyền: `(Tồn cũ * Giá cũ + Nhập mới * Giá mới) / Tổng tồn` để báo cáo lãi gộp phản ánh chính xác nhất.',
      zh: '每次采购入库（PO Receiving）时，计价引擎自动实时重算移动加权平均成本：`(原库存*原成本 + 新到货*进价) / 总库存`，确保每笔销售出库结转的营业成本与毛利率绝对精准。'
    },
    technicalNote: 'Managed in `App\\Services\\Inventory\\CostValuationService`.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-41',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '41. តើប្រព័ន្ធគ្រប់គ្រង Price Lists ផ្សេងៗគ្នា (លក់រាយ Retail, លក់ដុំ Wholesale, VIP) យ៉ាងដូចម្តេច?',
      en: '41. How does the tiered pricing engine assign dynamic price lists for Retail, Wholesale, and VIP customer tiers?',
      th: '41. ระบบจัดการรายการราคาแบบแบ่งกลุ่ม (Price Lists) สำหรับลูกค้าปลีก, ลูกค้าส่ง และสมาชิกระดับ VIP อย่างไร?',
      vi: '41. Bảng giá phân tầng (Price Lists) cho khách bán lẻ, bán buôn (Wholesale) và khách VIP hoạt động ra sao?',
      zh: '41. 分级客户价格本（Tiered Price Lists：零售、批发Wholesale、VIP大客户）如何在POS与商城端动态匹配？'
    },
    a: {
      km: 'អតិថិជនម្នាក់ៗត្រូវបានភ្ជាប់ជាមួយ Customer Group។ នៅពេល Cashier ជ្រើសរើសអតិថិជន ឬពេលអតិថិជន Login លើ Website តម្លៃទំនិញលើ POS និង Cart នឹងផ្លាស់ប្តូរទៅតាម Price List នៃ Group នោះដោយស្វ័យប្រវត្តិ។',
      en: 'Customers belong to designated customer groups. When a customer is selected on the POS or signs in online, catalog prices dynamically adjust to their assigned price tiers and wholesale quantity breakpoints.',
      th: 'ลูกค้าแต่ละรายจะผูกกับกลุ่มลูกค้า เมื่อเลือกชื่อลูกค้าบน POS หรือเมื่อลูกค้าเข้าสู่ระบบบนเว็บ ราคาสินค้าจะปรับตาม Price List ของกลุ่มนั้นโดยอัตโนมัติ',
      vi: 'Mỗi khách hàng được gán vào một nhóm khách. Khi thu ngân chọn khách hoặc khi khách đăng nhập trên website, giá sản phẩm tự động cập nhật theo bảng giá của nhóm đó.',
      zh: '每个客户归属于特定的客户群组（Customer Group）。POS端选定客户或用户登录商城时，计价引擎秒级命中对应价格本及阶梯批发起订量门槛并自动改写售价。'
    },
    technicalNote: 'Linked via `customer_group_prices` table.',
    relatedPath: '/modules/products'
  },
  {
    id: 'faq-42',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '42. តើការជូនដំណឹងពេលប្រាក់ក្នុងថតខុសគ្នាខ្លាំង (Cash Discrepancy Alerts) ការពារការបាត់បង់លុយយ៉ាងដូចម្តេច?',
      en: '42. How do automated cash discrepancy thresholds alert store managers to cashier till shortages or overages?',
      th: '42. ระบบแจ้งเตือนเมื่อเงินทอนหรือเงินในลิ้นชักผิดปกติ (Cash Discrepancy Alerts) ป้องกันการสูญหายอย่างไร?',
      vi: '42. Cảnh báo chênh lệch tiền két (Cash Discrepancy Alerts) cảnh báo quản lý khi thừa/thiếu tiền mặt ra sao?',
      zh: '42. 钱箱长短款异常阈值告警（Cash Discrepancy Alerts）如何向店长即时推送现金风控通知？'
    },
    a: {
      km: 'ប្រសិនបើផលខុសគ្នារវាងប្រាក់រាប់ជាក់ស្តែង និងប្រាក់ក្នុងប្រព័ន្ធលើសពីកម្រិតកំណត់ (ឧទាហរណ៍ លើសពី $5 ឬ 20,000 KHR) ប្រព័ន្ធនឹងតម្រូវឱ្យ Cashier បញ្ចូលកំណត់ហេតុពន្យល់ និងផ្ញើ Telegram Alert ទៅកាន់ Store Manager ភ្លាមៗ។',
      en: 'If shift closing cash discrepancies exceed configured tolerances (e.g. > $5.00), the cashier is prompted for mandatory justification notes, and an automated alert dispatches to the store manager via Telegram webhook.',
      th: 'หากผลต่างของเงินสดเกินกว่าเกณฑ์ที่กำหนด (เช่น เกิน $5) ระบบจะบังคับให้แคชเชียร์กรอกเหตุผลชี้แจง และส่งแจ้งเตือนไปยังผู้จัดการร้านผ่าน Telegram ทันที',
      vi: 'Nếu chênh lệch tiền mặt vượt quá ngưỡng cho phép (ví dụ > $5), thu ngân bắt buộc phải nhập lý do giải trình và hệ thống tự động gửi thông báo qua Telegram cho Quản lý cửa hàng.',
      zh: '若交接班实数现金与系统应收金额差额超过设定风控阈值（如 > $5.00），系统强制收银员填写差额原因说明，并秒级向店长Telegram工作群推送风控告警。'
    },
    technicalNote: 'Configured in `pos_settings.discrepancy_threshold`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-43',
    category: 'pos',
    role: 'developer',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '43. តើប្រព័ន្ធបង្កើនល្បឿន UI របស់ POS យ៉ាងដូចម្តេច ដើម្បីកុំឱ្យ Lag ពេលវិក្កយបត្រមានទំនិញ ១០០ មុខ?',
      en: '43. How does virtualized list rendering keep the POS UI responsive with 100+ line items in a single cart?',
      th: '43. ระบบเพิ่มความเร็ว UI ของหน้า POS อย่างไรเพื่อไม่ให้กระตุกเมื่อมีรายการสินค้าในบิลเกิน 100 รายการ?',
      vi: '43. Cơ chế ảo hóa danh sách (Virtual List) giúp giao diện POS mượt mà khi có hơn 100 sản phẩm như thế nào?',
      zh: '43. POS前端如何利用虚拟列表（Virtual List Rendering）在单笔订单超100+品项时保持60FPS极致流畅？'
    },
    a: {
      km: 'POS ប្រើប្រាស់ Virtualized List (TanStack Virtual) និង React.memo ដែល Render តែជួរទំនិញដែលកំពុងមើលឃើញលើអេក្រង់ប៉ុណ្ណោះ។ ការបន្ថែម ឬកែប្រែទំនិញប្រើប្រាស់ Immer.js State Updates ដោយគ្មាន Lag ឡើយ។',
      en: 'The cart viewport leverages TanStack Virtual and memoized subcomponents, rendering only DOM elements within the active scroll view. State mutations execute via lightweight Immer immutability trees.',
      th: 'หน้า POS ใช้ TanStack Virtual และ React.memo ในการเรนเดอร์เฉพาะรายการที่มองเห็นบนหน้าจอ ทำให้การเพิ่มหรือแก้ไขสินค้าทำงานได้อย่างลื่นไหล 60 FPS แม้มีรายการสินค้าจำนวนมาก',
      vi: 'Giao diện giỏ hàng sử dụng TanStack Virtual và React.memo chỉ render các phần tử DOM trong vùng nhìn thấy, đảm bảo mượt mà tuyệt đối kể cả khi giỏ hàng có hàng trăm món.',
      zh: 'POS购物车采用TanStack Virtual虚拟化技术与React.memo记忆组件，仅渲染可视视口内的DOM节点；状态更新基于Immer不可变结构，确保在极端大单下仍保持60FPS操作响应。'
    },
    technicalNote: 'Implemented in `src/components/pos/CartItemList.tsx`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-44',
    category: 'architecture',
    role: 'developer',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '44. តើប្រព័ន្ធការពារការ Deadlock ក្នុង Database យ៉ាងដូចម្តេច ពេលមាន Transactions ច្រើនដំណាលគ្នា?',
      en: '44. How does the architecture prevent database deadlocks during heavy concurrent reads and writes across 99 tables?',
      th: '44. สถาปัตยกรรมป้องกันปัญหา Database Deadlock ขณะมีธุรกรรมพร้อมกันจำนวนมากได้อย่างไร?',
      vi: '44. Kiến trúc phòng ngừa Deadlock cơ sở dữ liệu khi có nhiều giao dịch đồng thời ra sao?',
      zh: '44. 在99张表高频并发读写场景下，系统如何从设计层面杜绝PostgreSQL死锁（Deadlock）？'
    },
    a: {
      km: 'ប្រព័ន្ធអនុវត្តច្បាប់ Strict Consistent Lock Ordering៖ រាល់ពេល Lock ទិន្នន័យក្នុង Transaction ត្រូវ Lock តាមលំដាប់លំដោយនៃ Primary Keys ពីតូចទៅធំជានិច្ច (`ORDER BY id ASC`) ដើម្បីការពារកុំឱ្យ Transactions ពីរចាក់សោរច្រាសទិសគ្នា។',
      en: 'Transactions strictly enforce deterministic lock ordering: multiple row locks sort keys monotonically (`ORDER BY id ASC`) before issuing `lockForUpdate()`, eliminating cyclical dependency deadlocks.',
      th: 'ระบบบังคับใช้กฎการล็อกแบบเรียงลำดับ ID เสมอ (`ORDER BY id ASC`) ก่อนที่จะเรียกคำสั่ง `lockForUpdate()` เพื่อป้องกันการเกิดเงื่อนไขวงรอบที่ทำให้เกิด Deadlock',
      vi: 'Các giao dịch bắt buộc sắp xếp thứ tự khóa theo ID tăng dần (`ORDER BY id ASC`) trước khi gọi `lockForUpdate()`, loại bỏ hoàn toàn khả năng gây nghẽn chết (Deadlock).',
      zh: '系统严格贯彻确定性锁顺序原则：在任何涉及批量锁定的事务中，强制按主键升序排序（`ORDER BY id ASC`）后再执行`lockForUpdate()`，从数学逻辑上彻底消除死锁环路。'
    },
    technicalNote: 'Enforced in `App\\Traits\\HandlesDeterministicLocks`.',
    relatedPath: '/database'
  },
  {
    id: 'faq-45',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชឆៀរ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '45. តើប្រព័ន្ធពិន្ទុសន្សំ និងសមាជិកភាព (Customer Loyalty Points) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '45. How does the customer loyalty rewards engine calculate points accumulation, tiers (Silver, Gold, Platinum), and point redemption at checkout?',
      th: '45. ระบบสะสมแต้มสมาชิก (Customer Loyalty Points) และระดับสมาชิก (Silver, Gold, Platinum) ทำงานอย่างไร?',
      vi: '45. Hệ thống tích điểm và thăng hạng thành viên (Silver, Gold, Platinum) vận hành ra sao?',
      zh: '45. 会员积分积攒、会员等级晋升（Silver、Gold、Platinum）与收银结账积分抵现是如何联动的？'
    },
    a: {
      km: 'រាល់ពេលអតិថិជនទិញទំនិញ $1 ទទួលបាន ១ ពិន្ទុ។ ពិន្ទុអាចប្រើជាប្រាក់បញ្ចុះតម្លៃនៅពេល checkout (ឧទាហរណ៍ ១០០ ពិន្ទុ = $1)។ ពេលអតិថិជនទិញដល់កម្រិតកំណត់ ប្រព័ន្ធនឹងដំឡើង Tier ទៅជា VIP ដើម្បីទទួលបាន Discount បន្ថែមដោយស្វ័យប្រវត្តិ។',
      en: 'Customers earn points (e.g. $1 = 1 pt). Points redeem as direct cash credits at checkout (100 pts = $1). Spending thresholds trigger automated tier promotions (Silver -> Gold -> Platinum) with permanent percentage perks.',
      th: 'ลูกค้าจะได้รับแต้มสะสมเมื่อซื้อสินค้า และสามารถนำแต้มมาใช้เป็นส่วนลดเงินสดตอนคิดเงินได้ เมื่อยอดซื้อสะสมถึงเกณฑ์ ระบบจะอัปเกรดระดับสมาชิกให้อัตโนมัติ',
      vi: 'Khách hàng tích lũy điểm khi mua sắm và có thể đổi điểm thành tiền giảm giá trực tiếp khi thanh toán. Đạt đủ hạn mức chi tiêu sẽ tự động thăng hạng VIP với ưu đãi chiết khấu riêng.',
      zh: '顾客消费自动累计积分（如$1=1分）；积分可在收银台一键抵现（100分抵扣$1）。累计消费达成门槛自动晋级等级并终身享受专属折扣特权。'
    },
    technicalNote: 'Handled in `App\\Services\\Customer\\LoyaltyPointsService`.',
    relatedPath: '/modules/customers'
  },
  {
    id: 'faq-46',
    category: 'hrm',
    role: 'hr',
    categoryLabel: { km: 'វត្តមាន & Dynamic QR', en: 'HRM & Dynamic QR', th: 'การลงเวลา Dynamic QR', vi: 'Chấm công Dynamic QR', zh: '动态QR考勤与人事' },
    q: {
      km: '46. តើការផ្ទេរសិទ្ធិអនុម័តវត្តមាន និងច្បាប់សម្រាកពេល Manager ឈប់សម្រាក (Approval Delegation) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '46. How does approval delegation re-route attendance and leave approvals when a department manager is out of office?',
      th: '46. การมอบหมายสิทธิ์การอนุมัติ (Approval Delegation) ส่งต่อคำขอลาเมื่อผู้จัดการไม่อยู่อย่างไร?',
      vi: '46. Cơ chế ủy quyền phê duyệt (Approval Delegation) chuyển tiếp đơn nghỉ phép khi Quản lý vắng mặt như thế nào?',
      zh: '46. 部门经理休假出差时，考勤与请假审批代理人委派机制（Approval Delegation）如何平滑转交？'
    },
    a: {
      km: 'Manager អាចកំណត់ Delegate Approver ក្នុងប្រព័ន្ធសម្រាប់ចន្លោះកាលបរិច្ឆេទជាក់លាក់។ រាល់ Leave Requests ក្នុងអំឡុងពេលនោះនឹងត្រូវបញ្ជូនទៅកាន់អ្នកទទួលសិទ្ធិជំនួសដោយស្វ័យប្រវត្តិ។',
      en: 'Managers can designate temporary delegates with active date windows. Pending and new leave requests automatically route to the acting delegate, preserving audit trails.',
      th: 'ผู้จัดการสามารถตั้งค่าผู้รักษาการแทนพร้อมระบุช่วงเวลาได้ คำขออนุมัติทั้งหมดในช่วงนั้นจะถูกส่งต่อไปยังผู้รับมอบอำนาจโดยอัตโนมัติ',
      vi: 'Quản lý có thể chỉ định người ủy quyền trong khoảng thời gian xác định. Các đơn nghỉ phép trong thời gian này sẽ tự động chuyển đến người nhận ủy quyền.',
      zh: '主管可在后台设置审批代理人与有效起止时间。在此期间产生的所有待办请假审批流自动无缝流转至代理人工作台并全程留痕。'
    },
    technicalNote: 'Tracked in `approval_delegations` table.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-47',
    category: 'hrm',
    role: 'hr',
    categoryLabel: { km: 'វត្តមាន & Dynamic QR', en: 'HRM & Dynamic QR', th: 'การลงเวลา Dynamic QR', vi: 'Chấm công Dynamic QR', zh: '动态QR考勤与人事' },
    q: {
      km: '47. តើប្រព័ន្ធបញ្ចូលថ្ងៃឈប់សម្រាកបុណ្យជាតិនៃប្រទេសកម្ពុជា (Cambodian Public Holidays) យ៉ាងដូចម្តេច?',
      en: '47. How does the system sync the official Cambodian National Holiday calendar for automatic payroll multiplier triggers?',
      th: '47. ระบบจัดการปฏิทินวันหยุดนักขัตฤกษ์ของกัมพูชา (Cambodian Public Holidays) เพื่อคำนวณค่าแรงพิเศษอย่างไร?',
      vi: '47. Hệ thống đồng bộ lịch nghỉ lễ quốc gia Campuchia để tự động kích hoạt hệ số lương ngày lễ như thế nào?',
      zh: '47. 系统如何同步柬埔寨法定公共假日日历（Cambodian Public Holidays）并自动触发节假日2.0x加班薪资计算？'
    },
    a: {
      km: 'ប្រព័ន្ធបំពាក់ Master Holiday Calendar ប្រចាំឆ្នាំ (បុណ្យចូលឆ្នាំខ្មែរ, ភ្ជុំបិណ្ឌ, ព្រះរាជពិធីបុណ្យអុំទូក)។ បុគ្គលិកដែលមកធ្វើការក្នុងថ្ងៃបុណ្យទាំងនេះនឹងត្រូវបានគណនាប្រាក់ OT ស្វ័យប្រវត្តិតាមអត្រា 2.0x។',
      en: 'The HRM module pre-populates official Cambodian public holidays (Khmer New Year, Pchum Ben, Water Festival). Employees working on holiday shifts automatically receive 2.0x premium wage rates.',
      th: 'ระบบมีปฏิทินวันหยุดนักขัตฤกษ์ของกัมพูชาในตัว (สงกรานต์, แซนโดนตา, บุญลอยกระทง) พนักงานที่มาทำงานในวันหยุดเหล่านี้จะได้รับค่าแรงพิเศษ 2.0 เท่าโดยอัตโนมัติ',
      vi: 'Hệ thống tích hợp sẵn lịch ngày lễ chính thức của Campuchia (Tết Khmer, Lễ Pchum Ben, Lễ hội Nước). Nhân viên đi làm vào các ngày này sẽ tự động hưởng lương gấp 2.0 lần.',
      zh: '系统内置柬埔寨王国官方年度公共节假日日历（柬埔寨新年、亡人节、送水节等）。在法定节假日出勤的员工考勤自动标记并套用2.0倍双倍薪酬算法。'
    },
    technicalNote: 'Configured in `public_holidays` master table.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-48',
    category: 'pos',
    role: 'cashier',
    categoryLabel: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashiering', th: 'ระบบแคชเชียร์ POS', vi: 'Hệ thống Thu ngân POS', zh: '极速POS收银' },
    q: {
      km: '48. តើការគណនាពន្ធលើតម្លៃបន្ថែម (VAT 10% Tax Invoices) អនុលោមតាមអគ្គនាយកដ្ឋានពន្ធដារកម្ពុជា (GDT) យ៉ាងដូចម្តេច?',
      en: '48. How does the billing engine generate standard Cambodian General Department of Taxation (GDT) compliant VAT tax invoices?',
      th: '48. ระบบออกใบกำกับภาษีมูลค่าเพิ่ม (VAT 10%) ตามมาตรฐานกรมสรรพากรกัมพูชา (GDT) อย่างไร?',
      vi: '48. Hệ thống xuất hóa đơn thuế giá trị gia tăng (VAT 10%) tuân thủ Tổng cục Thuế Campuchia (GDT) như thế nào?',
      zh: '48. 结算引擎如何开具符合柬埔寨税务总局（GDT）合规标准的增值税（VAT 10%）官方发票？'
    },
    a: {
      km: 'ប្រព័ន្ធគាំទ្រទាំង Tax Inclusive (តម្លៃបូកបញ្ចូលពន្ធ) និង Tax Exclusive (តម្លៃមិនទាន់គិតពន្ធ)។ វិក្កយបត្រផ្លូវការមានបោះពុម្ពលេខ VATTIN របស់ក្រុមហ៊ុន, ឈ្មោះអតិថិជន, ចំនួនពន្ធ VAT 10% ជាប្រាក់រៀល KHR សុក្រឹត និងលេខសារពើពន្ធតាមស្តង់ដារ GDT។',
      en: 'The engine supports both Tax-Inclusive and Tax-Exclusive pricing modes. Standard tax invoices display the company VATTIN, customer TIN, itemized 10% VAT in KHR, and sequential fiscal serial numbers required by GDT regulations.',
      th: 'ระบบรองรับทั้งการคิดภาษีแบบรวมในราคา (Inclusive) และแยกภาษี (Exclusive) โดยใบกำกับภาษีจะมีหมายเลขประจำตัวผู้เสียภาษี (VATTIN) และคำนวณภาษี VAT 10% เป็นสกุลเงิน KHR ถูกต้องตามกฎหมาย',
      vi: 'Hệ thống hỗ trợ cả chế độ giá đã gồm thuế và chưa gồm thuế. Hóa đơn VAT chuẩn hiển thị mã số thuế VATTIN, thông tin khách hàng, số tiền thuế 10% bằng KHR theo quy chuẩn GDT.',
      zh: '系统支持价税合计（含税）与价税分离（未税）两种计税模式。官方增值税发票打印企业VATTIN税号、客户税号、以KHR计算的10%增值税额及符合GDT规范的连续税务凭证编号。'
    },
    technicalNote: 'Built in `App\\Services\\Finance\\TaxInvoiceService`.',
    relatedPath: '/modules/reports'
  },
  {
    id: 'faq-49',
    category: 'inventory',
    role: 'warehouse',
    categoryLabel: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Warehouses', th: 'คลังสินค้าหลายสาขา', vi: 'Kho hàng đa chi nhánh', zh: '多仓储进销存' },
    q: {
      km: '49. តើប្រព័ន្ធការពារកុំឱ្យបុគ្គលិកកែប្រែចំនួនស្តុកដោយបំពាន (Inventory Tamper Prevention) យ៉ាងដូចម្តេច?',
      en: '49. How does the immutable inventory ledger prevent unauthorized manual manipulation of stock balances?',
      th: '49. ระบบป้องกันการลักลอบแก้ไขยอดสต็อกสินค้าโดยพลการ (Inventory Tamper Prevention) อย่างไร?',
      vi: '49. Sổ cái kho bất biến ngăn chặn hành vi chỉnh sửa số lượng kho trái phép như thế nào?',
      zh: '49. 不可逆库存流水总账（Immutable Inventory Ledger）如何从根本上防范员工恶意篡改库存？'
    },
    a: {
      km: 'គ្មាន User ណាអាចកែប្រែលេខក្នុងតារាង `inventories` ដោយផ្ទាល់បានឡើយ។ រាល់ការប្រែប្រួលស្តុក (លក់ចេញ, ទិញចូល, ផ្ទេរ, ខូចខាត) ត្រូវតែកត់ត្រាជា Ledger Row ថ្មីក្នុង `inventory_movements` ជាមួយ Reference ID និង User ID ជាប់ជានិច្ច។',
      en: 'Direct database updates to `inventories.quantity` are blocked. All balance shifts require appending an immutable entry in the `inventory_movements` table with transaction origin IDs and actor signatures.',
      th: 'ไม่อนุญาตให้แก้ไขตัวเลขในตารางสต็อกโดยตรง การเปลี่ยนแปลงทุกครั้งจะต้องสร้างแถวประวัติใหม่ใน `inventory_movements` พร้อมระบุเลขอ้างอิงและผู้ทำรายการเสมอ',
      vi: 'Không cho phép sửa trực tiếp số lượng trong bảng kho. Mọi thay đổi đều phải ghi nhận dòng lịch sử mới trong `inventory_movements` kèm mã giao dịch và người thực hiện.',
      zh: '系统完全屏蔽对`inventories.quantity`的直接修改指令。任何出入库必须以追加记录的形式写入`inventory_movements`流水总账，携带业务单据关联ID及操作人电子签名。'
    },
    technicalNote: 'Enforced via database triggers and domain service policies.',
    relatedPath: '/modules/inventory'
  },
  {
    id: 'faq-50',
    category: 'devops',
    role: 'developer',
    categoryLabel: { km: 'DevOps & ការដាក់ដំណើរការ', en: 'DevOps & Deployment', th: 'DevOps และการติดตั้ง', vi: 'DevOps & Triển khai', zh: 'DevOps与部署运维' },
    q: {
      km: '50. តើប្រព័ន្ធគ្រប់គ្រង Session និង Cache ពេលដំណើរការលើ Servers ច្រើន (Load Balancing) យ៉ាងដូចម្តេច?',
      en: '50. How does the architecture scale horizontally across multiple application nodes with centralized Redis session and cache clustering?',
      th: '50. สถาปัตยกรรมรองรับการขยายตัว (Load Balancing) บนหลายเซิร์ฟเวอร์ด้วย Redis Cluster อย่างไร?',
      vi: '50. Kiến trúc mở rộng quy mô trên nhiều máy chủ (Load Balancing) với Redis tập trung như thế nào?',
      zh: '50. 当多台应用服务器挂载在负载均衡（Load Balancer）后，系统如何借助Redis集中管理会话与缓存？'
    },
    a: {
      km: 'សេវាកម្ម Laravel ទាំងអស់ដំណើរការជា Stateless Node។ រាល់ Session, Cache, Rate Limits, និង WebSocket Connections ត្រូវបានគ្រប់គ្រងកណ្តាលដោយ Redis 7 Cluster ធានាថាការ Login និងទិន្នន័យមានភាពរលូន ១០០% ទោះបី User ហោះកាត់ Server ណាក៏ដោយ។',
      en: 'Application containers operate fully statelessly. User authentication tokens, Redis cache tags, rate limit buckets, and WebSocket channels reside on a centralized Redis 7 cluster, allowing seamless zero-downtime horizontal scaling.',
      th: 'แอปพลิเคชันทำงานแบบ Stateless อย่างสมบูรณ์ ข้อมูลเซสชัน, แคช และการจำกัดอัตราจะถูกเก็บไว้ที่ Redis 7 Cluster ส่วนกลาง ทำให้สามารถเพิ่มเซิร์ฟเวอร์ได้ทันทีโดยไม่กระทบผู้ใช้งาน',
      vi: 'Các máy chủ ứng dụng hoàn toàn không lưu trạng thái (Stateless). Mã phiên, bộ đệm và giới hạn tốc độ được quản lý tập trung trên Redis 7 Cluster, cho phép mở rộng quy mô linh hoạt.',
      zh: '所有后端容器均设计为纯无状态（Stateless）节点。用户会话、Redis缓存标签、限流漏桶与WebSocket连接池全部集中下沉至独立Redis 7集群，支持高并发无缝横向弹性扩容。'
    },
    technicalNote: 'Configured via `CACHE_DRIVER=redis` and `SESSION_DRIVER=redis`.',
    relatedPath: '/developer-guide'
  },
  {
    id: 'faq-51',
    category: 'architecture',
    role: 'all',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '51. តើការជូនដំណឹងពេលមាន Order ថ្មី (Push Notifications & Sound Alerts) ដំណើរការយ៉ាងដូចម្តេច?',
      en: '51. How does the real-time event broadcasting pipeline deliver instant order notifications and sound rings to the kitchen/cashier?',
      th: '51. ระบบแจ้งเตือนคำสั่งซื้อใหม่แบบเรียลไทม์ (Push Notification และเสียงเตือน) ไปยังแคชเชียร์ทำงานอย่างไร?',
      vi: '51. Quy trình phát thông báo đơn hàng mới theo thời gian thực (Âm thanh & Push Notification) hoạt động ra sao?',
      zh: '51. 线上商城产生新订单时，如何通过实时事件广播（WebSocket/SSE）向收银台与厨房推送语音弹窗提醒？'
    },
    a: {
      km: 'នៅពេលមាន Order ថ្មីលើ Website ប្រព័ន្ធនឹងបញ្ជូន Event តាមរយៈ Laravel Pusher / WebSockets ទៅកាន់ Admin Dashboard និង POS Terminal ភ្លាមៗ ព្រមទាំងបន្លឺសំឡេងរោទ៍ជូនដំណឹង និងព្រីនប័ណ្ណកម្ម៉ង់ដោយស្វ័យប្រវត្តិ។',
      en: 'New storefront orders trigger asynchronous Laravel broadcast events over WebSockets (Pusher / Soketi). The cashier terminal intercepts the payload within 200ms, plays a chime, and triggers auto-printing.',
      th: 'เมื่อมีคำสั่งซื้อใหม่จากหน้าเว็บ ระบบจะส่งสัญญาณ Event ผ่าน WebSockets ไปยังหน้า Admin และ POS ทันที พร้อมเปิดเสียงแจ้งเตือนและพิมพ์บิลเข้าครัวให้อัตโนมัติ',
      vi: 'Khi có đơn hàng mới trên website, hệ thống phát sự kiện qua WebSockets đến Admin Dashboard và máy POS trong 200ms, phát âm thanh chuông báo và tự động in phiếu chế biến.',
      zh: '线上商城下单成功瞬间，后端触发异步广播事件经由WebSocket通道（Pusher/Soketi）推送至门店收银与前台看板，200毫秒内触发叮咚语音播报并自动出单。'
    },
    technicalNote: 'Dispatched via `App\\Events\\NewOrderCreatedEvent`.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-52',
    category: 'architecture',
    role: 'all',
    categoryLabel: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'System Architecture', th: 'สถาปัตยกรรมระบบ', vi: 'Kiến trúc Hệ thống', zh: '系统架构' },
    q: {
      km: '52. តើការគាំទ្រពហុភាសា (i18n Localization) ទាំង ៥ ភាសាត្រូវបានរៀបចំយ៉ាងដូចម្តេច?',
      en: '52. How is the 5-language internationalization (i18n) architecture structured for Khmer, English, Thai, Vietnamese, and Chinese?',
      th: '52. สถาปัตยกรรมระบบหลายภาษา (i18n) สำหรับ 5 ภาษา (เขมร, อังกฤษ, ไทย, เวียดนาม, จีน) จัดการอย่างไร?',
      vi: '52. Kiến trúc đa ngôn ngữ (i18n) cho 5 ngôn ngữ (Khmer, Anh, Thái, Việt, Trung) được cấu trúc như thế nào?',
      zh: '52. 针对高棉语、英语、泰语、越南语与中文的5国语言国际化（i18n Localization）架构是如何标准构建的？'
    },
    a: {
      km: 'ប្រព័ន្ធរៀបចំដាច់ដោយឡែកជា Modular Subfolders (`locales/km`, `locales/en`, `locales/th`, `locales/vi`, `locales/zh`) ដែលមាន Strict TypeScript Interfaces ការពារកុំឱ្យបាត់ Translation Keys ជាមួយ Font គាំទ្រអក្សរខ្មែរ (Kantumruy Pro/Siemreap) យ៉ាងស្រស់ស្អាត។',
      en: 'The i18n subsystem is organized into modular directory trees (`locales/{lang}/`) backed by strong TypeScript typing interfaces to guarantee zero missing keys, paired with native Khmer, Thai, and CJK typography rendering.',
      th: 'ระบบหลายภาษาถูกจัดเป็นโฟลเดอร์ย่อย (`locales/{lang}/`) พร้อมระบบตรวจสอบด้วย TypeScript ป้องกันการตกหล่นของข้อความ และรองรับฟอนต์ภาษาเขมร, ไทย, เวียดนาม, จีน อย่างสวยงาม',
      vi: 'Hệ thống i18n được tổ chức theo các thư mục con riêng biệt (`locales/{lang}/`) với kiểu dữ liệu TypeScript nghiêm ngặt đảm bảo không thiếu khóa dịch, hiển thị phông chữ tối ưu cho từng ngôn ngữ.',
      zh: '全站多语言架构规范划分于独立子目录（`locales/{lang}/`），依托严谨的TypeScript Interface进行强类型键值约束确保零遗漏；并专门针对高棉文、泰文与中文排版进行了字重与行高视效优化。'
    },
    technicalNote: 'Managed via unified store in `src/stores/useDocsStore.tsx`.',
    relatedPath: '/overview'
  }
];
