import { createContext, useContext, useReducer } from 'react';

const LoginContext = createContext();

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        username: action.payload.username,
        password: action.payload.password,
      };
    case 'RESET':
      return { username: '', password: '' };
    default:
      return state;
  }
};

export const useLoginValue = () => {
  const loginAndDispatch = useContext(LoginContext);
  return loginAndDispatch[0];
};

export const useLoginDispatch = () => {
  const loginAndDispatch = useContext(LoginContext);
  return loginAndDispatch[1];
};

export const LoginProvider = ({ children }) => {
  const [login, loginDispatch] = useReducer(loginReducer, {
    username: '',
    password: '',
  });
  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
