import { useRef } from "react";
import { useExpense } from "../../context/ExpenseContext";
import Badge from "../ui/Badge";
import {
  formatAmount,
  readFileAsBase64,
  ACCEPTED_FILE_TYPES,
  isImageType,
} from "../../utils/helpers";
import "./BillItem.css";

export default function BillItem({ bill, reportId, checked, onToggle, onViewDetails }) {
  const { approveBill, rejectBill, uploadBillFile } = useExpense();
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      uploadBillFile(reportId, bill.id, base64, file.name, file.type);
    } catch {
      alert("Failed to read file. Please try again.");
    }
    e.target.value = "";
  };

  const isPending = bill.status === "pending";

  return (
    <div className="item">
      <input
        type="checkbox"
        className="checkbox"
        checked={checked}
        onChange={() => onToggle(bill.id)}
      />

      <div
        className="preview"
        onClick={() => inputRef.current?.click()}
        title="Click to upload"
      >
        {bill.fileData ? (
          isImageType(bill.fileType) ? (
            <img src={bill.fileData} alt="bill" className="previewImage" />
          ) : (
            <div className="previewPlaceholder">
              <div>📄</div>
              <div>{bill.fileName}</div>
            </div>
          )
        ) : (
          <div className="previewPlaceholder">
            Preview
            <div className="previewUpload">+ Upload</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          className="fileInput"
          onChange={handleFileChange}
        />
      </div>

      <div className="body">
        <div className="meta">Uploaded on - {bill.uploadedOn}</div>

        <div className="bodyMain">
          <div className="titleSection">
            <span className="billTitle" onClick={() => onViewDetails(bill.id)}>
              {bill.title}
            </span>
            {isPending ? (
              <div className="actionBtns">
                <button className="btnReject" onClick={() => rejectBill(reportId, bill.id)}>
                  Reject
                </button>
                <button className="btnAccept" onClick={() => approveBill(reportId, bill.id)}>
                  Accept
                </button>
              </div>
            ) : (
              <Badge status={bill.status} />
            )}
          </div>

          <div className="detailSection">
            <span className="detailLabel walletLabel">Wallet</span>
            <span className="detailLabel categoryLabel">Category</span>
            <span className="detailValue walletValue">{bill.wallet}</span>
            <span className="detailValue categoryValue">{bill.category}</span>
            <span className="detailLabel merchantLabel">Merchant</span>
            <span className="detailValue merchantValue">{bill.merchant}</span>
          </div>

          <div className="amountCol">
            <div className="amountBlock">
              <span className="detailLabel">Amount</span>
              <span className="amountValue">{formatAmount(bill.amount)}</span>
            </div>
            <span className="viewDetails" onClick={() => onViewDetails(bill.id)}>
              View Details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
