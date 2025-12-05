import React, { useState } from 'react';
import axios from 'axios';
import './SendPosts.css'; // Optional styling

const SendPosts = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Reset messages
    setMessage('');
    setError('');
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Both title and description are required');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Sending data:', formData);
      
      // Send POST request to your backend
      const response = await axios.post(
        'http://localhost:5000/api/posts', // Changed from /api/menu to /api/posts
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Success:', response.data);
      
      // Show success message
      setMessage(`✅ Post "${response.data.title}" added successfully!`);
      
      // Clear form
      setFormData({
        title: '',
        description: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      console.error('Error:', err);
      
      let errorMsg = 'Failed to send post';
      if (err.response) {
        errorMsg = `Error ${err.response.status}: ${err.response.data.error || err.response.data.details || 'Server error'}`;
      } else if (err.request) {
        errorMsg = 'No response from server. Make sure backend is running on port 5000';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Test if backend is running
  const testBackend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log('Backend test:', response.data);
      setMessage(`✅ Backend is running: ${response.data.message}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Backend not running. Start server.js first');
    }
  };

  return (
    <div className="send-posts-container">
      <h1>📤 Send Post to Database</h1>
      <p>This will insert data into PostgreSQL table "posts"</p>
      
      {/* Test Connection Button */}
      <button onClick={testBackend} className="test-btn">
        Test Backend Connection
      </button>
      
      {/* Messages */}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter post title"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter post description"
            rows="4"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !formData.title.trim() || !formData.description.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              '📤 Send Post'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={() => setFormData({ title: '', description: '' })}
            className="clear-btn"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
      
      {/* Info Panel */}
      <div className="info-panel">
        <h3>How it works:</h3>
        <ol>
          <li>Fill in Title and Description</li>
          <li>Click "Send Post" button</li>
          <li>Data sent to backend (localhost:5000)</li>
          <li>Backend inserts into PostgreSQL "posts" table</li>
          <li>Success/failure message shown</li>
        </ol>
        
        <h3>Quick Test Commands:</h3>
        <pre>
{`# Check if backend is running
curl http://localhost:5000/

# Test POST with curl
curl -X POST http://localhost:5000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test","description":"Test description"}'`}
        </pre>
      </div>
    </div>
  );
};

export default SendPosts;