import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import TestPage from './pages/TestPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import CategoriesPage from './pages/CategoriesPage'
import BadgesPage from './pages/BadgesPage'
import ReportsPage from './pages/ReportsPage'
import StatisticsPage from './pages/StatisticsPage'

function ProtectedRoute({ element }) {
    const token = localStorage.getItem('admin_access_token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return element
}

export default function App() {
    useEffect(() => {
        console.log('App loaded successfully')
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/test" element={<TestPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
                <Route path="/users" element={<ProtectedRoute element={<UsersPage />} />} />
                <Route path="/categories" element={<ProtectedRoute element={<CategoriesPage />} />} />
                <Route path="/badges" element={<ProtectedRoute element={<BadgesPage />} />} />
                <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} />} />
                <Route path="/statistics" element={<ProtectedRoute element={<StatisticsPage />} />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}
