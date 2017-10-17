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
        if data['username'] and data['x'] and data['y'] and data['id'] and data['type'] and data['color']:
            unit = data
            units.append(unit);
            return "success"
    except KeyError:
        return "Missing keys!"


    return "Something went terribly wrong"


# Updates the position of an existing unit
@app.route('/push', methods=['POST'])
def push():
    # print "data: " + str(request.args);
    data = request.values
    # dataDict = json.loads(data)

    global units

    if data['x'] and data['y'] and data['id']:
        for x in range(0, len(units)):
            if data['id'] == units[x]['id']:
                units[x]['x'] = int(data['x']);
                units[x]['y'] = int(data['y']);
                return 'success';
    return "fail";

# removes an existing unit
@app.route('/remove', methods=['POST'])
def remove():
    # print "data: " + str(request.args);
    data = request.values
    # dataDict = json.loads(data)

    global units

    if data['id']:
        for x in range(0, len(units)):
            if data['id'] == units[x]['id']:
                del units[x]# = None
                return 'success'
        return "Unit not found"
    return "fail";
