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
if(filetheme == null)
{
  filetheme = 'dark';
}
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
    window.shiftTable = this;

    var storedData = localStorage.getItem('schedule');
    if(window.Calendar)
    {
      if(!storedData || window.calendar.state.events.length > JSON.parse(storedData).length)
      {
        console.log("rendering from backend")
        this.state = {
          shifts: []
        }
        getShifts();
      }
      else
      {
        this.state = {
          shifts: JSON.parse(storedData)
        }
        console.log("rendering from local",this.state.shifts);
      }
    }
    else if(!storedData)
    {
      console.log("rendering from backend")
      this.state = {
        shifts: []
      }
      getShifts();
    }
    else
    {
      this.state = {
        shifts: JSON.parse(storedData)
      }
      console.log("rendering from local",this.state.shifts);
    }
    this.addShiftToState = this.addShiftToState.bind(this);
    this.addFromLocalStorage = this.addFromLocalStorage.bind(this);
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
    this.setState({
      shifts: newItems[0]
    });
    
  }
  
  addFromLocalStorage(storedData)
  {
    console.log("trying to add",JSON.parse(storedData));
    this.setState(
      {
        shifts: JSON.parse(storedData)
      }
    );
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
        Header: "Assigned Employee(s)",
        accessor: "assignedEmployee"
      },
      {
        Header: "Edit Shift",
        id: 'editRow',
        Cell: (row) => (<button style={{backgroundColor: 'red',color: 'white',cursor:'pointer'}} onClick={() => {
              let data = this.state.shifts;
              const name = this.state.shifts[row.index].title;
              const start = this.state.shifts[row.index].start;
              const end = this.state.shifts[row.index].end;
              getShiftsNoUpdate(row.index);
              //var currentState = window.calendar.state.events;
              //var currentShifts = [getShiftsNoUpdate().then((data) => {return data})];
              //var shifts2 = currentShifts[1];
              //console.log("hello",currentShifts[0]);
              //postShifts()
              //deleteDbData(idNum);
            }}>Delete</button>)
      }
    ] 
    return (
      <div>
        <ReactTable ref={this.myRef} columns={columns} data={this.state.shifts} noDataText="No Shifts" href='./styles/ReactTable.css' />
      </div>
      
    );
  }
}







function getDbData()
{
  const url = "http://localhost:5000/getdata"

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      console.log(data);
      for (var i = 0;i <  data.length;i++)
      {
        window.employeeTable.addEmployeeToState(data[i][0],data[i][1],data[i][2],data[i][3]);
      }
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });

}


function getDbDataLength()
{
  return window.employeeTable.state.employees.length;
}

function deleteDbData(id)
{

  console.log(id);
  const url = "http://localhost:5000/deletedata"

  axios.post(url,{
    id: id
  })
  .then(function (response) {
    window.location.reload(true);
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function clearDbData(name)
{

  console.log(name);
  const url = "http://localhost:5000/cleardata"

  axios.post(url,{
    companyName: name
  })
  .then(function (response) {
    window.location.reload(true);
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
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
        window.shiftTable.addShiftToState(title,start,end,"");
      }
      console.log("shifts in  schedule state are now:",window.shiftTable.state.shifts)
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




function postDbData(id,first,last,memStat)
{

  console.log(id);
  const url = "http://localhost:5000/adddata"

  axios.post(url,{
    id: id,
    firstName: first,
    lastName: last,
    memstat: memStat,
  })
  .then(function (response) {
    window.location.reload(true);
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


function formatDate(date)
{
    var date = date.split('T')
    var time = date[1];
    date = date[0];

    const months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
    var month = date.split('-')[1];
    month = months[parseInt(month) - 1];

    var day = date.split('-')[2];

    var year = date.split('-')[0];

    return (month + " " + day + ", " + year + " " + time + ':00')
}


function formatDate2(date)
{
    var date = date.split('T')
    var time = date[1];
    console.log("Original is:",time);
    var hour = time.split(":")[0];
    var min = time.split(":")[1];
    var ampm = "am";

    if(hour.trim() == "12")
    {
        ampm = "pm";
    }
    else if(hour.trim() == "13")
    {
        hour = "1";
        ampm = "pm";
    }
    else if(hour.trim() == "14")
    {
        hour = "2";
        ampm = "pm";
    }
    else if(hour.trim() == "15")
    {
        hour = "3";
        ampm = "pm";
    }
    else if(hour.trim() == "16")
    {
        hour = "4";
        ampm = "pm";
    }
    else if(hour.trim() == "17")
    {
        hour = "5";
        ampm = "pm";
    }
    else if(hour.trim() == "18")
    {
        hour = "6";
        ampm = "pm";
    }
    else if(hour.trim() == "19")
    {
        hour = "7";
        ampm = "pm";
    }
    else if(hour.trim() == "20")
    {
        hour = "8";
        ampm = "pm";
    }
    else if(hour.trim() == "21")
    {
        hour = "9";
        ampm = "pm";
    }
    else if(hour.trim() == "22")
    {
        hour = "10";
        ampm = "pm";
    }
    else if(hour.trim() == "23")
    {
        hour = "11";
        ampm = "pm";
    }
    else if(hour.trim() == "00")
    {
        hour = "12";
        ampm = "am";
    }

    time = hour + ":" + min;
    console.log("New is:",time);
    date = date[0];

    const months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
    var month = date.split('-')[1];
    month = months[parseInt(month) - 1];

    var day = date.split('-')[2];

    var year = date.split('-')[0];

    return (time + " " + ampm + "  -   " + month + " " + day + ", " + year)
}


function schedule()
{

  const url = "http://localhost:5000/schedule"

  axios.post(url,{
    shifts: window.shiftTable.state.shifts
  })
  .then(function (response) {
    //window.location.reload(true);
    const data = response.data;
    console.log(response.data);
    window.shiftTable.setState(
      {
        shifts: data
      }
    )
    localStorage.setItem('schedule', JSON.stringify(data));
    //window.location.reload(true);
  })
  .catch(function (error) {
    console.log(error);
  });
}

class ScheduleButton extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        isOpened: false
      };
      this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    //{window.parent.employeeTable.addEmployee(0,"f","L","member")}
    schedule();
    this.setState({isOpened: !this.state.isOpened});
  };


  render() {
    return (
      <button style={{display:'inline-block',marginBottom:'1%',width:'20%',paddingTop:"1%",paddingBottom:'1%',marginLeft:'.5%',backgroundColor:'#3700b3',color:'white'}} onClick={this.handleClick}>
        Schedule
      </button>
    );
  }
}

class ClearScheduleButton extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        isOpened: false
      };
      this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    //{window.parent.employeeTable.addEmployee(0,"f","L","member")}
    localStorage.removeItem('schedule');
    window.location.reload(true);
    this.setState({isOpened: !this.state.isOpened});
  };


  render() {
    return (
      <button style={{display:'inline-block',marginBottom:'1%',marginLeft:'.5%',width:'20%',paddingTop:"1%",paddingBottom:'1%',backgroundColor:'red',color:'white'}} onClick={this.handleClick}>
        Clear Schedule
      </button>
    );
  }
}

class SchedulePage extends React.Component{
    render()
    {
        return (
            <div>
                <h1 id='shiftsTitle2' >Shifts</h1>
                <ScheduleButton/>
                <ClearScheduleButton/>
                <Table id='shifts'/>
            </div>
        );
    }
  }

export default SchedulePage;