import re
import subprocess
from appium import webdriver
from bs4 import BeautifulSoup
from time import sleep

from base import BaseTestFlow
from config import *
from ios_config import *

class IOSTestFlow(BaseTestFlow):

    def __init__(self, device_name):
        super().__init__(device_name)

    def setup(self):
        print("\nSetting up the device %s\n" % self.device_name)
        self.driver = webdriver.Remote(
            command_executor=COMMAND_EXECUTOR,
            desired_capabilities={
                'bundleId': BUNDLE_ID,
                'platformName':  PLATFORM_NAME,
                'platformVersion': PLATFORM_VERSION,
                'udid': UUID,
                'deviceName': DEVICE_NAME,
            })

    def collect_device_log_process_target(self):
        proc = subprocess.Popen(['cfgutil', 'syslog'], stdout=subprocess.PIPE)
        with open(self.current_log_filename, "w") as f:
            while True:
                line = proc.stdout.readline()
                f.write("%s\n" % str(line)[2:-3])

    def __walk_through_xml(self, soup, ret):
        if not hasattr(soup, 'children') or len(list(soup.children)) == 0:
            try:
                name = soup.attrs['name'].strip()
            except:
                return
            id_match = re.match(ID_RE_PATTERN, name)
            act_btn_match = re.match(ACT_BTN_RE_PATTERN, name)
            nav_btn_match = re.match(NAV_BTN_RE_PATTERN, name)
            back_btn_match = re.match(BACK_BTN_RE_PATTERN, name, re.IGNORECASE)
            injection_btn_match = re.match(INJECTION_BTN_RE_PATTERN, name, re.IGNORECASE)
            injection_clear_btn_match = re.match(INJECTION_CLEAR_BTN_RE_PATTERN, name, re.IGNORECASE)

            if id_match:
                ret['id'] = id_match.group()
            elif act_btn_match:
                ret['act_btns'].append(act_btn_match.group())
            elif nav_btn_match:
                ret['nav_btns'].append(nav_btn_match.group())
            elif back_btn_match:
                ret['back_btn'] = back_btn_match.group()
            elif injection_btn_match:
                ret['injection_btn'] = injection_btn_match.group()
            elif injection_clear_btn_match:
                ret['clear_btn'] = injection_clear_btn_match.group()
            return
        for child in soup.children:
            self.__walk_through_xml(child, ret)

    def parse_current_screen(self):
        source = self.driver.page_source
        soup = BeautifulSoup(source, "xml")
        ret = {}
        ret['id'] = None
        ret['act_btns'] = []
        ret['nav_btns'] = []
        ret['back_btn'] = None
        ret['injection_btn'] = None
        ret['clear_btn'] = None
        self.__walk_through_xml(soup, ret)

        for index, name in enumerate(ret['act_btns']):
            ret['act_btns'][index] = self.driver.find_element_by_name(name)
        for index, name in enumerate(ret['nav_btns']):
            ret['nav_btns'][index] = self.driver.find_element_by_name(name)
        if ret['back_btn'] is not None:
            ret['back_btn'] = self.driver.find_element_by_name(ret['back_btn'])
        if ret['injection_btn'] is not None:
            ret['injection_btn'] = self.driver.find_element_by_name(ret['injection_btn'])
        if ret['clear_btn'] is not None:
            ret['clear_btn'] = self.driver.find_element_by_name(ret['clear_btn'])
            
        return ret

    def navigate_back(self, back_btn):
        back_btn.click()
        sleep(1)

if __name__ == '__main__':
    ios_test_flow = IOSTestFlow("dPhone")
    ios_test_flow.main()
