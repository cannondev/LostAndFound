import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = (message, type = 'error') => {
  const toastConfig = {
    style: {
      background: 'linear-gradient(135deg,rgb(213, 192, 229), #D4A5FF, #E5C8FF)',
      color: '#5E3A89',
      fontSize: '18px',
      fontWeight: '500',
      borderRadius: '25px',
      padding: '25px 35px',
      textAlign: 'center',
      boxShadow: '0px 6px 18px rgba(150, 100, 200, 0.25)',
      border: '2px solid #C8A2C8',
      width: '400px',
    },
  };

  if (type === 'error') {
    toast.error(message, toastConfig);
  } else if (type === 'success') {
    toast.success(message, toastConfig);
  } else {
    toast.info(message, toastConfig);
  }
};

export default showToast;
