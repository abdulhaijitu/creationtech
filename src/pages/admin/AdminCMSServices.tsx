import { Navigate } from 'react-router-dom';

// Redirect CMS Services to the unified Services management page
const AdminCMSServices = () => {
  return <Navigate to="/admin/services" replace />;
};

export default AdminCMSServices;
