import React, { Component, lazy } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTable from 'react-table-v6';
import axios from 'axios';
import Popup from "reactjs-popup";

//styles
var filetheme = localStorage.getItem('theme');
if(filetheme == null)
{
  filetheme = 'dark';
}
require ('../styles/' + filetheme + '/react-tabs.css');
require ('../styles/' + filetheme + '/ReactTable.css');
require ('../styles/' + filetheme + '/Application.css');
//import '../styles/dark/react-tabs.css';







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
          
          <div className="modal" id='popup'>
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
          
          <div className="modal" id='popup'>
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


class EmployeePage extends React.Component{
    render()
    {
        return (
            <div>
                <h1 id='employeesTitle' >Employees</h1>
                <AddEmployeePopup>
                </AddEmployeePopup>
                <DeleteEmployeesPopup>
                </DeleteEmployeesPopup>
                <Table id='employees'/>
            </div>
        );
    }
  }

export default EmployeePage;