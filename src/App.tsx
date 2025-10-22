import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import PMCalendar from "./pages/PMCalendar";
import VendorPortal from "./pages/VendorPortal";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import PMTemplates from "./pages/PMTemplates";
import VendorDashboard from "./pages/VendorDashboard";
import VendorWorkOrderDetails from "./pages/VendorWorkOrderDetails";
import ReportsDashboard from "./pages/ReportsDashboard";
import ReportsWorkOrders from "./pages/ReportsWorkOrders";
import ReportsVendors from "./pages/ReportsVendors";
import ReportsPM from "./pages/ReportsPM";
import CapitalProjects from "./pages/CapitalProjects";
import CapitalProjectDetails from "./pages/CapitalProjectDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-bg">
        <Navbar />
        <div className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modern-dashboard" element={<DashboardPage />} />
            <Route path="/workorders" element={<WorkOrders />} />
            <Route path="/pm" element={<PMCalendar />} />
            <Route path="/pm-templates" element={<PMTemplates />} />
            <Route path="/vendors" element={<VendorPortal />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/reports/workorders" element={<ReportsWorkOrders />} />
            <Route path="/reports/vendors" element={<ReportsVendors />} />
            <Route path="/reports/pm" element={<ReportsPM />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/work-orders/:id" element={<VendorWorkOrderDetails />} />
            <Route path="/capital-projects" element={<CapitalProjects />} />
            <Route path="/capital-projects/:id" element={<CapitalProjectDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;