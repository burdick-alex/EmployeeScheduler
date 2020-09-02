import React from "react";
//Functional Component 
const SettingsPage = () => {
  return (
    <div>
      <h1 id='settingsTitle'>Settings:</h1>
      <label style={{display:'block',padding:'2%'}}>
                Theme:   
                <select name="theme" onChange={e => {localStorage.setItem('theme',e.target.value);console.log("setting to",e.target.value);window.location.reload(true);}}>
                  <option selected={localStorage.getItem('theme') == 'dark'} value="dark">Dark</option>
                  <option selected={localStorage.getItem('theme') == 'light'} value="light">Light</option>
                </select>
      </label>
    </div>
  );
};

export default SettingsPage;