import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialReports } from '../data/mockData';
import { generateId } from '../utils/helpers';

const ExpenseContext = createContext(null);

function computeReportStatus(bills) {
  if (!bills.length) return 'pending';
  const statuses = bills.map((b) => b.status);
  if (statuses.every((s) => s === 'approved')) return 'approved';
  if (statuses.every((s) => s === 'rejected')) return 'rejected';
  if (statuses.some((s) => s === 'approved')) return 'partially_approved';
  return 'pending';
}

function computeApprovedAmount(bills) {
  return bills
    .filter((b) => b.status === 'approved')
    .reduce((sum, b) => sum + b.amount, 0);
}

function reducer(reports, action) {
  switch (action.type) {
    case 'UPDATE_BILL_STATUS': {
      const { reportId, billId, status } = action.payload;
      return reports.map((r) => {
        if (r.id !== reportId) return r;
        const updatedBills = r.bills.map((b) =>
          b.id === billId ? { ...b, status } : b
        );
        return {
          ...r,
          bills: updatedBills,
          status: computeReportStatus(updatedBills),
          approvedAmount: computeApprovedAmount(updatedBills),
        };
      });
    }

    case 'UPDATE_REPORT_STATUS': {
      const { reportId, status } = action.payload;
      return reports.map((r) => {
        if (r.id !== reportId) return r;
        const newStatus = status === 'approved' ? 'approved' : 'rejected';
        const updatedBills = r.bills.map((b) => ({ ...b, status: newStatus }));
        return {
          ...r,
          bills: updatedBills,
          status: newStatus,
          approvedAmount:
            newStatus === 'approved' ? r.totalAmount : 0,
        };
      });
    }

    case 'UPLOAD_BILL_FILE': {
      const { reportId, billId, fileData, fileName, fileType } = action.payload;
      return reports.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          bills: r.bills.map((b) =>
            b.id === billId
              ? { ...b, fileData, fileName, fileType }
              : b
          ),
        };
      });
    }

    case 'DELETE_BILL_FILE': {
      const { reportId, billId } = action.payload;
      return reports.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          bills: r.bills.map((b) =>
            b.id === billId
              ? { ...b, fileData: null, fileName: null, fileType: null }
              : b
          ),
        };
      });
    }

    case 'ADD_COMMENT': {
      const { reportId, billId, comment } = action.payload;
      return reports.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          bills: r.bills.map((b) =>
            b.id === billId
              ? { ...b, comments: [...b.comments, comment] }
              : b
          ),
        };
      });
    }

    default:
      return reports;
  }
}

export function ExpenseProvider({ children }) {
  const [stored, setStored] = useLocalStorage('expense_reports', initialReports);
  const [reports, dispatch] = useReducer(reducer, stored);

  useEffect(() => {
    setStored(reports);
  }, [reports]);

  const approveBill = (reportId, billId) =>
    dispatch({ type: 'UPDATE_BILL_STATUS', payload: { reportId, billId, status: 'approved' } });

  const rejectBill = (reportId, billId) =>
    dispatch({ type: 'UPDATE_BILL_STATUS', payload: { reportId, billId, status: 'rejected' } });

  const approveReport = (reportId) =>
    dispatch({ type: 'UPDATE_REPORT_STATUS', payload: { reportId, status: 'approved' } });

  const rejectReport = (reportId) =>
    dispatch({ type: 'UPDATE_REPORT_STATUS', payload: { reportId, status: 'rejected' } });

  const uploadBillFile = (reportId, billId, fileData, fileName, fileType) =>
    dispatch({ type: 'UPLOAD_BILL_FILE', payload: { reportId, billId, fileData, fileName, fileType } });

  const deleteBillFile = (reportId, billId) =>
    dispatch({ type: 'DELETE_BILL_FILE', payload: { reportId, billId } });

  const addComment = (reportId, billId, text, author = 'You', initials = 'YO') => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-IN') + ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        reportId,
        billId,
        comment: { id: generateId(), author, initials, timestamp, text },
      },
    });
  };

  return (
    <ExpenseContext.Provider
      value={{ reports, approveBill, rejectBill, approveReport, rejectReport, uploadBillFile, deleteBillFile, addComment }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpense must be used within ExpenseProvider');
  return ctx;
};
