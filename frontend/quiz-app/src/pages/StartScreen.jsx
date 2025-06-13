import React from "react";
import { Button, Typography, Space } from 'antd';
import { useNavigate } from "react-router-dom";
const { Title, Paragraph } = Typography;
const StartScreen = () => {
    const navigate = useNavigate();
    const handleStartQuiz = () => {
        navigate('/quiz');
    };
    return <div style={{ textAlign: 'center', padding: '180px 20px' }}>
        <Title level={2}>Chào mừng bạn đến với Quiz!</Title>

        <Paragraph style={{ fontSize: '16px', color: '#595959', marginBottom: '30px' }}>
            Hãy kiểm tra kiến thức của bạn ngay bây giờ bằng cách tham gia bài kiểm tra thú vị này.
        </Paragraph>

        <Space>
            <Button
                type="primary"
                size="large"
                onClick={handleStartQuiz}
                style={{ height: '50px', fontSize: '18px', padding: '0 30px' }}
            >
                Bắt đầu Quiz
            </Button>
        </Space>
    </div>;
};

export default StartScreen;
