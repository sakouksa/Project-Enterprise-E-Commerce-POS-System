import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';

class SalesListScreen extends StatelessWidget {
  const SalesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final sales = [
      {'invoice': 'INV-2026-9081', 'customer': 'John Smith (VIP)', 'amount': '\$3,898.00', 'status': 'COMPLETED', 'type': 'POS Cash'},
      {'invoice': 'INV-2026-9082', 'customer': 'Sokha Retail Co.', 'amount': '\$1,299.00', 'status': 'COMPLETED', 'type': 'KHQR Bakong'},
      {'invoice': 'INV-2026-9083', 'customer': 'Walk-in Customer', 'amount': '\$249.00', 'status': 'RETURN REQUEST', 'type': 'Credit Card'},
    ];

    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Sales Orders & Invoices'),
      drawer: const EnterpriseDrawer(),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: sales.length,
        itemBuilder: (context, index) {
          final s = sales[index];
          final isReturn = s['status'] == 'RETURN REQUEST';

          return EnterpriseCard(
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: const Icon(Icons.receipt_long, color: AppColors.primary),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s['invoice']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text('${s['customer']} • ${s['type']}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(s['amount']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.success)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isReturn ? AppColors.danger.withOpacity(0.15) : AppColors.success.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        s['status']!,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isReturn ? AppColors.danger : AppColors.success,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
