import re
import os
import codecs

ROOT_LOG_FOLDER="all_logs"
DEVICES=["huawei_p9_plus", "nexus_6p", "samsung_s9", "vivo_x27", "test_phone"]

page2type = {
    "UITest": "UI",
    "ImageViewerTest": "UI",
    "Online_Video_1": "Video",
    "Online_Video_2": "Video",
    "Online_Video_4": "Video",
    "Online_Video_8": "Video",
    "Offline_Video_1": "Video",
    "Offline_Video_2": "Video",
    "Offline_Video_4": "Video",
    "Offline_Video_8": "Video",
    "AudioPlayList": "Audio",
    "AudioTest": "Audio",
    "AnimatedMarkers": "Map",
    "AnimatedNavigation": "Map",
    "DefaultMarkers": "Map",
    "ViewsAsMarkers": "Map",
    "FileSystemScreen": "Filesystem",
    "DBScreen": "Filesystem",
    "Download_1_files": "Download",
    "Download_2_files": "Download",
    "Download_3_files": "Download",
    "Download_4_files": "Download",
    "Download_5_files": "Download",
    "WebGLScreen": "3D",
    "CameraScreen": "Camera",    
}

type_count = {
    "3D": 1,
    "Audio": 2,
    "Camera": 1,
    "Download": 5,
    "Filesystem": 2,
    "Map": 4,
    "UI": 2,
    "Video": 8,
}

# NOTE - modify this, these data are fake
# the device name is the same with the device name in the log
device_rounds = {
    "huawei_p9_plus": 1,
    "nexus_6p": 1,
    "samsung_s9": 1,
    "vivo_x27": 1,
    "test_phone": 1,
}

# NOTE - modify this if the stress combination changed
stress_count = 16

types = sorted(list(set([page2type[key] for key in page2type])))

def process(device):
    # vivo_x27_round_3_2020-07-05_15-07-36_[-Download_4_files-]_(CPU-2)(Disk_Write-2)(Memory-2)(Network_Download-0).txt
    pattern = r"^" + device + r".*\[-(.*)\-].*CPU-(\d).*Disk_Write-(\d).*Memory-(\d).*Network_Download-(\d).*$"
    
    page_crash_count = {} # case -> [0000, 0001, ...]
    type_crash_count = {} # type -> [0000, 0001, ...]
    
    for type in types:
        type_crash_count[type] = [0] * 16

    files = os.popen("ls %s" % ROOT_LOG_FOLDER).read()
    files = files.strip().split("\n")

    for each in files:
        match = re.match(pattern, each)
        if match:
            page = match.group(1)
            cpu = int(match.group(2)) // 2
            disk = int(match.group(3)) // 2
            memory = int(match.group(4)) // 2
            network = int(match.group(5)) // 2
            stress = (cpu << 3) | (disk << 2) | (memory << 1) | network
            if page_crash_count.get(page) == None:
                page_crash_count[page] = [0] * 16
            page_crash_count[page][stress] += 1
            page_type = page2type.get(page)
            if page_type:
                type_crash_count[page_type][stress] += 1

    page_types = types
    for page_type in page_types:
        summary[device][page_type] = sum(type_crash_count[page_type])

def output_summary(summary):
    f = codecs.open("crash_summary.csv", "w", "utf-8")
    header = ",".join(["type", "device", "crash_count", "type_count", "stress_count", "rounds", "crash_rate"])
    f.write(header + "\n")

    for type in types:
        for device in DEVICES:
            csv_line = "{type},{device},{crash_count},{type_count},{stress_count},{rounds},{crash_rate}\n".format(
                type=type,
                device=device,
                crash_count=summary[device][type],
                type_count=type_count[type],
                stress_count=stress_count, # modify this if stress combination changed
                rounds=device_rounds[device],
                crash_rate=summary[device][type]/(type_count[type] * stress_count * device_rounds[device])
            )
            f.write(csv_line)

    f.close()

if __name__ == "__main__":
    summary = {} # device -> type -> count
    for device in DEVICES:
        summary[device] = {}
        process(device)
    output_summary(summary)