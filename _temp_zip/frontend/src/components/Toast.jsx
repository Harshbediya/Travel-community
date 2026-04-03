import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, CalendarClock } from 'lucide-react';

const Toast = {
  success: (message) => {
    toast.success(message, {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      className: 'dark:bg-navy-light dark:text-white border dark:border-gray-700',
    });
  },
  error: (message) => {
    toast.error(message, {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      className: 'dark:bg-navy-light dark:text-white border dark:border-gray-700',
    });
  },
  info: (message) => {
    toast(message, {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      className: 'dark:bg-navy-light dark:text-white border dark:border-gray-700',
    });
  },
  booking: (message) => {
    toast(message, {
      icon: <CalendarClock className="w-5 h-5 text-primary" />,
      className: 'dark:bg-navy-light dark:text-white border dark:border-gray-700 border-primary',
    });
  }
};

export default Toast;
