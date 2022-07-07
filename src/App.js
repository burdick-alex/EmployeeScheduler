import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Popup from "reactjs-popup";
import ReactTable from 'react-table-v6';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { RoutedTabs, NavTab } from "react-router-tabs";

//styles
var filetheme = localStorage.getItem('theme');
if(filetheme == null)
{
  filetheme = 'dark';
}
require ('./styles/' + filetheme + '/Calendar.css');
require ('./styles/' + filetheme + '/ReactTable.css');
require ('./styles/' + filetheme + '/Application.css');
require ('./styles/' + filetheme + '/react-router-tabs.css');
require ('./styles/' + filetheme + '/react-tabs.css');



//Import all needed Components
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import EmployeePage from "./pages/Employees";
import SchedulePage from "./pages/Schedule";
import ShiftPage from "./pages/Shifts";
import Page404 from "./pages/Page404";
import SettingsPage from "./pages/Settings"
import ScheduleRequestPage from "./pages/ScheduleRequests"


class App extends Component {
  render() {
    return (
      <div id='headerDiv'>
      <Router>
      <NavTab to="/employees">Employees</NavTab>
      <NavTab to="/shifts">Shifts</NavTab>
      <NavTab to="/requests">Schedule Requests</NavTab>
      <NavTab to="/schedule">Schedule</NavTab>
      <NavTab to="/settings">Settings</NavTab>
        <Switch>
          <Route exact path="/404" component={Page404} />
          <Route exact path="/" >
            <Redirect to="/employees"/>
          </Route>
          <Route exact path="/employees" component={EmployeePage} />
          <Route exact path="/schedule" component={SchedulePage} />
          <Route exact path="/requests" component={ScheduleRequestPage} />
          <Route exact path="/shifts" component={ShiftPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Redirect to="/404"/>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;