CLICK_TIMES_FOR_EACH_BUTTON = 10

ID_RE_PATTERN = r"<-[0-9a-zA-Z ]+->"
ACT_BTN_RE_PATTERN = r"\|-[0-9a-zA-Z ]+-\|"
NAV_BTN_RE_PATTERN = r"\[-[0-9a-zA-Z ]+-\]"
BACK_BTN_RE_PATTERN = r"Back"

INJECTION_BTN_RE_PATTERN = r"Injection"
INJECTION_CLEAR_BTN_RE_PATTERN = r"Clear"

CHARGING_SECONDS_AFTER_EACH_CASE = 0.01 * 60  # charge for some minutes

TEAR_DOWN_RETRY_TIMES = 10

STRESS_PATTERNS = {
    # "CPU": [0, 2],
    # "Disk Write": [0, 2],
    # "Network Download": [0, 2],
    # "Memory": [0, 2],
    "CPU": [0],
    "Disk Write": [0],
    "Network Download": [0],
    "Memory": [0]
}
