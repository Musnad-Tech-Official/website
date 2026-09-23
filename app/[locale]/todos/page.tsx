import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: todos, error } = await supabase.from("todos").select();

  if (error) {
    console.error("Error fetching todos:", error);
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Todos (Clerk + Supabase)</h1>
      <ul className="space-y-2">
        {todos && todos.length > 0 ? (
          todos.map((todo) => <li key={todo.id}>{todo.name}</li>)
        ) : (
          <li className="text-muted-foreground">No todos found or table is empty.</li>
        )}
      </ul>
    </div>
  );
}
