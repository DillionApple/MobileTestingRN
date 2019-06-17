ZIP_ALIGN=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/zipalign
APK_SIGNER=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/apksigner
UNSIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-unsigned.apk
ALIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-aligned.apk
SIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-signed.apk
APK_DST_PATH=~/Desktop/mobile_testing.apk



rm $UNSIGNED_APK_PATH
rm $ALIGNED_APK_PATH
rm $SIGNED_APK_PATH
rm $APK_DST_PATH

cd ../
node ./node_modules/react-native/local-cli/cli.js bundle --dev false --assets-dest ./android/app/src/main/res/ --entry-file ./BGTaskWorker.js --platform android --bundle-output ./android/app/src/main/assets/threads/BGTaskWorker.bundle
cd android

./gradlew assembleRelease

$ZIP_ALIGN -v -p 4 $UNSIGNED_APK_PATH $ALIGNED_APK_PATH

echo -e "curidemo\n" | $APK_SIGNER sign --ks release-key.jks --out $SIGNED_APK_PATH $ALIGNED_APK_PATH

cp $SIGNED_APK_PATH $APK_DST_PATH

# adb install $APK_DST_PATH