import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ClassOverView from './calendar';
import Template from './template';
export default function ClassroomCalendar() {
    return (
        <Routes>
            <Route path="/overview" element={<ClassOverView />} />
            <Route path="/template" element={<Template />} />
        </Routes>
    )
}
