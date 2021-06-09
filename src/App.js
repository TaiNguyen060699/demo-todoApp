import { useState,useEffect } from 'react'
import Header  from './components/Header'
import Tasks  from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import {BrowserRouter as Router, Route} from 'react-router-dom'


const App = () => {
  const [showAddTask , setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //fetch Tasks 
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:3000/tasks")
    const data = await res.json()
    console.log(data)
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`)
    const data = await res.json()
    console.log(data)
    return data
  }
  //delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`,{
      method: "DELETE"
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //toggle task
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const upTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:3000/tasks/${id}`,{
      method: "PUT",
      headers: {
        'Content-type': 'application/json' 
      },
      body: JSON.stringify(upTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => 
        task.id === id ? {...task, reminder: 
        data.reminder} : task
      )
    )
  }

  //Add Task

  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 1000) + 1
    // const newTask = {id , ...task}
    //setTasks([...tasks, newTask])
    const res = await fetch(`http://localhost:3000/tasks`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task)
    }) 

    const data = await res.json()
    setTasks([...tasks, data])
  }

  return (
    <Router>
      <div className='container'>
        <Header 
          onAdd={() => setShowAddTask(!showAddTask)} 
          showAdd={showAddTask}
        />
        <Route path='/' exact render={(props => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? 
              (<Tasks 
                tasks={tasks} 
                onDelete={deleteTask}
                onToggle={toggleReminder}
                /> ) : 
                ('No Task to show')}
              </>
        ))} />
        <Route path='/about' component={About} />
        <Footer/>
      </div>
    </Router>
  )
}

export default App
