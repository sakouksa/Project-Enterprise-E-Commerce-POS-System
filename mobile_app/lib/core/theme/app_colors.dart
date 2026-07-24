import 'package:flutter/material.dart';

/// Enterprise Modern Palette (Inspired by Stripe, Linear, Notion, Apple & Material 3)
class AppColors {
  // Primary & Secondary Brand Colors (Requested Explicitly)
  static const Color primary = Color(0xFF2563EB);       // Royal Blue (#2563EB)
  static const Color primaryDark = Color(0xFF3B82F6);   // Blue 500 (#3B82F6)
  static const Color secondary = Color(0xFF4F46E5);     // Indigo (#4F46E5)
  static const Color accent = Color(0xFF0EA5E9);        // Sky Blue (#0EA5E9)

  // Neutral Colors (Light Theme)
  static const Color backgroundLight = Color(0xFFF8FAFC); // Slate 50 (#F8FAFC)
  static const Color surfaceLight = Color(0xFFFFFFFF);    // Pure White Card
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color lightInputFill = Color(0xFFF8FAFC);
  static const Color borderLight = Color(0xFFE2E8F0);     // Slate 200
  static const Color textPrimaryLight = Color(0xFF0F172A); // Slate 900
  static const Color textSecondaryLight = Color(0xFF64748B); // Slate 500

  // Neutral Colors (Dark Theme)
  static const Color backgroundDark = Color(0xFF0F172A);  // Slate 900 (#0F172A)
  static const Color surfaceDark = Color(0xFF1E293B);     // Slate 800 (#1E293B)
  static const Color cardDark = Color(0xFF1E293B);
  static const Color darkInputFill = Color(0xFF0F172A);
  static const Color borderDark = Color(0xFF334155);      // Slate 700
  static const Color textPrimaryDark = Color(0xFFF8FAFC); // Slate 50
  static const Color textSecondaryDark = Color(0xFF94A3B8); // Slate 400

  // Status & Indicator Colors (Requested Explicitly)
  static const Color success = Color(0xFF10B981);       // Emerald (#10B981)
  static const Color warning = Color(0xFFF59E0B);       // Amber (#F59E0B)
  static const Color danger = Color(0xFFEF4444);        // Red/Rose (#EF4444)
  static const Color info = Color(0xFF3B82F6);          // Blue

  // Enterprise Hero & Glass Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF2563EB), Color(0xFF4F46E5)],
  );

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1E3A8A), Color(0xFF2563EB), Color(0xFF4F46E5)],
  );

  static const LinearGradient heroDarkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0B132B), Color(0xFF1E293B), Color(0xFF312E81)],
  );

  static const RadialGradient orbGlowGradient = RadialGradient(
    colors: [Color(0xFF2563EB), Color(0x444F46E5), Colors.transparent],
    stops: [0.2, 0.6, 1.0],
  );

  static const LinearGradient glassGradientLight = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xE6FFFFFF), Color(0xB3FFFFFF)],
  );

  static const LinearGradient glassGradientDark = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xE61E293B), Color(0xB31E293B)],
  );
}

