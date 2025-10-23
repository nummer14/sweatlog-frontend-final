import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore.js';

// Pages
import LandingPage from '@/pages/LandingPage.jsx'; // LandingPage import
import Login from '@/pages/Login.jsx';
import SignUp from '@/pages/SignUp';
import HomeRedirect from '@/pages/HomeRedirect';
import SocialFeed from '@/pages/SocialFeed';
import Post from '@/pages/Post';
import PostDetail from '@/pages/PostDetail';
import MyProfile from '@/pages/MyProfile';
import UserProfile from '@/pages/UserProfile';
import MyRoutines from '@/pages/MyRoutines';
import RoutineEditor from '@/pages/RoutineEditor';
import MyGoals from '@/pages/MyGoals';
import GoalEditor from '@/pages/GoalEditor';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';

function App() {
  const { accessToken } = useAuthStore();

  return (
    <Router>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto pt-20 p-4">
          <Routes>
            <Route 
              path="/" 
              element={
                accessToken ? <SocialFeed /> : <LandingPage />
              } 
            />
            
            {/* ✅ 로그인/회원가입 페이지는 로그인 시 접근하지 못하도록 처리합니다. */}
            <Route path="/login" element={!accessToken ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!accessToken ? <SignUp /> : <Navigate to="/" replace />} />
            <Route path="/oauth2/redirect" element={<HomeRedirect />} />

            {/* Protected Routes (로그인이 필요한 페이지들) */}
            {/* SocialFeed는 위에서 처리했으므로 여기서는 제외하거나, 
                /feed 같은 별도 경로로 만들 수도 있습니다. 여기서는 위 방식으로 통일합니다. */}
            <Route path="/post/new" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/post/edit/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/post/:postId"element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
            <Route path="/profile/me" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/routines" element={<ProtectedRoute><MyRoutines /></ProtectedRoute>} />
            <Route path="/routines/new" element={<ProtectedRoute><RoutineEditor /></ProtectedRoute>} />
            <Route path="/routines/edit/:routineId" element={<ProtectedRoute><RoutineEditor /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><MyGoals /></ProtectedRoute>} />
            <Route path="/goals/new" element={<ProtectedRoute><GoalEditor /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}
export default App;