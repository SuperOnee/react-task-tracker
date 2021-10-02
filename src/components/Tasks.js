import Task from './Task'

const Tasks = ({ tasks, onDelete, onToggle }) => {
  return (
    //   使用空标签遍历渲染task列表
    <>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

export default Tasks
