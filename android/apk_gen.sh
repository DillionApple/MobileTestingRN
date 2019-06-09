ZIP_ALIGN=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/zipalign
APK_SIGNER=/Users/dillion/Library/Android/sdk/build-tools/28.0.3/apksigner
UNSIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-unsigned.apk
ALIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-aligned.apk
SIGNED_APK_PATH=./app/build/outputs/apk/release/app-release-signed.apk
APK_DST_PATH=~/Desktop/mobile_testing.apk

./gradlew assembleRelease

$ZIP_ALIGN -v -p 4 $UNSIGNED_APK_PATH $ALIGNED_APK_PATH

$APK_SIGNER sign --ks release-key.jks --out $SIGNED_APK_PATH $ALIGNED_APK_PATH

cp $SIGNED_APK_PATH $APK_DST_PATH