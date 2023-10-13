import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSheetOverView from './siginSheetOverview';
import SigninSheet from './signinSheet';
export default function SignInSheet() {
    return (
        <Routes>
            <Route path="/signin-sheet-overview" element={<SignInSheetOverView />} />
            <Route path="" element={<SigninSheet />} />
        </Routes>
    )
}
