import os
import re
from datetime import datetime
from multiprocessing import Process
from config import *
from random import randint
from time import sleep

from exception import AppCrashedException

class Node:

    def __init__(self, name):
        self.name = name
        self.children = []

    def add_child(self, child):
        self.children.append(child)

class BaseTestFlow:

    CURRENT_LOG_FILENAME = "current_log.txt"

    def __init__(self):
        self.complete = set()
        self.current = None


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
        # }
        
        raise NotImplementedError()

    def navigate_back(self, back_btn):
        raise NotImplementedError()

    def collect_device_log_process_target(self):
        raise NotImplementedError()

    def dfs(self):
        sleep(10)
        parsed = self.parse_current_screen()
        node = Node(parsed['id'])
        print("Entered {0}".format(node.name))

        for nav_btn in parsed['nav_btns']:
            nav_btn_text = nav_btn.text
            if nav_btn_text in self.complete:
                continue
            self.current = nav_btn_text
            nav_btn.click()
            child = self.dfs()
            node.add_child(child)
            self.complete.add(nav_btn_text)

        act_btns = parsed['act_btns']
        if len(act_btns) > 0:
            for i in range(CLICK_TIMES_FOR_EACH_BUTTON * len(act_btns)):
                rand_index = randint(0, len(act_btns) - 1)
                act_btn = act_btns[rand_index]
                act_btn_text = act_btn.text.strip()
                if not re.match(r"\|-.*-\|", act_btn_text):
                    raise AppCrashedException("App crashed in screen {0}".format(node.name))
                act_btn.click()
                print("Button {0} clicked".format(act_btn.text))

        if parsed['back_btn']:
            self.navigate_back(parsed['back_btn'])

        print("Exited {0}".format(node.name))
        self.complete.add(node.name)
        return node
                
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
                root = self.dfs()
            except:
                crash_occured = True
                print("Broken on screen %s" % self.current)
                self.complete.add(self.current)
            finally:
                self.tear_down()
                log_proc.terminate()

            if crash_occured:
                time_str = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
                log_filename = "round_%d_%s_%s.txt" % (round, time_str, self.current)
                command = "mv '%s' '%s'" % (self.CURRENT_LOG_FILENAME, log_filename)
                os.system(command)
            else:
                print("All tests in round %d done" % round)
                round += 1
                self.complete = set()
