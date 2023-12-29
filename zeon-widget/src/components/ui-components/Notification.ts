import { toast } from 'react-toastify';

export type NotificationType = "info" | "success" | "warning" | "error";


const notification = (type:NotificationType, message:string) => {
  switch (type) {
    case 'info':
      toast.info(message);
      break;
    case 'success':
      toast.success(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      break;
  }
};

export default notification;