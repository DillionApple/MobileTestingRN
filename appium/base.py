from config import *
from random import randint
from time import sleep

class Node:

    def __init__(self, name):
        self.name = name
        self.children = []

    def add_child(child):
        self.children.append(child)

class BaseTestFLow:    

    def __init__(self):
        pass

    def setup(self):
        raise NotImplementedError()

    def tear_down(self):
        print("\nDone\nn")
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

    def dfs(self):
        parsed = parse_current_screen()

        node = Node(parsed['id'])

        print("Entered {0}".format(node.name))

        for nav_btn in parsed['act_btns']:
            nav_btn.click()
            sleep(1)
            child = dfs()
            node.add_child(child)

        act_btns = parsed['act_btns']
        if len(act_btns) > 0:
            for i in range(CLICK_TIMES_IN_EACH_SCREEN):
                rand_index = randint(0, len(act_btns) - 1)
                act_btn = act_btns[rand_index]
                act_btn.click()
                print("Button {0} clicked".format(act_btn.text)) # TODO - act_btn.text may not be useable in iOS

        if parsed['back_btn']:
            parsed['back_btn'].click()
            sleep(1)

        print("Exited {0}".format(node.name))
        return node
                
    def main(self):
        setup()
        root = dfs()
        tear_down()
        
