import React from 'react';
import { Navigate } from 'react-router-dom';

import useStore from '../store';

// Router Wrapper
function RequireAuth({ children }) {
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);

  if (!authenticated) {
    return <Navigate to="/input-country" />;
  } else {
    return children;
  }
}

export default RequireAuth;
