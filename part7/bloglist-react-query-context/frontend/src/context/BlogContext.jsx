import { createContext, useReducer } from 'react';

const BlogContext = createContext();

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        title: action.payload.title,
        author: action.payload.author,
        url: action.payload.url,
      };
    case 'RESET':
      return { title: '', author: '', url: '' };
    default:
      return state;
  }
};

export const BlogProvider = ({ children }) => {
  const [blog, blogDispatch] = useReducer(blogReducer, {
    title: '',
    author: '',
    url: '',
  });
  return (
    <BlogContext.Provider value={[blog, blogDispatch]}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
