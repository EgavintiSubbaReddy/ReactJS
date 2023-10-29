import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
 
function App() {
  const [usersData, setUsersData] = useState([]);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [emailid, setEmailId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);
 
  const formRef = useRef(null);
 
  const updateUserId = (event) => {
    setUserId(event.target.value);
  };
 
  const updatePassword = (event) => {
    setPassword(event.target.value);
  };
 
  const updateEmail = (event) => {
    setEmailId(event.target.value);
  };
 
  const insertUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (isUpdating) {
        await axios.put(`http://localhost:8001/updateUser`, {
          uid: selectedUserId,
          password: password,
          emailid: emailid,
        });
        console.log('Update successful');
      } else {
        await axios.post('http://localhost:8001/insertUser', {
          uid: userId,
          password: password,
          emailid: emailid,
        });
        console.log('Insert successful');
      }
      clearForm();
      await fetchUsersData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
      setSelectedUserId(null);
    }
  };
 
  const deleteUser = async (uid) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8001/deleteUser?uid=${uid}`);
      console.log('Delete successful');
      await fetchUsersData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const editUser = (uid) => {
    const selectedUser = usersData.find((user) => user.userid === uid);
    if (selectedUser) {
      setIsUpdating(true);
      setSelectedUserId(selectedUser.userid);
      setUserId(selectedUser.userid);
      setPassword(selectedUser.password);
      setEmailId(selectedUser.emailid);
    }
  };
 
  const clearForm = () => {
    setUserId('');
    setPassword('');
    setEmailId('');
    formRef.current.reset();
  };
 
  const fetchUsersData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8001/getAll');
      setUsersData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const toggleUserTable = () => {
    setShowUserTable(!showUserTable);
  };
 
  useEffect(() => {
    fetchUsersData();
  }, []);
 
  return (
    <div className="App center-container">
      <center>
      <h1>USER FORM</h1>
        <form ref={formRef} onSubmit={insertUser}>
          <input type="text" className="inputStyle" value={userId} onChange={updateUserId} placeholder="User ID" /><br />
          <input type="password" className="inputStyle" value={password} onChange={updatePassword} placeholder="Password" /><br />
          <input type="email" className="inputStyle" value={emailid} onChange={updateEmail} placeholder="Email ID" /><br />
          <button type="submit" className="buttonStyle" disabled={isLoading}>
            {isUpdating ? "Update" : "Add"}
          </button>
          <input type="reset" className="resetButtonStyle" value="Reset" onClick={clearForm} disabled={isLoading} />
        </form>
        <button id="table-toggle-button" onClick={toggleUserTable}>
          {showUserTable ? 'Hide User Table' : 'Show User Table'}
        </button>
        {showUserTable && (
          <table className="tableStyle">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Password</th>
                <th>Email ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="1">Loading...</td>
                </tr>
              ) : usersData.map((user) => (
                <tr key={user.userid}>
                  <td>{user.userid}</td>
                  <td>{user.password}</td>
                  <td>{user.emailid}</td>
                  <td>
                    <button id="delete-button" onClick={() => deleteUser(user.userid)} disabled={isLoading}>Delete</button>
                    <button id="edit-button" onClick={() => editUser(user.userid)} disabled={isLoading}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </center>
    </div>
  );
}
 
export default App;