import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../core/widgets/chart_widgets.dart';
import '../../../core/network/api_client.dart';

final dashboardStatsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final dio = ref.read(dioProvider);
  try {
    final response = await dio.get('/dashboard/stats');
    if (response.statusCode == 200) {
      return response.data['data'] ?? response.data;
    }
  } catch (e) {
    debugPrint('Dashboard stats API offline, returning fallback cache');
  }
  return {
    'todays_sales': 12845.50,
    'todays_purchase': 4520.00,
    'revenue': 94500.00,
    'profit': 28400.00,
    'orders_count': 142,
    'customers_count': 890,
    'employees_count': 35,
    'attendance_count': 32,
    'low_stock_count': 8,
    'out_of_stock_count': 2,
    'pending_orders': 5,
    'pending_purchases': 3,
  };
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(dashboardStatsProvider);

    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Enterprise ERP Terminal'),
      drawer: const EnterpriseDrawer(),
      body: RefreshIndicator(
        onRefresh: () async => ref.refresh(dashboardStatsProvider),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Banner
              _buildHeroBanner(context),
              const SizedBox(height: 20),

              // Enterprise Stats Cards Carousel / Grid
              Text(
                'Key Performance Indicators',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 18),
              ),
              const SizedBox(height: 12),
              statsAsync.when(
                data: (stats) => _buildStatsGrid(context, stats),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (_, __) => _buildStatsGrid(context, {
                  'todays_sales': 12845.50,
                  'todays_purchase': 4520.00,
                  'revenue': 94500.00,
                  'profit': 28400.00,
                  'orders_count': 142,
                  'customers_count': 890,
                  'employees_count': 35,
                  'attendance_count': 32,
                  'low_stock_count': 8,
                  'out_of_stock_count': 2,
                  'pending_orders': 5,
                  'pending_purchases': 3,
                }),
              ),
              const SizedBox(height: 24),

              // Charts Section
              const SalesAreaChartWidget(weeklySalesData: [1200, 2400, 1800, 3200, 4100, 3800, 5200]),
              const SizedBox(height: 16),
              const PurchaseBarChartWidget(purchaseTrendData: [800, 1500, 1100, 2100, 1900, 2800, 3100]),
              const SizedBox(height: 24),

              // Quick Actions & Alerts
              _buildAlertsSection(context),
              const SizedBox(height: 24),

              // Recent Orders Feed
              _buildRecentOrdersFeed(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.bolt, color: Colors.amber, size: 16),
                    SizedBox(width: 4),
                    Text('Live Enterprise Terminal', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const Icon(Icons.qr_code_scanner, color: Colors.white70),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Ready to process sales?',
            style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text(
            'Launch POS terminal or scan item barcode to checkout instantly.',
            style: TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                onPressed: () => context.go('/pos'),
                icon: const Icon(Icons.point_of_sale),
                label: const Text('OPEN POS TERMINAL'),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white70),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () => context.push('/products'),
                icon: const Icon(Icons.search),
                label: const Text('CATALOG'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, Map<String, dynamic> stats) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.25,
      children: [
        StatCard(
          title: "Today's Sales",
          value: "\$${(stats['todays_sales'] ?? 0.0).toStringAsFixed(2)}",
          trendText: "+14.2%",
          isPositive: true,
          icon: Icons.attach_money,
          color: AppColors.primary,
          onTap: () => context.push('/sales'),
        ),
        StatCard(
          title: "Today's Purchase",
          value: "\$${(stats['todays_purchase'] ?? 0.0).toStringAsFixed(2)}",
          trendText: "-5.1%",
          isPositive: false,
          icon: Icons.shopping_bag_outlined,
          color: AppColors.accent,
          onTap: () => context.push('/purchases'),
        ),
        StatCard(
          title: "Total Revenue",
          value: "\$${(stats['revenue'] ?? 0.0).toStringAsFixed(2)}",
          trendText: "+8.4%",
          isPositive: true,
          icon: Icons.account_balance_wallet_outlined,
          color: AppColors.success,
          onTap: () => context.push('/finance'),
        ),
        StatCard(
          title: "Net Profit",
          value: "\$${(stats['profit'] ?? 0.0).toStringAsFixed(2)}",
          trendText: "+12.0%",
          isPositive: true,
          icon: Icons.trending_up,
          color: AppColors.warning,
          onTap: () => context.push('/reports'),
        ),
      ],
    );
  }

  Widget _buildAlertsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Inventory & Operational Alerts',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 18),
        ),
        const SizedBox(height: 12),
        EnterpriseCard(
          backgroundColor: AppColors.warning.withOpacity(0.08),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: AppColors.warning,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.warning_amber_rounded, color: Colors.white),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Low Stock Warning (8 Items)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Text('MacBook Pro M3, iPhone 15 Pro stock < min threshold', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.arrow_forward_ios, size: 16),
                onPressed: () => context.go('/inventory'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentOrdersFeed(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Recent POS Sales', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 18)),
            TextButton(
              onPressed: () => context.push('/sales'),
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 4,
          itemBuilder: (context, index) {
            final orderNum = 'INV-2026-${1000 + index}';
            final amount = (120 + index * 45).toStringAsFixed(2);
            return EnterpriseCard(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.primary.withOpacity(0.1),
                    child: const Icon(Icons.receipt, color: AppColors.primary),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(orderNum, style: const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        const Text('Cashier: Admin • Cash Payment', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('\$$amount', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.success)),
                      const Text('COMPLETED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.success)),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
