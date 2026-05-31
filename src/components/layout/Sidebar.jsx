import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Shield, Receipt, Gift,
  CreditCard, FileText, Settings, ScrollText, Grid3X3,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Teams', icon: Users, to: '/teams' },
  { label: 'Roles', icon: Shield, to: '/roles' },
  { label: 'Expense', icon: Receipt, to: '/expenses/all', base: '/expenses' },
  { label: 'Rewards', icon: Gift, to: '/rewards' },
  { label: 'Smart Cards', icon: CreditCard, to: '/smart-cards' },
  { label: 'Reports', icon: FileText, to: '/reports' },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Terms & Conditions', icon: ScrollText, to: '/terms' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logoIcon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2.5" fill="none" />
            <circle cx="12" cy="12" r="3" fill="white" />
          </svg>
        </div>
        <span className="logoText">OptiFii</span>
        <Grid3X3 size={16} className="gridIcon" />
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(({ label, icon: Icon, to, base }) => (
          <NavLink
            key={label}
            to={to}
            className={() => {
              const isActive = base
                ? location.pathname.startsWith(base)
                : location.pathname === to;
              return `navItem${isActive ? ' active' : ''}`;
            }}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        <div className="divider" />

        {BOTTOM_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => `navItem${isActive ? ' active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="footer">
        <div className="footerAvatar" />
        <div className="footerInfo">
          <div className="footerName">Giftryt Ventures Pvt. Ltd.</div>
          <div className="footerEmail">team@giftryt.com</div>
        </div>
      </div>
    </aside>
  );
}
