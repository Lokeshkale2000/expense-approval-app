import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Sidebar from './components/layout/Sidebar';
import ReportsPage from './components/reports/ReportsPage';
import ReportDetailPage from './components/report-detail/ReportDetailPage';
import './App.css';

function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: 40, color: 'var(--text-muted)', fontSize: 15 }}>
      {title} — coming soon.
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <Routes>
              <Route path="/expenses" element={<ReportsPage />} />
              <Route path="/expenses/all" element={<ReportsPage />} />
              <Route path="/expenses/pending" element={<ReportsPage />} />
              <Route path="/expenses/report/:id" element={<ReportDetailPage />} />
              <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
              <Route path="/teams" element={<PlaceholderPage title="Teams" />} />
              <Route path="/roles" element={<PlaceholderPage title="Roles" />} />
              <Route path="/rewards" element={<PlaceholderPage title="Rewards" />} />
              <Route path="/smart-cards" element={<PlaceholderPage title="Smart Cards" />} />
              <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ExpenseProvider>
  );
}
