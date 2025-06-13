import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


import { API_ENDPOINTS } from '../../config/api'
// question
export const fetchQuestions = createAsyncThunk(
    'quiz/fetchQuestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_ENDPOINTS.QUESTIONS);
            const formattedQuestions = response.data.map(q => ({
                id: q.id,
                text: q.text,
                answers: q.options.map(opt => ({
                    id: opt.id.toString(),
                    text: opt.text,
                    isCorrect: opt.isCorrect
                }))
            }));
            return formattedQuestions;
        } catch (error) {
            return rejectWithValue("Không thể tải câu hỏi. Vui lòng thử lại sau.");
        }
    }
);

// checkAnswer
export const submitAnswer = createAsyncThunk(
    'quiz/submitAnswer',
    async ({ questionId, selectedOptionId }, { getState, rejectWithValue }) => {
        try {
            const validationResponse = await axios.post(API_ENDPOINTS.VALIDATE_ANSWER, {
                questionId: questionId,
                selectedOptionId: parseInt(selectedOptionId)
            });
            const { isCorrect, message: feedbackMessage } = validationResponse.data;

            const newUserAnswer = {
                questionId: questionId,
                selectedAnswerId: selectedOptionId,
                isCorrect: isCorrect,
            };

            return { newUserAnswer, isCorrect };
        } catch (error) {
            return rejectWithValue("Không thể kiểm tra đáp án. Vui lòng thử lại.");
        }
    }
);

// result
export const submitQuizResults = createAsyncThunk(
    'quiz/submitQuizResults',
    async (_, { getState, rejectWithValue }) => {
        const state = getState().quiz;
        const { userAnswers, startTime } = state;

        const formattedAnswers = userAnswers.map(answer => ({
            questionId: answer.questionId,
            selectedOptionId: parseInt(answer.selectedAnswerId)
        }));

        const submissionPayload = {
            answers: formattedAnswers,
            startTime: startTime
        };

        try {
            const response = await axios.post(API_ENDPOINTS.SUBMIT_QUIZ_RESULTS, submissionPayload);
            return response.data;
        } catch (error) {
            let errorMessage = "Không thể gửi kết quả bài kiểm tra. Vui lòng thử lại.";
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || error.response.data.title || JSON.stringify(error.response.data);
                console.error("Lỗi API (submitQuizResults):", error.response.data);
            } else if (error.message) {
                errorMessage = error.message;
            }
            return rejectWithValue(errorMessage);
        }
    }
);
// reviews 

export const fetchReviewData = createAsyncThunk(
    'quiz/fetchReviewData',
    async (submissionId, { rejectWithValue }) => {
        if (!submissionId) {
            return rejectWithValue("Không tìm thấy ID bài nộp để xem lại.");
        }
        try {
            const response = await axios.get(`${API_ENDPOINTS.REVIEW_QUIZ}/ ${submissionId}`);
            return response.data;
        } catch (error) {
            let errorMessage = "Không thể tải dữ liệu xem lại. Vui lòng thử lại sau.";
            if (error.response && error.response.data && error.response.data.title) {
                errorMessage = error.response.data.title;
            } else if (error.message) {
                errorMessage = error.message;
            }
            console.error("Lỗi API (fetchReviewData):", error);
            return rejectWithValue(errorMessage);
        }
    }
);
const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswerId: null,
        feedback: null,
        userAnswers: [],
        loading: 'idle',
        error: null,

        startTime: null,
        submitting: 'idle',
        quizResult: null,

        reviewQuestions: [],
        reviewUserAnswers: [],
        reviewLoading: 'idle',
        reviewError: null,
    },
    reducers: {
        setSelectedAnswer: (state, action) => {
            state.selectedAnswerId = action.payload;
        },
        goToNextQuestion: (state) => {
            state.currentQuestionIndex += 1;
            state.selectedAnswerId = null;
            state.feedback = null;
        },
        resetQuiz: (state) => {
            Object.assign(state, quizSlice.getInitialState());
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                state.startTime = new Date().toISOString();
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            })
            .addCase(submitAnswer.pending, (state) => {
            })
            .addCase(submitAnswer.fulfilled, (state, action) => {
                const { newUserAnswer, isCorrect } = action.payload;
                state.userAnswers.push(newUserAnswer);
                state.feedback = isCorrect ? 'correct' : 'incorrect';
            })
            .addCase(submitAnswer.rejected, (state, action) => {
                state.feedback = 'error';
                state.error = action.payload;
                message.error(action.payload);
            })
            .addCase(submitQuizResults.pending, (state) => {
                state.submitting = 'pending';
                state.error = null;
            })
            .addCase(submitQuizResults.fulfilled, (state, action) => {
                state.submitting = 'succeeded';
                state.quizResult = action.payload;
                state.error = null;
            })
            .addCase(submitQuizResults.rejected, (state, action) => {
                state.submitting = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchReviewData.pending, (state) => {
                state.reviewLoading = 'pending';
                state.reviewError = null;
            })
            .addCase(fetchReviewData.fulfilled, (state, action) => {
                state.reviewLoading = 'succeeded';
                const apiReviewData = action.payload;

                const questionsForReview = apiReviewData.map(item => ({
                    id: item.questionId,
                    text: item.questionText,
                    options: item.options.map(option => ({
                        id: option.id,
                        text: option.text,
                        isCorrect: option.isCorrect
                    }))
                }));

                const userAnswersForReview = apiReviewData.map(item => ({
                    questionId: item.questionId,
                    selectedAnswerId: item.selectedOptionId,
                    isCorrect: item.selectedOptionId === item.correctOptionId,
                    correctOptionId: item.correctOptionId
                }));

                state.reviewQuestions = questionsForReview;
                state.reviewUserAnswers = userAnswersForReview;
                state.reviewError = null;
            })
            .addCase(fetchReviewData.rejected, (state, action) => {
                state.reviewLoading = 'failed';
                state.reviewError = action.payload || "Không thể tải dữ liệu xem lại.";
            })
    },
});

export const { setSelectedAnswer, goToNextQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;