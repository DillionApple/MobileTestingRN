#!/usr/bin/env bash

# ANDROID CONFIGS
ZIP_ALIGN=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/zipalign
APK_SIGNER=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/apksigner
UNSIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-unsigned.apk
ALIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-aligned.apk
SIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-signed.apk
APK_DST_PATH=~/Desktop/mobile_testing.apk

# IOS CONFIGS
IOS_UDID=472eb0efd95a196bb99f1aab7d3071691e70f184 # iPhone 8
IOS_APP_PATH=/Users/dillion/Library/Developer/Xcode/DerivedData/MobileTesting-gotryjfkgwwnjhgfvxtzltqfmacl/Build/Products/Release-iphoneos/MobileTesting.app
IOS_APP_DST=~/Desktop/MobileTesting.app

function bundle {
  # for ios
  node node_modules/react-native/local-cli/cli.js bundle --dev false --assets-dest ./ios --entry-file BGTaskWorker.js --platform ios --bundle-output ./ios/BGTaskWorker.jsbundle

  # for android
  mkdir -p ./android/app/src/main/assets/threads
  node node_modules/react-native/local-cli/cli.js bundle --dev false --assets-dest ./android/app/src/main/res/ --entry-file BGTaskWorker.js --platform android --bundle-output ./android/app/src/main/assets/threads/BGTaskWorker.bundle

  echo "Warning: one more step for iOS"
  echo "In Xcode's file explorer, right click on MobileTesting and select 'Add Files to MobileTesting', select ios/BGTaskWorker.jsbundle and add"
}

function android_release {

  cd ./android

  rm $UNSIGNED_APK_PATH
  rm $ALIGNED_APK_PATH
  rm $SIGNED_APK_PATH
  rm $APK_DST_PATH

  ./gradlew assembleRelease

  $ZIP_ALIGN -v -p 4 $UNSIGNED_APK_PATH $ALIGNED_APK_PATH

  echo -e "curidemo\n" | $APK_SIGNER sign --ks release-key.jks --out $SIGNED_APK_PATH $ALIGNED_APK_PATH

  cp $SIGNED_APK_PATH $APK_DST_PATH

  cd ../

}

function ios_release {
  cd ./ios

  xcodebuild -project MobileTesting.xcodeproj -scheme MobileTesting -destination "id=$IOS_UDID"

  cp -r $IOS_APP_PATH $IOS_APP_DST

  # NOTE - This command is currently no use.
  # cfgutil install-app $IOS_APP_DST
}

function clear {
  rm -r ./node_modules/
  rm -r ./android/app/build/
  rm -r ./ios/build/
  npm install
}

case $1 in
  bundle)
    bundle
    ;;
  android_release)
    android_release
    ;;
  ios_release)
    ios_release
    ;;
  clear)
    clear
    ;;
  *)
    echo bundle/android_release/clear
esac