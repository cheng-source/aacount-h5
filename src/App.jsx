import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import routes from "./router/index";
import NavBar from "./components/NavBar";



const App = function() {
  return <BrowserRouter>
    <Routes>
      {routes.map(route=> <Route key={route.path} path={route.path} element={<route.component></route.component>}></Route>)}
    </Routes>
    <NavBar showNav={true}></NavBar>
  </BrowserRouter>
}

export default App;