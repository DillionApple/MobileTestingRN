# coding=utf-8

from django.conf import settings
import django
from mobile_testing_log_server.settings import DATABASES, INSTALLED_APPS
settings.configure(DATABASES=DATABASES, INSTALLED_APPS=INSTALLED_APPS)
django.setup()
from mobile_testing_log_server.models import LogRecord

from django.db import connection
cursor = connection.cursor()

import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import halfnorm


def get_page2action():
    ret = {}
    query = """
        select distinct page, action from mobile_testing_log_server_logrecord        
    """
    cursor.execute(query)
    for row in cursor:
        page, action = row
        if ret.get(page) == None:
            ret[page] = []
        ret[page].append(action)
    return ret

def get_devices():
    ret = []
    query = """
        select distinct device from mobile_testing_log_server_logrecord
     """
    cursor.execute(query)
    for each in cursor:
        ret.append(each[0])
    return ret

def get_data(device, page, action):
    ret = []
    records = LogRecord.objects.filter(device=device, page=page, action=action)
    for record in records:
        ret.append(record.delay)
    return ret

def draw_all(page, action):
    all_data = []
    cols = min(3, len(devices))
    rows = len(devices) // cols
    if len(devices) % cols != 0:
        rows += 1
    fig, axs = plt.subplots(rows, cols, figsize=(6, 4))
    fig.tight_layout(rect=[0, 0.03, 1, 0.9])
    row = 0
    col = 0
    for device in devices:
        data = get_data(device, page, action)
        data = sorted(data)
        if rows == 1:
            if cols == 1:
                tmp_axs = axs
            else:
                tmp_axs = axs[col]
        else:
            tmp_axs = axs[row, col]
        tmp_axs.hist(data, 10)
        plt.xlim(0, 8)
        plt.xlabel("耗时 (ms)")
        plt.ylabel("频数（次）")
        # tmp_axs.set_title(device)
        if data:
            axs2 = tmp_axs.twinx()
            loc, scale = halfnorm.fit(data)
            limit = loc + 3 * scale
            percent = 100.0 * len([x for x in data if x >= limit])/len(data)
            X = [i/10 for i in range(80)]
            # plt.axvline(limit, c='r')
            # plt.text(limit, 0, '%.2f(%.2f%%)' % (limit, percent))
            axs2.plot(X, halfnorm.pdf(X, loc, scale), c='r')
            plt.ylabel("概率密度")
        col += 1
        row += int(col/cols)
        col %= cols
    # title = "{page}-{action}".format(page=page, action=action)
    # plt.suptitle(title, y=1.0)
    """
    fmt = '%.0f%%'  # Format you want the ticks, e.g. '40%'
    xticks = mtick.FormatStrFormatter(fmt)
    fig.xaxis.set_major_formatter(xticks)
    """
    # plt.show()
    plt.subplots_adjust(0.1, 0.12, 0.9, 0.95)
    # plt.savefig("hist/{title}.png".format(title=title))
    plt.savefig("hist/example.png")
    plt.close()


if __name__ == "__main__":
    plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']
    devices = ["google"]
    draw_all("AudioPlayList", "_onPause")
    exit()
    devices = get_devices()
    page2action = get_page2action()
    for page in page2action:
        for action in page2action[page]:
            draw_all(page, action)