CLICK_TIMES_FOR_EACH_BUTTON = 10

ID_RE_PATTERN = r"<-[0-9a-zA-Z ]+->"
ACT_BTN_RE_PATTERN = r"\|-[0-9a-zA-Z ]+-\|"
NAV_BTN_RE_PATTERN = r"\[-[0-9a-zA-Z ]+-\]"
BACK_BTN_RE_PATTERN = r"Back"

INJECTION_BTN_RE_PATTERN = r"Injection"
INJECTION_CLEAR_BTN_RE_PATTERN = r"Clear"

CHARGING_SECONDS_AFTER_EACH_CASE = 2 * 60 # charge for 2 minutes

STRESS_PATTERNS = {
    "CPU": [0, 2],
    "Disk Write": [0, 2],
    "Network Download": [0, 2],
    "Memory": [0, 2],
}
