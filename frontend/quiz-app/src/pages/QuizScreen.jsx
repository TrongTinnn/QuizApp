import React, { useEffect } from 'react';
import { Card, Button, Radio, Space, Alert, Typography, Progress, message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchQuestions,
    setSelectedAnswer,
    submitAnswer,
    goToNextQuestion,
    submitQuizResults
} from '../redux/reducer/quizSlice.js';

const { Title, Text } = Typography;

const QuizScreen = ({ onQuizEnd }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        questions,
        currentQuestionIndex,
        selectedAnswerId,
        feedback,
        userAnswers,
        loading,
        error,
        submitting,
        quizResult
    } = useSelector((state) => state.quiz);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    useEffect(() => {
        if (questions.length === 0 && loading === 'idle') {
            dispatch(fetchQuestions());
        }
    }, [dispatch, questions.length, loading]);

    useEffect(() => {
        dispatch(setSelectedAnswer(null));
    }, [currentQuestionIndex, dispatch]);

    if (loading === 'pending' || loading === 'idle') {
        return (
            <Card style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <Title level={4} style={{ marginTop: '20px' }}>Loading questions...</Title>
            </Card>
        );
    }

    if (loading === 'failed' || error) {
        return <Alert message="Error" description={error || "Đã xảy ra lỗi không xác định."} type="error" showIcon />;
    }
    if (questions.length === 0) {
        return <Alert message="Thông báo" description="Không có câu hỏi nào để hiển thị." type="info" showIcon />;
    }

    const handleRadioChange = (e) => {
        if (feedback) return;
        dispatch(setSelectedAnswer(e.target.value));
    };

    const handleSubmitAnswer = async () => {
        if (selectedAnswerId === null) {
            message.warning("Vui lòng chọn một đáp án trước khi tiếp tục.");
            return;
        }

        try {
            const submitAnswerAction = await dispatch(submitAnswer({
                questionId: currentQuestion.id,
                selectedOptionId: selectedAnswerId
            }));

            if (submitAnswerAction.meta.requestStatus === 'fulfilled') {
                setTimeout(async () => {
                    if (currentQuestionIndex < totalQuestions - 1) {
                        dispatch(goToNextQuestion());
                    } else {
                        message.loading("Đang gửi kết quả bài kiểm tra...", 0);
                        const finalQuizSubmitAction = await dispatch(submitQuizResults());

                        message.destroy();

                        if (finalQuizSubmitAction.meta.requestStatus === 'fulfilled') {
                            navigate('/results', { state: { quizResult: finalQuizSubmitAction.payload } });
                        }
                    }
                }, 1500);
            }
        } catch (err) {
            console.error("Lỗi trong handleSubmitAnswer:", err);
        }
    };
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <Card
            title={`Question ${currentQuestionIndex + 1}/${totalQuestions}`}
            style={{ width: '100%' }}
            actions={[
                <Button
                    type="primary"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswerId === null || feedback !== null}
                >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Next Answer' : 'Finish Quiz'}
                </Button>,
            ]}
        >
            <Progress percent={progressPercent} showInfo={false} />

            <Title level={4} style={{ marginTop: '15px' }}>{currentQuestion.text}</Title>

            <Radio.Group
                onChange={handleRadioChange}
                value={selectedAnswerId}
                style={{ width: '100%' }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {currentQuestion.answers.map((answer) => (
                        <Radio
                            key={answer.id}
                            value={answer.id}
                            disabled={feedback !== null}
                            style={{
                                padding: '10px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                width: '100%',
                                backgroundColor:
                                    selectedAnswerId === answer.id && feedback === 'correct'
                                        ? '#d4edda'
                                        : selectedAnswerId === answer.id && feedback === 'incorrect'
                                            ? '#f8d7da'
                                            : 'white',
                                borderColor:
                                    selectedAnswerId === answer.id && feedback === 'correct'
                                        ? '#28a745'
                                        : selectedAnswerId === answer.id && feedback === 'incorrect'
                                            ? '#dc3545'
                                            : '#d9d9d9',
                            }}
                        >
                            <Text>{answer.text}</Text>
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>

            {feedback && feedback !== 'error' && (
                <div style={{ marginTop: '20px' }}>
                    <Alert
                        message={feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                        type={feedback === 'correct' ? 'success' : 'error'}
                        showIcon
                        icon={feedback === 'correct' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    />
                </div>
            )}
        </Card>
    );
};

export default QuizScreen;