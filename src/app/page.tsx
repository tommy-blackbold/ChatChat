'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useState, useEffect } from 'react';

export default function Home() {
  // 다음 줄을 제거하거나 주석 처리하세요:
  // const [usedState, setUsedState] = useState<string>('');

  useEffect(() => {
    // 여기에 _unusedVariable을 사용하는 코드를 추가할 수 있습니다.
  }, []);

  function handleClick(_event: React.MouseEvent<HTMLButtonElement>) { // argsIgnorePattern
    // 이벤트 객체를 사용하지 않는 경우
    console.log('버튼이 클릭되었습니다.');
  }

  // function unusedFunction() { // 이 함수는 사용되지 않습니다.
  //   console.log('이 함수는 사용되지 않습니다.');
  // }

  return (
    <main>
      <h1>TypeScript ESLint 예제</h1>
      <button onClick={handleClick}>클릭하세요</button>
    </main>
  );
}