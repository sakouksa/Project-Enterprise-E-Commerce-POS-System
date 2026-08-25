<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company\Company;
use App\Models\Company\Branch;
use App\Models\Company\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\Unit;
use App\Models\Inventory\Inventory;
use App\Models\Customer\Customer;
use App\Application\Sales\CreateSaleAction;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PosSaleFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_execute_sale_action_and_reduce_inventory(): void
    {
        $company = Company::create([
            'name'  => 'Enterprise POS Corp',
            'code'  => 'EPC',
            'slug'  => 'enterprise-pos-corp',
            'email' => 'pos@enterprise.com',
        ]);

        $branch = Branch::create([
            'company_id' => $company->id,
            'name'       => 'Main Branch',
            'code'       => 'MB01',
        ]);

        $warehouse = Warehouse::create([
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
            'name'       => 'Central Warehouse',
            'code'       => 'WH01',
        ]);

        $unit = Unit::create([
            'company_id' => $company->id,
            'name'       => 'Piece',
            'symbol'     => 'pcs',
        ]);

        $product = Product::create([
            'company_id'     => $company->id,
            'unit_id'        => $unit->id,
            'name'           => 'Wireless Gaming Mouse',
            'slug'           => 'wireless-gaming-mouse',
            'sku'            => 'WGM-001',
            'selling_price'  => 50.00,
            'stock_quantity' => 100,
            'is_active'      => true,
        ]);

        $user = User::create([
            'name'       => 'Cashier User',
            'email'      => 'cashier@enterprise.com',
            'password'   => bcrypt('password'),
            'company_id' => $company->id,
            'branch_id'  => $branch->id,
        ]);

        $customer = Customer::create([
            'company_id' => $company->id,
            'name'       => 'Retail Walk-in',
            'email'      => 'walkin@customer.com',
            'is_active'  => true,
        ]);

        $inventory = Inventory::create([
            'company_id'         => $company->id,
            'warehouse_id'       => $warehouse->id,
            'product_id'         => $product->id,
            'product_variant_id' => null,
            'quantity'           => 100,
            'reserved_quantity'  => 0,
        ]);

        $action = app(CreateSaleAction::class);
        $sale = $action->execute([
            'company_id'   => $company->id,
            'branch_id'    => $branch->id,
            'warehouse_id' => $warehouse->id,
            'customer_id'  => $customer->id,
            'user_id'      => $user->id,
            'cashier_id'   => $user->id,
            'items'        => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 5,
                    'unit_price' => 50.00,
                    'discount'   => 0,
                    'tax'        => 0,
                ],
            ],
            'payment_status' => 'paid',
            'payments'     => [
                [
                    'payment_method' => 'cash',
                    'amount'         => 250.00,
                ],
            ],
        ]);

        $this->assertNotNull($sale);
        $this->assertEquals(250.00, (float) $sale->grand_total);
        $this->assertEquals('completed', $sale->status);

        // Check stock reduced in warehouse inventory
        $inventory->refresh();
        $this->assertEquals(95, (int) $inventory->quantity);

        // Verify inventory movement record exists
        $this->assertDatabaseHas('inventory_movements', [
            'product_id'   => $product->id,
            'warehouse_id' => $warehouse->id,
            'type'         => 'out',
            'quantity'     => 5,
        ]);
    }
}
