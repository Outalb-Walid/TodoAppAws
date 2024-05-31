import { FC, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTodo } from "@context/TodoContext";

type ChildProps = {
  item: {
    id: string;
    text: string;
    checked: boolean;
  };
};

const TodoItem: FC<ChildProps> = ({ item }) => {
  const { deleteTask, editTask, setSelectedId, selectedId, localCheck } =
    useTodo();

  const checktext = useRef<HTMLParagraphElement>(null);
  const checkbox = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    editTask(item);
    setSelectedId(item.id);
  };

  const handleCheck = () => {
    checktext.current?.classList.toggle("check", checkbox.current?.checked);
  };

  const localChecked = () => {
    if (item.checked) {
      checkbox.current?.setAttribute("checked", "checked");
      checktext.current?.classList.add("check");
    }
  };

  const taskCardClass =
    selectedId === item.id ? "task-card selected" : "task-card";

  useEffect(() => {
    localChecked();
  }, []);

  const handleDeleteClick = () => {
    deleteTask(item.id);
  };

  return (
    <div className={taskCardClass}>
      <input
        type="checkbox"
        className="checkbox"
        ref={checkbox}
        onClick={() => {
          localCheck(item.id);
          handleCheck();
        }}
      />
      <p className="task-text" ref={checktext}>
        {item.text}
      </p>
      <div className="card-btn">
        <FaTrash className="delete" onClick={handleDeleteClick} />
        <FaEdit className="edit" onClick={handleEditClick} />
      </div>
    </div>
  );
};

export default TodoItem;
