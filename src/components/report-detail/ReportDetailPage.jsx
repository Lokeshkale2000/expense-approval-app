// // import { useState } from "react";
// // import { useParams, useNavigate, Link } from "react-router-dom";
// // import { ArrowLeft, RefreshCw, ArrowDownUp, Search, Download } from "lucide-react";
// // import { useExpense } from "../../context/ExpenseContext";
// // import Avatar from "../ui/Avatar";
// // import Badge from "../ui/Badge";
// // import BillItem from "./BillItem";
// // import BillPreviewModal from "../bill-preview/BillPreviewModal";
// // import { formatAmount } from "../../utils/helpers";
// // import "./ReportDetailPage.css";

// // export default function ReportDetailPage() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { reports, approveReport, rejectReport, approveBill, rejectBill } = useExpense();
// //   const [activeTab, setActiveTab] = useState("expenses");
// //   const [search, setSearch] = useState("");
// //   const [previewBillId, setPreviewBillId] = useState(null);
// //   const [selectedIds, setSelectedIds] = useState([]);

// //   const toggleSelect = (billId) =>
// //     setSelectedIds((prev) =>
// //       prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId],
// //     );

// //   const report = reports.find((r) => r.id === id);

// //   if (!report) {
// //     return (
// //       <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
// //         Report not found. <Link to="/">Go back</Link>
// //       </div>
// //     );
// //   }

// //   const filteredBills = report.bills.filter(
// //     (b) => !search || b.title.toLowerCase().includes(search.toLowerCase()),
// //   );

// //   const previewBillIndex = report.bills.findIndex((b) => b.id === previewBillId);

// //   return (
// //     <div className="rd-page">
// //       <div className="rd-breadcrumb">
// //         <button onClick={() => navigate("/expenses/all")}>
// //           <ArrowLeft size={13} /> Bill Approver
// //         </button>
// //         <span className="rd-breadcrumbSep">/</span>
// //         <Link to="#">Dec-2025</Link>
// //         <span className="rd-breadcrumbSep">/</span>
// //         <span>View Report</span>
// //       </div>

// //       <div className="rd-content">
// //         <div className="rd-employeeCard">
// //           <div className="rd-empInfo">
// //             <Avatar initials={report.employee.initials} size="lg" />
// //             <div className="rd-empDetails">
// //               <span className="rd-empIdText">Emp. ID - {report.employee.empId.replace("EMP-", "")}</span>
// //               <span className="rd-empName">{report.employee.name}</span>
// //             </div>
// //             <div className="rd-empMeta">
// //               <div className="rd-empMetaGroup rd-empMetaGroupBorder">
// //                 <span className="rd-empMetaLabel">Grade</span>
// //                 <span className="rd-empMetaValue">{report.employee.grade}</span>
// //               </div>
// //               <div className="rd-empMetaGroup rd-empMetaGroupBorder">
// //                 <span className="rd-empMetaLabel">Department</span>
// //                 <span className="rd-empMetaValue">{report.employee.department}</span>
// //               </div>
// //               <div className="rd-empMetaGroup">
// //                 <span className="rd-empMetaLabel">Email ID</span>
// //                 <span className="rd-empMetaValue">{report.employee.email}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rd-headerActions">
// //             <button className="rd-btnDownload" title="Download report">
// //               <Download size={15} />
// //             </button>
// //             <button
// //               className="rd-btnRejectReport"
// //               onClick={() => {
// //                 if (selectedIds.length > 0) {
// //                   selectedIds.forEach((billId) => rejectBill(report.id, billId));
// //                   setSelectedIds([]);
// //                 } else {
// //                   rejectReport(report.id);
// //                 }
// //               }}
// //             >
// //               Reject
// //             </button>
// //             <button
// //               className="rd-btnApproveReport"
// //               onClick={() => {
// //                 if (selectedIds.length > 0) {
// //                   selectedIds.forEach((billId) => approveBill(report.id, billId));
// //                   setSelectedIds([]);
// //                 } else {
// //                   approveReport(report.id);
// //                 }
// //               }}
// //             >
// //               Approve
// //             </button>
// //           </div>
// //         </div>

// //         <div className="rd-reportSummaryRow">
// //           <div className="rd-reportTitleGroup">
// //             <span className="rd-reportTitle">{report.reportName}</span>
// //             <Badge status={report.status} />
// //           </div>
// //           <div className="rd-amountGroup">
// //             <div className="rd-amountBox">
// //               <span className="rd-amountLabel">Total Amount</span>
// //               <span className="rd-amountValue">{formatAmount(report.totalAmount)}</span>
// //             </div>
// //             <div className="rd-amountBox">
// //               <span className="rd-amountLabel">Amount Approved</span>
// //               <span className="rd-amountValue">{formatAmount(report.approvedAmount)}</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="rd-mainLayout">
// //           <div className="rd-billsPanel">
// //             <div className="rd-billsToolbar">
// //               <div className="rd-tabs">
// //                 <button
// //                   className={`rd-tab${activeTab === "expenses" ? " rd-activeTab" : ""}`}
// //                   onClick={() => setActiveTab("expenses")}
// //                 >
// //                   Expenses
// //                 </button>
// //                 <button
// //                   className={`rd-tab${activeTab === "mileage" ? " rd-activeTab" : ""}`}
// //                   onClick={() => setActiveTab("mileage")}
// //                 >
// //                   Mileage Expense
// //                 </button>
// //               </div>

// //               <div className="rd-billsToolbarRight">
// //                 <button className="rd-iconBtn" title="Refresh"><RefreshCw size={13} /></button>
// //                 <button className="rd-iconBtn" title="Sort"><ArrowDownUp size={13} /></button>
// //                 <div className="rd-searchWrap">
// //                   <Search size={13} color="var(--text-muted)" />
// //                   <input
// //                     value={search}
// //                     onChange={(e) => setSearch(e.target.value)}
// //                     placeholder="Search here..."
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="rd-billsList">
// //               {activeTab === "mileage" ? (
// //                 <div className="rd-emptyBills">No mileage expenses added.</div>
// //               ) : filteredBills.length === 0 ? (
// //                 <div className="rd-emptyBills">No expenses found.</div>
// //               ) : (
// //                 filteredBills.map((bill) => (
// //                   <BillItem
// //                     key={bill.id}
// //                     bill={bill}
// //                     reportId={report.id}
// //                     checked={selectedIds.includes(bill.id)}
// //                     onToggle={toggleSelect}
// //                     onViewDetails={(billId) => setPreviewBillId(billId)}
// //                   />
// //                 ))
// //               )}
// //             </div>
// //           </div>

// //           <div className="rd-sidebar">
// //             <div className="rd-sideCard">
// //               <div className="rd-sideCardTitle">Approver:</div>
// //               <div className="rd-approverRow">
// //                 <Avatar initials={report.approver.initials} size="sm" />
// //                 <span className="rd-approverName">{report.approver.name}</span>
// //               </div>
// //               <button className="rd-sideLink">View Report History</button>
// //             </div>
// //             <div className="rd-sideCard">
// //               <div className="rd-sideCardTitle">Wallet Policies</div>
// //               <div className="rd-sideValue">{report.walletPolicies}</div>
// //             </div>
// //             <div className="rd-sideCard">
// //               <div className="rd-sideCardTitle">Additional Documents</div>
// //               <div className="rd-sideValue">{report.additionalDocuments ?? "-"}</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {previewBillId && (
// //         <BillPreviewModal
// //           bills={report.bills}
// //           initialIndex={previewBillIndex >= 0 ? previewBillIndex : 0}
// //           reportId={report.id}
// //           onClose={() => setPreviewBillId(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   RefreshCw,
//   ArrowDownUp,
//   Search,
//   Download,
// } from "lucide-react";
// import { useExpense } from "../../context/ExpenseContext";
// import Avatar from "../ui/Avatar";
// import Badge from "../ui/Badge";
// import BillItem from "./BillItem";
// import BillPreviewModal from "../bill-preview/BillPreviewModal";
// import { formatAmount } from "../../utils/helpers";
// import "./ReportDetailPage.css";

// export default function ReportDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { reports, approveReport, rejectReport, approveBill, rejectBill } =
//     useExpense();
//   const [activeTab, setActiveTab] = useState("expenses");
//   const [search, setSearch] = useState("");
//   const [previewBillId, setPreviewBillId] = useState(null);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const toggleSelect = (billId) =>
//     setSelectedIds((prev) =>
//       prev.includes(billId)
//         ? prev.filter((id) => id !== billId)
//         : [...prev, billId],
//     );

//   const report = reports.find((r) => r.id === id);

//   if (!report) {
//     return (
//       <div
//         style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}
//       >
//         Report not found. <Link to="/">Go back</Link>
//       </div>
//     );
//   }

//   const filteredBills = report.bills.filter(
//     (b) => !search || b.title.toLowerCase().includes(search.toLowerCase()),
//   );

//   const previewBillIndex = report.bills.findIndex(
//     (b) => b.id === previewBillId,
//   );

//   return (
//     <div className="rd-page">
//       {/* Breadcrumb */}
//       <div className="rd-breadcrumb">
//         <button onClick={() => navigate("/expenses/all")}>
//           <ArrowLeft size={13} /> Bill Approver
//         </button>
//         <span className="rd-breadcrumbSep">/</span>
//         <Link to="#">Dec-2025</Link>
//         <span className="rd-breadcrumbSep">/</span>
//         <span>View Report</span>
//       </div>

//       <div className="rd-content">
//         {/* ── Employee Card ── */}
//         <div className="rd-employeeCard">
//           <div className="rd-empInfo">
//             <Avatar initials={report.employee.initials} size="lg" />
//             <div className="rd-empDetails">
//               <span className="rd-empIdText">
//                 Emp. ID - {report.employee.empId.replace("EMP-", "")}
//               </span>
//               <span className="rd-empName">{report.employee.name}</span>
//             </div>
//             <div className="rd-empMeta">
//               <div className="rd-empMetaGroup rd-empMetaGroupBorder">
//                 <span className="rd-empMetaLabel">Grade</span>
//                 <span className="rd-empMetaValue">{report.employee.grade}</span>
//               </div>
//               <div className="rd-empMetaGroup rd-empMetaGroupBorder">
//                 <span className="rd-empMetaLabel">Department</span>
//                 <span className="rd-empMetaValue">
//                   {report.employee.department}
//                 </span>
//               </div>
//               <div className="rd-empMetaGroup">
//                 <span className="rd-empMetaLabel">Email ID</span>
//                 <span className="rd-empMetaValue">{report.employee.email}</span>
//               </div>
//             </div>
//           </div>

//           <div className="rd-headerActions">
//             <button className="rd-btnDownload" title="Download report">
//               <Download size={15} />
//             </button>
//             <button
//               className="rd-btnRejectReport"
//               onClick={() => {
//                 if (selectedIds.length > 0) {
//                   selectedIds.forEach((billId) =>
//                     rejectBill(report.id, billId),
//                   );
//                   setSelectedIds([]);
//                 } else {
//                   rejectReport(report.id);
//                 }
//               }}
//             >
//               Reject
//             </button>
//             <button
//               className="rd-btnApproveReport"
//               onClick={() => {
//                 if (selectedIds.length > 0) {
//                   selectedIds.forEach((billId) =>
//                     approveBill(report.id, billId),
//                   );
//                   setSelectedIds([]);
//                 } else {
//                   approveReport(report.id);
//                 }
//               }}
//             >
//               Approve
//             </button>
//           </div>
//         </div>

//         {/* ── Report Summary Row ── */}
//         <div className={{di}}>
//           <div>
//             <div className="rd-reportSummaryRow">
//               {/* LEFT: title + badge */}
//               <div className="rd-reportTitleGroup">
//                 <span className="rd-reportTitle">{report.reportName}</span>
//                 <Badge status={report.status} />

//                 <div className="rd-amountBox">
//                   <span className="rd-amountLabel">Amount Approved</span>
//                   <span className="rd-amountValue">
//                     {formatAmount(report.approvedAmount)}
//                   </span>
//                 </div>
//                 <div className="rd-amountBox">
//                   <span className="rd-amountLabel">Total Amount</span>
//                   <span className="rd-amountValue">
//                     {formatAmount(report.totalAmount)}
//                   </span>
//                 </div>
//               </div>

//               {/* RIGHT: two amount boxes separated by a divider */}
//               <div className="rd-amountGroup"></div>
//             </div>

//             {/* ── Main Layout ── */}
//             <div className="rd-mainLayout">
//               {/* Bills Panel */}
//               <div className="rd-billsPanel">
//                 <div className="rd-billsToolbar">
//                   <div className="rd-tabs">
//                     <button
//                       className={`rd-tab${activeTab === "expenses" ? " rd-activeTab" : ""}`}
//                       onClick={() => setActiveTab("expenses")}
//                     >
//                       Expenses
//                     </button>
//                     <button
//                       className={`rd-tab${activeTab === "mileage" ? " rd-activeTab" : ""}`}
//                       onClick={() => setActiveTab("mileage")}
//                     >
//                       Mileage Expense
//                     </button>
//                   </div>

//                   <div className="rd-billsToolbarRight">
//                     <button className="rd-iconBtn" title="Refresh">
//                       <RefreshCw size={13} />
//                     </button>
//                     <button className="rd-iconBtn" title="Sort">
//                       <ArrowDownUp size={13} />
//                     </button>
//                     <div className="rd-searchWrap">
//                       <Search size={13} color="var(--text-muted)" />
//                       <input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search here..."
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rd-billsList">
//                   {activeTab === "mileage" ? (
//                     <div className="rd-emptyBills">
//                       No mileage expenses added.
//                     </div>
//                   ) : filteredBills.length === 0 ? (
//                     <div className="rd-emptyBills">No expenses found.</div>
//                   ) : (
//                     filteredBills.map((bill) => (
//                       <BillItem
//                         key={bill.id}
//                         bill={bill}
//                         reportId={report.id}
//                         checked={selectedIds.includes(bill.id)}
//                         onToggle={toggleSelect}
//                         onViewDetails={(billId) => setPreviewBillId(billId)}
//                         onApprove={approveBill}
//                         onReject={rejectBill}
//                       />
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//             {/* Sidebar */}
//           </div>
//           <div className="rd-sidebar">
//             <div className="rd-sideCard">
//               <div className="rd-sideCardTitle">Approver:</div>
//               <div className="rd-approverRow">
//                 <Avatar initials={report.approver.initials} size="sm" />
//                 <span className="rd-approverName">{report.approver.name}</span>
//               </div>
//               <button className="rd-sideLink">View Report History</button>
//             </div>
//             <div className="rd-sideCard">
//               <div className="rd-sideCardTitle">Wallet Policies</div>
//               <div className="rd-sideValue">{report.walletPolicies}</div>
//             </div>
//             <div className="rd-sideCard">
//               <div className="rd-sideCardTitle">Additional Documents</div>
//               <div className="rd-sideValue">
//                 {report.additionalDocuments ?? "-"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {previewBillId && (
//         <BillPreviewModal
//           bills={report.bills}
//           initialIndex={previewBillIndex >= 0 ? previewBillIndex : 0}
//           reportId={report.id}
//           onClose={() => setPreviewBillId(null)}
//         />
//       )}
//     </div>
//   );
// }
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
import "./ReportDetailPage.css";

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
    <div className="rd-page">
      {/* Breadcrumb */}
      <div className="rd-breadcrumb">
        <button onClick={() => navigate("/expenses/all")}>
          <ArrowLeft size={13} /> Bill Approver
        </button>
        <span className="rd-breadcrumbSep">/</span>
        <Link to="#">Dec-2025</Link>
        <span className="rd-breadcrumbSep">/</span>
        <span>View Report</span>
      </div>

      <div className="rd-content">
        {/* ── Employee Card ── */}
        <div className="rd-employeeCard">
          <div className="rd-empInfo">
            <Avatar initials={report.employee.initials} size="lg" />
            <div className="rd-empDetails">
              <span className="rd-empIdText">
                Emp. ID - {report.employee.empId.replace("EMP-", "")}
              </span>
              <span className="rd-empName">{report.employee.name}</span>
            </div>
            <div className="rd-empMeta">
              <div className="rd-empMetaGroup rd-empMetaGroupBorder">
                <span className="rd-empMetaLabel">Grade</span>
                <span className="rd-empMetaValue">{report.employee.grade}</span>
              </div>
              <div className="rd-empMetaGroup rd-empMetaGroupBorder">
                <span className="rd-empMetaLabel">Department</span>
                <span className="rd-empMetaValue">
                  {report.employee.department}
                </span>
              </div>
              <div className="rd-empMetaGroup">
                <span className="rd-empMetaLabel">Email ID</span>
                <span className="rd-empMetaValue">{report.employee.email}</span>
              </div>
            </div>
          </div>

          <div className="rd-headerActions">
            <button className="rd-btnDownload" title="Download report">
              <Download size={15} />
            </button>
            <button
              className="rd-btnRejectReport"
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
              className="rd-btnApproveReport"
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

        {/* ── Report Summary Row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ width: "84%" }}>
            <div
              style={{
                display: "flex",

                justifyContent: "space-between",
              }}
              className="rd-reportSummaryRow"
            >
              {/* LEFT: title + badge */}
              <div className="rd-reportTitleGroup">
                <span className="rd-reportTitle">{report.reportName}</span>
                <Badge status={report.status} />
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div className="rd-amountBox">
                    <span className="rd-amountLabel">Amount Approved</span>
                    <span className="rd-amountValue">
                      {formatAmount(report.approvedAmount)}
                    </span>
                  </div>
                  <div className="rd-amountBox">
                    <span className="rd-amountLabel">Total Amount</span>
                    <span className="rd-amountValue">
                      {formatAmount(report.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: two amount boxes separated by a divider */}
              <div className="rd-amountGroup"></div>
            </div>

            {/* ── Main Layout ── */}
            <div className="rd-mainLayout">
              {/* Bills Panel */}
              <div className="rd-billsPanel">
                <div className="rd-billsToolbar">
                  <div className="rd-tabs">
                    <button
                      className={`rd-tab${activeTab === "expenses" ? " rd-activeTab" : ""}`}
                      onClick={() => setActiveTab("expenses")}
                    >
                      Expenses
                    </button>
                    <button
                      className={`rd-tab${activeTab === "mileage" ? " rd-activeTab" : ""}`}
                      onClick={() => setActiveTab("mileage")}
                    >
                      Mileage Expense
                    </button>
                  </div>

                  <div className="rd-billsToolbarRight">
                    <button className="rd-iconBtn" title="Refresh">
                      <RefreshCw size={13} />
                    </button>
                    <button className="rd-iconBtn" title="Sort">
                      <ArrowDownUp size={13} />
                    </button>
                    <div className="rd-searchWrap">
                      <Search size={13} color="var(--text-muted)" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search here..."
                      />
                    </div>
                  </div>
                </div>

                <div className="rd-billsList">
                  {activeTab === "mileage" ? (
                    <div className="rd-emptyBills">
                      No mileage expenses added.
                    </div>
                  ) : filteredBills.length === 0 ? (
                    <div className="rd-emptyBills">No expenses found.</div>
                  ) : (
                    filteredBills.map((bill) => (
                      <BillItem
                        key={bill.id}
                        bill={bill}
                        reportId={report.id}
                        checked={selectedIds.includes(bill.id)}
                        onToggle={toggleSelect}
                        onViewDetails={(billId) => setPreviewBillId(billId)}
                        onApprove={approveBill}
                        onReject={rejectBill}
                      
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Sidebar */}
          </div>
          <div
            style={{ width: "16%", display: "flex", flexDirection: "column" }}
            className="rd-sidebar"
          >
            <div className="rd-sideCard">
              <div className="rd-sideCardTitle">Approver:</div>
              <div className="rd-approverRow">
                <Avatar initials={report.approver.initials} size="sm" />
                <span className="rd-approverName">{report.approver.name}</span>
              </div>
              <button className="rd-sideLink">View Report History</button>
            </div>
            <div className="rd-sideCard">
              <div className="rd-sideCardTitle">Wallet Policies</div>
              <div className="rd-sideValue">{report.walletPolicies}</div>
            </div>
            <div className="rd-sideCard">
              <div className="rd-sideCardTitle">Additional Documents</div>
              <div className="rd-sideValue">
                {report.additionalDocuments ?? "-"}
              </div>
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