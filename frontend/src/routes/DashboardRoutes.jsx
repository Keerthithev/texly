import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSMS from '../pages/DashboardSMS.jsx';
import DashboardContacts from '../pages/DashboardContacts.jsx';
import DashboardTemplates from '../pages/DashboardTemplates.jsx';
import DashboardReports from '../pages/DashboardReports.jsx';
import DashboardSubscription from '../pages/DashboardSubscription.jsx';

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="sms" replace />} />
      <Route path="sms" element={<DashboardSMS />} />
      <Route path="contacts" element={<DashboardContacts />} />
      <Route path="templates" element={<DashboardTemplates />} />
      <Route path="reports" element={<DashboardReports />} />
      <Route path="subscription" element={<DashboardSubscription />} />
    </Routes>
  );
}
