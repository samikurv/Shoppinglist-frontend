import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/';


function App() {
  const [item,setItem] = useState('');
  const [items,setItems] = useState([]);
  const [amount, setAmount] = useState('')

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }, [])
  
  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description:item, amount:amount });
    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setItem('');
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
    })
  }
  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
    })
  }

  return (

  <div className='container'>
      <h1>Shopping list</h1>
      <form onSubmit={save}>
        <label className='container'>New item</label>
        <input value={item} placeholder='Type description' onChange={e => setItem(e.target.value)} />
        <input type="number" min="1" value={amount} placeholder='Insert amount' onChange={e => setAmount(e.target.value)} />
        <button>Add</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <span>{item.description}</span> {item.amount} &nbsp;
            <a href="#" className="delete" onClick={() => remove(item.id)}>
            Delete
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;