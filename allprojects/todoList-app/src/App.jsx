import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished = (e) => {
    setshowFinished(!showFinished)
  }



  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLS()
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    saveToLS()
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = (!newTodos[index].isCompleted)
    setTodos(newTodos)
    saveToLS()
  }


  return (
    <>
      <Navbar />
      <div className="md:container mx-3 md:mx-auto my-5 rounded-xl bg-blue-100 p-5 min-h-[80vh] md:w-1/2">
        <h1 className='text-3xl font-bold text-center'>iTask - manage your todos at one place</h1>
        <div className='addTodo my-6 flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-gray-800'>Add a Todo</h2>
          <div className="flex">

            <input onChange={handleChange} value={todo} className='bg-amber-50 w-full px-5 py-1 rounded-md' type="text" />
            <button onClick={handleAdd} disabled={todo.length < 2} className='bg-violet-700 hover:bg-violet-900 text-white p-3 py-1 text-sm rounded-md disabled:bg-violet-400  cursor-pointer mx-2 font-bold'>Save</button>
          </div>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} name="" id="show" /> 
        <label className='mx-2' htmlFor="show">show Finished</label>
        <div className='h-[1px] bg-black opacity-15 my-3 w-[90%] mx-auto'></div>
        <h2 className='text-xl text-gray-800 font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map((item) => {
            return (showFinished || !item.isCompleted) &&
              <div key={item.id} className="todo flex  justify-between my-3 border border-gray-300 bg-violet-200 rounded-2xl px-4 py-2">
                <div className='flex gap-5'>
                  <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full self-center">
                  <button onClick={(e) => handleEdit(e, item.id)} className='bg-violet-700 hover:bg-violet-900 text-white p-3 py-1 text-sm rounded-md mx-2 cursor-pointer'><FaEdit /></button>
                  <button onClick={(e) => handleDelete(e, item.id)} className='bg-violet-700 hover:bg-violet-900 text-white p-3 py-1 text-sm rounded-md mx-2 cursor-pointer'><MdDelete /></button>
                </div>


              </div>

          })}
        </div>

      </div>
    </>
  )
}

export default App
