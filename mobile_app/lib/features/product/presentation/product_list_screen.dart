import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';

class ProductListScreen extends ConsumerStatefulWidget {
  const ProductListScreen({super.key});

  @override
  ConsumerState<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends ConsumerState<ProductListScreen> {
  bool _isGridView = true;
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _products = [
    {
      'id': '1',
      'name': 'MacBook Pro 16" M3 Max',
      'category': 'Laptops',
      'brand': 'Apple',
      'sku': 'APP-MBP16-M3',
      'price': 3499.00,
      'stock': 14,
      'status': 'In Stock',
    },
    {
      'id': '2',
      'name': 'iPhone 15 Pro Max 512GB',
      'category': 'Smartphones',
      'brand': 'Apple',
      'sku': 'APP-IP15PM-512',
      'price': 1399.00,
      'stock': 8,
      'status': 'Low Stock',
    },
    {
      'id': '3',
      'name': 'Samsung Galaxy S24 Ultra',
      'category': 'Smartphones',
      'brand': 'Samsung',
      'sku': 'SAM-S24U-256',
      'price': 1299.00,
      'stock': 22,
      'status': 'In Stock',
    },
    {
      'id': '4',
      'name': 'Sony WH-1000XM5 Headphones',
      'category': 'Audio',
      'brand': 'Sony',
      'sku': 'SNY-WH1000XM5',
      'price': 399.00,
      'stock': 0,
      'status': 'Out of Stock',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Products & Catalog'),
      drawer: const EnterpriseDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Search & Filter Header Bar
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: const InputDecoration(
                      hintText: 'Search by Product Name, SKU, IMEI, Barcode...',
                      prefixIcon: Icon(Icons.search),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: Icon(_isGridView ? Icons.table_chart : Icons.grid_view, color: AppColors.primary),
                  onPressed: () => setState(() => _isGridView = !_isGridView),
                ),
                IconButton(
                  icon: const Icon(Icons.filter_list, color: AppColors.primary),
                  onPressed: () => _showFilterSheet(context),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Products Grid / Table
            Expanded(
              child: _isGridView ? _buildGrid() : _buildTable(),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('ADD PRODUCT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildGrid() {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.85,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        final p = _products[index];
        final isLow = p['status'] == 'Low Stock';
        final isOut = p['status'] == 'Out of Stock';

        return EnterpriseCard(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(child: Icon(Icons.inventory_2, size: 40, color: AppColors.primary)),
              ),
              const SizedBox(height: 8),
              Text(p['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
              Text('${p['category']} • ${p['brand']}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondaryLight)),
              const Spacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('\$${(p['price'] as num).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: isOut
                          ? AppColors.danger.withOpacity(0.12)
                          : isLow
                              ? AppColors.warning.withOpacity(0.12)
                              : AppColors.success.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Qty: ${p['stock']}',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isOut
                            ? AppColors.danger
                            : isLow
                                ? AppColors.warning
                                : AppColors.success,
                      ),
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

  Widget _buildTable() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columns: const [
          DataColumn(label: Text('Product Name')),
          DataColumn(label: Text('Category')),
          DataColumn(label: Text('SKU')),
          DataColumn(label: Text('Price')),
          DataColumn(label: Text('Stock')),
          DataColumn(label: Text('Status')),
        ],
        rows: _products.map((p) {
          return DataRow(cells: [
            DataCell(Text(p['name'], style: const TextStyle(fontWeight: FontWeight.bold))),
            DataCell(Text(p['category'])),
            DataCell(Text(p['sku'])),
            DataCell(Text('\$${(p['price'] as num).toStringAsFixed(2)}')),
            DataCell(Text('${p['stock']}')),
            DataCell(Text(p['status'])),
          ]);
        }).toList(),
      ),
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Filter Catalog', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            const Text('Category:', style: TextStyle(fontWeight: FontWeight.bold)),
            Wrap(
              spacing: 8,
              children: ['All', 'Laptops', 'Smartphones', 'Audio'].map((c) => Chip(label: Text(c))).toList(),
            ),
            const SizedBox(height: 16),
            const Text('Stock Status:', style: TextStyle(fontWeight: FontWeight.bold)),
            Wrap(
              spacing: 8,
              children: ['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((s) => Chip(label: Text(s))).toList(),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('APPLY FILTERS'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
