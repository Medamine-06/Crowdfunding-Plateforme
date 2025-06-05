import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './auth/Login'
import Layout from './components/Layout'
import ProjectDetails from "./pages/ProjectDetails";
import CampaignList from './components/CampaignList'
import {AuthLayout}  from './auth/AuthLayout'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import Signup from './auth/Signup'
import CampaignForm from './pages/CampaignForm'
import Discover from './pages/Discover'
import HowItWorks from './pages/HowItWorks'
import ManageProjects from './pages/ManageProjects';
import PrivateRoute from './components/PrivateRoute';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import ManageUsers from './pages/ManageUsers'; // Add this import
import Statistics from './pages/Statistics';

function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
    <Routes>
    <Route path="" element={<Layout />}>
      <Route path="/" element={<Home></Home>} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="projects/:id" element={<ProjectDetails/>} /> 
      <Route path='CampaignList' element={<CampaignList></CampaignList>}/>
      <Route path='campaignForm' element={<CampaignForm></CampaignForm>}/>
      <Route path="/discover" element={<Discover />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <ManageProjects />
          </PrivateRoute>
        }
      />
                  <Route
              path="/admin/users"
              element={
                <PrivateRoute requiredRole="admin">
                  <ManageUsers />
                </PrivateRoute>
              }
            />
               <Route
        path="/admin/statistics"
        element={
          <PrivateRoute requiredRole="admin">
            <Statistics />
          </PrivateRoute>
        }
      />
         

    </Route>


    <Route path="/auth" element={<AuthLayout/>}>
          <Route path='login' element={<Login/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path="forgot-password" element={<ForgotPassword/>} />
          <Route path="reset-password/:resetkey" element={<ResetPassword />} />
    </Route>
    <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
    <Route path="/PaymentCancel" element={<PaymentCancel />} />

    </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
