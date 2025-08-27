#!/bin/bash

echo "🔄 Regenerating Android project for Books App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js 20+ required. Current version: $(node --version)"
    echo "💡 Install Node.js 20+ or use nvm: nvm use 20"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Build web assets
echo "📦 Building web assets..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Web build failed"
    exit 1
fi

# Remove existing Android project
if [ -d "android" ]; then
    echo "🗑️  Removing existing Android project..."
    rm -rf android/
fi

# Add fresh Android platform
echo "📱 Adding fresh Android platform..."
npx cap add android
if [ $? -ne 0 ]; then
    echo "❌ Failed to add Android platform"
    exit 1
fi

# Update Android configuration
echo "⚙️  Updating Android configuration..."

# Update app ID
sed -i 's/com\.example\.app/com.tunek.booksapp/g' android/app/build.gradle 2>/dev/null || \
sed -i '' 's/com\.example\.app/com.tunek.booksapp/g' android/app/build.gradle

sed -i 's/com\.example\.app/com.tunek.booksapp/g' android/app/src/main/AndroidManifest.xml 2>/dev/null || \
sed -i '' 's/com\.example\.app/com.tunek.booksapp/g' android/app/src/main/AndroidManifest.xml

# Add Java 17 compatibility to build.gradle
sed -i '/buildTypes {/i\    compileOptions {\
        sourceCompatibility JavaVersion.VERSION_17\
        targetCompatibility JavaVersion.VERSION_17\
    }' android/app/build.gradle 2>/dev/null || \
sed -i '' '/buildTypes {/i\
    compileOptions {\
        sourceCompatibility JavaVersion.VERSION_17\
        targetCompatibility JavaVersion.VERSION_17\
    }\
' android/app/build.gradle

# Add global Java 17 compatibility to root build.gradle
echo "🔧 Adding global Java 17 compatibility..."
if ! grep -q "afterEvaluate" android/build.gradle; then
    sed -i '/allprojects {/,/}/ {
        /}$/ i\    \
    // Force Java 17 compatibility for all modules\
    afterEvaluate { project ->\
        if (project.hasProperty("android")) {\
            project.android {\
                compileOptions {\
                    sourceCompatibility JavaVersion.VERSION_17\
                    targetCompatibility JavaVersion.VERSION_17\
                }\
            }\
        }\
    }
    }' android/build.gradle 2>/dev/null || echo "Failed to add global Java compatibility"
fi

# Create optimized variables.gradle
cat > android/variables.gradle << 'EOF'
ext {
    minSdkVersion = 22
    compileSdkVersion = 33
    targetSdkVersion = 33
    androidxActivityVersion = '1.7.2'
    androidxAppCompatVersion = '1.5.1'
    androidxCoordinatorLayoutVersion = '1.2.0'
    androidxCoreVersion = '1.9.0'
    androidxFragmentVersion = '1.5.4'
    coreSplashScreenVersion = '1.0.0'
    androidxWebkitVersion = '1.5.0'
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.1.4'
    androidxEspressoCoreVersion = '3.5.0'
    cordovaAndroidVersion = '10.1.1'
}
EOF

# Update gradle.properties for AndroidX compatibility
cat >> android/gradle.properties << 'EOF'

# Automatically convert third-party libraries to use AndroidX
android.enableJetifier=true
EOF

# Update app name in strings.xml
mkdir -p android/app/src/main/res/values
cat > android/app/src/main/res/values/strings.xml << 'EOF'
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">Books App</string>
    <string name="title_activity_main">Books App</string>
    <string name="package_name">com.tunek.booksapp</string>
    <string name="custom_url_scheme">com.tunek.booksapp</string>
</resources>
EOF

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed"
    exit 1
fi

# Make gradlew executable
chmod +x android/gradlew

# Test build
echo "🔨 Testing Android build..."
cd android
./gradlew clean
./gradlew assembleDebug --no-daemon

if [ $? -eq 0 ]; then
    echo "✅ Android project regenerated successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        APK_SIZE=$(stat -c%s app/build/outputs/apk/debug/app-debug.apk 2>/dev/null || stat -f%z app/build/outputs/apk/debug/app-debug.apk)
        echo "📦 APK size: ${APK_SIZE} bytes"
    fi
else
    echo "❌ Android build failed"
    echo "💡 Try running manually:"
    echo "   cd android"
    echo "   ./gradlew clean"
    echo "   ./gradlew assembleDebug --stacktrace"
    exit 1
fi

echo ""
echo "🎉 Done! You can now:"
echo "   • Install APK: android/app/build/outputs/apk/debug/app-debug.apk"
echo "   • Open in Android Studio: npx cap open android"
echo "   • Build again: cd android && ./gradlew assembleDebug"