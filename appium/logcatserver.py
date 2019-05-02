from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route('/log/<errstr>')
def show_user_profile(errstr):
    print('ERR: %s' % errstr)
    return 'ERR: %s' % errstr
