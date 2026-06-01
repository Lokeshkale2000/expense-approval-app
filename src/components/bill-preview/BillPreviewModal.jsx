import { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, RotateCw, Download, Trash2, Plus } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatAmount, readFileAsBase64, ACCEPTED_FILE_TYPES, isImageType, isPdfType, downloadFile } from '../../utils/helpers';
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

  const switchBill = (index) => { setCurrentIndex(index); setScale(1); setRotation(0); };
  const zoomIn = () => setScale((s) => Math.min(s + 0.25, MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, MIN_SCALE));
  const rotateLeft = () => setRotation((r) => r - 90);
  const rotateRight = () => setRotation((r) => r + 90);

  const handleDownload = () => { if (bill.fileData) downloadFile(bill.fileData, bill.fileName); };
  const handleDelete = () => { if (confirm('Remove this file?')) deleteBillFile(reportId, bill.id); };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    uploadBillFile(reportId, bill.id, base64, file.name, file.type);
    setScale(1); setRotation(0);
    e.target.value = '';
  };

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    addComment(reportId, bill.id, text);
    setCommentText('');
  };

  const isPending = bill.status === 'pending';

  return (
    <div className="bpm-overlay">
      <div className="bpm-modal">
        <div className="bpm-header">
          <span className="bpm-headerTitle">Expense Details ({currentIndex + 1} of {total})</span>
          <button className="bpm-closeBtn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="bpm-body">
          <div className="bpm-viewerPanel">
            <div className="bpm-viewerArea">
              {bill.fileData ? (
                <div className="bpm-imageWrap">
                  {isImageType(bill.fileType) ? (
                    <img src={bill.fileData} alt={bill.title} className="bpm-billImage" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }} />
                  ) : isPdfType(bill.fileType) ? (
                    <iframe src={bill.fileData} className="bpm-pdfFrame" title={bill.fileName} />
                  ) : (
                    <div className="bpm-emptyPreview">
                      <div className="bpm-emptyPreviewIcon">📄</div>
                      <div>{bill.fileName}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bpm-emptyPreview" onClick={() => fileInputRef.current?.click()}>
                  <div className="bpm-emptyPreviewIcon">🖼️</div>
                  <span>Preview</span>
                  <span className="bpm-uploadHint">+ Click to upload bill</span>
                </div>
              )}
            </div>

            <div className="bpm-thumbnailStrip">
              {bills.map((b, i) => (
                <div key={b.id} className={`bpm-thumbnail${i === currentIndex ? ' bpm-active' : ''}`} onClick={() => switchBill(i)}>
                  {b.fileData && isImageType(b.fileType) ? (
                    <img src={b.fileData} alt={b.title} />
                  ) : (
                    <div className="bpm-thumbnailPlaceholder">{b.fileData ? '📄' : ''}</div>
                  )}
                </div>
              ))}
              <button className="bpm-addBtn" title="Upload file" onClick={() => fileInputRef.current?.click()}>
                <Plus size={16} />
              </button>
            </div>

            <div className="bpm-controls">
              <button className="bpm-ctrlBtn" onClick={zoomIn} title="Zoom in"><ZoomIn size={13} /></button>
              <button className="bpm-ctrlBtn" onClick={zoomOut} title="Zoom out"><ZoomOut size={13} /></button>
              <button className="bpm-ctrlBtn" onClick={rotateLeft} title="Rotate left"><RotateCcw size={13} /></button>
              <button className="bpm-ctrlBtn" onClick={rotateRight} title="Rotate right"><RotateCw size={13} /></button>
              <button className="bpm-ctrlBtn" onClick={handleDownload} title="Download" disabled={!bill.fileData} style={{ opacity: bill.fileData ? 1 : 0.4 }}>
                <Download size={13} />
              </button>
              <button className="bpm-ctrlBtn bpm-ctrlBtnDanger" onClick={handleDelete} title="Delete file" disabled={!bill.fileData} style={{ opacity: bill.fileData ? 1 : 0.4 }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="bpm-detailsPanel">
            <div className="bpm-detailsTop">
              <div className="bpm-uploadedOn">Uploaded on - {bill.uploadedOn}</div>
              <div className="bpm-billTitleRow">
                <span className="bpm-billTitleText">{bill.title}</span>
                <Badge status={bill.status} />
              </div>
              <div className="bpm-amountLabel">Amount</div>
              <div className="bpm-amountValue">{formatAmount(bill.amount)}</div>
              {isPending && (
                <div className="bpm-actionBtns">
                  <button className="bpm-btnReject" onClick={() => rejectBill(reportId, bill.id)}>Reject</button>
                  <button className="bpm-btnAccept" onClick={() => approveBill(reportId, bill.id)}>Accept</button>
                </div>
              )}
            </div>

            <div className="bpm-tabs">
              <button className={`bpm-tab${activeTab === 'details' ? ' bpm-activeTab' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
              <button className={`bpm-tab${activeTab === 'comments' ? ' bpm-activeTab' : ''}`} onClick={() => setActiveTab('comments')}>Comments</button>
            </div>

            {activeTab === 'details' ? (
              <div className="bpm-detailsContent">
                <div className="bpm-detailRow">
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Client Name</span>
                    <span className="bpm-detailValue">{bill.clientName || '-'}</span>
                  </div>
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Project ID</span>
                    <span className="bpm-detailValue">{bill.projectId || '-'}</span>
                  </div>
                </div>
                <div className="bpm-divider" />
                <div className="bpm-detailRow" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Wallet</span>
                    <span className="bpm-detailValue">{bill.wallet}</span>
                  </div>
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Category</span>
                    <span className="bpm-detailValue">{bill.category}</span>
                  </div>
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Merchant</span>
                    <span className="bpm-detailValue">{bill.merchant}</span>
                  </div>
                </div>
                <div className="bpm-detailRow" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="bpm-detailGroup">
                    <span className="bpm-detailLabel">Remarks</span>
                    <span className="bpm-detailValueDark">{bill.remarks || '-'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bpm-commentsContent">
                <div className="bpm-commentsList">
                  {bill.comments.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', paddingTop: 20 }}>No comments yet.</div>
                  ) : (
                    bill.comments.map((c) => (
                      <div key={c.id} className="bpm-comment">
                        <div className="bpm-commentHeader">
                          <Avatar initials={c.initials} size="sm" />
                          <span className="bpm-commentAuthor">{c.author}</span>
                          <span className="bpm-commentTime">{c.timestamp}</span>
                        </div>
                        <div className="bpm-commentText">{c.text}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="bpm-commentInput">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add New Comment"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button className="bpm-addCommentBtn" onClick={handleAddComment}>Add</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept={ACCEPTED_FILE_TYPES} className="bpm-fileInput" onChange={handleFileChange} />
    </div>
  );
}
