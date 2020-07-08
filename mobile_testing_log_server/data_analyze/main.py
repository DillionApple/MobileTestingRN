from django.conf import settings
import django
from mobile_testing_log_server.settings import DATABASES, INSTALLED_APPS
settings.configure(DATABASES=DATABASES, INSTALLED_APPS=INSTALLED_APPS)
django.setup()
from mobile_testing_log_server.models import LogRecord

from django.db import connection
cursor = connection.cursor()

import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

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
    fig = plt.subplot()
    for device in devices:
        data = get_data(device, page, action)
        data = sorted(data)
        data_length = len(data)
        X = []
        Y = []
        for i in range(data_length):
            X.append(1.0 * (i + 1) / data_length * 100)
            Y.append(data[i])
        fig.plot(X, Y, label=device)
    plt.xlabel("percent")
    plt.ylabel("delay(ms)")
    title = "{page}-{action}".format(page=page, action=action)
    plt.title(title)
    plt.legend()
    fmt = '%.0f%%'  # Format you want the ticks, e.g. '40%'
    xticks = mtick.FormatStrFormatter(fmt)
    fig.xaxis.set_major_formatter(xticks)
    plt.savefig("{title}.png".format(title=title))
    plt.show()
    plt.close()

if __name__ == "__main__":
    devices = get_devices()
    page2action = get_page2action()
    for page in page2action:
        for action in page2action[page]:
            draw_all(page, action)