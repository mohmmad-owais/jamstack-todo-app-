import React, { useEffect, useState } from "react"
import { useQuery, useMutation,gql } from '@apollo/client';
// import gql from 'graphql-tag';
import "./style.css";


import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

// This query is executed at run time by Apollo.
const GET_TODOS = gql`
  query GetTodos {
    todos {
      id,
      task,
      status,
      title
    }
  }
`;
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`;
const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!){
    deleteTodo(id: $id){
      id
    }
  }
`;

export default function Home() {
    
    const [input, setInput] = React.useState('');


    const [addTodo] = useMutation(ADD_TODO);
    const [deleteTodo] = useMutation(DELETE_TODO);

    const addTask = () => {
        addTodo({
            variables: {
                task: input
            },
            refetchQueries: [{ query: GET_TODOS }]
        })
        setInput ('');
    }

    

    const { loading, error, data } = useQuery(GET_TODOS);
    

    if (loading)
        return <h2>Loading..</h2>

    if (error) {
        console.log(error)
        return <h2>Error</h2>
    }

    const deleteTask = (id) => {
        deleteTodo({
          variables: {
            id
          },
          refetchQueries: [{ query: GET_TODOS }]
        })
      };

      const dltbtn = (id) =>{
           console.log(id);
      }

    return (
        <div className="container">
            <h1>Serverless JAMStack Todo app</h1>
            <label>
                <h1> Add Task </h1> 
                <TextField id="standard-basic" label="Enter todo"  required  type="text" value={input}
           onChange={(e) => {
            setInput(e.target.value);
          }}/>
            </label>
            <br />
            <br />
            <Button variant="outlined" onClick={addTask}>Add Task</Button>

            <br /> <br />

            <h3>My TODO LIST</h3>

          
            <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">TASK</TableCell>
            <TableCell align="center">Status</TableCell>
         
          </TableRow>
        </TableHead>
        <TableBody>

          {data.todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell component="th" scope="row">
                {todo.id}
              </TableCell>
              
              <TableCell align="center">{todo.task ? todo.task : todo.title}</TableCell>
              <TableCell align="right">true
              <DeleteIcon className='dltBtn' onClick={() => deleteTask(todo.id)} />
                  
              </TableCell>
              
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      
      
      
        </div>
    
 
 
 );

}