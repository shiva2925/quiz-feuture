import React, { Component, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Quiz from './Quiz';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();


function App() {
  const [paramData,serParamDAta]=useState({userId:"",sectionId:"",index:0})
 
 useEffect(()=>{
  var paramsData = window.location.pathname
    var params= paramsData.split("/")
    serParamDAta({userId:params[1],sectionId:params[2],index:Number(params[3])})
 },[])

    return (
      
      <BrowserRouter>
      <Routes>
        <Route path="/:userid/:sectionid/:index" element={<Quiz />}>
       
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

export default App;
{/* <NavigationContainer>
<Stack.Navigator>
  <Stack.Screen name="/" component={Quiz} />
</Stack.Navigator>
</NavigationContainer> */}

