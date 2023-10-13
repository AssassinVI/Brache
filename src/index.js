import React from 'react';
import { Provider } from "react-redux"; // 1.
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import { store } from "./redux/store";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(


  <DndProvider backend={HTML5Backend}>
    <Provider store={store}>  { /* 將store作為props傳遞給其他component */}
      <Router basename='/'>
        <App />
      </Router>
    </Provider>
  </DndProvider>

);
