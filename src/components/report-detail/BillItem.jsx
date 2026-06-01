import { useExpense } from "../../context/ExpenseContext";
import Badge from "../ui/Badge";
import { formatAmount, isImageType } from "../../utils/helpers";
import "./BillItem.css";

export default function BillItem({
  bill,
  reportId,
  checked,
  onToggle,
  onViewDetails,
}) {
  const { approveBill, rejectBill } = useExpense();

  const isPending = bill.status === "pending";

  return (
    <div className="bi-item">
      <input
        type="checkbox"
        className="bi-checkbox"
        checked={checked}
        onChange={() => onToggle(bill.id)}
      />

      <div className="bi-preview">
        {bill.fileData ? (
          isImageType(bill.fileType) ? (
            <img src={bill.fileData} alt="bill" className="bi-previewImage" />
          ) : (
            <div className="bi-previewPlaceholder">
              <div>📄</div>
              <div>{bill.fileName}</div>
            </div>
          )
        ) : (
          <div className="bi-previewPlaceholder">Preview</div>
        )}
      </div>

      <div className="bi-content">
        <div className="bi-meta">Uploaded on - {bill.uploadedOn}</div>

        <div className="bi-main">
          <div className="bi-titleSection">
            <span
              className="bi-billTitle"
              onClick={() => onViewDetails(bill.id)}
            >
              {bill.title}
            </span>

            {isPending ? (
              <div className="bi-actionBtns">
                <button
                  className="bi-btnReject"
                  onClick={() => rejectBill(reportId, bill.id)}
                >
                  Reject
                </button>

                <button
                  className="bi-btnAccept"
                  onClick={() => approveBill(reportId, bill.id)}
                >
                  Accept
                </button>
              </div>
            ) : (
              <Badge status={bill.status} />
            )}
          </div>

          <div className="bi-info">
            <div className="bi-infoBlock">
              <div className="bi-detailLabel">Wallet</div>
              <div className="bi-detailValue">{bill.wallet}</div>
            </div>

            <div className="bi-infoBlock">
              <div className="bi-detailLabel">Category</div>
              <div className="bi-detailValue">{bill.category}</div>
            </div>

            <div className="bi-infoBlock">
              <div className="bi-detailLabel">Merchant</div>
              <div className="bi-detailValue">{bill.merchant}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bi-amountCol">
        <div className="bi-amountBlock">
          <span className="bi-detailLabel">Amount</span>

          <span className="bi-amountValue">{formatAmount(bill.amount)}</span>
        </div>

        <span className="bi-viewDetails" onClick={() => onViewDetails(bill.id)}>
          View Details
        </span>
      </div>
    </div>
  );
}
