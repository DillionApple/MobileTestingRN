import pickle

def save_state(data, filename):
    with open(filename, "wb") as f:
        pickle.dump(data, f)

def load_state(filename):
    with open(filename, "rb") as f:
        return pickle.load(f)