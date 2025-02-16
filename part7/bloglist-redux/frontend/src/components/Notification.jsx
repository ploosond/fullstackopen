import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  return (
    <div>
      {notification.type === 'success' && (
        <Alert severity="success" className="success">
          {notification.message}
        </Alert>
      )}
      {notification.type === 'error' && (
        <Alert severity="error" className="error">
          {notification.message}
        </Alert>
      )}
    </div>
  );
};

export default Notification;
