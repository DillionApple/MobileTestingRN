# coding=gbk
import random
import re
import matplotlib.pyplot as plt
import numpy as np
import matplotlib
import seaborn as sns


def draw(name, data):
    data = np.array(data)
    data = sorted(data[data<3000])
    # sns.distplot(data, bins=30)
    n, bins, patches = plt.hist(data, bins=30, facecolor='b', alpha=0.75)
    plt.xlabel('Duration')
    plt.ylabel('Frequency')
    # plt.title(name)
    plt.grid(True)
    # plt.show()
    # maxfreq = n.max()
    # plt.ylim(ymax=np.ceil(maxfreq / 10) * 10 if maxfreq % 10 else maxfreq + 10)
    plt.savefig('./mobile_pic/%s_%s' % (mobile, name))
    plt.show()

mobile = 'vivo'
if __name__ == '__main__':
    pattern = re.compile(r'Module: (\S+) Function:(\S+) takes (\d+)ms')
    file_path = 'mobile_log/%s.txt' % mobile
    record_dict = {}
    with open(file_path) as log_file:
        log_content = log_file.read()
        ret = pattern.findall(log_content)
    for r in ret:
        if r[1] not in record_dict:
            record_dict[r[1]] = [int(r[2])]
        else:
            record_dict[r[1]].append(int(r[2]))
    # name = random.sample(record_dict.keys(), 1)[0]
    for name in record_dict.keys():
        # name = 'testImageView'
        draw(name, record_dict[name])
