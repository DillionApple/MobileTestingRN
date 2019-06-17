COMMAND_EXECUTOR = "http://127.0.0.1:4723/wd/hub"

PLATFORM_NAME = "Android"
APP_PACKAGE = "com.mobiletesting"
APP_ACTIVITY = "MainActivity"


def __build_device_dict(udid, platform_version, system_port):
    return {
        "UDID": udid,
        "PLATFORM_VERSION": platform_version,
        "SYSTEM_PORT": system_port
    }

DEVICE_DICT = {
    "vivo_x27": __build_device_dict("5dc1e44f", "9", 8201),
    "nexus_6p": __build_device_dict("ENU7N15B05000332", "6.0.1", 8202),
    "huawei_p9_plus": __build_device_dict("8FS5T16C26002998", "8.0.0", 8203),
    "samsung_s9": __build_device_dict("281b4b90cc0d7ece", "9", 8204),
}
