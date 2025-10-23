/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ 이 부분을 추가합니다.
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'], // 'oswald'라는 이름의 커스텀 폰트 패밀리 추가
      },
      colors: {
        'brand-red-dark': '#990000', // 'brand-red-dark'라는 이름의 커스텀 색상 추가
      },
    },
  },
  plugins: [],
}