'use client';

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { useChat, Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, append } = useChat({
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
      alert('채팅 오류가 발생했습니다: ' + error.message);
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

  // 입력값이 변경될 때마다 textarea의 값을 동기화합니다.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = inputValue;
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      setIsLoading(true);
      const currentInput = inputValue.trim();
      
      // 입력값을 비우는 작업을 비동기적으로 처리합니다.
      setTimeout(() => {
        setInputValue('');
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.value = '';
          }
        });
      }, 0);

      const userMessage: Message = { role: 'user', content: currentInput };
      await append(userMessage);
      setIsLoading(false);
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
        {isLoading && <div className="text-center">처리 중...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleFormSubmit} className="flex flex-col mb-4">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}