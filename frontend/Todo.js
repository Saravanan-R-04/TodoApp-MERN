import React, { useEffect, useState } from 'react'
import './Todo.css'
const Todo = () => {

  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [error,setError]=useState("");
  const [message,setMessage]=useState("")
  const [todos,setTodos]=useState([]);
  const [editId,setEditID]=useState(-1);
  const [edittitle,setEditTitle]=useState("");
  const [editdescription,setEditDescription]=useState("");
  const apiURL = "http://localhost:5500"
  const handleSubmit = () =>{
    if(title.trim()!=='' && description.trim()!=='')
    {
        fetch(apiURL+"/todo",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title,description})
        }).then((res)=>{
            if(res.ok)
            {
                setTodos([...todos,{title,description}])
                setMessage("Item Add Successfully")
                setTitle("")
                setDescription("")
                setTimeout(()=>{
                    setMessage("");
                },3000)
            }
            else{
                setError("Unable To Create Todo Item")
            }
        })
        
    }
  }
  const getItems = () =>{
    fetch(apiURL+"/todo")
    .then((res)=>res.json())
    .then((res)=>setTodos(res))
  }
  
  const handleEditCancel=()=>{
    setEditID(-1);
  }
  const handleUpdate=()=>{
    if(edittitle.trim()!=='' && editdescription.trim()!=='')
    {
        fetch(apiURL+"/todo/"+editId,{
            method:"PUT",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title:edittitle,description:editdescription})
        }).then((res)=>{
            if(res.ok)
            {
                const updatedTodos=todos.map((item)=>{
                    if(item._id===editId)
                    {
                        item.title=edittitle;
                        item.description=editdescription;
                    }
                    return item;
                })
                setTodos(updatedTodos)
                setMessage("Item Updated Successfully")
                setEditID(-1)
                setTimeout(()=>{
                    setMessage("");
                },3000)

            }
            else{
                setError("Unable To Update Item")
            }
        })
        
    }
  }
  const handleDelete = (id)=>{
    if(window.confirm('Are you sure want to delete'))
    {
        fetch(apiURL+"/todo/"+id,{
            method:"DELETE",
        }).then((res)=>{
            if(res.ok)
            {
                const deleteTodos=todos.filter((todo)=>todo._id!==id)
                setTodos(deleteTodos)
                setMessage("Item Deleted Successfully")
                setTimeout(()=>{
                    setMessage("");
                },3000)

            }
            else{
                setError("Unable To Delete Item")
            }
        })
        
    }
        
  }
  useEffect(()=>{
    getItems();
  },[])
  return (
    <>  
        <div className='row p-3 bg-success text-light'>
            <h1>Todo Project With MERN</h1>
        </div>
        <div className='row'>
            <h3>Add Item</h3>
            {message && <p className='text-success'>{message}</p>}
            <div className='form-group gap-2'>
                <input className='form-control title' value={title}  onChange={(e)=>{setTitle(e.target.value)}} type='text' placeholder='Enter Title Here'/>
                <br/>
                <textarea className='form-control description' value={description} onChange={(e)=>{setDescription(e.target.value)}} type='text' placeholder='Enter Description Here'/>
                <br/>
                <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        
        <div className='row mt-3' style={{width:"40%",height:"120px"}}>
            <ul className='list-group'>
            {
                todos.map((item,index)=> <li key={index} className='list-group-item d-flex justify-content-between bg-info align-items-center my-2'>
                    <div className='d-flex flex-column'>
                       {
                            editId===-1 || editId!==item._id? <>
                                <span className='fw-bold'>{item.title}</span>
                                <span>{item.description}</span>
                            </>
                            : <>
                                <div className='form-group gap-2'>
                                    <input className='form-control' value={edittitle}  onChange={(e)=>{setEditTitle(e.target.value)}} type='text' placeholder='Enter Title Here'/>
                                    <input className='form-control' value={editdescription} onChange={(e)=>{setEditDescription(e.target.value)}} type='text' placeholder='Enter Description Here'/>
                                </div>
                            
                            </>
                       }
                    </div>
                    <div className='d-flex gap-2'>
                        {editId===-1 || editId!==item._id ? <button className='btn btn-warning' onClick={()=>{setEditID(item._id);setEditTitle(item.title);setEditDescription(item.description)}}>Edit</button>:
                        <>
                            {<button className='btn btn-warning' onClick={handleUpdate}>Update</button>}
                            {<button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                        </>
                        }
                        {editId===-1 || editId!==item._id ? <button className='btn btn-danger' onClick={()=>{handleDelete(item._id)}}>Delete</button>:""}
                    </div>
                </li>)
            }
            </ul>
        </div>  
        {error && <p className='text-danger'>{error}</p>}
    </>
  )
}
export default Todo
