export default function ConfirmDialog({ open, title = 'Reset?', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={`dialog-overlay open`} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dialog-box">
        <div className="dialog-title">{title}</div>
        <div className="dialog-message">{message}</div>
        <div className="dialog-buttons">
          <button className="dialog-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="dialog-btn confirm" onClick={onConfirm}>Reset</button>
        </div>
      </div>
    </div>
  );
}
