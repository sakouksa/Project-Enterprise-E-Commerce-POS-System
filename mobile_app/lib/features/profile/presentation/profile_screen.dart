import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/enterprise_app_bar.dart';
import '../../../core/widgets/enterprise_drawer.dart';
import '../../../core/widgets/enterprise_card.dart';
import '../../../core/security/biometric_service.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _biometricsActive = true;
  final BiometricService _biometricService = BiometricService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const EnterpriseAppBar(title: 'User Profile & Security'),
      drawer: const EnterpriseDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Header Card
            EnterpriseCard(
              backgroundColor: AppColors.heroGradient.colors.first,
              child: const Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 50, color: AppColors.primary),
                  ),
                  SizedBox(height: 12),
                  Text('Super Admin', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  Text('admin@enterprise-pos.com', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  SizedBox(height: 8),
                  Chip(
                    backgroundColor: Colors.white24,
                    label: Text('SUPER ADMIN ROLE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Company & Branch Assignments
            EnterpriseCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Company & Scoping', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 12),
                  _buildListTile(Icons.business, 'Company Name', 'Enterprise Global Group Ltd'),
                  _buildListTile(Icons.store, 'Assigned Branch', 'Phnom Penh Main Headquarter'),
                  _buildListTile(Icons.warehouse, 'Default Warehouse', 'Phnom Penh Main WH-01'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Security & Biometrics
            EnterpriseCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Security Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 12),
                  SwitchListTile(
                    secondary: const Icon(Icons.fingerprint, color: AppColors.primary),
                    title: const Text('Biometric Login (FaceID / Fingerprint)'),
                    subtitle: const Text('Require biometric authentication to open POS terminal'),
                    value: _biometricsActive,
                    activeColor: AppColors.primary,
                    onChanged: (val) async {
                      if (val) {
                        final messenger = ScaffoldMessenger.of(context);
                        final canAuth = await _biometricService.isBiometricAvailable();
                        if (!canAuth) {
                          messenger.showSnackBar(
                            const SnackBar(content: Text('Biometrics hardware not available on this device.')),
                          );
                          return;
                        }
                      }
                      if (mounted) {
                        setState(() => _biometricsActive = val);
                      }
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.lock_outline, color: AppColors.primary),
                    title: const Text('Change Account Password'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {},
                  ),
                  ListTile(
                    leading: const Icon(Icons.pin, color: AppColors.primary),
                    title: const Text('Set 4-Digit Terminal Security PIN'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListTile(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary, size: 20),
          const SizedBox(width: 12),
          Text(title, style: const TextStyle(color: AppColors.textSecondaryLight, fontSize: 13)),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }
}
