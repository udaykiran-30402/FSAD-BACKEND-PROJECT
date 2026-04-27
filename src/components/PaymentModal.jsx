import { useEffect, useState } from 'react';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'cod', label: 'Cash on Delivery' },
];

function PaymentModal({ isOpen, onClose, onConfirm, product, submitting }) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, submitting]);

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(PAYMENT_METHODS[0].id);
    }
  }, [isOpen]);

  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className="payment-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <div className="payment-modal card fade-up">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tc-secondary)]">Complete Purchase</p>
            <h2 id="payment-modal-title" className="mt-1 text-2xl font-bold text-[var(--tc-ink)]">
              Choose payment method
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-2xl leading-none text-[var(--tc-muted)] transition hover:text-[var(--tc-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close payment modal"
          >
            ×
          </button>
        </div>

        <div className="payment-summary">
          <div>
            <p className="text-sm text-[var(--tc-muted)]">Product</p>
            <p className="font-semibold text-[var(--tc-ink)]">{product.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--tc-muted)]">Amount</p>
            <p className="text-xl font-bold text-[var(--tc-accent)]">${product.price}</p>
          </div>
        </div>

        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.id} className={`payment-method-option ${selectedMethod === method.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(event) => setSelectedMethod(event.target.value)}
              />
              <span className="text-sm font-medium text-[var(--tc-ink)]">{method.label}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} disabled={submitting} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedMethod)}
            disabled={submitting}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
