import os
import re
from datetime import datetime
from multiprocessing import Process
from config import *
from random import randint
from time import sleep

from exception import AppCrashedException

class BaseTestFlow:

    CURRENT_LOG_FILENAME = "current_log.txt"

    def __init__(self):
        self.complete = set()
        self.current_screen = None
        self.current_stress = None
        self.stresses = []

    def setup(self):
        raise NotImplementedError()

    def tear_down(self):
        print("\nTearing down the device\n")
        self.driver.quit()

    def parse_current_screen(self):
        
        # find the activity identifier <- ->
        # find action buttons |- -|
        # find navigation buttons [- -]
        # find back button

        # return {
        #   id: <str>
        #   act_btns: [<element>, ...]
        #   nav_btns: [<element>, ...]
        #   back_btn: element
        #   injection_btn: element
        #   clear_btn: element
        # }
        
        raise NotImplementedError()

    def navigate_back(self, back_btn):
        raise NotImplementedError()


    def init_stresses(self, parsed):
        parsed['injection_btn'].click()
        sleep(2)
        injection_parsed = self.parse_current_screen() # all injection buttons are stored in act_btns
        for injection_btn in injection_parsed["act_btns"]:
            self.stresses.append(injection_btn.text)
        injection_parsed['back_btn'].click()
        sleep(2)


    def collect_device_log_process_target(self):
        raise NotImplementedError()

    def inject_stress(self, parsed, stress):
        print("Injecting stress %s" % stress)
        parsed['injection_btn'].click()
        sleep(2)
        injection_parsed = self.parse_current_screen()
        for injection_btn in injection_parsed["act_btns"]:
            if injection_btn.text == stress:
                injection_btn.click()
                break
        sleep(2)
        print("Injection complete")
        self.current_stress = stress

    def clear_stress(self, parsed):
        print("Clearing stress")
        parsed['injection_btn'].click()
        sleep(2)
        injection_parsed = self.parse_current_screen()
        injection_parsed['clear_btn'].click()
        sleep(2)
        print("Clearing complete")
        self.current_stress = "Empty"

    def dfs(self, screen_name):
        print("Entered {0}".format(screen_name))
        self.current_screen = screen_name
        sleep(10)
        parsed = self.parse_current_screen()

        if parsed['nav_btns']:
            for nav_btn in parsed['nav_btns']:
                nav_btn_text = nav_btn.text
                if nav_btn_text in self.complete:
                    continue
                nav_btn.click()
                self.dfs(nav_btn_text)
                self.complete.add(nav_btn_text)
        else:
            if len(parsed['act_btns']) > 0:
                if not self.stresses: # initial stresses list
                    self.init_stresses(parsed)
                    parsed = self.parse_current_screen() # the "parsed" will be broken after new model is shown

                for stress in self.stresses:
                    self.inject_stress(parsed, stress)
                    parsed = self.parse_current_screen()

                    act_btns = parsed['act_btns']

                    for i in range(CLICK_TIMES_FOR_EACH_BUTTON * len(act_btns)):
                        rand_index = randint(0, len(act_btns) - 1)
                        act_btn = act_btns[rand_index]
                        act_btn_text = act_btn.text.strip()
                        print(act_btn_text)
                        if not re.match(ACT_BTN_RE_PATTERN, act_btn_text):
                            raise AppCrashedException("App crashed in screen {0}, with stress {1}".format(screen_name, stress))
                        act_btn.click()
                        print("Button {0} clicked".format(act_btn.text))

                    self.clear_stress(parsed)
                    parsed = self.parse_current_screen()

        if parsed['back_btn']:
            self.navigate_back(parsed['back_btn'])

        print("Exited {0}".format(screen_name))
                
    def main(self):
        round = 0
        self.complete = set()
        while True:
            sleep(1)
            self.setup()
            # start log process
            log_proc = Process(target=self.collect_device_log_process_target)
            log_proc.start()
            crash_occured = False
            try:
                self.dfs("[-MobileTesting-]")
            except:
                crash_occured = True
                print("Broken on screen %s" % self.current_screen)
                self.complete.add(self.current_screen)
            finally:
                self.tear_down()
                log_proc.terminate()

            if crash_occured:
                time_str = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
                log_filename = "round_%d_%s_%s_%s.txt" % (round, time_str, self.current_screen, self.current_stress)
                if os.name == "nt":# running in windows
                    log_filename = log_filename.replace(" ", "_")
                    command = "move %s %s" % (self.CURRENT_LOG_FILENAME, log_filename)
                else:# running in linux
                    command = "mv '%s' '%s'" % (self.CURRENT_LOG_FILENAME, log_filename)
                os.system(command)
            else:
                print("All tests in round %d done" % round)
                round += 1
                self.complete = set()
