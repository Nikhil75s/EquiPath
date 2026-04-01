import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import A11yHub from './components/common/A11yHub'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import AbilityAssessment from './pages/AbilityAssessment'
import SkillGapNavigator from './pages/SkillGapNavigator'
import JobListings from './pages/JobListings'
import EmployerDashboard from './pages/EmployerDashboard'
import PostJob from './pages/PostJob'
import ReadinessAudit from './pages/ReadinessAudit'
import AdminDashboard from './pages/AdminDashboard'
import Applicants from './pages/Applicants'
import MyApplications from './pages/MyApplications'
import CareerPath from './pages/CareerPath'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Job Seeker Routes */}
          <Route path="/dashboard/seeker" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/assessment" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <AbilityAssessment />
            </ProtectedRoute>
          } />
          <Route path="/skill-gap" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <SkillGapNavigator />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <JobListings />
            </ProtectedRoute>
          } />
          <Route path="/seeker/applications" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/seeker/career-path" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <CareerPath />
            </ProtectedRoute>
          } />

          {/* Employer Routes */}
          <Route path="/dashboard/employer" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer/post-job" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/employer/audit" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ReadinessAudit />
            </ProtectedRoute>
          } />
          <Route path="/employer/jobs/:jobId/applicants" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Applicants />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <A11yHub />
      <Footer />
    </div>
  )
}

export default App
