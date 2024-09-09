'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onResponse: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsLoading(false);
      // 사용자에게 오류 메시지 표시
      alert('오류가 발생했습니다: ' + error.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">챗챗 클론</h1>
      
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, i) => (
          <div key={i} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">로딩 중...</div>}
      </div>
      
      <form onSubmit={onSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border rounded-l"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}