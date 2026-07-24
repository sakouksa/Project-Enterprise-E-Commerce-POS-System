import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class EnterpriseCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final bool isGlass;
  final Color? backgroundColor;

  const EnterpriseCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.margin = const EdgeInsets.only(bottom: 16),
    this.onTap,
    this.isGlass = false,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = backgroundColor ?? (isDark ? AppColors.cardDark : AppColors.cardLight);
    final borderColor = isDark ? AppColors.borderDark : AppColors.borderLight;

    Widget cardContent = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: isGlass ? Colors.transparent : cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor, width: 1),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withOpacity(0.3) : Colors.black.withOpacity(0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: child,
    );

    if (isGlass) {
      cardContent = ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              gradient: isDark ? AppColors.glassGradientDark : AppColors.glassGradientLight,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: borderColor, width: 1),
            ),
            child: child,
          ),
        ),
      );
    }

    if (onTap != null) {
      return Container(
        margin: margin,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: cardContent,
        ),
      );
    }

    return Container(
      margin: margin,
      child: cardContent,
    );
  }
}
