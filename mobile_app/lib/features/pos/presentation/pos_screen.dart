import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';

// POS Cart Item Model
class PosCartItem {
  final String id;
  final String name;
  final double price;
  int quantity;
  double discount;

  PosCartItem({
    required this.id,
    required this.name,
    required this.price,
    this.quantity = 1,
    this.discount = 0.0,
  });

  double get itemSubtotal => (price - discount) * quantity;
}

final posCartProvider = StateNotifierProvider<PosCartNotifier, List<PosCartItem>>((ref) {
  return PosCartNotifier();
});

class PosCartNotifier extends StateNotifier<List<PosCartItem>> {
  PosCartNotifier() : super([]);

  void addItem(String id, String name, double price) {
    final index = state.indexWhere((item) => item.id == id);
    if (index >= 0) {
      state[index].quantity += 1;
      state = [...state];
    } else {
      state = [...state, PosCartItem(id: id, name: name, price: price)];
    }
  }

  void updateQuantity(String id, int delta) {
    state = state.map((item) {
      if (item.id == id) {
        final newQty = item.quantity + delta;
        if (newQty > 0) item.quantity = newQty;
      }
      return item;
    }).toList();
  }

  void removeItem(String id) {
    state = state.where((item) => item.id != id).toList();
  }

  void clearCart() {
    state = [];
  }
}

class POSScreen extends ConsumerStatefulWidget {
  const POSScreen({super.key});

  @override
  ConsumerState<POSScreen> createState() => _POSScreenState();
}

class _POSScreenState extends ConsumerState<POSScreen> {
  final TextEditingController _searchController = TextEditingController();
  final List<Map<String, dynamic>> _catalogProducts = [
    {'id': 'P001', 'name': 'MacBook Pro M3 Max', 'price': 2499.00, 'stock': 12, 'code': '88012345'},
    {'id': 'P002', 'name': 'iPhone 15 Pro Max 256GB', 'price': 1199.00, 'stock': 25, 'code': '88012346'},
    {'id': 'P003', 'name': 'iPad Pro 12.9 M2', 'price': 1099.00, 'stock': 8, 'code': '88012347'},
    {'id': 'P004', 'name': 'AirPods Pro Gen 2', 'price': 249.00, 'stock': 50, 'code': '88012348'},
    {'id': 'P005', 'name': 'Dell XPS 15 OLED', 'price': 1899.00, 'stock': 15, 'code': '88012349'},
    {'id': 'P006', 'name': 'Samsung Galaxy S24 Ultra', 'price': 1299.00, 'stock': 30, 'code': '88012350'},
  ];

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(posCartProvider);
    final subtotal = cart.fold<double>(0.0, (sum, item) => sum + item.itemSubtotal);
    final tax = subtotal * 0.10; // 10% VAT
    final grandTotal = subtotal + tax;

    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'POS Sales Terminal'),
      drawer: const EnterpriseDrawer(),
      body: Row(
        children: [
          // Catalog & Search Section
          Expanded(
            flex: 6,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          decoration: InputDecoration(
                            hintText: 'Search product or barcode...',
                            prefixIcon: const Icon(Icons.search),
                            suffixIcon: IconButton(
                              icon: const Icon(Icons.qr_code_scanner, color: AppColors.primary),
                              onPressed: () => _openScannerModal(context),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 0.95,
                      ),
                      itemCount: _catalogProducts.length,
                      itemBuilder: (context, index) {
                        final product = _catalogProducts[index];
                        return EnterpriseCard(
                          onTap: () {
                            ref.read(posCartProvider.notifier).addItem(
                                  product['id'],
                                  product['name'],
                                  (product['price'] as num).toDouble(),
                                );
                          },
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 70,
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.08),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Center(
                                  child: Icon(Icons.shopping_bag_outlined, size: 36, color: AppColors.primary),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                product['name'],
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              const Spacer(),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '\$${(product['price'] as num).toStringAsFixed(2)}',
                                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 15),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: AppColors.primary,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.add, color: Colors.white, size: 16),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Cart & Checkout Section
          Expanded(
            flex: 4,
            child: Container(
              color: Theme.of(context).cardColor,
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Cart (${cart.length})', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      if (cart.isNotEmpty)
                        TextButton(
                          onPressed: () => ref.read(posCartProvider.notifier).clearCart(),
                          child: const Text('Clear', style: TextStyle(color: AppColors.danger)),
                        ),
                    ],
                  ),
                  const Divider(),
                  Expanded(
                    child: cart.isEmpty
                        ? const Center(child: Text('Cart is empty', style: TextStyle(color: AppColors.textSecondaryLight)))
                        : ListView.builder(
                            itemCount: cart.length,
                            itemBuilder: (context, index) {
                              final item = cart[index];
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 8.0),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                          Text('\$${item.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                                        ],
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.remove_circle_outline, size: 20),
                                          onPressed: () => ref.read(posCartProvider.notifier).updateQuantity(item.id, -1),
                                        ),
                                        Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                        IconButton(
                                          icon: const Icon(Icons.add_circle_outline, size: 20),
                                          onPressed: () => ref.read(posCartProvider.notifier).updateQuantity(item.id, 1),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Subtotal:'),
                      Text('\$${subtotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('VAT (10%):'),
                      Text('\$${tax.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Grand Total:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('\$${grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                      onPressed: cart.isEmpty ? null : () => _showPaymentModal(context, grandTotal),
                      icon: const Icon(Icons.payment),
                      label: const Text('CHECKOUT NOW', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _openScannerModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        height: 300,
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(Icons.qr_code_scanner, size: 64, color: AppColors.primary),
            const SizedBox(height: 16),
            const Text('Camera Barcode & QR Scanner', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Point camera at item barcode to automatically add to checkout cart.'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Simulate scan match
                ref.read(posCartProvider.notifier).addItem('P001', 'MacBook Pro M3 Max', 2499.00);
                Navigator.pop(context);
              },
              child: const Text('SIMULATE BARCODE SCAN MATCH'),
            ),
          ],
        ),
      ),
    );
  }

  void _showPaymentModal(BuildContext context, double totalAmount) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          height: 550,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select Payment Method', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Total Payable: \$${totalAmount.toStringAsFixed(2)}', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 20),

              // KHQR Bakong Code Container
              Center(
                child: Column(
                  children: [
                    QrImageView(
                      data: '00020101021238580016A000000770001111011300000000010025303840540${totalAmount.toStringAsFixed(2)}5802KH5912ENTERPRISE6010PHNOM PENH620707030106304',
                      version: QrVersions.auto,
                      size: 180.0,
                    ),
                    const SizedBox(height: 8),
                    const Text('Scan KHQR (Bakong / ABA / Wing / ACLEDA)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              ),
              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ref.read(posCartProvider.notifier).clearCart();
                        Navigator.pop(context);
                        _showReceiptModal(context, totalAmount, 'CASH');
                      },
                      icon: const Icon(Icons.money),
                      label: const Text('CASH TENDER'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                      onPressed: () {
                        ref.read(posCartProvider.notifier).clearCart();
                        Navigator.pop(context);
                        _showReceiptModal(context, totalAmount, 'KHQR');
                      },
                      icon: const Icon(Icons.qr_code),
                      label: const Text('CONFIRM KHQR'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showReceiptModal(BuildContext context, double amount, String method) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: AppColors.success, size: 64),
            const SizedBox(height: 12),
            const Text('Payment Successful!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('Amount Paid: \$${amount.toStringAsFixed(2)} ($method)', style: const TextStyle(color: AppColors.textSecondaryLight)),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.share),
                    label: const Text('SHARE'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.print),
                    label: const Text('PRINT RECEIPT'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
