COMMAND_EXECUTOR = "http://127.0.0.1:4723/wd/hub"

PLATFORM_NAME = "Android"
APP_PACKAGE = "com.mobiletesting"
APP_ACTIVITY = "MainActivity"


def __build_device_dict(uuid, platform_version):
    return {
        "UUID": uuid,
        "PLATFORM_VERSION": platform_version
    }

DEVICE_DICT = {
    "vivo_x27": __build_device_dict("5dc1e44f", "9"),
    "nexus_6p": __build_device_dict("ENU7N15B05000332", "6.0.1"),
    "huawei_p9_plus": __build_device_dict("8FS5T16C26002998", "8.0.0"),
    "samsung_s9": __build_device_dict("281b4b90cc0d7ece", "9"),
}

print(DEVICE_DICT)