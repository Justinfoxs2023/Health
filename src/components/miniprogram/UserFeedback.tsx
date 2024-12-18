import React, { useState } from 'react';

import axios from 'axios';

const UserFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  const submitFeedback = async () => {
    try {
      await axios.post('/api/feedback', { feedback });
      alert('反馈提交成功！');
      setFeedback('');
    } catch (error) {
      alert('反馈提交失败，请重试。');
    }
  };

  return (
    <div>
      <h2></h2>
      <textarea value={feedback} onChange={handleFeedbackChange} placeholder="请输入您的反馈" />
      <button onClick={submitFeedback}></button>
    </div>
  );
};

export default UserFeedback;
