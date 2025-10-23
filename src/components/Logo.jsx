import React from 'react';

// size prop을 받아서 크기를 조절할 수 있는 로고 컴포넌트
export default function Logo({ size = '4xl' }) {
  // prop으로 받은 size에 따라 Tailwind CSS 클래스를 매핑합니다.
  const sizeClasses = {
    '5xl': 'text-5xl',
    '4xl': 'text-4xl',
    '3xl': 'text-3xl',
  };

  return (
    // 👇 1. flex 컨테이너는 그대로 사용합니다.
    <div className="flex items-end justify-center">
      
      {/* 👇 2. 'sweatlo' 부분: oswald 폰트, 검정 */}
      <span className={`font-oswald font-bold text-gray-900 tracking-tight ${sizeClasses[size]}`}>
        sweatlo
      </span>
      
      {/* 👇 3. 'g' 부분: oswald 폰트, 어두운 빨강 */}
      <span className={`font-oswald font-bold text-brand-red-dark tracking-tight ${sizeClasses[size]}`}>
        g
      </span>
      
    </div>
  );
}