from __future__ import print_function
from ortools.sat.python import cp_model
from openpyxl import Workbook
from openpyxl import load_workbook
import sqlite3
import sys
import json
from openpyxl.styles import *
alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ"
class Employee:
    def __init__(self, name,id):
        self.name = name
        self.id = id
    def printName(self):
        print(self.name)
    def getRequests(self,d,s,reqs,model,shifts):
        book = load_workbook(filename="test.xlsx")
        sheet = book[self.name]
        for day in range(0,d):
            for shift in range(2,2+s):
                cell = sheet[alphabet[day] + str(shift)]
                if (cell.fill.start_color.rgb == "FF00B050"):
                    print("work request")
                    reqs[self.id][day][shift-2] = 1
                elif(cell.fill.start_color.rgb == "FFFF0000"):
                    print("no-work request")
                    print(self.name,"cannot work shift",shift-2,"on day",day)
                    model.Add(shifts[(self.id,day, int(shift-2))] != 1)
        return reqs

def connDB(self):
    self.conn = sqlite3.connect(self.dbname)
    self.cursor = self.conn.cursor()
    self.cursor.execute("PRAGMA key='mypassword'")

def createEmployeeSet(filename,companyName):
    connection = sqlite3.connect(filename + ".db")
    cursor = connection.cursor()
    sql_command = """
    CREATE TABLE %s ( 
    id INTEGER, 
    fname VARCHAR(20), 
    lname VARCHAR(30), 
    membershipStatus VARCHAR(15));""" %companyName
    cursor.execute(sql_command)
    connection.commit()
    connection.close()

def createTable(filename,companyName):
    connection = sqlite3.connect(filename + ".db")
    cursor = connection.cursor()
    sql_command = """
    CREATE TABLE %s (  
    events VARCHAR
    );""" %companyName
    cursor.execute(sql_command)
    connection.commit()
    connection.close()

def printDB(nameOfGroup):
    try:
        print("Printing table for " + nameOfGroup + ":")
        connection = sqlite3.connect(nameOfGroup + ".db")
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM employee')
        result = cursor.fetchall()
        for r in result:
            print(r)
    except:
        print("table doesn't exist")

def getTable(filename,tableName):
    try:
        print("Getting table for " + filename + ":")
        connection = sqlite3.connect(filename + ".db")
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM %s'%tableName)
        print('SELECT * FROM %s'%tableName)
        result = cursor.fetchall()
        return result
    except:
        print(sys.exc_info()[0])
        print("table doesn't exist")

def getCompanies(filename):
    try:
        print("Getting table for " + filename + ":")
        connection = sqlite3.connect(filename + ".db")
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM %s'%"companies")
        result = cursor.fetchall()
        processedResult = []
        for i in range(len(result)):
            processedResult.append(result[i][0])
        return processedResult
    except:
        print("table doesn't exist")

def getShifts(filename,tableName):
    try:
        print("Getting table for " + filename + ":")
        connection = sqlite3.connect(filename + ".db")
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM %s'%tableName)
        print('SELECT * FROM %s'%tableName)
        result = cursor.fetchall()
        return list(result)[0][0]
    except:
        print("table doesn't exist")

def addEmployeeToDB(nameOfGroup,id,firstName,lastName,membership):
    connection = sqlite3.connect(nameOfGroup + ".db")
    cursor = connection.cursor()
    format_str = """INSERT INTO employee (id, fname, lname, membershipStatus)
        VALUES ({id}, "{first}", "{last}", "{membership}");"""

    sql_command = format_str.format(id = id, first=firstName, last=lastName, membership=membership)
    print(sql_command)
    cursor.execute(sql_command)
    sql_command = format_str.format(id=id, first=firstName, last=lastName, membership=membership)
    command = """UPDATE employee SET prefs = "{1}" WHERE id = {0};""".format(str(id),"0"*(len(getShifts("th","shifts").split("}"))-1) )
    print(len(getShifts("th","shifts").split("}")),"\n",command)
    cursor.execute(command)
    connection.commit()
    connection.close()

def addCompanyToDB(filename,cname):
    connection = sqlite3.connect(filename + ".db")
    cursor = connection.cursor()
    format_str = """INSERT INTO companies (cName)
        VALUES ("%s");""" %cname

    sql_command = format_str#format_str.format(name=cname)
    print(sql_command)
    cursor.execute(sql_command)
    connection.commit()
    connection.close()

def deleteEmployeeFromDB(nameOfGroup,id):
    connection = sqlite3.connect(nameOfGroup + ".db")
    cursor = connection.cursor()
    cursor.execute('DELETE FROM employee WHERE id=' + str(id))
    connection.commit()
    connection.close()

def deleteCompanyFromDB(filename,cname):
    connection = sqlite3.connect(filename + ".db")
    cursor = connection.cursor()
    cursor.execute('DELETE FROM companies WHERE cName=' + str(cname))
    connection.commit()
    connection.close()


def dropTable(tableName,nameOfGroup):
    connection = sqlite3.connect(nameOfGroup + ".db")
    cursor = connection.cursor()
    cursor.execute('DROP table if exists ' + tableName)
    connection.commit()
    connection.close()

def clearTable(tableName,nameOfGroup):
    connection = sqlite3.connect(nameOfGroup + ".db")
    cursor = connection.cursor()
    cursor.execute('DELETE FROM ' + tableName)
    connection.commit()
    connection.close()

def updateShifts(filename, newShifts):
    clearTable('shifts','th')
    connection = sqlite3.connect(filename + ".db")
    cursor = connection.cursor()
    format_str = """INSERT INTO shifts (events)
        VALUES ("%s");""" % newShifts

    sql_command = format_str  # format_str.format(name=cname)
    print(sql_command)
    cursor.execute(sql_command)
    connection.commit()
    connection.close()
def addColumn():
    connection = sqlite3.connect("th.db")
    cursor = connection.cursor()
    command = """ALTER TABLE employee 
        ADD prefs varchar(255);"""
    cursor.execute(command)
def fillColumns():
    connection = sqlite3.connect("th.db")
    cursor = connection.cursor()
    command = """UPDATE employee SET prefs = "0000";"""
    cursor.execute(command)
    connection.commit()
    connection.close()

def changePref(newPref,rowId,empId):
    connection = sqlite3.connect("th.db")
    cursor = connection.cursor()
    command = """SELECT * FROM employee WHERE id = %s;"""%str(empId)
    cursor.execute(command)
    pref = list(cursor.fetchall()[0][4])
    pref[rowId] = newPref
    pref = str(pref).strip("[]").replace("'","").replace(" ","").replace(",","")
    command = """UPDATE employee SET prefs = "{1}" WHERE id = {0};""".format(str(empId),pref)
    cursor.execute(command)
    connection.commit()
    connection.close()









