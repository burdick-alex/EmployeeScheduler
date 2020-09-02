from flask import Flask,jsonify,request
from flask_cors import CORS
from testShiftRequests import *
from utilityFunctions import *
import json
import json
app = Flask(__name__)

CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/getdata',methods=['POST','GET'])
def  return_data():
    if request.method == "POST":
        print(request.json)
        # = request.json['id']
        empList = getTable("th", "employee")
    else:
        print('not post')
        print(request.json)
        empList = getTable("th", "employee")
    return jsonify(empList)

@app.route('/getcompanies')
def  return_data2():
    empList = getCompanies("th")
    print(empList)
    # data = []
    # for i in range(len(empList)):
    #     employee = {"id": empList[i][0], "first": empList[i][1],
    #                     "last": empList[i][2], "memStat": empList[i][3]}
    #     data.append(employee)
    return jsonify(empList)

@app.route('/adddata',methods=['POST'])
def  update_data():
    if request.method == "POST":
        print(request.json)
        id = request.json['id']
        first = request.json['firstName']
        last = request.json['lastName']
        memstat = request.json['memstat']
        addEmployeeToDB("th", id, first, last, memstat)
        print(id, first, last, memstat)
    else:
        print('not post')
    return jsonify(201)

@app.route('/deletedata',methods=['POST'])
def  delete_data():
    if request.method == "POST":
        print(request.json)
        id = request.json['id']
        deleteEmployeeFromDB("th", id)
        print("Deleting employee:",id)
    else:
        print('not post')
    return jsonify(201)

@app.route('/cleardata',methods=['POST'])
def  clear_data():
    if request.method == "POST":
        print(request.json)
        name = request.json['companyName']
        clearTable(name,"th")
        print("Deleting employee:",name)
    else:
        print('not post')
    return jsonify(201)

@app.route('/postShifts',methods=['POST'])
def  update_shifts():
    if request.method == "POST":
        print(request.json)
        lst = request.json['shiftList']
        print('posting list',lst)
        updateShifts('th',lst)
    else:
        print('not post')
    return jsonify(201)

@app.route('/getShifts',methods=['POST','GET'])
def  return_dat3():
    if request.method == "POST":
        print(request.json)
        # = request.json['id']
        shiftList = getShifts("th", "shifts")
        print('the shift list is:',shiftList)
    else:
        print('not post')
        print(request.json)
        shiftList = getShifts("th", "shifts")
    return jsonify(shiftList)

@app.route('/schedule',methods=['POST','GET'])
def  schedule():
    if request.method == "POST":
        print(request.json)
        shifts = list(request.json['shifts'])
        try:
            shifts = scheduler(shifts)
        except:
            shifts = scheduler2(shifts)
        #shifts[0]['assignedEmployee'] = 'bobby'
        print('\n\n\n\n\n\n\nthe shift list is:',len(shifts))
    else:
        print('not post')
    return jsonify(shifts)
@app.route('/setPrefs',methods=['POST','GET'])
def  setPrefs():
    if request.method == "POST":
        print(request.json)
        changePref(request.json['newPref'],int(request.json['rowId']),int(request.json['id']))
        # shifts = list(request.json['shifts'])
        # shifts = scheduler(shifts)
        #shifts[0]['assignedEmployee'] = 'bobby'
        #print('\n\n\n\n\n\n\nthe shift list is:',len(shifts))
    else:
        print('not post')
    return jsonify(201)

