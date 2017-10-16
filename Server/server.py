from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

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
    data = request.values

    #import pdb;pdb.set_trace()

    global units

    try:
        if data['owner'] and data['posx'] and data['posy'] and data['unit_id'] and data['type']:
            unit = {}
            unit['owner'] = data['owner']
            unit['posx'] = data['posx']
            unit['posy'] = data['posy']
            unit['unit_id'] = data['unit_id']
            unit['type'] = data['type']
            units.append(unit);
            return "success"
    except KeyError:
        return "Missing keys!"


    return "Something went terribly wrong"


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

# removes an existing unit
@app.route('/remove', methods=['POST'])
def remove():
    # print "data: " + str(request.args);
    data = request.args
    # dataDict = json.loads(data)

    global units

    if data['unit_id']:
        for x in range(0, len(units)):
            if data['unit_id'] == units[x]['unit_id']:
                units[x] = None
                return 'success'
        return "Unit not found"
    return "fail";
