'use client';

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    api: '/api/chat',
    onResponse: () => {
      setIsLoading(false);
    },
    onFinish: () => {
      scrollToBottom();
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsLoading(false);
      alert('오류가 발생했습니다: ' + error.message);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const currentInput = input.trim();
      setInput(''); // 입력 필드를 즉시 초기화
      handleSubmit(e, { data: { content: currentInput } });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ChatChat</h1>
      
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, i) => (
          <div key={i} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'} message`}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">로딩 중...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleFormSubmit} className="flex">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border rounded-l"
          rows={1}
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