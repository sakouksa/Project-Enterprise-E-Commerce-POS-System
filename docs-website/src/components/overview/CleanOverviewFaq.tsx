import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  Code2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  QrCode,
  Layers
} from 'lucide-react';

export const CleanOverviewFaq: React.FC = () => {
  const { language } = useDocs();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');

  const topQuestions = [
    {
      id: 'faq-01',
      icon: Lock,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      badge: 'Concurrency & Stock Locking',
      badgeKh: 'ការទប់ស្កាត់ការលក់លើសស្តុក',
      q: {
        km: 'តើប្រព័ន្ធដោះស្រាយបញ្ហា Race Condition និងការលក់លើសស្តុក (Over-selling) យ៉ាងដូចម្តេច?',
        en: 'How does the system prevent Race Conditions and inventory over-selling during peak concurrent sales?',
        th: 'ระบบป้องกัน Race Condition และการขายสินค้าเกินสต็อกอย่างไรในระหว่างการขายพร้อมกันสูง?',
        vi: 'Hệ thống xử lý tình trạng Race Condition và ngăn chặn bán vượt tồn kho như thế nào?',
        zh: '在高并发多终端同时结算时，系统如何杜绝超卖并防止Race Condition竞态条件？'
      },
      a: {
        km: 'ប្រព័ន្ធដំណើរការតាម PostgreSQL Row-Level Lock ដោយប្រើ `DB::transaction()` រួមជាមួយ `lockForUpdate()` លើតារាង `inventories`។ ក្នុងពេលដែលបញ្ជរ A កំពុងកាត់ស្តុក បញ្ជរ B ត្រូវរង់ចាំរហូតដល់ Transaction ត្រូវបាន Commit ជោគជ័យ។ ប្រសិនបើស្តុកនៅសល់មិនគ្រប់គ្រាន់ ប្រព័ន្ធនឹងបដិសេធប្រតិបត្តិការ និង Rollback ភ្លាមៗ។',
        en: 'The system uses PostgreSQL row-level locks via `DB::transaction()` paired with `lockForUpdate()` on the `inventories` table. While Cashier A is checking out a SKU, Cashier B waits until the transaction commits. If stock balance is insufficient, the transaction throws an InsufficientStockException and rolls back automatically.',
        th: 'ระบบใช้การล็อกระดับแถวของ PostgreSQL ผ่าน `DB::transaction()` ร่วมกับ `lockForUpdate()` ในตาราง `inventories` ทำให้มั่นใจได้ว่าจะไม่มีการตัดสต็อกติดลบ',
        vi: 'Hệ thống sử dụng khóa cấp hàng (Row-level lock) trong PostgreSQL bằng `DB::transaction()` kết hợp `lockForUpdate()` trên bảng `inventories`.',
        zh: '系统在PostgreSQL数据库层采用悲观行级锁机制，在`DB::transaction()`事务中执行`lockForUpdate()`。当收银台A结算某SKU时，收银台B必须排队等待，余额不足时自动抛出异常并全局Rollback。'
      },
      techNote: 'PostgreSQL: SELECT * FROM inventories WHERE id = ? FOR UPDATE;'
    },
    {
      id: 'faq-02',
      icon: QrCode,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      badge: 'National Bank Bakong KHQR',
      badgeKh: 'ការទូទាត់បាគង KHQR ជាតិ',
      q: {
        km: 'តើការទូទាត់ប្រាក់បាគង KHQR Dynamic ដំណើរការ និងផ្ទៀងផ្ទាត់ដោយរបៀបណា?',
        en: 'How does the dynamic Bakong KHQR EMVCo payment workflow generate and verify incoming bank transactions?',
        th: 'กระบวนการสร้างและตรวจสอบการชำระเงิน Dynamic Bakong KHQR ดำเนินการอย่างไร?',
        vi: 'Quy trình tạo và xác thực thanh toán Bakong KHQR diễn ra như thế nào?',
        zh: '柬埔寨国家银行Bakong KHQR动态二维码的生成与实时验签机制如何运作？'
      },
      a: {
        km: 'POS និង Storefront ផ្ញើសំណើបង្កើត QR ទៅកាន់ `BakongService` ក្នុងកម្រិត Sub-second តាមស្តង់ដារ EMVCo CRC-16។ នៅពេលអតិថិជនស្កេនទូទាត់លើ Mobile Banking ប្រព័ន្ធទទួល Webhook Callback ពីធនាគារ និងដំណើរការ Long-polling Fallback (រៀងរាល់ ២ វិនាទី) ដើម្បីផ្លាស់ប្តូរស្ថានភាពទៅជា `paid` ភ្លាមៗ។',
        en: 'BakongService generates an EMVCo compliant CRC-16 payload in sub-second time. When scanned, Bakong API dispatches a signed webhook callback to `/api/v1/webhooks/bakong`. Simultaneously, the frontend runs a 2-second polling fallback to verify hash settlement and trigger receipt printing.',
        th: 'BakongService สร้างรหัส QR EMVCo CRC-16 ภายในเสี้ยววินาที และตรวจสอบผ่าน Webhook และ Polling ทุก 2 วินาที',
        vi: 'BakongService tạo chuỗi EMVCo CRC-16 trong vòng dưới 1 giây và xác thực thanh toán qua Webhook kết hợp Polling.',
        zh: 'BakongService在亚秒内生成符合EMVCo标准的CRC-16动态二维码字符串。扫码支付后，系统通过加密Webhook回调并在前端配合2秒轮询机制，确认到账后自动触发热敏小票打印。'
      },
      techNote: 'POST /api/v1/payments/khqr/generate & Webhook Callback'
    },
    {
      id: 'faq-03',
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      badge: 'Dynamic QR Anti-Fraud',
      badgeKh: 'វត្តមាន Dynamic QR ការពារការក្លែងបន្លំ',
      q: {
        km: 'តើប្រព័ន្ធកត់ត្រាវត្តមានបុគ្គលិកការពារការក្លែងបន្លំ និងការផ្ញើរូបថតស្កេនជំនួសដោយរបៀបណា?',
        en: 'How does the Dynamic QR attendance kiosk prevent buddy-punching, photo sharing, and remote check-ins?',
        th: 'ระบบลงเวลาด้วย Dynamic QR ป้องกันการทุจริตและการส่งภาพถ่ายเช็คอินแทนกันอย่างไร?',
        vi: 'Hệ thống chấm công Dynamic QR ngăn chặn việc chấm công hộ và gửi ảnh chụp màn hình như thế nào?',
        zh: '动态二维码考勤系统如何通过三维校验杜绝代打卡、拍照代刷与异地打卡？'
      },
      a: {
        km: 'ប្រព័ន្ធអនុវត្តការការពារ ៣ ស្រទាប់៖ ១. Dynamic QR ប្តូរកូដសម្ងាត់រៀងរាល់ ១៥ វិនាទី (រូបថតដែលថតទុកនឹងផុតកំណត់) ២. ពិនិត្យកូដសម្គាល់ Hardware Device UUID របស់ទូរស័ព្ទបុគ្គលិក ៣. ផ្ទៀងផ្ទាត់កូអរដោនេ GPS Geofencing ក្នុងរង្វង់ ១០០ ម៉ែត្រជុំវិញសាខា។',
        en: 'Attendance verification employs 3-tier fraud protection: 1. Dynamic QR rotates every 15 seconds (shared photos expire immediately); 2. Enforces registered mobile hardware UUID matching; 3. Validates real-time device GPS coordinates within a 100-meter radius of the branch kiosk.',
        th: 'ระบบใช้การป้องกัน 3 ชั้น: QR เปลี่ยนทุก 15 วินาที, ตรวจสอบ Device UUID ของอุปกรณ์, และตรวจสอบพิกัด GPS ภายในรัศมี 100 เมตร',
        vi: 'Bảo mật 3 lớp: QR động đổi mỗi 15 giây, đối soát UUID phần cứng điện thoại, và kiểm tra định vị GPS trong bán kính 100m.',
        zh: '三维反作弊机制：1. Kiosk终端动态二维码每15秒轮换更新（拍照分享立即作废）；2. 绑定员工移动设备唯一硬件UUID；3. 强制校验手机GPS经纬度位于门店100米电子围栏内。'
      },
      techNote: '15s Rotating Token + Hardware UUID Binding + 100m GPS Radius'
    },
    {
      id: 'faq-04',
      icon: RefreshCw,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
      badge: 'Moving Average Costing',
      badgeKh: 'ការគណនាថ្លៃដើមទំនិញជាក់ស្តែង',
      q: {
        km: 'តើថ្លៃដើមទំនិញ (Cost Price / COGS) ត្រូវបានគណនាយ៉ាងដូចម្តេចនៅពេលទទួលទំនិញពីអ្នកផ្គត់ផ្គង់?',
        en: 'How is product cost price (COGS) dynamically computed when receiving purchase orders with varying prices?',
        th: 'ต้นทุนสินค้า (COGS) คำนวณแบบไดนามิกอย่างไรเมื่อรับสินค้าจากใบสั่งซื้อที่มีราคาแตกต่างกัน?',
        vi: 'Giá vốn hàng bán (COGS) được tính toán tự động như thế nào khi nhập hàng?',
        zh: '当供应商进货价格波动时，系统如何实时重新加权计算移动平均成本（Moving Average Costing）？'
      },
      a: {
        km: 'ប្រព័ន្ធប្រើប្រាស់រូបមន្ត Moving Average Costing ស្វ័យប្រវត្តិ៖ `New Cost = [(Old Qty × Old Cost) + (New Qty × New Cost)] / (Old Qty + New Qty)`។ ការគណនានេះធ្វើឡើងភ្លាមៗនៅពេលចុចទទួលទំនិញ (PO Receiving) ដើម្បីធានាថារបាយការណ៍ប្រាក់ចំណេញសុទ្ធ (Gross Profit) មានភាពត្រឹមត្រូវជានិច្ច។',
        en: 'The system uses Moving Average Costing: `New Cost = [(Current Qty × Current Cost) + (Incoming Qty × Incoming Cost)] / Total Qty`. This is executed atomically on PO goods receipt, ensuring accurate Gross Margin and COGS financial reporting.',
        th: 'ระบบใช้สูตร Moving Average Costing คำนวณต้นทุนเฉลี่ยถ่วงน้ำหนักอัตโนมัติทันทีที่รับสินค้าเข้าคลัง',
        vi: 'Hệ thống sử dụng công thức giá bình quân gia quyền di động (Moving Average Costing) tự động khi nhập kho.',
        zh: '系统严格采用移动加权平均成本法：`新成本 = [(现有库存 × 现有成本) + (入库数量 × 入库单价)] / 总库存`。在入库验收单确认瞬间原子化完成重算，保证毛利率与损益表精准。'
      },
      techNote: 'Formula: ((Qty_old * Cost_old) + (Qty_new * Cost_new)) / (Qty_old + Qty_new)'
    },
    {
      id: 'faq-05',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30',
      badge: 'Multi-Branch Scoping',
      badgeKh: 'ការញែកទិន្នន័យតាមសាខា និងឃ្លាំង',
      q: {
        km: 'តើប្រព័ន្ធធានាភាពឯកជន និងការញែកទិន្នន័យឆ្លងសាខា (Branch Scoping) យ៉ាងដូចម្តេច?',
        en: 'How does multi-branch data isolation prevent cross-tenant data leaks between store branches?',
        th: 'ระบบแยกข้อมูลระหว่างสาขา (Branch Scoping) อย่างไรเพื่อป้องกันการรั่วไหลของข้อมูล?',
        vi: 'Làm thế nào hệ thống đảm bảo cô lập dữ liệu giữa các chi nhánh (Branch Scoping)?',
        zh: '多门店多仓库架构下，系统如何在ORM查询层面实现跨门店数据的严格隔离与穿透防护？'
      },
      a: {
        km: 'ប្រព័ន្ធប្រើប្រាស់ Global Scope ក្នុង Laravel Eloquent (`BranchScope`)។ រាល់ Query ទាំងអស់ត្រូវបានចងដោយស្វ័យប្រវត្តិនូវ `WHERE branch_id = ?` យោងតាម User Profile។ បុគ្គលិកនៅសាខាទី ១ មិនអាចមើលឃើញ ឬកែប្រែទិន្នន័យលក់ ឬស្តុករបស់សាខាទី ២ បានឡើយ លើកលែងតែ Super Admin និង General Manager។',
        en: 'Laravel Eloquent Global Scopes (`BranchScope`) automatically bind `WHERE branch_id = ?` to all transactional queries based on the authenticated JWT payload. Branch A staff cannot view or alter Branch B records unless granted global scoping roles.',
        th: 'Laravel Eloquent Global Scopes บังคับใช้ `WHERE branch_id = ?` โดยอัตโนมัติสำหรับทุกคำสั่งค้นหา',
        vi: 'Laravel Eloquent Global Scopes tự động gán điều kiện `WHERE branch_id = ?` cho mọi truy vấn theo token của người dùng.',
        zh: '系统在Laravel Eloquent层注册了全局查询作用域（Global Scope）。所有业务模型在检索时自动注入`WHERE branch_id = ?`，除总部管理员外，单店员工在SQL底层完全无法跨店越权访问。'
      },
      techNote: 'Eloquent Global Scope: Builder::where("branch_id", auth()->user()->branch_id)'
    },
    {
      id: 'faq-06',
      icon: Zap,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
      badge: 'Offline-First Mobile Sync',
      badgeKh: 'ប្រតិបត្តិការ Mobile ពេលដាច់ Internet',
      q: {
        km: 'តើកម្មវិធីទូរស័ព្ទ Flutter POS ដំណើរការយ៉ាងដូចម្តេចនៅពេលដាច់បណ្តាញ Internet?',
        en: 'How does the Flutter Mobile POS maintain offline-first operations and reconcile transactions upon reconnecting?',
        th: 'แอปพลิเคชัน Flutter Mobile POS ทำงานอย่างไรเมื่อไม่มีการเชื่อมต่ออินเทอร์เน็ต?',
        vi: 'Ứng dụng Flutter Mobile POS hoạt động như thế nào khi mất kết nối mạng (Offline-First)?',
        zh: 'Flutter移动端在网络中断或弱网环境下如何实现离线开单与重新联网后的幂等同步？'
      },
      a: {
        km: 'Flutter ប្រើប្រាស់ Hive NoSQL Local Database សម្រាប់ផ្ទុកទិន្នន័យកាតាឡុកទំនិញ តម្លៃ និងវិក្កយបត្រដែលបានលក់ក្រៅបណ្តាញ។ នៅពេលភ្ជាប់ Internet ឡើងវិញ Dio HTTP Client នឹងបញ្ជូនកញ្ចប់ទិន្នន័យតាម Queue ទៅកាន់ API ជាមួយ UUID Idempotency Key ដើម្បីការពារការកត់ត្រាជាន់គ្នា។',
        en: 'Flutter utilizes Hive NoSQL storage to cache products, price lists, and offline sales tickets. Once connectivity is restored, Dio dispatches the offline queue to `/api/v1/pos/sync` using UUID Idempotency Keys to prevent duplicate processing.',
        th: 'Flutter ใช้ Hive NoSQL เก็บข้อมูลออฟไลน์ และซิงค์ข้อมูลผ่าน UUID Idempotency Key เมื่อกลับมาออนไลน์',
        vi: 'Flutter sử dụng cơ sở dữ liệu Hive NoSQL để lưu trữ cục bộ và đồng bộ an toàn qua khóa Idempotency UUID.',
        zh: 'Flutter端内置Hive NoSQL高速本地引擎，离线状态下可正常扫码与本地出单。网络恢复后，后台后台同步队列携带UUID幂等凭证提交至`/api/v1/pos/sync`，杜绝重复入账。'
      },
      techNote: 'Hive NoSQL Box -> Sync Queue -> POST /api/v1/pos/sync with Idempotency UUID'
    }
  ];

  return (
    <section id="architectural-highlights" className="mb-14 space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Architectural Invariants & Problem-Solving</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {language === 'km' ? 'ចំណុចសំខាន់ៗនៃដំណោះស្រាយបច្ចេកទេស (Core Architecture FAQs)' : 'Core Architectural Q&A & Technical Invariants'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
              {language === 'km'
                ? 'ដំណោះស្រាយចំពោះសំណួរបច្ចេកទេសស្នូលទាំង ៦ ដែលកំណត់គុណភាពនៃប្រព័ន្ធសហគ្រាស'
                : 'Direct architectural answers explaining concurrency, payments, attendance fraud protection, and data isolation.'}
            </p>
          </div>

          <Link
            to="/faq"
            className="px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all shrink-0"
          >
            <span>{language === 'km' ? 'មើលសំណួរទាំង ៥២ (View all 52 FAQs)' : 'Explore 52 FAQs'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 High-Impact Questions Accordion */}
        <div className="space-y-3">
          {topQuestions.map((item) => {
            const isOpen = openFaqId === item.id;
            const Icon = item.icon;
            const qText = item.q[language] || item.q.en;
            const aText = item.a[language] || item.a.en;
            const badgeText = language === 'km' ? item.badgeKh : item.badge;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-brand-500/50 bg-white dark:bg-slate-900/90 shadow-sm ring-1 ring-brand-500/10'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                  className="w-full flex items-start justify-between p-4 sm:p-5 text-left transition-colors gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${item.color}`}>
                        {badgeText}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {qText}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? 'rotate-180 text-brand-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <p className="font-normal">{aText}</p>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-brand-700 dark:text-brand-300 flex items-center gap-2 overflow-x-auto">
                      <Code2 className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                      <span>{item.techNote}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
