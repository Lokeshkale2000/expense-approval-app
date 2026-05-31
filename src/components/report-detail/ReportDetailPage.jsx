import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  ArrowDownUp,
  Search,
  Download,
} from "lucide-react";
import { useExpense } from "../../context/ExpenseContext";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import BillItem from "./BillItem";
import BillPreviewModal from "../bill-preview/BillPreviewModal";
import { formatAmount } from "../../utils/helpers";
import styles from "./ReportDetailPage.module.css";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, approveReport, rejectReport, approveBill, rejectBill } =
    useExpense();
  const [activeTab, setActiveTab] = useState("expenses");
  const [search, setSearch] = useState("");
  const [previewBillId, setPreviewBillId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (billId) =>
    setSelectedIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    );

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div
        style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}
      >
        Report not found. <Link to="/">Go back</Link>
      </div>
    );
  }

  const filteredBills = report.bills.filter(
    (b) => !search || b.title.toLowerCase().includes(search.toLowerCase()),
  );

  const previewBillIndex = report.bills.findIndex(
    (b) => b.id === previewBillId,
  );

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate("/expenses/all")}>
          <ArrowLeft size={13} /> Bill Approver
        </button>
        <span className={styles.breadcrumbSep}>/</span>
        <Link to="#">Dec-2025</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>View Report</span>
      </div>

      <div className={styles.content}>
        {/* Employee header card */}
        <div className={styles.employeeCard}>
          <div className={styles.empInfo}>
            <Avatar initials={report.employee.initials} size="lg" />
            <div className={styles.empDetails}>
              <span className={styles.empIdText}>
                Emp. ID - {report.employee.empId.replace("EMP-", "")}
              </span>
              <span className={styles.empName}>{report.employee.name}</span>
            </div>
            <div className={styles.empDivider} />
            <div className={styles.empMeta}>
              <div className={styles.empMetaGroup}>
                <span className={styles.empMetaLabel}>Grade</span>
                <span className={styles.empMetaValue}>
                  {report.employee.grade}
                </span>
              </div>
              <div className={styles.empMetaGroup}>
                <span className={styles.empMetaLabel}>Department</span>
                <span className={styles.empMetaValue}>
                  {report.employee.department}
                </span>
              </div>
              <div className={styles.empMetaGroup}>
                <span className={styles.empMetaLabel}>Email ID</span>
                <span className={styles.empMetaValue}>
                  {report.employee.email}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.btnDownload} title="Download report">
              <Download size={15} />
            </button>
            <button
              className={styles.btnRejectReport}
              onClick={() => {
                if (selectedIds.length > 0) {
                  selectedIds.forEach((billId) =>
                    rejectBill(report.id, billId),
                  );
                  setSelectedIds([]);
                } else {
                  rejectReport(report.id);
                }
              }}
            >
              Reject
            </button>
            <button
              className={styles.btnApproveReport}
              onClick={() => {
                if (selectedIds.length > 0) {
                  selectedIds.forEach((billId) =>
                    approveBill(report.id, billId),
                  );
                  setSelectedIds([]);
                } else {
                  approveReport(report.id);
                }
              }}
            >
              Approve
            </button>
          </div>
        </div>

        {/* Report summary */}
        <div className={styles.reportSummaryRow}>
          <div className={styles.reportTitleGroup}>
            <span className={styles.reportTitle}>{report.reportName}</span>
            <Badge status={report.status} />
          </div>
          <div className={styles.amountGroup}>
            <div className={styles.amountBox}>
              <span className={styles.amountLabel}>Total Amount</span>
              <span className={styles.amountValue}>
                {formatAmount(report.totalAmount)}
              </span>
            </div>
            <div className={styles.amountBox}>
              <span className={styles.amountLabel}>Amount Approved</span>
              <span className={styles.amountValue}>
                {formatAmount(report.approvedAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className={styles.mainLayout}>
          {/* Bills panel */}
          <div className={styles.billsPanel}>
            <div className={styles.billsToolbar}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab}${activeTab === "expenses" ? ` ${styles.activeTab}` : ""}`}
                  onClick={() => setActiveTab("expenses")}
                >
                  Expenses
                </button>
                <button
                  className={`${styles.tab}${activeTab === "mileage" ? ` ${styles.activeTab}` : ""}`}
                  onClick={() => setActiveTab("mileage")}
                >
                  Mileage Expense
                </button>
              </div>

              <div className={styles.billsToolbarRight}>
                <button className={styles.iconBtn} title="Refresh">
                  <RefreshCw size={13} />
                </button>
                <button className={styles.iconBtn} title="Sort">
                  <ArrowDownUp size={13} />
                </button>
                <div className={styles.searchWrap}>
                  <Search size={13} color="var(--text-muted)" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search here..."
                  />
                </div>
              </div>
            </div>

            <div className={styles.billsList}>
              {activeTab === "mileage" ? (
                <div className={styles.emptyBills}>
                  No mileage expenses added.
                </div>
              ) : filteredBills.length === 0 ? (
                <div className={styles.emptyBills}>No expenses found.</div>
              ) : (
                filteredBills.map((bill) => (
                  <BillItem
                    key={bill.id}
                    bill={bill}
                    reportId={report.id}
                    checked={selectedIds.includes(bill.id)}
                    onToggle={toggleSelect}
                    onViewDetails={(billId) => setPreviewBillId(billId)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>Approver:</div>
              <div className={styles.approverRow}>
                <Avatar initials={report.approver.initials} size="sm" />
                <span className={styles.approverName}>
                  {report.approver.name}
                </span>
              </div>
              <button className={styles.sideLink}>View Report History</button>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>Wallet Policies</div>
              <div className={styles.sideValue}>{report.walletPolicies}</div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>Additional Documents</div>
              <div className={styles.sideValue}>
                {report.additionalDocuments ?? "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Preview Modal */}
      {previewBillId && (
        <BillPreviewModal
          bills={report.bills}
          initialIndex={previewBillIndex >= 0 ? previewBillIndex : 0}
          reportId={report.id}
          onClose={() => setPreviewBillId(null)}
        />
      )}
    </div>
  );
}
