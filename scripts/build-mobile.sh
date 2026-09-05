#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  KHPosCommerce Flutter Mobile POS - Release APK Build & Distribution Helper
# ═══════════════════════════════════════════════════════════════════════════════

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MOBILE_DIR="$ROOT_DIR/appkhposcommerce"
DIST_DIR="$ROOT_DIR/storage/dist/mobile"

echo "=========================================================================="
echo " 📱 Building KHPosCommerce Flutter Mobile POS (Release APK)"
echo "=========================================================================="

mkdir -p "$DIST_DIR"
cd "$MOBILE_DIR"

echo "📦 1. Fetching Flutter dependencies..."
flutter pub get

echo "⚡ 2. Building Optimized Release APKs (Compact size)..."
flutter build apk --split-per-abi --release

APK_SOURCE="$MOBILE_DIR/build/app/outputs/flutter-apk/app-arm64-v8a-release.apk"

if [ -f "$APK_SOURCE" ]; then
    TARGET_NAME="khposcommerce-mobile-arm64-$(date +'%Y%m%d_%H%M%S').apk"
    cp "$APK_SOURCE" "$DIST_DIR/$TARGET_NAME"
    cp "$APK_SOURCE" "$DIST_DIR/khposcommerce-mobile-latest.apk"

    echo "=========================================================================="
    echo " 🎉 Build Successful!"
    echo " 📁 APK Location: $DIST_DIR/$TARGET_NAME"
    echo " 📁 Latest Link:   $DIST_DIR/mobile-pos-latest.apk"
    echo "=========================================================================="
    echo ""
    echo " 🚀 Next Steps to Share/Host for Free:"
    echo " 1. Upload to Diawi:        https://www.diawi.com (Get Instant QR & Install Link)"
    echo " 2. Upload to Firebase:     https://console.firebase.google.com -> App Distribution"
    echo " 3. Upload to Google Drive: Share link with 'Anyone with the link can view'"
    echo "=========================================================================="
else
    echo "✖ Error: APK output not found at $APK_SOURCE"
    exit 1
fi
