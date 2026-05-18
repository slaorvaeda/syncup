import { toast as sonner } from "sonner";

export const toast = {
  success(message, options) {
    if (!message) return;
    sonner.success(message, options);
  },
  error(message, options) {
    if (!message) return;
    sonner.error(message, options);
  },
  info(message, options) {
    if (!message) return;
    sonner.info(message, options);
  },
  warning(message, options) {
    if (!message) return;
    sonner.warning(message, options);
  },
};
