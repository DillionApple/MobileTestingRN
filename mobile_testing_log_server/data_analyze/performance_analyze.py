import os
import codecs

import matplotlib.pyplot as plt
from scipy.stats import norm, expon

from data_analyze.utils import *

ROOT_PATH="./performance_summary/"

# DISTRIBUTION = "half_norm"
DISTRIBUTION = "expon"
NO_STRESS = False

try:
    os.mkdir(ROOT_PATH)
except:
    pass


def process(type): # type -> device -> {u, sigma, sigma/u, fixed_u, fixed_sigma/u, score}
    fig = plt.subplot()
    max_avg = 0
    max_sigma = 0
    max_sigma_div_avg = 0
    devices_having_records = []
    for device in devices:
        print("processing type: {0}, device: {1}".format(type, device))
        data = []
        for page in CLASSES[type]:
            data = data + get_data(device, page, NO_STRESS)
        if len(data) == 0:
            continue
        devices_having_records.append(device)
        data_avg = sum(data) / len(data)
        max_avg = max(data_avg, max_avg)
        summary[type][device]['avg'] = data_avg
        if DISTRIBUTION == "half_norm":
            data = data + [-1 * x for x in data]
            data = sorted(data)
            loc, sigma = norm.fit(data)
            summary[type][device]['sigma'] = sigma
            summary[type][device]['sigma_div_avg'] = sigma / data_avg
            distribution_func = norm
        elif DISTRIBUTION == "expon":
            params = expon.fit(data)
            print(data_avg)
            print(params)
            summary[type][device]['sigma'] = sigma
            summary[type][device]['sigma_div_avg'] = sigma / data_avg
            distribution_func = expon

        max_sigma = max(summary[type][device]['sigma'], max_sigma)
        max_sigma_div_avg = max(summary[type][device]['sigma_div_avg'], max_sigma_div_avg)

        steps = 1000
        try:
            data = sorted(data)
            step = 1.0 * (data[-1] - data[0]) / steps
            norm_x = [data[0] + i * step for i in range(steps)]
            fig.plot(norm_x, distribution_func.pdf(norm_x, loc, sigma), label="%s(μ=%.2f,σ=%.2f)" % (device, data_avg, sigma))
        except:
            pass

    title = "{type}-{distribution}".format(type=type, distribution=DISTRIBUTION)
    plt.suptitle(title, y=1.0)
    plt.legend()
    plt.xlim(0, 3 * max_sigma)
    plt.savefig(os.path.join(ROOT_PATH, "{0}-{1}.png".format(type, DISTRIBUTION)))
    plt.close()

    for device in devices_having_records:
        summary[type][device]["fixed_avg"] = summary[type][device]["avg"] / max_avg
        summary[type][device]["fixed_sigma_div_avg"] = summary[type][device]["sigma_div_avg"] / max_sigma_div_avg
        summary[type][device]["score"] = summary[type][device]["fixed_avg"] + summary[type][device]["fixed_sigma_div_avg"]

def output_summary(summary):
    f = codecs.open(os.path.join(ROOT_PATH, "performance_summary_{distribution}.csv".format(distribution=DISTRIBUTION)), "w", "utf-8")
    csv_head = ",".join(["type", "device", "mu", "sigma", "sigma/mu", "mu(fixed)", "sigma/mu(fixed)", "score"])
    f.write(csv_head + "\n")
    keys = ["avg", "sigma", "sigma_div_avg", "fixed_avg", "fixed_sigma_div_avg", "score"]
    device_data = {}
    for device in devices:
        device_data[device] = {}
        for key in keys:
            device_data[device][key] = []
    for each_class in CLASSES:
        for device in devices:
            try:
                data = summary[each_class][device]
                csv_line = "{type},{device},{avg:.2f},{sigma:.2f},{sigma_div_avg:.2f},{fixed_avg:.2f},{fixed_sigma_div_avg:.2f},{score:.2f}\n".format(
                    type=each_class,
                    device=device,
                    avg=data["avg"],
                    sigma=data["sigma"],
                    sigma_div_avg=data["sigma_div_avg"],
                    fixed_avg=data["fixed_avg"],
                    fixed_sigma_div_avg=data["fixed_sigma_div_avg"],
                    score=data["score"],
                )
                for key in keys:
                    device_data[device][key].append(data[key])
            except:
                csv_line = "{type},{device},-,-,-,-,-,-\n".format(
                    type = each_class,
                    device = device,
                )
            f.write(csv_line)
    for device in devices:
        csv_line = "All,{device},{avg:.2f},{sigma:.2f},{sigma_div_avg:.2f},{fixed_avg:.2f},{fixed_sigma_div_avg:.2f},{score:.2f}\n".format(
            device=device,
            avg=get_avg(device_data[device]["avg"]),
            sigma=get_avg(device_data[device]["sigma"]),
            sigma_div_avg=get_avg(device_data[device]["sigma_div_avg"]),
            fixed_avg=get_avg(device_data[device]["fixed_avg"]),
            fixed_sigma_div_avg=get_avg(device_data[device]["fixed_sigma_div_avg"]),
            score=get_avg(device_data[device]["score"]),
        )
        f.write(csv_line)


    f.close()


if __name__ == "__main__":
    # devices = get_devices()
    devices = ["HUAWEI", "vivo", "samsung", "google", "Apple"]
    summary = {}
    for each in CLASSES:
        summary[each] = {}
        for device in devices:
            summary[each][device] = {}
    for each in CLASSES:
        process(each)
    output_summary(summary)
