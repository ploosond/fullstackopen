import { createSlice } from "@reduxjs/toolkit";

const anecdotesAtStart = [];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState,
  reducers: {
    voteOf(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      );
    },
    createAnecdote(state, action) {
      const anecdote = asObject(action.payload);
      return state.concat(anecdote);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdote(state, action) {
      return action.payload;
    },
  },
});

export const { voteOf, createAnecdote, appendAnecdote, setAnecdote } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;
