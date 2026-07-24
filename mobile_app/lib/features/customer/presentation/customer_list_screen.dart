import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';

class CustomerListScreen extends StatelessWidget {
  const CustomerListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final customers = [
      {'name': 'John Smith', 'group': 'VIP Customer', 'phone': '+855 12 345 678', 'points': 1420, 'credit': '\$5,000.00'},
      {'name': 'Sokha Enterprise', 'group': 'Wholesale Group', 'phone': '+855 98 765 432', 'points': 8900, 'credit': '\$25,000.00'},
      {'name': 'David Miller', 'group': 'Retail Regular', 'phone': '+855 77 112 233', 'points': 150, 'credit': '\$500.00'},
    ];

    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Customers & CRM'),
      drawer: const EnterpriseDrawer(),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: customers.length,
        itemBuilder: (context, index) {
          final c = customers[index];
          return EnterpriseCard(
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Text((c['name'] as String)[0], style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(c['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text('${c['group']} • ${c['phone']}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(12)),
                      child: Text('${c['points']} PTS', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ),
                    const SizedBox(height: 4),
                    Text('Limit: ${c['credit']}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.person_add, color: Colors.white),
        label: const Text('ADD CUSTOMER', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
