import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import Entry from './pages/Entry';
import DataList from './pages/DataList';
import Reports from './pages/Reports';
import Finance from './pages/Finance';
import Technician from './pages/Technician';
import DatabaseSetup from './pages/DatabaseSetup';

const App = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entry" element={<Entry />} />
          <Route path="/list" element={<DataList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/technician" element={<Technician />} />
          <Route path="/database" element={<DatabaseSetup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;