# Appium testing environment setup guide

## requirements

1. [Appium](http://appium.io)

First, install [nodejs](https://nodejs.org/en/), then use `npm install -g appium` to install Appium.

2. [Android Sdk](https://developer.android.google.cn/studio)

Download Android Sdk, then set up the environment variables like follows:

```
export ANDROID_SDK_ROOT=/home/zelkova/Android/Sdk
export ANDROID_HOME=/home/zelkova/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

3. [Java](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

Download java and set `JAVA_HOME`

4. pip install -r requirements.txt
