import { Modal as BootstrapModal, Button } from "react-bootstrap";

export default function Modal({
  show,
  onClose,
  onConfirm,
  title,
  body,
  confirmText = "Confirm",
}) {
  return (
    <BootstrapModal show={show} onHide={onClose} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{body}</BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={onClose} className="rounded-pill">
          <i className="bi bi-x-circle me-1"></i> Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} className="rounded-pill">
          <i className="bi bi-trash me-1"></i> {confirmText}
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
}
