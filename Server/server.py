from flask import Flask
from flask import request
from flask import jsonify
app = Flask(__name__)

global units
units = [];


@app.route('/', methods=['GET','POST'])
def hello_world():
    return 'Hello, World!';


# Dumps all units and their positions
@app.route('/pull', methods=['GET'])
def pull():
    global units
    return jsonify(results=units)


# Creates a new unit, appends to units array
@app.route('/new_unit', methods=['POST'])
def new_unt():
    data = request.args

    global units

    if data['owner'] and data['posx'] and data['posy'] and data['unit_id']:
        unit = {}
        unit['owner'] = data['owner']
        unit['posx'] = data['posx']
        unit['posy'] = data['posy']
        unit['unit_id'] = data['unit_id']
        units.append(unit);
        return "success"
    return "fail"


# Updates the position of an existing unit
@app.route('/push', methods=['POST'])
def push():
    # print "data: " + str(request.args);
    data = request.args
    # dataDict = json.loads(data)

    global units

    if data['posx'] and data['posy'] and data['unit_id']:
        for x in range(0, len(units)):
            if data['unit_id'] == units[x]['unit_id']:
                units[x]['posx'] = int(data['posx']);
                units[x]['posy'] = int(data['posy']);
                return 'success';
    return "fail";
