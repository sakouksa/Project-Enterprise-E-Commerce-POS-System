import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';
import '../../../core/localization/app_localization.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocale = ref.watch(localeProvider);

    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'Terminal System Settings'),
      drawer: const EnterpriseDrawer(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Appearance & Theme
          EnterpriseCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Appearance & Theme', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                ListTile(
                  leading: const Icon(Icons.palette_outlined, color: AppColors.primary),
                  title: const Text('Theme Mode'),
                  subtitle: const Text('System Dynamic / Dark Mode / Light Mode'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Localization & Currency
          EnterpriseCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Localization & Currency', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                ListTile(
                  leading: const Icon(Icons.language, color: AppColors.primary),
                  title: const Text('Application Language'),
                  subtitle: Text('Active: ${currentLocale.languageCode.toUpperCase()} (English / Khmer / Thai / Vietnamese / Chinese)'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () => _showLanguageSelector(context, ref),
                ),
                ListTile(
                  leading: const Icon(Icons.monetization_on_outlined, color: AppColors.primary),
                  title: const Text('Base Currency'),
                  subtitle: const Text('USD (\$) / KHR (៛) Dual Currency Support'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Hardware & Printers
          EnterpriseCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Hardware & Accessories', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                ListTile(
                  leading: const Icon(Icons.print_outlined, color: AppColors.primary),
                  title: const Text('POS Thermal Printer'),
                  subtitle: const Text('Bluetooth / Network Printer Setup (58mm / 80mm)'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(Icons.qr_code_scanner, color: AppColors.primary),
                  title: const Text('External Barcode Scanner'),
                  subtitle: const Text('Camera Scanner & USB/Bluetooth Scanner Mode'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Offline Database & Cache
          EnterpriseCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Offline Cache & Sync Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 12),
                ListTile(
                  leading: const Icon(Icons.sync, color: AppColors.success),
                  title: const Text('Force Auto-Sync Offline Queue'),
                  subtitle: const Text('Upload pending offline transactions to Laravel API'),
                  trailing: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Offline queue synchronized with server successfully!')),
                      );
                    },
                    child: const Text('SYNC NOW'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showLanguageSelector(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select Language', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ListTile(
                leading: const Text('🇺🇸', style: TextStyle(fontSize: 24)),
                title: const Text('English (US)'),
                onTap: () {
                  ref.read(localeProvider.notifier).state = const Locale('en');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Text('🇰🇭', style: TextStyle(fontSize: 24)),
                title: const Text('Khmer (ភាសាខ្មែរ)'),
                onTap: () {
                  ref.read(localeProvider.notifier).state = const Locale('km');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Text('🇹🇭', style: TextStyle(fontSize: 24)),
                title: const Text('Thai (ไทย)'),
                onTap: () {
                  ref.read(localeProvider.notifier).state = const Locale('th');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Text('🇻🇳', style: TextStyle(fontSize: 24)),
                title: const Text('Vietnamese (Tiếng Việt)'),
                onTap: () {
                  ref.read(localeProvider.notifier).state = const Locale('vi');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Text('🇨🇳', style: TextStyle(fontSize: 24)),
                title: const Text('Chinese (中文)'),
                onTap: () {
                  ref.read(localeProvider.notifier).state = const Locale('zh');
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
