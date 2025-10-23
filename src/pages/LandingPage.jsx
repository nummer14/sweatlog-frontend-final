import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Dumbbell, Target, Users } from 'lucide-react';

// 각 슬라이드의 이미지, 내용을 배열로 관리합니다.
// ✅ 이 부분을 복사해서 기존 slides 배열과 교체하세요.

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    content: (
      <>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          당신의 모든 땀방울을
          <br />
          <span className="font-oswald font-bold tracking-tight">
            <span className="text-white">sweatlo</span>
            <span className="text-red-400">g</span>
          </span>
          에 기록하세요.
        </h1>
      </>
    ),
  },
  {
    // ✅ 2번 슬라이드: 배경 이미지를 기존 3번 이미지로 변경
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    content: (
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl max-w-3xl">
        저희는 단순한 기록을 넘어,
        <br />
        당신의 성장을 돕는
        <br />
        <span className="text-4xl font-bold tracking-tight text-red-400 sm:text-6xl">스마트 운동 파트너</span>입니다.
      </h1>
    ),
  },
  {
    // ✅ 3번 슬라이드: '여럿이 함께 웃으며 운동하는' 새 이미지로 변경  
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80',
    content: (
      <>
        {/* ✅ 요청대로 '가치있게' 문구를 상단 중앙에 배치 */}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-16">
          당신의 땀방울을
          <span className="text-red-400"> 가치 있게.</span>
        </h1>
        {/* ✅ 그 아래에 기능 3가지 소개 배치 */}
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
          <div className="relative pl-16 text-left">
            <dt className="text-lg font-semibold leading-7 text-white"><div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"><Dumbbell className="h-6 w-6 text-white" /></div>간편한 운동 기록</dt>
            <dd className="mt-2 text-base leading-7 text-gray-300">어떤 운동이든 몇 번의 터치로 손쉽게 기록하고 관리하세요.</dd>
          </div>
          <div className="relative pl-16 text-left">
            <dt className="text-lg font-semibold leading-7 text-white"><div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"><Target className="h-6 w-6 text-white" /></div>체계적인 목표 관리</dt>
            <dd className="mt-2 text-base leading-7 text-gray-300">구체적인 목표를 설정하고 달성률을 추적하며 동기를 부여받으세요.</dd>
          </div>
          <div className="relative pl-16 text-left">
            <dt className="text-lg font-semibold leading-7 text-white"><div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"><Users className="h-6 w-6 text-white" /></div>함께하는 소셜 피드</dt>
            <dd className="mt-2 text-base leading-7 text-gray-300">친구들과 응원하며 함께 성장하고 운동 습관을 만들어가세요.</dd>
          </div>
        </dl>
      </>
    ),
  },
  {
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80',
    content: (
      <>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          지금 바로 시작하세요
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/signup" className="rounded-md bg-red-700 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-red-600 focus-visible:outline-red-600 transition-transform hover:scale-105">
            무료로 시작하기
          </Link>
          <Link to="/login" className="text-sm font-semibold leading-6 text-white">
            로그인 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </>
    ),
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  }

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden -mt-20 bg-black">
      {/* 슬라이드 래퍼 */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* 각 슬라이드 */}
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full w-full flex-shrink-0">
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="relative mx-auto flex h-full max-w-4xl items-center justify-center px-6 text-center lg:px-8">
              <div className="transition-opacity duration-500">
                {slide.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전 버튼 */}
      {currentSlide > 0 && (
        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30" aria-label="Previous slide">
          <ArrowLeft size={24} />
        </button>
      )}

      {/* 다음 버튼 */}
      {currentSlide < slides.length - 1 && (
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30" aria-label="Next slide">
          <ArrowRight size={24} />
        </button>
      )}
      
      {/* 하단 페이지네이션 점 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${currentSlide === index ? 'w-4 bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
          ))}
      </div>
    </div>
  );
}