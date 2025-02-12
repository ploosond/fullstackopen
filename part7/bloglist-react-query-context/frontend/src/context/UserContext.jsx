import { createContext, useContext, useReducer } from 'react';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'REMOVE':
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);
  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
