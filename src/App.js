import { useState, useEffect } from 'react'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// function render
const App = () => {
  useEffect(() => {
    console.log('useEffect function')
  }, [])

  const [tasks, setTasks] = useState([])

  const [showAddTask, setShowAddTask] = useState(false)

  const BASE_URL = 'http://localhost:5000'

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch(BASE_URL + '/tasks')
    const data = await res.json()
    console.log('data', data)
    return data
  }

  // Fetch specific task
  const fetchTaskById = async (id) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // 使用useEffect hook获取数据, 没有依赖数据所以2nd参数传递空数组
  useEffect(() => {
    // closure
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Add Task
  const addTask = async (task) => {
    const res = await fetch(BASE_URL + '/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // On Toggle
  const toggleReminder = async (id) => {
    const task = await fetchTaskById(id)
    const newTask = { ...task, reminder: !task.reminder }

    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })

    const data = await res.json()
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        {/* 指定多个组件渲染 */}
        <Route
          path='/'
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                'No task to show'
              )}
            </>
          )}
        />
        {/* 路由到/about指定单个组件 About */}
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
