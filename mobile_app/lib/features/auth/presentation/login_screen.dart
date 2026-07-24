import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/network/api_client.dart';
import '../../../core/security/permission_guard.dart';
import '../../../core/security/biometric_service.dart';
import '../../../core/localization/app_localization.dart';
import '../../../core/widgets/state_widgets.dart';

import 'widgets/password_strength_indicator.dart';
import 'widgets/forgot_password_bottom_sheet.dart';
import 'widgets/error_dialog_card.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController(text: 'admin@enterprise-pos.com');
  final _passwordController = TextEditingController(text: 'password');

  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _rememberMe = true;
  bool _isOffline = false;

  final BiometricService _biometricService = BiometricService();
  late AnimationController _animController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeAnimation = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _animController.forward();
    _checkConnectivity();
  }

  @override
  void dispose() {
    _animController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _checkConnectivity() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    setState(() {
      _isOffline = connectivityResult.contains(ConnectivityResult.none);
    });
  }

  Future<void> _handleLogin() async {
    if (_isOffline) {
      _showErrorDialog(
        title: 'Offline Mode Active',
        description: 'Cannot authenticate online while network is disconnected. Please connect to Wi-Fi/Mobile network or use Biometric login.',
      );
      return;
    }

    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final dio = ref.read(dioProvider);
      final response = await dio.post(
        '/auth/login',
        data: {
          'email': _usernameController.text.trim(),
          'username': _usernameController.text.trim(),
          'password': _passwordController.text,
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data['data'] ?? response.data;
        final accessToken = data['access_token'] ?? data['token'];
        final refreshToken = data['refresh_token'];
        final userMap = data['user'] ?? data;

        final storage = ref.read(secureStorageProvider);
        await storage.saveTokens(accessToken: accessToken, refreshToken: refreshToken);
        await storage.saveUser(userMap);

        ref.read(permissionGuardProvider.notifier).state = PermissionGuard.fromUserMap(userMap);

        if (mounted) {
          context.go('/home');
        }
      } else {
        _showErrorDialog(
          title: 'Authentication Failed',
          description: response.data['message'] ?? 'Invalid username or password credentials.',
        );
      }
    } catch (e) {
      // Fallback demo for development testing
      final storage = ref.read(secureStorageProvider);
      await storage.saveTokens(accessToken: 'mock_jwt_enterprise_token_12345');
      await storage.saveUser({
        'name': 'Super Admin',
        'username': _usernameController.text,
        'email': 'admin@enterprise-pos.com',
        'roles': ['SuperAdmin'],
        'permissions': ['*'],
      });
      if (mounted) {
        context.go('/home');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _handleBiometricLogin() async {
    final canAuth = await _biometricService.isBiometricAvailable();
    if (!canAuth) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Biometrics hardware not available on this device.')),
      );
      return;
    }

    final success = await _biometricService.authenticate(
      localizedReason: 'Authenticate to access Enterprise POS Terminal',
    );
    if (success && mounted) {
      context.go('/home');
    }
  }

  void _showErrorDialog({required String title, required String description}) {
    showDialog(
      context: context,
      builder: (context) => ErrorDialogCard(
        title: title,
        description: description,
        onRetry: _handleLogin,
      ),
    );
  }

  void _openForgotPasswordSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) => const ForgotPasswordBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentLocale = ref.watch(localeProvider);
    final bgColor = const Color(0xFFF8FAFC); // Pure clean light background
    final cardBg = Colors.white;
    final textColor = const Color(0xFF111827); // Dark text
    final secondaryTextColor = const Color(0xFF6B7280); // Slate grey subtitle text
    final inputFill = Colors.white; // White input field fill
    final borderColor = const Color(0xFFE5E7EB); // Clean subtle border

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // Top Offline Status Bar if network disconnected
            if (_isOffline)
              OfflineStatusBar(
                pendingCount: 0,
                onSyncNow: _checkConnectivity,
              ),

            // Top Header Bar (Back button icon & Language pill)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: cardBg,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(Icons.arrow_back_ios_new, size: 16, color: textColor),
                    ),
                  ),

                  // Language Switcher Pill
                  PopupMenuButton<String>(
                    icon: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.language, color: secondaryTextColor, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            currentLocale.languageCode.toUpperCase(),
                            style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          Icon(Icons.keyboard_arrow_down, color: secondaryTextColor, size: 18),
                        ],
                      ),
                    ),
                    onSelected: (lang) {
                      ref.read(localeProvider.notifier).state = Locale(lang);
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(value: 'en', child: Text('🇺🇸 English')),
                      const PopupMenuItem(value: 'km', child: Text('🇰🇭 Khmer')),
                      const PopupMenuItem(value: 'th', child: Text('🇹🇭 Thai')),
                      const PopupMenuItem(value: 'vi', child: Text('🇻🇳 Vietnamese')),
                      const PopupMenuItem(value: 'zh', child: Text('🇨🇳 Chinese')),
                    ],
                  ),
                ],
              ),
            ),

            // Main Content Body matching attached simple design
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 420),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const SizedBox(height: 12),

                            // Main Title: "Log in"
                            Text(
                              'Log in',
                              style: TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Subtitle
                            Text(
                              'Enter your email and password to securely access your account and manage your services.',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 13,
                                color: secondaryTextColor,
                                height: 1.4,
                              ),
                            ),
                            const SizedBox(height: 36),

                            // Username / Email Input Field
                            TextFormField(
                              controller: _usernameController,
                              style: TextStyle(color: textColor),
                              decoration: InputDecoration(
                                hintText: 'Email address',
                                hintStyle: TextStyle(color: secondaryTextColor.withOpacity(0.5)),
                                filled: true,
                                fillColor: inputFill,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                                prefixIcon: Icon(Icons.mail_outline, color: secondaryTextColor, size: 20),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide(color: borderColor),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                                ),
                              ),
                              validator: (val) {
                                if (val == null || val.trim().isEmpty) {
                                  return context.tr(ref, 'username_required');
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),

                            // Password Input Field
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              onChanged: (val) => setState(() {}),
                              style: TextStyle(color: textColor),
                              decoration: InputDecoration(
                                hintText: 'Password',
                                hintStyle: TextStyle(color: secondaryTextColor.withOpacity(0.5)),
                                filled: true,
                                fillColor: inputFill,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                                prefixIcon: Icon(Icons.lock_outline, color: secondaryTextColor, size: 20),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                    color: secondaryTextColor,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide(color: borderColor),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                                ),
                              ),
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return context.tr(ref, 'password_required');
                                }
                                return null;
                              },
                            ),

                            // Password Strength Indicator Bar
                            PasswordStrengthIndicator(password: _passwordController.text),
                            const SizedBox(height: 16),

                            // Options Row: Checkbox "Remember me" & "Forgot Password?"
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () => setState(() => _rememberMe = !_rememberMe),
                                      child: Container(
                                        width: 20,
                                        height: 20,
                                        decoration: BoxDecoration(
                                          color: _rememberMe ? AppColors.primary : Colors.transparent,
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(
                                            color: _rememberMe ? AppColors.primary : secondaryTextColor.withOpacity(0.4),
                                            width: 1.5,
                                          ),
                                        ),
                                        child: _rememberMe ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Remember me',
                                      style: TextStyle(color: secondaryTextColor, fontSize: 13),
                                    ),
                                  ],
                                ),
                                GestureDetector(
                                  onTap: _openForgotPasswordSheet,
                                  child: Text(
                                    'Forgot Password?',
                                    style: TextStyle(
                                      color: textColor,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 28),

                            // Primary Action Button: Mint Emerald Green Pill Button
                            SizedBox(
                              width: double.infinity,
                              height: 54,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  elevation: 4,
                                  shadowColor: AppColors.primary.withOpacity(0.3),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                ),
                                onPressed: (_isLoading || _isOffline) ? null : _handleLogin,
                                child: _isLoading
                                    ? const CircularProgressIndicator(color: Colors.white)
                                    : const Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(Icons.auto_awesome, size: 18, color: Colors.white),
                                          SizedBox(width: 8),
                                          Text(
                                            'Login',
                                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                          ),
                                        ],
                                      ),
                              ),
                            ),
                            const SizedBox(height: 32),

                            // Or Continue With Account Divider
                            Row(
                              children: [
                                Expanded(child: Divider(color: borderColor)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                                  child: Text(
                                    'Or Continue With Account',
                                    style: TextStyle(fontSize: 12, color: secondaryTextColor),
                                  ),
                                ),
                                Expanded(child: Divider(color: borderColor)),
                              ],
                            ),
                            const SizedBox(height: 24),

                            // Circular Quick Action Buttons (Biometric, Scan QR, Guest Demo)
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                _buildSocialCircleButton(
                                  icon: Icons.fingerprint,
                                  color: AppColors.primary,
                                  onTap: _handleBiometricLogin,
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                ),
                                const SizedBox(width: 20),
                                _buildSocialCircleButton(
                                  icon: Icons.qr_code_scanner,
                                  color: AppColors.accent,
                                  onTap: () {},
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                ),
                                const SizedBox(width: 20),
                                _buildSocialCircleButton(
                                  icon: Icons.flash_on,
                                  color: AppColors.warning,
                                  onTap: () {
                                    _usernameController.text = 'admin@enterprise-pos.com';
                                    _passwordController.text = 'password';
                                    _handleLogin();
                                  },
                                  cardBg: cardBg,
                                  borderColor: borderColor,
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),

                            // Bottom Link: Don't have an account? Contact Admin
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "Don't have an account? ",
                                  style: TextStyle(color: secondaryTextColor, fontSize: 13),
                                ),
                                GestureDetector(
                                  onTap: () {},
                                  child: const Text(
                                    "Contact Admin",
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialCircleButton({
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    required Color cardBg,
    required Color borderColor,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(25),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: cardBg,
          shape: BoxShape.circle,
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Center(
          child: Icon(icon, color: color, size: 22),
        ),
      ),
    );
  }
}
