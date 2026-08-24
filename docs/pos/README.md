# 🛒 OptaPOS Point of Sale (POS) Subsystem

Welcome to the technical manual for the **OptaPOS High-Speed Retail POS Engine**.

---

## 📌 POS Overview & Architecture

The POS engine is engineered for high-volume supermarket, retail electronics, and boutique checkout environments. It operates across both the **React 19 Admin Web POS** and the **Flutter 3.24 Mobile POS** connected to Laravel 12 backend services.

```
+---------------------------------------------------------------------------------------------------------------+
|                                            POS TRANSACTION LIFECYCLE                                          |
+---------------------------------------------------------------------------------------------------------------+
| 1. Open Shift ➜ 2. Scan Barcode ➜ 3. Apply Discount/Tax ➜ 4. Lock Stock ➜ 5. Pay (KHQR/Cash) ➜ 6. Receipt     |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 🗂️ POS Documentation Index

| Document | Topic & Focus | Key Components Involved |
|---|---|---|
| [POS Overview](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/pos-overview.md) | Architectural overview, touch layout, state | `POSPage.tsx`, `pos_controller.dart` |
| [Shift Management](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/open-close-shift.md) | Opening float, cash drawer reconciliation, shift close | `POSShiftController.php`, `pos_registers` |
| [Bakong KHQR Payments](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/bakong-khqr-payments.md) | EMVCo QR generation, WebSocket payment callback | `BakongService.php`, `payments` |
| [Atomic Row Locking](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/atomic-row-locking.md) | Concurrency protection, `lockForUpdate()`, FIFO | `POSService.php`, `inventories` |
| [Split Payments & Refunds](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/split-payments-and-refunds.md) | Multi-tender checkout, partial return handling | `SaleReturnService.php`, `sale_returns` |
| [Receipt Printing](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/receipt-printing.md) | ESC/POS 80mm/58mm thermal printing & PDF receipts | `ReceiptController.php`, `sales` |

---

## ⚡ POS Concurrency & Stock Flow

When a cashier clicks **"Complete Sale"**:
1. Frontend sends payload `POST /api/v1/pos/checkout`.
2. Backend starts `DB::beginTransaction()`.
3. Backend locks the target warehouse inventory records:
   ```php
   $inventory = Inventory::where('warehouse_id', $warehouseId)
       ->where('product_variant_id', $variantId)
       ->lockForUpdate()
       ->firstOrFail();
   ```
4. If stock is insufficient, throws `422 Unprocessable Entity ("Insufficient stock")` and rolls back transaction.
5. Deducts stock quantity and inserts audit log in `inventory_movements`.
6. Creates `sales`, `sale_items`, and `payments` records.
7. Commits database transaction.
8. Triggers `SaleCompletedEvent` for real-time WebSocket notification and dashboard updates.

---
*Related Docs:*
- [Sales Business Domain](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/business-domains/sales/README.md)
- [Database Schema Reference](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/database/README.md)
