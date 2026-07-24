import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Inventory & Warehouses'),
      drawer: const EnterpriseDrawer(),
      body: Column(
        children: [
          TabBar(
            controller: _tabController,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondaryLight,
            indicatorColor: AppColors.primary,
            tabs: const [
              Tab(text: 'Warehouses'),
              Tab(text: 'Transfers'),
              Tab(text: 'Adjustments'),
              Tab(text: 'Opname/Counts'),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildWarehouseTab(),
                _buildTransfersTab(),
                _buildAdjustmentsTab(),
                _buildOpnameTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWarehouseTab() {
    final warehouses = [
      {'name': 'Phnom Penh Main Warehouse', 'code': 'WH-PP-01', 'total_items': 14200, 'value': '\$480,500.00'},
      {'name': 'Siem Reap Regional Hub', 'code': 'WH-SR-02', 'total_items': 4500, 'value': '\$125,000.00'},
      {'name': 'Battambang Store Depot', 'code': 'WH-BB-03', 'total_items': 2100, 'value': '\$64,200.00'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: warehouses.length,
      itemBuilder: (context, index) {
        final wh = warehouses[index];
        return EnterpriseCard(
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.warehouse, color: AppColors.primary),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(wh['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Text('Code: ${wh['code']} • Items: ${wh['total_items']}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ),
              Text(wh['value'] as String, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.success)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTransfersTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        EnterpriseCard(
          child: const Row(
            children: [
              Icon(Icons.swap_horiz, color: AppColors.accent, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('TRF-2026-0042', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Main WH ➔ Siem Reap Hub • 50 Items', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ),
              Chip(label: Text('IN TRANSIT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.warning))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAdjustmentsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        EnterpriseCard(
          child: const Row(
            children: [
              Icon(Icons.tune, color: AppColors.warning, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('ADJ-2026-0018 (Damaged Stock)', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('iPhone 15 Pro Max (-2 units) • Reason: Broken Box', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ),
              Chip(label: Text('APPROVED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.success))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOpnameTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        EnterpriseCard(
          child: const Row(
            children: [
              Icon(Icons.checklist, color: AppColors.primary, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('OPN-2026-Q2 Stock Audit', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Auditor: John Doe • 1,240 items verified', style: TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
                  ],
                ),
              ),
              Chip(label: Text('COMPLETED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.success))),
            ],
          ),
        ),
      ],
    );
  }
}
