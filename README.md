# MobileTestingRN

## 手机端测试软件: `./`

### 编译

#### 软件要求：

* nodejs：v12.1.0
* npm：6.9.0
* Android端：安装 Android SDK
* iOS端：安装 Xcode

#### 编译与安装
* 下载代码：`https://github.com/DillionApple/MobileTestingRN`
* 修改`main.sh`开头中的相关路径，以及其它相关配置
* Android端：`./main.sh clear && ./main.sh bundle && ./main.sh android_release`，之后 Release 版本的 APK 文件将存放在 main.sh 中配置的路径。通过 adb 来安装到手机
* iOS端：`./main.sh clear && ./main.sh bundle`，之后，在 Xcode 中打开`ios/MobileTesting.xcodeproj`，进行编译并在真机上安装。为了能够得到 Release 版的软件，需要注册苹果开发者账号

## 电脑端控制软件: `./appium`

### 软件要求

* Appium: 1.18.0
* Python: 3.7.3

### 安装依赖

`pip3 install -r requirements.txt`

### 运行

* 首先打开 Appium server：`appium`
* 对测试程序进行配置：`android_config.py`, `ios_config.py` 以及 `config.py`，主要配置每台机器的 UDID，以及系统版本号
* 由于 iOS 对程序有严格的签名要求，对于 iOS 设备的真机测试，需要按照[此文档](http://appium.io/docs/en/drivers/ios-xcuitest-real-devices/)进行配置
* 执行测试程序：`python3 android.py <device_name>` 或 `python3 ios.py <device_name>`。其中，`<device_name>`为在配置文件中设置的设备名称

## 服务端收集软件: `./mobile_testing_log_server`

### 软件要求

* Python: 3.7.3
* MySQL: 5.7.29

### 安装依赖

`pip3 install Django==2.2.13`

### 运行

* 对`mobile_testing_log_server/settings.py`中的数据库项`DATABASES`进行配置。默认使用sqlite
* 运行`python3 manage.py migrate`来创建数据库中的表
* 运行`python3 manage.py 0.0.0.0:8000`来执行服务

