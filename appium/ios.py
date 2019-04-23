import re
import time
from appium import webdriver
from bs4 import BeautifulSoup

from base import BaseTestFlow
from config import *

class IOSTestFlow(BaseTestFlow):

    def __init__(self):
        pass

    def setup(self):
        self.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            desired_capabilities={
                'bundleId': 'com.zelkova.MobileTesting',
                'platformName': 'iOS',
                'platformVersion': '12.2',
                # 'udid': '472eb0efd95a196bb99f1aab7d3071691e70f184',
                # 'deviceName': 'dPhone',
                'deviceName': 'iPhone 8',
            })

    def __walk_through_xml(self, soup, ret):
        if not hasattr(soup, 'children') or len(list(soup.children)) == 0:
            try:
                name = soup.attrs['name']
            except:
                return
            id_match = re.match(ID_RE_PATTERN, name)
            act_btn_match = re.match(ACT_BTN_RE_PATTERN, name)
            nav_btn_match = re.match(NAV_BTN_RE_PATTERN, name)
            back_btn_match = re.match(BACK_BTN_RE_PATTERN, name, re.IGNORECASE)
            if id_match:
                ret['id'] = id_match.group()
            elif act_btn_match:
                ret['act_btns'].append(act_btn_match.group())
            elif nav_btn_match:
                ret['nav_btns'].append(nav_btn_match.group())
            elif back_btn_match:
                ret['back_btn'] = back_btn_match.group()
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
        self.__walk_through_xml(soup, ret)

        for index, name in enumerate(ret['act_btns']):
            ret['act_btns'][index] = self.driver.find_element_by_name(name)
        for index, name in enumerate(ret['nav_btns']):
            ret['nav_btns'][index] = self.driver.find_element_by_name(name)
        try:
            ret['back_btn'] = self.driver.find_element_by_name(ret['back_btn'])
        except:
            ret['back_btn'] = None
        

        return ret
    

if __name__ == '__main__':
    ios_test_flow = IOSTestFlow()
    ios_test_flow.main()

    
