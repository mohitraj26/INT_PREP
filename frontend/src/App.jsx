import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'
import AdminRoute from './components/AdminRoute'
import AddProblem from './pages/AddProblem'
import ProblemPage from './pages/ProblemPage'
import ProfilePage from './pages/ProfilePage'
import AllSubmissionPage from './pages/AllSubmissionPage'
import LandingPage from './pages/LandingPage'
import NewPage from './pages/NewPage'
import { ThemeProvider } from './context/Theme'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <Toaster />

      <Routes>
        
        <Route
          path='/problem/:id'
          element={authUser ? <ProblemPage /> : <Navigate to='/login' />}
        />

        <Route
          path='/allSubmissions'
          element={authUser ? <AllSubmissionPage /> : <Navigate to='/login' />}
        />
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/newpage' />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/login' />} />

        {/* ✅ All other pages wrapped in ThemeProvider */}
        <Route
          path='*'
          element={
            <ThemeProvider>
              <Routes>

                <Route path='/newpage' element={<NewPage />} />


                <Route element={<AdminRoute />}>
                  <Route
                    path='/add-problem'
                    element={authUser ? <AddProblem /> : <Navigate to='/' />}
                  />
                </Route>

                <Route
                  path='/profile'
                  element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
                />

              </Routes>
            </ThemeProvider>
          }
        />
      </Routes>
    </div>
  )
}

export default App
