import { useToast } from "@/components/context/ToastContext";
import "@/styles/toast/toast.scss";

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">✓</span>
            <span>{toast.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
