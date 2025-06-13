import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../redux/reducer/quizSlice'
export const store = configureStore({
    reducer: {
        quiz: quizReducer,
    },
});