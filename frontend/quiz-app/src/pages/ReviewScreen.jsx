import React, { useEffect, useState } from 'react';
import { Typography, Card, Button, Space, Tag, Spin, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviewData } from '../redux/reducer/quizSlice'; // Đảm bảo đường dẫn đúng

const { Title, Text, Paragraph } = Typography;

const ReviewScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const quizResult = useSelector((state) => state.quiz.quizResult);
    const Id = quizResult.submissionId;

    const fixedSubmissionId = 23;
    const questions = useSelector((state) => state.quiz.reviewQuestions);
    const userAnswers = useSelector((state) => state.quiz.reviewUserAnswers);
    const loading = useSelector((state) => state.quiz.reviewLoading);
    const error = useSelector((state) => state.quiz.reviewError);

    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {

        if (loading === 'idle' || loading === 'failed') {
            console.log(`ReviewScreen useEffect: Dispatching fetchReviewData with fixed ID: ${Id}`);
            dispatch(fetchReviewData(Id));
        }
    }, [dispatch, loading, Id]);


    if (loading === 'pending' || loading === 'idle') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
                <Title level={4}>Đang tải dữ liệu bài làm...</Title>
            </div>
        );
    }

    if (loading === 'failed' || error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Alert message="Lỗi" description={error || "Không thể tải dữ liệu xem lại."} type="error" showIcon />
                <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                    Về trang chủ
                </Button>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Title level={4}>Không có dữ liệu để xem lại.</Title>
                <Paragraph>Vui lòng đảm bảo `submissionId` = 1 có dữ liệu hợp lệ trong API.</Paragraph>
                <Button type="primary" onClick={() => navigate('/quiz-result')}>
                    Về kết quả Quiz
                </Button>
            </div>
        );
    }

    const currentQuestion = questions[currentReviewIndex];
    const currentUserAnswer = userAnswers.find(
        (answer) => answer.questionId === currentQuestion?.id
    );

    const goToNextReviewQuestion = () => {
        setCurrentReviewIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    };

    const goToPreviousReviewQuestion = () => {
        setCurrentReviewIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // <--- Đã sửa
    };

    const handleBackToResults = () => {
        navigate('/results');
    };

    return (
        <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                Xem lại bài làm (Test ID: {Id})
            </Title>

            <Card
                title={<Title level={4}>Câu hỏi {currentReviewIndex + 1} / {questions.length}</Title>}
                style={{ marginBottom: '20px' }}
                actions={[
                    <Button
                        key="prev"
                        onClick={goToPreviousReviewQuestion}
                        disabled={currentReviewIndex === 0}
                        icon={<LeftOutlined />}
                    >
                        Câu trước
                    </Button>,
                    <Button
                        key="next"
                        onClick={goToNextReviewQuestion}
                        disabled={currentReviewIndex === questions.length - 1}
                        icon={<RightOutlined />}
                    >
                        Câu tiếp
                    </Button>,
                ]}
            >
                <Paragraph strong style={{ fontSize: '1.1em', marginBottom: '15px' }}>
                    {currentQuestion?.text}
                </Paragraph>

                <Space direction="vertical" style={{ width: '100%' }}>
                    {currentQuestion?.options?.map((option) => {
                        const isSelected = currentUserAnswer && currentUserAnswer.selectedAnswerId === option.id;
                        const isCorrectOption = option.isCorrect;
                        const isUserAnswerCorrect = currentUserAnswer && currentUserAnswer.isCorrect;

                        let tagColor = 'default';
                        let tagIcon = null;
                        let tagText = '';

                        if (isSelected) {
                            if (isUserAnswerCorrect) {
                                tagColor = 'success';
                                tagIcon = <CheckCircleOutlined />;
                                tagText = 'Bạn đã chọn (Đúng)';
                            } else {
                                tagColor = 'error';
                                tagIcon = <CloseCircleOutlined />;
                                tagText = 'Bạn đã chọn (Sai)';
                            }
                        } else if (isCorrectOption) {
                            tagColor = 'success';
                            tagIcon = <CheckCircleOutlined />;
                            tagText = 'Đáp án đúng';
                        } else {
                            tagColor = 'default';
                            tagText = '';
                        }

                        return (
                            <Card
                                key={option.id}
                                size="small"
                                style={{
                                    marginBottom: '8px',
                                    backgroundColor: isSelected ? (isUserAnswerCorrect ? '#e6ffe6' : '#ffe6e6') : (isCorrectOption ? '#e6ffe6' : '#f0f2f5'),
                                    borderColor: isSelected ? (isUserAnswerCorrect ? '#52c41a' : '#ff4d4f') : (isCorrectOption ? '#52c41a' : 'transparent'),
                                }}
                            >
                                <Space>
                                    <Text strong>{option.text}</Text>
                                    {tagText && (
                                        <Tag color={tagColor} icon={tagIcon}>
                                            {tagText}
                                        </Tag>
                                    )}
                                </Space>
                            </Card>
                        );
                    })}
                </Space>

                {currentUserAnswer && (
                    <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: currentUserAnswer.isCorrect ? '#e6ffe6' : '#ffe6e6' }}>
                        <Text strong>Kết quả:</Text> {currentUserAnswer.isCorrect ? (
                            <Text type="success">Chúc mừng, bạn đã trả lời đúng!</Text>
                        ) : (
                            <Text type="danger">Bạn đã trả lời sai.<br /></Text>
                        )}
                        {!currentUserAnswer.isCorrect && currentQuestion?.options?.find(opt => opt.isCorrect) && (
                            <Paragraph>
                                <Text strong>Đáp án đúng là: {currentQuestion.options.find(opt => opt.isCorrect).text}</Text>
                            </Paragraph>
                        )}
                    </div>
                )}
            </Card>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="default" onClick={handleBackToResults}>
                    Quay lại kết quả {Id}
                </Button>
            </div>
        </div>
    );
};

export default ReviewScreen;