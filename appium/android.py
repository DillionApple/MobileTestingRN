import re
import os
import sys
from time import sleep
import subprocess

from appium import webdriver
from bs4 import BeautifulSoup

from base import BaseTestFlow
from config import *
from android_config import *

class AndroidTestFlow(BaseTestFlow):

    def __init__(self, device_name):
        super().__init__(device_name)
    
    def setup(self):
        print("\nSetting up the device %s\n" % self.device_name)
        desired_capabilities = {
            'platformName': PLATFORM_NAME,
            'platformVersion': DEVICE_DICT[self.device_name]["PLATFORM_VERSION"],
            'deviceName': self.device_name,
            'udid': DEVICE_DICT[self.device_name]["UDID"],
            'appPackage': APP_PACKAGE,
            'appActivity': APP_ACTIVITY,
            'autoGrantPermissions': True,
            'automationName': "UiAutomator2",
        }
        self.driver = webdriver.Remote(
            command_executor=COMMAND_EXECUTOR,
            desired_capabilities=desired_capabilities
        )

    def collect_device_log_process_target(self):
        proc = subprocess.Popen(['adb', '-s', DEVICE_DICT[self.device_name]['UDID'], 'logcat'], stdout=subprocess.PIPE)
        with open(self.current_log_filename, "w") as f:
            while True:
                line = proc.stdout.readline()
                if os.name == "nt":# on windows
                    f.write("%s\n" % str(line)[2:-5])
                else:# on linux
                    f.write("%s\n" % str(line)[2:-3])


    def parse_current_screen(self):
        source = self.driver.page_source
        elements = self.driver.find_elements_by_class_name('android.widget.TextView')
        
        ret = {}
        ret['id'] = None
        ret['act_btns'] = []
        ret['nav_btns'] = []
        ret['back_btn'] = None
        ret['injection_btn'] = None
        ret['clear_btn'] = None
        
        for el in elements:
            text = el.text.strip()
            id_match = re.match(ID_RE_PATTERN, text)
            act_btn_match = re.match(ACT_BTN_RE_PATTERN, text)
            nav_btn_match = re.match(NAV_BTN_RE_PATTERN, text)
            back_btn_match = re.match(BACK_BTN_RE_PATTERN, text, re.IGNORECASE)
            injection_btn_match = re.match(INJECTION_BTN_RE_PATTERN, text, re.IGNORECASE)
            injection_clear_btn_match = re.match(INJECTION_CLEAR_BTN_RE_PATTERN, text, re.IGNORECASE)
            if id_match:
                ret['id'] = id_match.group()
            elif act_btn_match:
                ret['act_btns'].append(el)
            elif nav_btn_match:
                ret['nav_btns'].append(el)
            elif back_btn_match:
                ret['back_btn'] = el
            elif injection_btn_match:
                ret['injection_btn'] = el
            elif injection_clear_btn_match:
                ret['clear_btn'] = el
        return ret

    def navigate_back(self, back_btn):
        self.driver.back()
        
        
if __name__ == '__main__':
    device_name = sys.argv[1]
    android_test_flow = AndroidTestFlow(device_name)
    android_test_flow.main()
