import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './styles/react-tabs.css';
import './styles/Popup.css';
import Popup from "reactjs-popup";
import ReactTable from 'react-table-v6';
import './styles/ReactTable.css';
import './styles/Calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import './styles/Application.css';

const localizer = momentLocalizer(moment)


class Table extends Component
{
  constructor(props)
  {
    super(props);
    window.employeeTable = this;
    this.state = {
      employees: []
    }
    getDbData();
    this.addEmployeeToState = this.addEmployeeToState.bind(this);
  }

  /*componentDidMount(newState)
  {
    if (this.componentMounted === false) this.componentMounted = true;
    console.log("checking")
  }*/

  /*componentDidUpdate(prevState)
  {
    if (prevState.employees !== this.state.employees)
    {
      return true;
    }
    else
    {
      return false;
    }
  }*/

  forceUpdateHandler(){
    console.log("forcing update");
    this.forceUpdate();
  };

  addEmployeeToState(id,first,last,memStat)
  {
    console.log("running")
    var newItems= [this.state.employees];
    newItems[0].push({id:id, first: first, last: last, memStat:memStat});
    this.setState({
      employees: newItems[0]
    });
    //this.forceUpdateHandler;

    
  }


  
  render() {
    const columns = [
      {
        Header: "Employee #",
        accessor: "id"
      },
      {
        Header: "First Name",
        accessor: "first"
      },
      {
        Header: "Last Name",
        accessor: "last"
      },
      {
        Header: "Membership Status",
        accessor: "memStat"
      },
      {
        Header: "Delete Employee",
        id: 'deleteRow',
        Cell: (row) => (<button style={{backgroundColor: 'red',color: 'white',cursor:'pointer'}} onClick={() => {
              let data = this.state.employees;
              const idNum = this.state.employees[row.index].id;
              deleteDbData(idNum);
            }}>Delete</button>)
      }
    ] 
    //getDbData();
    return (
      <div>
        <ReactTable ref={this.myRef} columns={columns} data={this.state.employees} noDataText="No Employees" href='./styles/ReactTable.css' />
      </div>
      
    );
  }
}

class AddEmployeePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      first: "",
      last: "",
      memstat: "member",
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
    console.log("submitting function");
    //e.preventDefault();
    //window.employeeTable.addEmployeeToState(0,"f","L","member");
    //window.close;
    //onSubmit(value);
    //window.location.reload(true);
    const id = getDbDataLength();
    postDbData(id,this.state.first,this.state.last,this.state.memstat);
    this.closeModal();
    console.log("wfhlrfh");
    //postDbData(id,first,last,memStat)
  }

  render() {
    return (
      <span>
        <button className="button" name="addemp" style={{display:'inline-block',marginBottom:'1%',width:'20%',paddingTop:"1%",paddingBottom:'1%',marginLeft:'.5%',backgroundColor:'#3700b3',color:'white'}} onClick={this.openModal}>
          +Add Employee
        </button>
        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          
          <div className="modal" style={{backgroundColor:'#303030',color:'white',borderColor:'black'}}>
            <button className="button" onClick={this.closeModal} style={{position:'absolute',top:0,right:0,backgroundColor:'#f04e1f',borderRadius:'50%',border:'none'}}>
              X
            </button>
            {/*window.employeeTable.addEmployee(0,"f","L","member")*/}
            
            <form id="loginForm" onSubmit={this.submitter} >
              <label style={{display:'block',padding:'2%'}}>
                First Name:
                <input type="text" name="first" style={{width:'50%'}} onChange={this.handleInputChange} />

              </label>
              
              <label style={{display:'block',padding:'2%'}}>
                Last Name:
                <input type="text" name="last" style={{width:'50%'}} onChange={this.handleInputChange}/>
              </label>
              <label style={{display:'block',padding:'2%'}}>
                Membership Status:   
                <select name="membership" onChange={this.handleInputChangeSelect}>
                  <option value="member">Member</option>
                  <option value="staff">Staff</option>
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



class DeleteEmployeesPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
     };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitter = this.submitter.bind(this);
  }
  openModal() {
    this.setState({ open: true });
  }
  closeModal() {
    this.setState({ open: false });
    //window.employeeTable.addEmployeeToState(0,"","","");
  }
  submitter(e){
    console.log("submitting function");
    clearDbData("employee")
    this.closeModal();
    console.log("wfhlrfh");
    //postDbData(id,first,last,memStat)
  }

  render() {
    return (
      <span>
        <button className="button" name="Delete All" style={{display:'inline-block',marginBottom:'1%',marginLeft:'.5%',width:'20%',paddingTop:"1%",paddingBottom:'1%',backgroundColor:'red',color:'white'}} onClick={this.openModal}>
          Delete All
        </button>
        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
          style={{width:'50%'}}
        >
          
          <div className="modal" style={{backgroundColor:'#303030'}}>
              <h3 style={{display:'block',textAlign:'center',paddingTop:'10%'}} >Are you sure you want to delete all employees?</h3>
              <div style={{paddingBottom:'10%'}}>
                <button onClick={this.submitter} style={{display:'inline-block',width:'45%',marginLeft:'2%',marginRight:'6%'}}>
                  Yes
                </button>
                <button onClick={this.closeModal} style={{display:'inline-block',width:'45%',marginRight:'2%'}}>
                  No
                </button>
              </div>
          </div>
        </Popup>
      </span>
    );
  }
}



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

          
          <div className="modal" style={{backgroundColor:'#303030'}}>
            <button className="button" onClick={this.closeModal} style={{position:'absolute',top:0,right:0,backgroundColor:'#f04e1f',borderRadius:'50%',border:'none'}}>
              X
            </button>
              <h1 style={{display:'block',textAlign:'center',paddingTop:'10%'}}>
                {this.state.name}
                <br></br>
              </h1>
              {!this.state.allDay ?(
              
              <span style={{paddingBottom:'10%',float:'center'}}>
                <h3 style={{display:'inline',float:'center'}}>Starts:</h3>
                {this.state.start.split("GMT")[0]}
                <br></br>
                <h3 style={{display:'inline'}}>Ends:</h3>
                {this.state.end.split("GMT")[0]}
              </span>) : 
              (
                <span style={{paddingBottom:'10%',float:'center'}}>
                <h3 style={{display:'inline',float:'center'}}>Date:</h3>
                {this.state.start.substr(0,15)}
              </span>)
          }
          </div>
        </Popup>
      </span>
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

function getCompanies()
{
  const url = "http://localhost:5000/getcompanies"

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      console.log("gettin here",data);
      for (let i = 0; i < data.length; i++) 
      {             
        window.compList.addCompany(data[i]);
      }
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });

}

function getDefaultCompany()
{
  const url = "http://localhost:5000/getcompanies"

  axios.get(url)
    .then(function (response) {
      const data = response.data;
      console.log("gettin here",data);
      if(data.length > 0)
      {
        return data[0];
      }
      else
      {
        return "none";
      }
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




class DeleteButton extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        isOpened: false
      };
      this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    //{window.parent.employeeTable.addEmployee(0,"f","L","member")}
    postDbData(0,"f","L","member");
    this.setState({isOpened: !this.state.isOpened});
  };


  render() {
    return (
      <button onClick={this.handleClick}>
        Hello
      </button>
    );
  }
}


class SelectCompany extends React.Component {
  constructor(props){
      super(props);
      window.compList = this;
      this.state = {
        companyNames: []
      };
      getCompanies();
      this.handleClick = this.handleClick.bind(this);
      this.addCompany = this.addCompany.bind(this);
  }
  handleClick = () => {
    //{window.parent.employeeTable.addEmployee(0,"f","L","member")}
    postDbData(0,"f","L","member");
    this.setState({isOpened: !this.state.isOpened});
  };

  addCompany(data) {
    console.log("now its:",data);  
    console.log("list is:",list); 
    var list = [this.state.companyNames];       
    //  for (let i = 0; i < data.length; i++) {             
    //       list.push(<option key={data[i]} value={data[i]}>{data[i]}</option>);   
    //  }
    list[0].push(data);
    console.log("list is:",list);  
    this.setState(
      {
        companyNames: list[0]
      });
  } 
  
  addEmployeeToState(id,first,last,memStat)
  {
    console.log("running")
    var newItems= [this.state.employees];
    newItems[0].push({id:id, first: first, last: last, memStat:memStat});
    this.setState({
      employees: newItems[0]
    });
    //this.forceUpdateHandler;

    
  }

  render() {
    return (
      <select name="membership" onChange={this.handleInputChangeSelect}>
        {this.state.companyNames.map((x) => <option key={x}>{x}</option>)}
      </select>
    );
  }
}



class App extends Component {  
  constructor(props)
  {
    super(props);
      window.main = this;
      this.state = {
        company: "none",
        status: "loading"
      };
  }

  componentDidMount()
  {
    var defaultName = getDefaultCompany();
    console.log("mounting",defaultName);
    this.setState({
      status: "done",
      company:defaultName
    })
  }
  render() { 
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    const dummyEvents = [
      {
        allDay: false,
        end: new Date('July 10, 2020 14:30:00'),
        start: new Date('July 10, 2020 11:00:00'),
        title: 'hi',
      },
      {
        allDay: false,
        end: new Date('July 10, 2020 14:30:00'),
        start: new Date('July 10, 2020 11:00:00'),
        title: 'hi2',
      },
      {
        allDay: true,
        end: new Date('July 09, 2020 11:13:00'),
        start: new Date('July 09, 2020 11:13:00'),
        title: 'All Day Event',
      },
    ];
    if(isChrome)
    {
      console.log("its chrome");
    }
    else
    {
      console.log("its not chrome");
    }
    if(this.state.status == "done")
      {
        return (  
          <Tabs>
            <TabList>
              <Tab>Employees</Tab>
              <Tab>Shifts</Tab>
              <Tab>Schedule</Tab>
              <Tab>Settings</Tab>
            </TabList>
            <TabPanel style={{backgroundColor:'121212'}}>
              <h1>Employees</h1>
              <AddEmployeePopup/>
              <DeleteEmployeesPopup/>
              <Table id='employees'/>
            </TabPanel>
            <TabPanel>
            <Calendar
              href="./styles/calendar.css"
              localizer={localizer}
              events={dummyEvents}
              views={['month', 'day','week']}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '680px' }}
              onDoubleClickEvent={e=>{window.eventPop.openUp(e);}}
            />
            <EditEventPopup/>
            </TabPanel>
            <TabPanel>
              <div class='header' style={{height:'980px',margin:0,padding:0}}>
                Coming Soon...
              </div>
            </TabPanel>
            <TabPanel>
              <h1>Settings</h1>
              <div>
                <label>Companies</label>
                <SelectCompany/>
              </div>
            </TabPanel>
          </Tabs>       
        )  
      }
      else
      {
        return null;
      }
  }  
}  
export default App;  
