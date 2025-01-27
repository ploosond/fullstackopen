import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdoteVote } from "./requests";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const dispatch = useNotificationDispatch();

  const queryClient = useQueryClient();

  const updateVoteMutation = useMutation({
    mutationFn: updateAnecdoteVote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      const updatedAnecdotes = anecdotes.map((anecdote) =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      );
      queryClient.setQueryData(["anecdotes"], updatedAnecdotes);
    },
  });

  const handleVote = (anecdote) => {
    updateVoteMutation.mutate(anecdote);
    dispatch({
      type: "create",
      payload: `anecdote '${anecdote.content}' voted`,
    });
    setTimeout(() => {
      dispatch({
        type: "remove",
      });
    }, 5000);
  };

  const { status, data, error } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  });

  if (status === "pending") {
    return <div>loading data...</div>;
  }

  if (status === "error") {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
