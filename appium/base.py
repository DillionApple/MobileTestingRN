import os
import re
from datetime import datetime
from multiprocessing import Process
from config import *
from random import randint
from time import sleep

from exception import AppCrashedException, OneTestCaseCompleteException

class BaseTestFlow:

    def __init__(self, device_name):
        self.complete = set()
        self.current_screen = None
        self.current_stress_combination_index = 0
        self.device_name = device_name
        self.current_log_filename = "current_log_{0}.txt".format(device_name)
        self.stress_combinations = []
        self.have_case_tested = False

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
        # find injection button
        # find clear button

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

    def collect_device_log_process_target(self):
        raise NotImplementedError()

    def init_stress_combinations(self):

        def dfs_combination(stress_names, index, stress_dict):
            if (index == len(stress_names)):
                stress_signature = ""
                for stress_name in stress_names:
                    stress_signature = stress_signature + "({0}-{1})".format(stress_name, stress_dict[stress_name])
                new_stress_dict = stress_dict.copy()
                new_stress_dict["signature"] = stress_signature
                self.stress_combinations.append(new_stress_dict)
                return
            stress_name = stress_names[index]
            for value in STRESS_PATTERNS[stress_name]:
                new_stress_dict = stress_dict.copy()
                new_stress_dict[stress_name] = value
                dfs_combination(stress_names, index + 1, new_stress_dict)

        stress_names = sorted([key for key in STRESS_PATTERNS])
        dfs_combination(stress_names, 0, {})

    def inject_stress(self, parsed, stress_dict):
        print("Injecting stress %s" % stress_dict["signature"])
        parsed['injection_btn'].click()
        sleep(2)
        injection_parsed = self.parse_current_screen()
        for injection_btn in injection_parsed["act_btns"]:
            stress_name = injection_btn.text[2:-2]
            for i in range(stress_dict[stress_name]):
                print("Clicking %s" % stress_name)
                injection_btn.click() # TODO - check whether the app is crashed
                sleep(5)
        injection_parsed["back_btn"].click()
        print("Injection complete")

    def clear_stress(self, parsed):
        print("Clearing stress")
        parsed['injection_btn'].click()
        sleep(2)
        injection_parsed = self.parse_current_screen()
        injection_parsed['clear_btn'].click()
        sleep(2)
        injection_parsed['back_btn'].click()
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
                self.current_screen = screen_name
                self.complete.add(nav_btn_text)
        else:
            self.have_case_tested = True
            if len(parsed['act_btns']) > 0:

                for stress_index in range(self.current_stress_combination_index, len(self.stress_combinations)):
                    self.current_stress_combination_index = stress_index
                    stress_dict = self.stress_combinations[stress_index]
                    self.inject_stress(parsed, stress_dict)
                    parsed = self.parse_current_screen()

                    act_btns = parsed['act_btns']

                    for i in range(CLICK_TIMES_FOR_EACH_BUTTON * len(act_btns)):
                        rand_index = randint(0, len(act_btns) - 1)
                        act_btn = act_btns[rand_index]
                        act_btn_text = act_btn.text.strip()
                        if not re.match(ACT_BTN_RE_PATTERN, act_btn_text):
                            raise AppCrashedException("App crashed in screen {0}, with stress {1}".format(
                                screen_name,
                                stress_dict["signature"]))
                        time_before_click = datetime.now()
                        act_btn.click()
                        print("Button {0} clicked".format(act_btn_text))
                        time_after_click = datetime.now()
                        time_delta_microseconds = (time_after_click - time_before_click).microseconds
                        if time_delta_microseconds < 500000:# 0.5s
                            sleep(0.5 - (time_delta_microseconds / 1000000))
                    raise OneTestCaseCompleteException(self.current_screen)

        self.navigate_back(parsed['back_btn'])
        print("Exited {0}".format(screen_name))

    def main(self):
        self.init_stress_combinations()
        round = 0
        while True:
            sleep(1)
            self.setup()
            # start log process
            log_proc = Process(target=self.collect_device_log_process_target)
            log_proc.start()
            crash_occured = False
            self.have_case_tested = False
            try:
                self.dfs("[-MobileTesting-]")
            except OneTestCaseCompleteException as e:
                print("One test case is done on screen %s, stress %s" % (
                    self.current_screen,
                    self.stress_combinations[self.current_stress_combination_index]["signature"],
                ))
            except Exception as e:
                crash_occured = True
                print("Broken on screen %s, stress %s" % (
                    self.current_screen,
                    self.stress_combinations[self.current_stress_combination_index]["signature"]
                    ))
            finally:
                self.current_stress_combination_index = (self.current_stress_combination_index + 1) % len(self.stress_combinations)
                if self.current_stress_combination_index == 0:
                    self.complete.add(self.current_screen)
                self.tear_down()
                log_proc.terminate()

            if crash_occured:
                time_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                stress_signature = self.stress_combinations[self.current_stress_combination_index-1]["signature"]
                log_filename = "{device_name}_round_{round}_{time_str}_{current_screen}_{current_stress}.txt".format(
                               device_name=self.device_name,
                               round=round,
                               time_str=time_str,
                               current_screen=self.current_screen,
                               current_stress=stress_signature)
                log_filename = log_filename.replace(" ", "_")
                log_filename = log_filename.replace("|", "_")

                print("Recording log, please do not terminate the program")
                with open(self.current_log_filename, "r") as f:
                    log_content = f.readlines()
                    log_content = log_content[-10000:]

                with open(log_filename, "w") as f:
                    for line in log_content:
                        f.write(line)
                print("Recording done")
            else:
                if not self.have_case_tested:
                    print("All test cases are done in round %d, starting a new round" % round)
                    round += 1
                    self.complete = set()
                print("Sleep for %d seconds to charge" % CHARGING_SECONDS_AFTER_EACH_CASE)
                sleep(CHARGING_SECONDS_AFTER_EACH_CASE)