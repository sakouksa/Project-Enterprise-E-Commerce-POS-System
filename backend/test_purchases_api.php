<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Purchase\Purchase;
use App\Models\Purchase\PurchaseItem;

echo "=== TESTING PURCHASES BACKEND API & CONTROLLER ===\n";

$purchaseCount = Purchase::count();
echo "Total Purchase Records: {$purchaseCount}\n";

$latest = Purchase::with(['supplier', 'warehouse', 'branch', 'items.product'])->latest()->first();
if ($latest) {
    echo "Latest Purchase ID: {$latest->id}\n";
    echo "Ref Number: {$latest->reference_number}\n";
    echo "Status: {$latest->status}\n";
    echo "Subtotal: {$latest->subtotal}\n";
    echo "Grand Total: {$latest->grand_total}\n";
    echo "Items Count: " . count($latest->items) . "\n";
    foreach ($latest->items as $it) {
        echo " - Item: {$it->product_name} | Qty: {$it->quantity} | Unit Cost: {$it->unit_cost} | Total: {$it->total}\n";
    }
} else {
    echo "No purchase orders found!\n";
}

echo "\nChecking null columns or broken relations in purchases...\n";
$brokenSuppliers = Purchase::whereNull('supplier_id')->count();
$brokenWarehouses = Purchase::whereNull('warehouse_id')->count();
echo " - Purchases with null supplier_id: {$brokenSuppliers}\n";
echo " - Purchases with null warehouse_id: {$brokenWarehouses}\n";
