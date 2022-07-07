import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';


//styles
var filetheme = localStorage.getItem('theme');
if(filetheme == null)
{
  filetheme = 'dark';
}
require ('../styles/' + filetheme + '/Calendar.css');



const localizer = momentLocalizer(moment)

class EditEventPopup extends React.Component {
    constructor(props) {
      super(props);
      window.eventPop = this;
      this.state = { 
        open: false,
        name: "_",
        start: "n/a",
        end: "n/a"
       };
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.openUp = this.openUp.bind(this);
    }
    openModal() {
      this.setState({ open: true });
    }
    closeModal() {
      this.setState({ open: false });
      //window.employeeTable.addEmployeeToState(0,"","","");
    }
    openUp(e)
    {
      this.openModal();
      this.setState(
        { 
           name: e.title.toString(),
           start: e.start.toString(),
           end: e.end.toString(),
           allDay: e.allDay
        });
      console.log("dog",e.allDay);
  
    }
  
    render() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return (
        <span>
          <Popup
            open={this.state.open}
            closeOnDocumentClick
            onClose={this.closeModal}
            style={{width:'15%'}}
          >
  
            
            <div className="modal" id='popup'>
              <button className="button" onClick={this.closeModal} style={{position:'absolute',top:0,right:0,backgroundColor:'#f04e1f',borderRadius:'50%',border:'none'}}>
                X
              </button>
                <h1 style={{color:'white',display:'block',textAlign:'center',paddingTop:'10%'}}>
                  {this.state.name}
                  <br></br>
                </h1>
                {!this.state.allDay ?(
                
                <span style={{color:'white',paddingBottom:'10%',float:'center'}}>
                  <h3 style={{color:'white',display:'inline',float:'center',paddingRight:'2%'}}>Starts:</h3>
                  {this.state.start.split("GMT")[0]}
                  <br></br>
                  <h3 style={{color:'white', display:'inline',paddingRight:'2%'}}>Ends:</h3>
                  {this.state.end.split("GMT")[0]}
                </span>) : 
                (
                  <span style={{paddingBottom:'10%',float:'center'}}>
                  <h3 style={{color:'white',display:'inline',float:'center',paddingRight:'2%'}}>Date:</h3>
                  <h4 style={{color:'white',display:'inline',float:'center'}}>{this.state.start.substr(0,15)}</h4>
                </span>)
            }
            </div>
          </Popup>
        </span>
      );
    }
  }

  class AddShiftPopup extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        open: false,
        eventName: "",
        start: "",
        end: "",
        allDay: false
       };
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.submitter = this.submitter.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleInputChangeSelect = this.handleInputChangeSelect.bind(this);
    }
    openModal() {
      this.setState({ open: true });
    }
    closeModal() {
      this.setState({ open: false });
      //window.employeeTable.addEmployeeToState(0,"","","");
    }
  
    handleInputChange = (event) => {
      console.log("Changing", event.target.name);
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  
    handleInputChangeSelect = (event) => {
      console.log("Changing", event.target.name,"to",event.target.value);
      
      this.setState({
        memstat: event.target.value
      })
      console.log("Now its", this.state.memstat);
    }
  
  
    submitter(e){
      console.log("submitting function",this.state.start);
      var start = formatDate(this.state.start);
      console.log("start is now",start);
      var end = formatDate(this.state.end);
      var name = this.state.name;
      if(this.state.name == "")
      {
        name = "Shift"
      }

      window.calendar.addEvent(name,start,end,this.state.allDay);
      console.log("shifts at post are",this.state.events);
      postShifts(window.calendar.state.events);
      //getShifts();
      this.closeModal();
      console.log("wfhlrfh");
    }
  
    render() {
      return (
        <span>
          <button className="button" name="addshift" style={{display:'inline-block',marginBottom:'1%',width:'20%',paddingTop:"1%",paddingBottom:'1%',marginLeft:'.5%',backgroundColor:'#3700b3',color:'white'}} onClick={this.openModal}>
            +Add Shift
          </button>
          <Popup
            open={this.state.open}
            closeOnDocumentClick
            onClose={this.closeModal}
          >
            
            <div className="modal" id='popup'>
              <button className="button" onClick={this.closeModal} style={{position:'absolute',top:0,right:0,backgroundColor:'#f04e1f',borderRadius:'50%',border:'none'}}>
                X
              </button>
              {/*window.employeeTable.addEmployee(0,"f","L","member")*/}
              
              <form id="loginForm" onSubmit={this.submitter} >

                {/*event title*/}
                <label style={{display:'block',padding:'2%'}}>
                    Shift Name:
                    <input type="text" name="name" style={{width:'50%'}} onChange={this.handleInputChange}/>
                </label>

                {/*event start*/}
                <label style={{display:'block',padding:'2%'}}>
                  Shift Start Time/Date:
                  <input type="datetime-local" name="start" style={{width:'50%'}} onChange={this.handleInputChange} />
                </label>
                
                {/*event end*/}
                <label style={{display:'block',padding:'2%'}}>
                  Shift End Time/Date:
                  <input type="datetime-local" name="end" style={{width:'50%'}} onChange={this.handleInputChange}/>
                </label>

                {/*all day*/}
                <label style={{display:'block',padding:'2%'}}>
                  Is the shift all day?:   
                  <select name="allDay" onChange={this.handleInputChangeSelect}>
                    <option value={false}>no</option>
                    <option value={true}>yes</option>
                  </select>
                </label>


                <input type="submit" value="Submit" style={{display:'block',padding:'2%'}}/>
              </form>
            </div>
          </Popup>
        </span>
      );
    }
}

class ShiftCalendar extends React.Component
{
    constructor(props)
    {
      super(props);
        window.calendar = this;
        this.state = {
          events: []
        };
        getShifts();
        this.addEvent = this.addEvent.bind(this);
    }

    forceUpdateHandler(){
      console.log("forcing update");
      this.forceUpdate();
    };
    
    addEvent(name,start,end,allDay)
    {
        var newEvent = 
        {
            allDay: allDay,
            end: new Date(end),
            start: new Date(start),
            title: name
        }

        {/*id:id, first: first, last: last, memStat:memStat*/}

        console.log("running shifts",newEvent);
        var newItems= [this.state.events];
        newItems[0].push(newEvent);
        this.setState({
        events: newItems[0]
        });
    }

    componentDidMount() { 
      this._ismounted = true;
    }
    
    render() {   
        return (  
            <div>
                <Calendar
                    href="./styles/calendar.css"
                    localizer={localizer}
                    events={this.state.events}
                    views={['month', 'day','week']}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '680px' }}
                    onDoubleClickEvent={e=>{window.eventPop.openUp(e);}}
                />
                <EditEventPopup/>
            </div>    
        )  
  
      }  
}

function getShifts()
{
  const url = "http://localhost:5000/getShifts"

  axios.get(url)
    .then(function (response) {
      var data = response.data;
      console.log("date is at getShiofts:",data);
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
        var end = formatDate(data[i+1].split("end':")[1].replace(/'/g,""));
        var start = formatDate(data[i+2].split("start':")[1].replace(/'/g,""));
        var title = " "
        if(data[i+3] != undefined)
        {
            var title = data[i+3].split("title':")[1].replace(/'/g,"").trim();
        }
        window.calendar.addEvent(title,start,end,allDay);
      }
      console.log("shifts in state are now:",window.calendar.state.events)
    })
    .catch(function (error) {
      console.log(error);
    });

}

function postShifts(shifts)
{

  console.log('sending',shifts);
  const url = "http://localhost:5000/postShifts"

  axios.post(url,{
    shiftList: shifts
  })
  .then(function (response) {
    //window.location.reload(true);
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



class ShiftPage extends Component {  
    constructor(props)
    {
      super(props);
        window.main = this;
        this.state = {
          company: "none",
          status: "loading"
        };
    }
  
    render() { 
          return (  
            <div>
              <h1 id='shiftsTitle1' >Shifts</h1>
              <AddShiftPopup/>
              <ShiftCalendar
                href="./styles/calendar.css"
                localizer={localizer}
                views={['month', 'day','week']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '680px' }}
                onDoubleClickEvent={e=>{window.eventPop.openUp(e);}}
              />
              <EditEventPopup/>
            </div>    
          )  

    }  
  }  
  export default ShiftPage;  
  