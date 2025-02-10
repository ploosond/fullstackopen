import { createContext, useReducer } from 'react';
import { notificationReducer } from '../reducers/notificationReducer';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  );

  return (
    <AppContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
