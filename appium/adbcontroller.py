import os
import re


# os.system('adb version')
# os.system('adb devices')

def volume_up():
    os.system('adb shell "input keyevent 24"')


def volume_down():
    os.system('adb shell "input keyevent 25"')


def volume_mute():
    os.system('adb shell "input keyevent 164 "')


def light_up():
    os.system('adb shell "input keyevent 221"')


def light_down():
    os.system('adb shell "input keyevent 220"')


def read_mem():
    memory_string = os.popen('adb shell "cat /proc/meminfo"').read()
    """ 
    MemTotal:       
    MemFree:         
    MemAvailable:    
    """
    pattern = re.compile(r"MemTotal:[\D]*(\d*)[\D]*(\d*)[\D]*(\d*)", re.S)
    mem_list = list(map(float, pattern.findall(memory_string)[0]))
    # print(mem_list)
    mem_usg = (mem_list[0] - mem_list[2]) / mem_list[0] * 100
    print(mem_usg)
    return mem_usg


def read_cpu():
    cpu_string = os.popen('adb shell "dumpsys cpuinfo | grep mobiletesting"').read()
    pattern = re.compile(r"^[\s]*(.*?)%", re.S)
    cpu_usg = float(pattern.findall(cpu_string)[0])
    print(cpu_usg)
    return cpu_usg


if __name__ == '__main__':
    read_mem()
    read_cpu()
    volume_mute()
    # for i in range(10):
    #     volume_up()
