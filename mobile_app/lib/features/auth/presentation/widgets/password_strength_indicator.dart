import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PasswordStrengthIndicator extends StatelessWidget {
  final String password;

  const PasswordStrengthIndicator({super.key, required this.password});

  double _calculateStrength() {
    if (password.isEmpty) return 0.0;
    double score = 0.0;
    if (password.length >= 6) score += 0.25;
    if (password.length >= 10) score += 0.25;
    if (RegExp(r'[A-Z]').hasMatch(password)) score += 0.25;
    if (RegExp(r'[0-9!@#\$%^&*(),.?":{}|<>!]').hasMatch(password)) score += 0.25;
    return score;
  }

  Color _getStrengthColor(double strength) {
    if (strength <= 0.25) return AppColors.danger;
    if (strength <= 0.50) return AppColors.warning;
    if (strength <= 0.75) return AppColors.accent;
    return AppColors.success;
  }

  String _getStrengthLabel(double strength) {
    if (password.isEmpty) return '';
    if (strength <= 0.25) return 'Weak';
    if (strength <= 0.50) return 'Fair';
    if (strength <= 0.75) return 'Good';
    return 'Strong Enterprise Password';
  }

  @override
  Widget build(BuildContext context) {
    if (password.isEmpty) return const SizedBox.shrink();

    final strength = _calculateStrength();
    final color = _getStrengthColor(strength);
    final label = _getStrengthLabel(strength);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: strength,
                  backgroundColor: Colors.grey.shade300,
                  color: color,
                  minHeight: 4,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color),
            ),
          ],
        ),
      ],
    );
  }
}
