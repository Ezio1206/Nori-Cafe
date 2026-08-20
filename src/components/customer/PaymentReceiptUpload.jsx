import { useRef, useState } from 'react';
import { fileToCompressedDataUrl } from '../../utils/imageFile';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — generous for a phone screenshot

/**
 * Lets the customer upload an actual payment receipt/screenshot for Online
 * Payment orders (instead of a self-reported "I've paid" checkbox). The
 * image is compressed client-side and handed back to the parent as a data
 * URL via `onChange`, ready to be stored on the order document.
 */
export default function PaymentReceiptUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setError('');

    if (!file.type?.startsWith('image/')) {
      setError('Please choose an image file (screenshot or photo of your receipt).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('That image is too large. Please choose a file under 8MB.');
      return;
    }

    setProcessing(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setFileName(file.name);
      onChange(dataUrl);
    } catch {
      setError('We couldn\u2019t read that file. Please try a different image.');
    } finally {
      setProcessing(false);
    }
  }

  function handleRemove() {
    setFileName('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="receipt-upload">
      <span className="nori-label" style={{ marginBottom: 10 }}>Upload Payment Receipt</span>

      <input
        ref={inputRef}
        id="receipt-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="receipt-preview-card">
          <div className="receipt-preview-thumb">
            <img src={value} alt="Payment receipt preview" />
          </div>
          <div className="receipt-preview-info">
            <div className="receipt-preview-name">{fileName || 'Receipt uploaded'}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--nori-success)', fontWeight: 600 }}>Ready to submit</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="nori-btn nori-btn-secondary" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className="nori-btn nori-btn-ghost" onClick={handleRemove}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="receipt-upload-dropzone"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            <polyline points="7 9 12 4 17 9" />
            <line x1="12" y1="4" x2="12" y2="16" />
          </svg>
          <span style={{ fontWeight: 600, color: 'var(--nori-coffee-deep)' }}>
            {processing ? 'Processing…' : 'Choose File'}
          </span>
          <span className="receipt-upload-hint">Upload a screenshot or photo of your payment confirmation</span>
        </button>
      )}

      {error && <p style={{ color: 'var(--nori-error)', fontSize: '0.82rem', marginTop: 8 }}>{error}</p>}
    </div>
  );
}
