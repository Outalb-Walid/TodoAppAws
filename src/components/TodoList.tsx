import { FC, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TodoItem } from "@components/index";
import { useTheme } from "@context/ThemeContext";
import { FaTrash } from 'react-icons/fa';
import axios from "axios";

async function fetchItems(url: string) {
  try {
    const response = await axios.get(url);
    // Assuming the items you need are in response.data
    const items = response.data;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error; // Re-throw the error if you want to handle it higher up
  }
}

interface ToDo {
  TodolisId: string;
  finished: boolean;
  title: string;
}

const TodoList: FC = () => {
  const [tasks, setTasks] = useState<ToDo[]>([]);
  const { theme } = useTheme();
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    const taskList = fetchItems(
      "https://tgdn9w16si.execute-api.us-east-1.amazonaws.com/Stage/items"
    );

    taskList.then((data) => {
      console.log(data);
      setTasks(data);
    });
  }, []);

  const deleteTask = async (taskId: string) => {
    const apiUrl = `https://tgdn9w16si.execute-api.us-east-1.amazonaws.com/Stage/items/${taskId}`;
    try {
      const response = await axios.delete(apiUrl);
      if (response.status === 200) {
        // Remove the item from the local state
        setTasks(prevTasks => prevTasks.filter(task => task.TodolisId !== taskId));
        console.log(`Task ${taskId} deleted successfully`);
      } else {
        console.error(`Error deleting task ${taskId}`);
      }
    } catch (error) {
      console.error(`Error in delete request: ${error}`);
    }
  };

  return (
    <div className={`task-list ${theme}`} ref={animationParent}>
      {tasks.map((todo, index) => (
        <div key={todo.TodolisId} className="task-item">
          <TodoItem
            item={{
              id: todo.TodolisId,
              checked: todo.finished,
              text: todo.title,
            }}
          />
          <FaTrash
            className="delete"
            onClick={() => deleteTask(todo.TodolisId)}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
