import Alert from "@/components/common/Alert";

export function FormErrorAlert({ message }) {
  if (!message) return null;
  return (
    <Alert variant="error" role="alert" aria-live="polite">
      {message}
    </Alert>
  );
}

export function FormSuccessAlert({ message }) {
  if (!message) return null;
  return (
    <Alert variant="success" role="status" aria-live="polite">
      {message}
    </Alert>
  );
}
