import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SendPosts() 
{
    const [formData, setFormData] = useState({title:'', description:''});

    const inputChangeHandler = (e) => {
        const [name, value] = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandle = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/menu', formData);

            setFormData([...formData, response.data]);
        } catch (err) {
            console.error('Error adding menu item:', err);
        }
    }
  return (
    <>
        <div className='send-container'>
            <div>
                <input
                    type='text'
                    placeholder='title: ...'
                    onChange={inputChangeHandler}
                />
            </div>
            <div>
                <textarea
                    type='text'
                    placeholder='descriptions'
                    onChange={inputChangeHandler}
                />
            </div>
            <div>
                <button className='submit-button' onClick={submitHandle} />
            </div>
        </div>
    </>
  );
};

export default SendPosts;