'use client';

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { useChat, Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

const assistantMessageStyle = {
  lineHeight: '1.65',
  paddingLeft: '8px',
  paddingRight: '8px'
};

const userMessageStyle = {
  lineHeight: '1.65',
  paddingLeft: '8px',
  paddingRight: '8px',
  whiteSpace: 'pre-wrap' as const
};

const codeStyle = {
  fontSize: '13px'
};

const mathBlockStyle = {
  backgroundColor: '#1e1e1e',
  color: '#d4d4d4',
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  fontSize: '13px',
  padding: '1em',
  borderRadius: '5px',
  overflowX: 'auto' as const,
  margin: '0.5em 0'
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSubmittingRef.current) {
      setInputValue(e.target.value);
    }
  };

  const clearInput = () => {
    isSubmittingRef.current = true;
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.focus();
      }
      isSubmittingRef.current = false;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    // ... 기존 코드 ...
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isSubmittingRef.current) {
      setIsLoading(true);
      const currentInput = inputValue.trim();
      clearInput();

      const userMessage: Message = {
        id: Date.now().toString(), // 고유한 ID 생성
        role: 'user',
        content: currentInput
      };
      try {
        await append(userMessage);
      } catch (error) {
        console.error('Error appending message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const renderMessage = (message: Message) => {
    const messageStyle = message.role === 'user' ? userMessageStyle : assistantMessageStyle;
    
    return (
      <div style={messageStyle}>
        {message.role === 'assistant' && (
          <div style={{ marginBottom: '10px' }}>
            <Image
              src="/javis.png"
              width={22}
              height={22}
              alt="Javis AI"
              style={{ verticalAlign: 'middle', display: 'inline-block' }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '10pt', verticalAlign: 'middle', marginLeft: '5px' }}>자비스 AI</span>
          </div>
        )}
        {message.role === 'user' ? (
          <div>{message.content}</div>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    style={tomorrow}
                    customStyle={codeStyle}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">자비스 AI</h1>
      
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, i) => (
          <div key={i} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'} message`}>
              {renderMessage(message)}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">로딩 중...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleFormSubmit} className="flex">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border rounded-l"
          rows={1}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? '전송 ...' : '전송'}
        </button>
      </form>
    </div>
  );
}