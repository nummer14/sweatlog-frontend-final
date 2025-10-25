import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore.js';
import api from '@/api/axios';

// Pages
import LandingPage from '@/pages/LandingPage.jsx'; // LandingPage import
import Login from '@/pages/Login.jsx';
import SignUp from '@/pages/SignUp';
import HomeRedirect from '@/pages/HomeRedirect';
import SocialFeed from '@/pages/SocialFeed';
import Post from '@/pages/Post';
import PostDetail from '@/pages/PostDetail';
import MyProfile from '@/pages/MyProfile';
// import UserProfile from '@/pages/UserProfile';
import MyRoutines from '@/pages/MyRoutines';
import RoutineEditor from '@/pages/RoutineEditor';
import MyGoals from '@/pages/MyGoals';
import GoalEditor from '@/pages/GoalEditor';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';

function App() {
  const { accessToken, setTokens } = useAuthStore();

  useEffect(() => {
    const storedAuthState = localStorage.getItem('auth-storage');

    if (storedAuthState) {
      try {
        const parsedState = JSON.parse(storedAuthState);
        const token = parsedState.state.accessToken;

        if (token) {

          setTokens({ accessToken: token, user: parsedState.state.user });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to parse auth storage:", error);
      }
    }
  }, []);
  
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
            <Route path="/login" element={!accessToken ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!accessToken ? <SignUp /> : <Navigate to="/" replace />} />
            <Route path="/oauth2/redirect" element={<HomeRedirect />} />
            <Route path="/post/new" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/post/edit/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/post/:postId"element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
            <Route path="/profile/me" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            {/* <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> */}
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