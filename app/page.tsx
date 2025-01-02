import TodoTableServer from "./TodoTableServer";
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container px-4 md:px-6 max-w-4xl mx-auto pt-8">
        <div className="flex flex-col gap-4 mb-8 font-mono">
          <h1 className="text-4xl md:text-5xl font-bold ">
            ToDo App with Slack
          </h1>
          <p className="text-lg text-muted-foreground">
            My first project using a RESTful API
          </p>
        </div>
      </div>
      <TodoTableServer />
    </div>
  );
}
