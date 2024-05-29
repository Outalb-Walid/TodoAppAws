import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TaskProps = {
  id: string;
  text: string;
  checked: boolean;
};
interface IType {
  task: {
    id: string;
    text: string;
    checked: boolean;
  }[];
  addTask: (newTask: { text: string; id: string; checked: boolean }) => void;
  deleteTask: (id: string) => void;
  editTask: (item: { id: string; text: string; checked: boolean }) => void;
  edit: {
    item: {
      text: string;
      id: string;
      checked: boolean;
    };
    edit: boolean;
  };
  updateTask: (newTask: { text: string; id: string }) => void;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedId: string | null;
  filteredTask: TaskProps[];
  searchTask: (text: string) => void;
  localCheck: (id: string) => void;
}
const TodoContext = createContext<IType>({
  task: [],
  addTask: () => {},
  deleteTask: () => {},
  editTask: () => {},
  edit: {
    item: {
      text: "",
      id: "",
      checked: false,
    },
    edit: false,
  },
  updateTask: () => {},
  setSelectedId: () => {},
  selectedId: null,
  filteredTask: [],
  searchTask: () => {},
  localCheck: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [task, setTask] = useState<TaskProps[]>(
    JSON.parse(localStorage.getItem("task")!) ?? []
  );
  const [edit, setEdit] = useState({
    item: {
      text: "",
      id: "",
      checked: false,
    },
    edit: false,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filteredTask, setFilteredTask] = useState<TaskProps[]>(task);

  //? SetFiltered Task
  const searchTask = useCallback(
    (text: string) => {
      setFilteredTask(task.filter((item) => item.text.includes(text)));
    },
    [task]
  );
  //* const searchTask = (text: string) => {
  //*  setFilteredTask(current=>current.filter((item) => item.text.includes(text)));
  //* };

  //? Sets checked value in local
  const localCheck = (id: string) => {
    setTask((current) =>
      current.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  //? Get Task from Local Storage
  const setLocalTask = () => {
    localStorage.setItem("task", JSON.stringify(task));
  };

  //? Add Task
  const addTask = (newTask: { text: string; id: string; checked: boolean }) => {
    if (newTask.text !== "") {
      setTask([newTask, ...task]);
    }
    if (
      newTask.text.toLowerCase().includes("order 66") ||
      newTask.text.toLowerCase().includes("execute order 66")
    ) {
      window.open("https://www.youtube.com/watch?v=G2QhAynp1FY");
    }
  };

  //? Delete Task
  const deleteTask = (id: string) => {
    setTask(task.filter((item) => item.id !== id));
  };

  //? Edit Task
  const editTask = (item: { id: string; text: string; checked: boolean }) => {
    setEdit({
      item,
      edit: true,
    });
  };

  //? Update Task
  const updateTask = (newTask: { text: string; id: string }) => {
    setTask(
      task.map((item) =>
        item.id === newTask.id ? { ...item, text: newTask.text } : item
      )
    );
    document
      .querySelectorAll(".task-card")
      .forEach((item) => item.classList.remove("selected"));
  };

  //? Task Local Storage
  useEffect(() => {
    setLocalTask();
    setFilteredTask(task);
  }, [task]);

  return (
    <TodoContext.Provider
      value={{
        addTask,
        task,
        updateTask,
        deleteTask,
        editTask,
        edit,
        setSelectedId,
        selectedId,
        filteredTask,
        searchTask,
        localCheck,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
export default TodoProvider;

export const useTodo = () => useContext(TodoContext);
