import { useRef } from "react";
import { useExpense } from "../../context/ExpenseContext";
import Badge from "../ui/Badge";
import {
  formatAmount,
  readFileAsBase64,
  ACCEPTED_FILE_TYPES,
  isImageType,
} from "../../utils/helpers";
import styles from "./BillItem.module.css";

export default function BillItem({
  bill,
  reportId,
  checked,
  onToggle,
  onViewDetails,
}) {
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
    <div className={styles.item}>
      {/* Checkbox */}
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={() => onToggle(bill.id)}
      />

      {/* Preview */}
      <div
        className={styles.preview}
        onClick={() => inputRef.current?.click()}
        title="Click to upload"
      >
        {bill.fileData ? (
          isImageType(bill.fileType) ? (
            <img
              src={bill.fileData}
              alt="bill"
              className={styles.previewImage}
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <div>📄</div>
              <div>{bill.fileName}</div>
            </div>
          )
        ) : (
          <div className={styles.previewPlaceholder}>
            Preview
            <div className={styles.previewUpload}>+ Upload</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          className={styles.fileInput}
          onChange={handleFileChange}
        />
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.meta}>Uploaded on - {bill.uploadedOn}</div>

        <div className={styles.bodyMain}>
          {/* Left: title + reject/accept or badge */}
          <div className={styles.titleSection}>
            <span
              className={styles.billTitle}
              onClick={() => onViewDetails(bill.id)}
            >
              {bill.title}
            </span>
            {isPending ? (
              <div className={styles.actionBtns}>
                <button
                  className={styles.btnReject}
                  onClick={() => rejectBill(reportId, bill.id)}
                >
                  Reject
                </button>
                <button
                  className={styles.btnAccept}
                  onClick={() => approveBill(reportId, bill.id)}
                >
                  Accept
                </button>
              </div>
            ) : (
              <Badge status={bill.status} />
            )}
          </div>

          {/* Middle: wallet, category, merchant */}
          <div className={styles.detailSection}>
            <span className={`${styles.detailLabel} ${styles.walletLabel}`}>
              Wallet
            </span>
            <span className={`${styles.detailLabel} ${styles.categoryLabel}`}>
              Category
            </span>
            <span className={`${styles.detailValue} ${styles.walletValue}`}>
              {bill.wallet}
            </span>
            <span className={`${styles.detailValue} ${styles.categoryValue}`}>
              {bill.category}
            </span>
            <span className={`${styles.detailLabel} ${styles.merchantLabel}`}>
              Merchant
            </span>
            <span className={`${styles.detailValue} ${styles.merchantValue}`}>
              {bill.merchant}
            </span>
          </div>

          {/* Right: amount top, view details bottom */}
          <div className={styles.amountCol}>
            <div className={styles.amountBlock}>
              <span className={styles.detailLabel}>Amount</span>
              <span className={styles.amountValue}>
                {formatAmount(bill.amount)}
              </span>
            </div>
            <span
              className={styles.viewDetails}
              onClick={() => onViewDetails(bill.id)}
            >
              View Details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
