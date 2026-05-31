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
import './BillPreviewModal.css';

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
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="header">
          <span className="headerTitle">
            Expense Details ({currentIndex + 1} of {total})
          </span>
          <button className="closeBtn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="body">
          {/* Left: Image viewer */}
          <div className="viewerPanel">
            <div className="viewerArea">
              {bill.fileData ? (
                <div className="imageWrap">
                  {isImageType(bill.fileType) ? (
                    <img
                      src={bill.fileData}
                      alt={bill.title}
                      className="billImage"
                      style={imgStyle}
                    />
                  ) : isPdfType(bill.fileType) ? (
                    <iframe
                      src={bill.fileData}
                      className="pdfFrame"
                      title={bill.fileName}
                    />
                  ) : (
                    <div className="emptyPreview">
                      <div className="emptyPreviewIcon">📄</div>
                      <div>{bill.fileName}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="emptyPreview"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="emptyPreviewIcon">🖼️</div>
                  <span>Preview</span>
                  <span className="uploadHint">+ Click to upload bill</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="thumbnailStrip">
              {bills.map((b, i) => (
                <div
                  key={b.id}
                  className={`thumbnail${i === currentIndex ? ' active' : ''}`}
                  onClick={() => switchBill(i)}
                >
                  {b.fileData && isImageType(b.fileType) ? (
                    <img src={b.fileData} alt={b.title} />
                  ) : (
                    <div className="thumbnailPlaceholder">
                      {b.fileData ? '📄' : 'No\nfile'}
                    </div>
                  )}
                </div>
              ))}
              <button
                className="addBtn"
                title="Upload file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Controls */}
            <div className="controls">
              <button className="ctrlBtn" onClick={zoomIn} title="Zoom in"><ZoomIn size={13} /></button>
              <button className="ctrlBtn" onClick={zoomOut} title="Zoom out"><ZoomOut size={13} /></button>
              <button className="ctrlBtn" onClick={rotateLeft} title="Rotate left"><RotateCcw size={13} /></button>
              <button className="ctrlBtn" onClick={rotateRight} title="Rotate right"><RotateCw size={13} /></button>
              <button
                className="ctrlBtn"
                onClick={handleDownload}
                title="Download"
                disabled={!bill.fileData}
                style={{ opacity: bill.fileData ? 1 : 0.4 }}
              >
                <Download size={13} />
              </button>
              <button
                className="ctrlBtn ctrlBtnDanger"
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
          <div className="detailsPanel">
            <div className="detailsTop">
              <div className="uploadedOn">Uploaded on - {bill.uploadedOn}</div>
              <div className="billTitleRow">
                <span className="billTitleText">{bill.title}</span>
                <Badge status={bill.status} />
              </div>
              <div className="amountLabel">Amount</div>
              <div className="amountValue">{formatAmount(bill.amount)}</div>

              {isPending && (
                <div className="actionBtns">
                  <button className="btnReject" onClick={() => rejectBill(reportId, bill.id)}>
                    Reject
                  </button>
                  <button className="btnAccept" onClick={() => approveBill(reportId, bill.id)}>
                    Accept
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab${activeTab === 'details' ? ' activeTab' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`tab${activeTab === 'comments' ? ' activeTab' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="detailsContent">
                <div className="detailRow">
                  <div className="detailGroup">
                    <span className="detailLabel">Client Name</span>
                    <span className="detailValue">{bill.clientName || '-'}</span>
                  </div>
                  <div className="detailGroup">
                    <span className="detailLabel">Project ID</span>
                    <span className="detailValue">{bill.projectId || '-'}</span>
                  </div>
                </div>

                <div className="divider" />

                <div className="detailRow">
                  <div className="detailGroup">
                    <span className="detailLabel">Wallet</span>
                    <span className="detailValue">{bill.wallet}</span>
                  </div>
                  <div className="detailGroup">
                    <span className="detailLabel">Category</span>
                    <span className="detailValue">{bill.category}</span>
                  </div>
                </div>

                <div className="detailRow" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="detailGroup">
                    <span className="detailLabel">Merchant</span>
                    <span className="detailValue">{bill.merchant}</span>
                  </div>
                </div>

                <div className="detailRow" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="detailGroup">
                    <span className="detailLabel">Remarks</span>
                    <span className="detailValueDark">{bill.remarks || '-'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="commentsContent">
                <div className="commentsList">
                  {bill.comments.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', paddingTop: 20 }}>
                      No comments yet.
                    </div>
                  ) : (
                    bill.comments.map((c) => (
                      <div key={c.id} className="comment">
                        <div className="commentHeader">
                          <Avatar initials={c.initials} size="sm" />
                          <span className="commentAuthor">{c.author}</span>
                          <span className="commentTime">{c.timestamp}</span>
                        </div>
                        <div className="commentText">{c.text}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="commentInput">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add New Comment"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button className="addCommentBtn" onClick={handleAddComment}>
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
        className="fileInput"
        onChange={handleFileChange}
      />
    </div>
  );
}
