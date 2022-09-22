from flask import Flask
import requests

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('main.html')


@app.route('/search_yelp')
def search_yelp():
    data = requests.args
    for k,v in data.items():
        print(f"{k} : {v}")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
