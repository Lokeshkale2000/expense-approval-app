import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, ArrowDownUp, Search, Download } from "lucide-react";
import { useExpense } from "../../context/ExpenseContext";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import BillItem from "./BillItem";
import BillPreviewModal from "../bill-preview/BillPreviewModal";
import { formatAmount } from "../../utils/helpers";
import "./ReportDetailPage.css";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, approveReport, rejectReport, approveBill, rejectBill } = useExpense();
  const [activeTab, setActiveTab] = useState("expenses");
  const [search, setSearch] = useState("");
  const [previewBillId, setPreviewBillId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (billId) =>
    setSelectedIds((prev) =>
      prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId],
    );

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        Report not found. <Link to="/">Go back</Link>
      </div>
    );
  }

  const filteredBills = report.bills.filter(
    (b) => !search || b.title.toLowerCase().includes(search.toLowerCase()),
  );

  const previewBillIndex = report.bills.findIndex((b) => b.id === previewBillId);

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate("/expenses/all")}>
          <ArrowLeft size={13} /> Bill Approver
        </button>
        <span className="breadcrumbSep">/</span>
        <Link to="#">Dec-2025</Link>
        <span className="breadcrumbSep">/</span>
        <span>View Report</span>
      </div>

      <div className="content">
        {/* Employee header card */}
        <div className="employeeCard">
          <div className="empInfo">
            <Avatar initials={report.employee.initials} size="lg" />
            <div className="empDetails">
              <span className="empIdText">Emp. ID - {report.employee.empId.replace("EMP-", "")}</span>
              <span className="empName">{report.employee.name}</span>
            </div>
            <div className="empDivider" />
            <div className="empMeta">
              <div className="empMetaGroup empMetaGroupBorder">
                <span className="empMetaLabel">Grade</span>
                <span className="empMetaValue">{report.employee.grade}</span>
              </div>
              <div className="empMetaGroup empMetaGroupBorder">
                <span className="empMetaLabel">Department</span>
                <span className="empMetaValue">{report.employee.department}</span>
              </div>
              <div className="empMetaGroup">
                <span className="empMetaLabel">Email ID</span>
                <span className="empMetaValue">{report.employee.email}</span>
              </div>
            </div>
          </div>

          <div className="headerActions">
            <button className="btnDownload" title="Download report">
              <Download size={15} />
            </button>
            <button
              className="btnRejectReport"
              onClick={() => {
                if (selectedIds.length > 0) {
                  selectedIds.forEach((billId) => rejectBill(report.id, billId));
                  setSelectedIds([]);
                } else {
                  rejectReport(report.id);
                }
              }}
            >
              Reject
            </button>
            <button
              className="btnApproveReport"
              onClick={() => {
                if (selectedIds.length > 0) {
                  selectedIds.forEach((billId) => approveBill(report.id, billId));
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
        <div className="reportSummaryRow">
          <div className="reportTitleGroup">
            <span className="reportTitle">{report.reportName}</span>
            <Badge status={report.status} />
          </div>
          <div className="amountGroup">
            <div className="amountBox">
              <span className="amountLabel">Total Amount</span>
              <span className="amountValue">{formatAmount(report.totalAmount)}</span>
            </div>
            <div className="amountBox">
              <span className="amountLabel">Amount Approved</span>
              <span className="amountValue">{formatAmount(report.approvedAmount)}</span>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="mainLayout">
          {/* Bills panel */}
          <div className="billsPanel">
            <div className="billsToolbar">
              <div className="tabs">
                <button
                  className={`tab${activeTab === "expenses" ? " activeTab" : ""}`}
                  onClick={() => setActiveTab("expenses")}
                >
                  Expenses
                </button>
                <button
                  className={`tab${activeTab === "mileage" ? " activeTab" : ""}`}
                  onClick={() => setActiveTab("mileage")}
                >
                  Mileage Expense
                </button>
              </div>

              <div className="billsToolbarRight">
                <button className="iconBtn" title="Refresh"><RefreshCw size={13} /></button>
                <button className="iconBtn" title="Sort"><ArrowDownUp size={13} /></button>
                <div className="searchWrap">
                  <Search size={13} color="var(--text-muted)" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search here..."
                  />
                </div>
              </div>
            </div>

            <div className="billsList">
              {activeTab === "mileage" ? (
                <div className="emptyBills">No mileage expenses added.</div>
              ) : filteredBills.length === 0 ? (
                <div className="emptyBills">No expenses found.</div>
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
          <div className="sidebar">
            <div className="sideCard">
              <div className="sideCardTitle">Approver:</div>
              <div className="approverRow">
                <Avatar initials={report.approver.initials} size="sm" />
                <span className="approverName">{report.approver.name}</span>
              </div>
              <button className="sideLink">View Report History</button>
            </div>

            <div className="sideCard">
              <div className="sideCardTitle">Wallet Policies</div>
              <div className="sideValue">{report.walletPolicies}</div>
            </div>

            <div className="sideCard">
              <div className="sideCardTitle">Additional Documents</div>
              <div className="sideValue">{report.additionalDocuments ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>

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
