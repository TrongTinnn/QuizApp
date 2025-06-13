import React from 'react';
import { Card, Button, Typography, Statistic, Row, Col, Space, Alert } from 'antd';
import { TrophyOutlined, CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuiz } from '../redux/reducer/quizSlice';

const { Title, Text, Paragraph } = Typography;

const ResultScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const quizResult = useSelector((state) => state.quiz.quizResult);
    const submissionId = quizResult.submissionId;

    const dispatch = useDispatch();

    const questions = useSelector((state) => state.quiz.questions);
    const userAnswers = useSelector((state) => state.quiz.userAnswers);


    if (!quizResult) {
        return (
            <Card style={{ width: '100%', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
                <Alert
                    message="Lỗi"
                    description="Không tìm thấy kết quả bài kiểm tra. Vui lòng hoàn thành bài kiểm tra trước."
                    type="warning"
                    showIcon
                />
                <Button type="primary" onClick={() => navigate('/quiz')} style={{ marginTop: '20px' }}>
                    Bắt đầu Quiz
                </Button>
            </Card>
        );
    }

    const { correctAnswers, totalQuestions, passed, durationSeconds } = quizResult;

    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(0) : 0;
    const isPassing = passed;

    const totalSecondsRounded = Math.round(durationSeconds);
    const minutes = Math.floor(totalSecondsRounded / 60);
    const seconds = totalSecondsRounded % 60;
    const formattedDuration = `${minutes} phút ${seconds} giây`;

    const handleRestartQuiz = () => {
        dispatch(resetQuiz());
        navigate('/quiz');
    };
    const handleBackToStart = () => {
        dispatch(resetQuiz());
        navigate('/');
    };

    const handleReviewQuiz = () => {
        navigate('/review');
    };

    return (
        <Card
            title="Kết quả Quiz"
            style={{ width: '100%', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}
        >
            <Title level={2} style={{ color: isPassing ? '#52c41a' : '#ff4d4f' }}>
                {isPassing ? 'Chúc mừng!' : 'Thử lại lần sau nhé!'}
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#595959' }}>
                Bạn đã hoàn thành bài kiểm tra. Đây là kết quả của bạn:
            </Paragraph>

            <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
                <Col span={12}>
                    <Statistic
                        title="Số câu đúng"
                        value={correctAnswers}
                        suffix={` / ${totalQuestions}`}
                        valueStyle={{ color: isPassing ? '#3f8600' : '#cf1322' }}
                        prefix={<TrophyOutlined />}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Tỷ lệ phần trăm"
                        value={percentage}
                        suffix="%"
                        valueStyle={{ color: isPassing ? '#3f8600' : '#cf1322' }}
                        prefix={isPassing ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    />
                </Col>
                <Col span={24} style={{ marginTop: '20px' }}>
                    <Statistic
                        title="Thời gian hoàn thành"
                        value={formattedDuration}
                        valueStyle={{ color: '#007bff' }}
                        prefix={<ClockCircleOutlined />}
                    />
                </Col>
            </Row>

            <Space direction="vertical" style={{ width: '100%', marginBottom: '10px' }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleRestartQuiz}
                    style={{ height: '50px', fontSize: '18px' }}
                >
                    Làm lại Quiz
                </Button>

            </Space>
            <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                    type="default"
                    size="large"
                    onClick={handleReviewQuiz}
                    style={{ height: '50px', fontSize: '18px', flexGrow: 1, minWidth: '200px', maxWidth: '48%' }}
                    icon={<SolutionOutlined />}
                >
                    Xem lại bài làm
                </Button>
                <Button
                    size="large"
                    onClick={handleBackToStart}
                    style={{ height: '50px', fontSize: '18px', flexGrow: 1, minWidth: '200px', maxWidth: '48%' }}
                >
                    Quay lại trang chủ
                </Button>
            </Space>
        </Card>
    );
};

export default ResultScreen;