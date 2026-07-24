import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';
import '../../../core/widgets/chart_widgets.dart';

class ReportsHubScreen extends StatelessWidget {
  const ReportsHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Enterprise Analytics & Reports'),
      drawer: const EnterpriseDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Export Toolbar
            EnterpriseCard(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  const Icon(Icons.analytics, color: AppColors.primary),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text('Generate & Export Audit Reports', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.picture_as_pdf, size: 16, color: AppColors.danger),
                    label: const Text('PDF', style: TextStyle(fontSize: 12)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                    onPressed: () {},
                    icon: const Icon(Icons.table_view, size: 16),
                    label: const Text('EXCEL', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Analytics Charts
            const SalesAreaChartWidget(weeklySalesData: [4500, 7200, 6800, 9400, 11200, 10800, 14500]),
            const SizedBox(height: 16),
            const PurchaseBarChartWidget(purchaseTrendData: [2100, 3400, 2900, 4800, 5100, 4200, 6300]),
            const SizedBox(height: 24),

            // Report Modules Grid
            const Text('Detailed Module Reports', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildReportTile(context, 'Sales & Revenue Report', 'Breakdown by POS terminal, cashier, payment method', Icons.receipt_long),
            _buildReportTile(context, 'Purchase & PO Report', 'Supplier purchases, outstanding payables, receiving status', Icons.local_shipping),
            _buildReportTile(context, 'Inventory & Valuation Report', 'Stock turnover, low stock warnings, lot expiration', Icons.inventory_2),
            _buildReportTile(context, 'Expense & P&L Statement', 'Operating costs, net margins, category breakdown', Icons.account_balance),
            _buildReportTile(context, 'HR & Attendance Report', 'Employee hours, overtime calculation, late minutes', Icons.badge),
          ],
        ),
      ),
    );
  }

  Widget _buildReportTile(BuildContext context, String title, String subtitle, IconData icon) {
    return EnterpriseCard(
      onTap: () {},
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.textSecondaryLight),
        ],
      ),
    );
  }
}
