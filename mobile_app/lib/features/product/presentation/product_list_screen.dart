import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/network/dio_client.dart';

final dioClientProvider = Provider<DioClient>((ref) => DioClient());

final productsFutureProvider = FutureProvider<List<dynamic>>((ref) async {
  final client = ref.watch(dioClientProvider);
  try {
    final response = await client.dio.get('/products');
    return response.data['data'] ?? [];
  } catch (e) {
    return [];
  }
});

class ProductListScreen extends ConsumerWidget {
  const ProductListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsFutureProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Catalog'),
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              Navigator.pushNamed(context, '/cart');
            },
          ),
        ],
      ),
      body: productsAsync.when(
        data: (products) => products.isEmpty
            ? const Center(child: Text('No products available'))
            : ListView.builder(
                padding: const EdgeInsets.all(8),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final p = products[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    child: ListTile(
                      leading: const CircleAvatar(child: Icon(Icons.image)),
                      title: Text(p['name'] ?? 'Product'),
                      subtitle: Text(p['sku'] ?? 'SKU'),
                      trailing: Text(
                        'Rp ${p['selling_price']?.toString() ?? '0'}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      onTap: () {
                        // Add to cart placeholder action
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Added ${p['name']} to cart')),
                        );
                      },
                    ),
                  );
                },
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => const Center(child: Text('Failed to load products')),
      ),
    );
  }
}
