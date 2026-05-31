export const formatAmount = (amount) =>
  `Rs. ${amount}`;

export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'pending' },
  approved: { label: 'Approved', color: 'approved' },
  rejected: { label: 'Rejected', color: 'rejected' },
  partially_approved: { label: 'Partially Approved', color: 'partial' },
};

export const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.pdf';

export const isImageType = (fileType) =>
  fileType && fileType.startsWith('image/');

export const isPdfType = (fileType) =>
  fileType === 'application/pdf';

export const downloadFile = (dataUrl, fileName) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName || 'bill';
  a.click();
};

export const generateId = () =>
  Math.random().toString(36).slice(2, 10);
