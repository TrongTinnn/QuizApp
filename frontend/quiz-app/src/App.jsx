import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import QuizScreen from './pages/QuizScreen';
import ReviewScreen from './pages/ReviewScreen';
import ResultScreen from './pages/ResultScreen';

function App() {

    return (

        <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/results" element={<ResultScreen />} />
            <Route path="/review" element={<ReviewScreen />} />
            {/* <Route path="/review/:submissionId" element={<ReviewScreen />} /> */}

        </Routes>



    )
}

export default App
