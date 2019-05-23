import re
from time import sleep

from appium import webdriver
from bs4 import BeautifulSoup

from base import BaseTestFlow
from config import *
from android_config import *



class AndroidTestFlow(BaseTestFlow):

    def __init__(self):
        pass
    
    def setup(self):
        self.driver = webdriver.Remote(
            command_executor=COMMAND_EXECUTOR,
            desired_capabilities={
                'platformName': PLATFORM_NAME,
                'platformVersion': PLATFORM_VERSION,
                'deviceName': DEVICE_NAME,
                'uuid': UUID,
                'appPackage': APP_PACKAGE,
                'appActivity': APP_ACTIVITY,
            }                
        )

    def parse_current_screen(self):
        source = self.driver.page_source
        elements = self.driver.find_elements_by_class_name('android.widget.TextView')
        
        ret = {}
        ret['id'] = None
        ret['act_btns'] = []
        ret['nav_btns'] = []
        ret['back_btn'] = None
        
        for el in elements:
            text = el.text
            id_match = re.match(ID_RE_PATTERN, text)
            act_btn_match = re.match(ACT_BTN_RE_PATTERN, text)
            nav_btn_match = re.match(NAV_BTN_RE_PATTERN, text)
            back_btn_match = re.match(BACK_BTN_RE_PATTERN, text, re.IGNORECASE)
            if id_match:
                ret['id'] = id_match.group()
            elif act_btn_match:
                ret['act_btns'].append(el)
            elif nav_btn_match:
                ret['nav_btns'].append(el)
            elif back_btn_match:
                ret['back_btn'] = el
        return ret

    def navigate_back(self, back_btn):
        self.driver.back()
        
        
if __name__ == '__main__':

    while True:
        try:
            android_test_flow = AndroidTestFlow()
            android_test_flow.main()
        except:
            print("App Crashed")

        sleep(10)