import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RefreshCw, ArrowDownUp, Search, ChevronDown } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatAmount } from '../../utils/helpers';
import styles from './ReportsPage.module.css';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'all', label: 'All Reports' },
];

export default function ReportsPage() {
  const { reports } = useExpense();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.endsWith('/pending') ? 'pending' : 'all';
  const [search, setSearch] = useState('');

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  const filtered = reports.filter((r) => {
    const matchTab = activeTab === 'all' || r.status === 'pending';
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.employee.name.toLowerCase().includes(q) ||
      r.reportName.toLowerCase().includes(q) ||
      r.approver.name.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="#">Bill Approver</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span>Dec-2025</span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reports</h1>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.tab}${activeTab === tab.key ? ` ${styles.activeTab}` : ""}`}
                  onClick={() =>
                    navigate(
                      tab.key === "pending"
                        ? "/expenses/pending"
                        : "/expenses/all",
                    )
                  }
                >
                  {tab.label}
                  <span className={styles.tabCount}>
                    {tab.key === "pending"
                      ? `0${pendingCount}`
                      : reports.length}
                  </span>
                  {tab.key === "all" && <ChevronDown size={14} />}
                </button>
              ))}
            </div>

            <div className={styles.toolbarRight}>
              <button className={styles.iconBtn} title="Refresh">
                <RefreshCw size={14} />
              </button>
              <button className={styles.iconBtn} title="Sort">
                <ArrowDownUp size={14} />
              </button>
              <div className={styles.searchWrap}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />
                <Search size={14} color="var(--text-muted)" />
              </div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SR NO.</th>
                  <th>EMPLOYEE NAME</th>
                  <th>REIMBURSEMENT REPORT</th>
                  <th>NO. OF BILLS</th>
                  <th>APPROVER</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.emptyState}>No reports found.</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <span className={styles.srNo}>{report.srNo}</span>
                      </td>
                      <td>
                        <div className={styles.employeeCell}>
                          <div className={styles.employeeInfo}>
                            <Avatar initials={report.employee.initials} size="sm" />
                            <span className={styles.employeeName}>{report.employee.name}</span>
                          </div>
                          <div className={styles.employeeId}>
                            Emp. ID - {report.employee.empId.replace("EMP-", "")}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.reportCell}>
                          <span
                            className={styles.reportLink}
                            onClick={() =>
                              navigate(`/expenses/report/${report.id}`)
                            }
                          >
                            {report.reportName}
                          </span>
                          <span className={styles.uploadDate}>
                            Uploaded on - {report.uploadedOn}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.billCount}>
                          {report.bills.length}
                        </span>
                      </td>
                      <td>
                        <div className={styles.approverCell}>
                          <Avatar
                            initials={report.approver.initials}
                            size="sm"
                          />
                          {report.approver.name}
                        </div>
                      </td>
                      <td>
                        <Badge status={report.status} />
                      </td>
                      <td>
                        <span className={styles.amount}>
                          {formatAmount(report.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
