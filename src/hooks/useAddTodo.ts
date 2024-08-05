import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import todoService, { Todo } from "../services/todoService";

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, Todo, AddTodoContext>({
    // input, error, output
    mutationFn: todoService.post,
    onSuccess: (savedTodo, newTodo) => {
      // we want to invalidate the cache
      // queryClient.invalidateQueries({
      //   queryKey: ["todos"],
      // });

      // update the data in the cache directly (since jsonplaceholder we're using isn't actually a real API)
      // queryClient.setQueryData<Todo[]>(["todos"], (todos) => [savedTodo, ...(todos || [])]);
      // if (ref.current) ref.current.value = "";

      // this is an optimistic update
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos = []) => [newTodo, ...todos]);

      onAdd(); // callback to the consumer of this hook to deal with updating the UI

      return { previousTodos };
    },
    onError: (error, newTodo, context) => {
      if (!context) return;

      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context?.previousTodos);
    },
  });
};

export default useAddTodo;
