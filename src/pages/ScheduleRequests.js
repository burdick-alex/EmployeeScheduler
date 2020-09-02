import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTable from 'react-table-v6';
import Stringify from 'react-stringify';


//styles

var filetheme = localStorage.getItem('theme');
require ('../styles/' + filetheme + '/ReactTable.css');
require ('../styles/' + filetheme + '/Application.css');
require ('../styles/' + filetheme + '/react-tabs.css');


function getShiftsNoUpdate(index)
{
  var dataa = [];
  const url = "http://localhost:5000/getShifts"
  return(
  axios.get(url)
    .then(function (response) {
      // dataa = response.data.replace(/'/g,'"').replace(/False/gi,'false');
      // dataa = JSON.parse(dataa);
      var data = JSON.parse(response.data.replace(/'/g,'"').replace(/False/gi,'false'));
      const newlist = [];
      for(var i = 0; i < data.length;i++)
      {
        if(i != index)
        {
          newlist.push(data[i]);
        }
      }

      postShifts(newlist);
    })
    .catch(function (error) {
      console.log(error);
    }));

}



function postShifts(shifts)
{

  console.log('sending',shifts);
  const url = "http://localhost:5000/postShifts"

  axios.post(url,{
    shiftList: shifts
  })
  .then(function (response) {
    window.location.reload(true);
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


class Table extends Component
{
  constructor(props)
  {
    super(props);
    window.shiftTable2 = this;

    var storedData = localStorage.getItem('schedule');
    if(window.Calendar)
    {
      if(!storedData || window.calendar.state.events.length > JSON.parse(storedData).length)
      {
        console.log("rendering from backend")
        this.state = {
          shifts: [],
          employees: [{prefs:"0000"}]
        }
        getShifts();
        //getDbData2();
      }
      else
      {
        this.state = {
          shifts: JSON.parse(storedData),
          employees: [{prefs:"0000"}]
        }
        //getDbData2();
        console.log("rendering from local",this.state.shifts);
      }
    }
    else if(!storedData)
    {
      console.log("rendering from backend")
      this.state = {
        shifts: [],
        employees: [{prefs:"0000"}]
      }
      //getDbData2();
      getShifts();
    }
    else
    {
      this.state = {
        shifts: JSON.parse(storedData),
        employees: [{prefs:"0000"}]
      }
      //getDbData2();
      console.log("rendering from local",this.state.shifts);
    }
    this.addShiftToState = this.addShiftToState.bind(this);
    this.addFromLocalStorage = this.addFromLocalStorage.bind(this);
    this.addEmployeeToState = this.addEmployeeToState.bind(this);
    this.handleInputChangeSelect = this.handleInputChangeSelect.bind(this);
    this.addEmp = this.addEmp.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;
    if(this._isMounted)
    {
      this.setState({
        employees: []
      });
    }
    fetch('http://localhost:5000/getdata')
        .then(res => res.json())
        .then(data => this.addEmp(data))
    };
  
  componentWillUnmount()
  {
    this._isMounted = false;
  }

  forceUpdateHandler(){
    console.log("forcing update");
    this.forceUpdate();
  };

  addShiftToState(title,start,end,name)
  {
    console.log("running")
    var newItems= [this.state.shifts];
    newItems[0].push({title:title, start:start, end:end, assignedEmployee:name });
    if(this._isMounted)
    {
      this.setState({
        shifts: newItems[0]
      });
    }
    
  }

  addEmp(data)
  {
    for (var i = 0;i <  data.length;i++)
      {
        console.log("looking for",localStorage.getItem('emp'),"found",data[i][0]);
        if(data[i][0] == localStorage.getItem('emp'))
        {
            console.log("adding",data[i][0])
            window.shiftTable2.addEmployeeToState(data[i][0],data[i][1],data[i][2],data[i][3],data[i][4]);
        }
      }
  }

  addEmployeeToState(id,first,last,memStat,prefs)
  {
    console.log("running lalala")
    var newItems= [this.state.employees];
    newItems[0].push({id:id, first: first, last: last, memStat:memStat, prefs:prefs});
    if(this._isMounted)
    {
      this.setState({
        employees: newItems[0]
      });
    }
    
  }
  
  addFromLocalStorage(storedData)
  {
    console.log("trying to add",JSON.parse(storedData));
    if(this._isMounted)
    {
      this.setState(
        {
          shifts: JSON.parse(storedData)
        }
      );
    }
  }

  handleInputChangeSelect = (event) => {
    console.log("Changing", event.target.name,"to",event.target.value);
    var rowNum = event.target.name.charAt(event.target.name.length - 1);
    postPrefs(localStorage.getItem('emp'),rowNum,event.target.value);
    // this.setState({
    //   employees: event.target.value
    // })
    console.log("Now its");
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
    this.componentDidMount;
  }

  render() {
    const columns = [
      {
        Header: "Shift Name",
        accessor: "title"
      },
      {
        Header: "Shift start",
        accessor: "start"
      },
      {
        Header: "Shift end",
        accessor: "end"
      },
      {
        Header: "Preference",
        id: 'editRow',
        Cell: (row) => (
          <div>
            <select name={"employ" + row.index} onChange={this.handleInputChangeSelect} >
              <option selected={this.state.employees[0].prefs.charAt(row.index) == "0"} key={0} value={0}>N/A</option>
              <option selected={this.state.employees[0].prefs.charAt(row.index) == "1"} key={1} value={1}>Preffered</option>
              <option selected={this.state.employees[0].prefs.charAt(row.index) == "2"} key={2} value={2}>Can't Work</option>
            </select>
          </div>  
          // <span>
            //     <input checked={this.state.employees[0].prefs.charAt(row.index) == "0"} type="radio" id="blank" name={row.index} value="na"/>
            //     <label for="blank">N/A</label>
            //     <input checked={this.state.employees[0].prefs.charAt(row.index) == "1"} type="radio" id="cant" name={row.index} value="no" onclick={console.log("21")}/>
            //     <label for="cant">Can't Work</label>
            //     <input  checked={this.state.employees[0].prefs.charAt(row.index) == "2"}type="radio" id="pref" name={row.index} value="pref"/>
            //     <label for="pref">Preffered</label>
            // </span>
        )
    }
    ] 
    console.log("lalala",this.state.employees);
    return (
      <div>
        <ReactTable ref={this.myRef} columns={columns} data={this.state.shifts} noDataText="No Shifts" href='./styles/ReactTable.css' />
      </div>
      
    );
  }
}



function getShifts()
{
  const url = "http://localhost:5000/getShifts"

  var shiftList = []

  axios.get(url)
    .then(function (response) {
      var data = response.data;
      console.log("date is at getS:",data);
      data = data.replace(/{/g," ").replace(/}/g," ").split(',');
      console.log(data);
      data[0] = data[0].substr(1);
      data[data.length - 1] = data[data.length - 1].substr(0,data[data.length - 1].length - 1);
      var formattedData = [];
      for (var i = 0;i <=  data.length - 3;i = i + 4)
      {
        var allDay = data[i].split(":")[1].replace(/'/g,"").trim();
        if (allDay.toLowerCase() == "true")
        {
            allDay = true;
        }
        else
        {
            allDay = false;
        }
        var end = formatDate3(data[i+1].split("end':")[1].replace(/'/g,""));
        console.log("start is:",data[i+2]);
        var start = formatDate3(data[i+2].split("start':")[1].replace(/'/g,""));
        var title = " "
        if(data[i+3] != undefined)
        {
            var title = data[i+3].split("title':")[1].replace(/'/g,"").trim();
        }
        console.log("I'm here doing ",title,start);
        window.shiftTable2.addShiftToState(title,start,end,"");
      }
      console.log("shifts in  schedule state are now:",window.shiftTable2.state.shifts)
    })
    .catch(function (error) {
      console.log(error);
    });

}

//selected={this.state.employees[0].prefs[row.index] == 0}

function getDbData()
{
  const url = "http://localhost:5000/getdata"

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      console.log("hogwash",data);
      for (var i = 0;i <  data.length;i++)
      {
        window.selector.addEmployeeToState(data[i][0],data[i][1],data[i][2],data[i][3],data[i][4]);
      }
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getDbData2()
{
  const url = "http://localhost:5000/getdata"

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      console.log("hogwash",data);
      for (var i = 0;i <  data.length;i++)
      {
        console.log("looking for",localStorage.getItem('emp'),"found",data[i][0]);
        if(data[i][0] == localStorage.getItem('emp'))
        {
            console.log("adding",data[i][0])
            window.shiftTable2.addEmployeeToState(data[i][0],data[i][1],data[i][2],data[i][3],data[i][4]);
        }
      }
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });
}


function postPrefs(id,rowId,newPref)
{

  console.log(id,rowId,newPref);
  const url = "http://localhost:5000/setPrefs"

  axios.post(url,{
    id: id,
    rowId: rowId,
    newPref: newPref,
  })
  .then(function (response) {
    //window.location.reload(true);
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function formatDate3(date)
{
  var date = date.split('T')
  var time = date[1];
  date = date[0];
  date = date + " " + time.split(":")[0] + ":" + time.split(":")[1]
  //var d = moment.utc(date).tz("America/Toronto");
  return date;
}

class Selector extends React.Component
{
  constructor(props)
  {
    super(props);
    window.selector = this;
    this.state = {
      employees: [],
      selected: localStorage.getItem('emp')
    }
    getDbData();
    this.addEmployeeToState = this.addEmployeeToState.bind(this);
  }

  componentDidMount()
  {
    this._isMounted = true;
  }

  componentWillUnmount()
  {
    this._isMounted = false;
  }

  addEmployeeToState(id,first,last,memStat,prefs)
  {
    console.log("running")
    var newItems= [this.state.employees];
    newItems[0].push({id:id, first: first, last: last, memStat:memStat, prefs:prefs});
    if(this._isMounted)
    {
      this.setState({
        employees: newItems[0]
      });
    }
    
  }

  getEmpName(id)
  {
    for(var i = 0;i< this.state.employees.length;i++)
    {
        if(this.state.employees[i].id == id)
        {
            return this.state.employees[i].first + " " + this.state.employees[i].last;
        }
        
    }
    if(this.state.employees.length > 0)
    {
        return this.state.employees[0].first + " " + this.state.employees[0].last;
    }
    else
    {
        return null;
    }
  }
  render()
    {
        return (
        <div>
            <span>
                Employee:   
                <select name="employ" onChange={e => {console.log(e.target.value),localStorage.setItem('emp',e.target.value);window.location.reload(true);/*localStorage.setItem('theme',e.target.value);console.log("setting to",e.target.value);window.location.reload(true);}*/}}>
                    {this.state.employees.map((item,i) => {return(<option selected={localStorage.getItem('emp') == item.id} key={item.id} value={item.id}>{item.id}</option>)})}
                </select>
            </span>
            <div>
        <h2>{this.getEmpName(localStorage.getItem('emp'))}</h2>
            </div>
        </div>
        );
    }
}


class ScheduleRequestsPage extends React.Component{
    render()
    {
        // getDbData();
        // console.log("hello",this.employeeHolder.state.employees);
        // var optionss = [];
        // for(var i = 0;i < this.employeeHolder.state.employees.length;i++)
        // {
        //     optionss.push(this.employeeHolder.state.employees);
        // }
        // console.log("ops are",optionss)
        return (
        <div>
            <Selector defaultValue={localStorage.getItem('emp')}/>
            <Table id='shifts'/>
        </div>
        );
    }
  }

export default ScheduleRequestsPage;