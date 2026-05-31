import { useState, useRef } from 'react';
import {
  X, ZoomIn, ZoomOut, RotateCcw, RotateCw, Download, Trash2, Plus,
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import {
  formatAmount, readFileAsBase64, ACCEPTED_FILE_TYPES,
  isImageType, isPdfType, downloadFile,
} from '../../utils/helpers';
import styles from './BillPreviewModal.module.css';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export default function BillPreviewModal({ bills, initialIndex, reportId, onClose }) {
  const { approveBill, rejectBill, uploadBillFile, deleteBillFile, addComment } = useExpense();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef(null);

  const bill = bills[currentIndex];
  if (!bill) return null;

  const total = bills.length;

  const switchBill = (index) => {
    setCurrentIndex(index);
    setScale(1);
    setRotation(0);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, MIN_SCALE));
  const rotateLeft = () => setRotation((r) => r - 90);
  const rotateRight = () => setRotation((r) => r + 90);

  const handleDownload = () => {
    if (bill.fileData) downloadFile(bill.fileData, bill.fileName);
  };

  const handleDelete = () => {
    if (confirm('Remove this file?')) deleteBillFile(reportId, bill.id);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    uploadBillFile(reportId, bill.id, base64, file.name, file.type);
    setScale(1);
    setRotation(0);
    e.target.value = '';
  };

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    addComment(reportId, bill.id, text);
    setCommentText('');
  };

  const imgStyle = {
    transform: `scale(${scale}) rotate(${rotation}deg)`,
  };

  const isPending = bill.status === 'pending';

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>
            Expense Details ({currentIndex + 1} of {total})
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Left: Image viewer */}
          <div className={styles.viewerPanel}>
            <div className={styles.viewerArea}>
              {bill.fileData ? (
                <div className={styles.imageWrap}>
                  {isImageType(bill.fileType) ? (
                    <img
                      src={bill.fileData}
                      alt={bill.title}
                      className={styles.billImage}
                      style={imgStyle}
                    />
                  ) : isPdfType(bill.fileType) ? (
                    <iframe
                      src={bill.fileData}
                      className={styles.pdfFrame}
                      title={bill.fileName}
                    />
                  ) : (
                    <div className={styles.emptyPreview}>
                      <div className={styles.emptyPreviewIcon}>📄</div>
                      <div>{bill.fileName}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={styles.emptyPreview}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={styles.emptyPreviewIcon}>🖼️</div>
                  <span>Preview</span>
                  <span className={styles.uploadHint}>+ Click to upload bill</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className={styles.thumbnailStrip}>
              {bills.map((b, i) => (
                <div
                  key={b.id}
                  className={`${styles.thumbnail}${i === currentIndex ? ` ${styles.active}` : ''}`}
                  onClick={() => switchBill(i)}
                >
                  {b.fileData && isImageType(b.fileType) ? (
                    <img src={b.fileData} alt={b.title} />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>
                      {b.fileData ? '📄' : 'No\nfile'}
                    </div>
                  )}
                </div>
              ))}
              <button
                className={styles.addBtn}
                title="Upload file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button className={styles.ctrlBtn} onClick={zoomIn} title="Zoom in"><ZoomIn size={13} /></button>
              <button className={styles.ctrlBtn} onClick={zoomOut} title="Zoom out"><ZoomOut size={13} /></button>
              <button className={styles.ctrlBtn} onClick={rotateLeft} title="Rotate left"><RotateCcw size={13} /></button>
              <button className={styles.ctrlBtn} onClick={rotateRight} title="Rotate right"><RotateCw size={13} /></button>
              <button
                className={styles.ctrlBtn}
                onClick={handleDownload}
                title="Download"
                disabled={!bill.fileData}
                style={{ opacity: bill.fileData ? 1 : 0.4 }}
              >
                <Download size={13} />
              </button>
              <button
                className={`${styles.ctrlBtn} ${styles.ctrlBtnDanger}`}
                onClick={handleDelete}
                title="Delete file"
                disabled={!bill.fileData}
                style={{ opacity: bill.fileData ? 1 : 0.4 }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className={styles.detailsPanel}>
            <div className={styles.detailsTop}>
              <div className={styles.uploadedOn}>Uploaded on - {bill.uploadedOn}</div>
              <div className={styles.billTitleRow}>
                <span className={styles.billTitleText}>{bill.title}</span>
                <Badge status={bill.status} />
              </div>
              <div className={styles.amountLabel}>Amount</div>
              <div className={styles.amountValue}>{formatAmount(bill.amount)}</div>

              {isPending && (
                <div className={styles.actionBtns}>
                  <button className={styles.btnReject} onClick={() => rejectBill(reportId, bill.id)}>
                    Reject
                  </button>
                  <button className={styles.btnAccept} onClick={() => approveBill(reportId, bill.id)}>
                    Accept
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab}${activeTab === 'details' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`${styles.tab}${activeTab === 'comments' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className={styles.detailsContent}>
                <div className={styles.detailRow}>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Client Name</span>
                    <span className={styles.detailValue}>{bill.clientName || '-'}</span>
                  </div>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Project ID</span>
                    <span className={styles.detailValue}>{bill.projectId || '-'}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.detailRow}>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Wallet</span>
                    <span className={styles.detailValue}>{bill.wallet}</span>
                  </div>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Category</span>
                    <span className={styles.detailValue}>{bill.category}</span>
                  </div>
                </div>

                <div className={styles.detailRow} style={{ gridTemplateColumns: '1fr' }}>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Merchant</span>
                    <span className={styles.detailValue}>{bill.merchant}</span>
                  </div>
                </div>

                <div className={styles.detailRow} style={{ gridTemplateColumns: '1fr' }}>
                  <div className={styles.detailGroup}>
                    <span className={styles.detailLabel}>Remarks</span>
                    <span className={styles.detailValueDark}>{bill.remarks || '-'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.commentsContent}>
                <div className={styles.commentsList}>
                  {bill.comments.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', paddingTop: 20 }}>
                      No comments yet.
                    </div>
                  ) : (
                    bill.comments.map((c) => (
                      <div key={c.id} className={styles.comment}>
                        <div className={styles.commentHeader}>
                          <Avatar initials={c.initials} size="sm" />
                          <span className={styles.commentAuthor}>{c.author}</span>
                          <span className={styles.commentTime}>{c.timestamp}</span>
                        </div>
                        <div className={styles.commentText}>{c.text}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.commentInput}>
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add New Comment"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button className={styles.addCommentBtn} onClick={handleAddComment}>
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className={styles.fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
