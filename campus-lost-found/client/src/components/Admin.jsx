import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [claimRollNo, setClaimRollNo] = useState('');
   const [selectedItem, setSelectedItem] = useState(null);
   const navigate = useNavigate();
   const { rollNo } = useAuth();

   const ADMIN_ROLL_NUMBERS = ['20071A1234', 'admin'];

   useEffect(() => {
       if (!ADMIN_ROLL_NUMBERS.includes(rollNo)) {
           navigate('/');
           return;
       }
       fetchItems();
   }, [rollNo, navigate]);

   const fetchItems = async () => {
       try {
           const data = await api.getAllItems();
           setItems(data);
           setLoading(false);
       } catch (err) {
           setError('Failed to fetch items');
           setLoading(false);
       }
   };

   // Simulated delete - only updates UI
   const handleDelete = (itemId) => {
       if (window.confirm('Are you sure you want to delete this item?')) {
           setItems(prevItems => prevItems.filter(item => item._id !== itemId));
       }
   };

   const openClaimModal = (item) => {
       setSelectedItem(item);
       setClaimRollNo('');
   };

   const handleClaim = async (e) => {
       e.preventDefault();
       if (!selectedItem || !claimRollNo) {
           alert('Please enter a valid roll number');
           return;
       }

       try {
           // Update local state immediately for UI responsiveness
           setItems(prevItems => prevItems.map(item => 
               item._id === selectedItem._id 
                   ? { 
                       ...item, 
                       status: 'claimed', 
                       claimedByRollNo: claimRollNo 
                   }
                   : item
           ));
           
           setSelectedItem(null);
           setClaimRollNo('');
       } catch (err) {
           console.error('Update failed:', err);
           setError('Failed to update item status');
       }
   };

   if (loading) return <div className="text-center mt-5">Loading...</div>;
   if (error) return <div className="alert alert-danger m-3">{error}</div>;

   return (
       <div className="container mt-4">
           <h2 className="mb-4">Admin Dashboard</h2>
           
           <div className="table-responsive">
               <table className="table table-striped">
                   <thead>
                       <tr>
                           <th>Title</th>
                           <th>Description</th>
                           <th>Location</th>
                           <th>Reporter Roll No</th>
                           <th>Status</th>
                           <th>Claimed By</th>
                           <th>Actions</th>
                       </tr>
                   </thead>
                   <tbody>
                       {items.map(item => (
                           <tr key={item._id}>
                               <td>{item.title}</td>
                               <td>{item.description}</td>
                               <td>{item.foundLocation}</td>
                               <td>{item.reporterRollNo}</td>
                               <td>
                                   <span className={`badge ${item.status === 'claimed' ? 'bg-success' : 'bg-warning'}`}>
                                       {item.status}
                                   </span>
                               </td>
                               <td>{item.claimedByRollNo || '-'}</td>
                               <td>
                                   {item.status !== 'claimed' && (
                                       <button 
                                           className="btn btn-sm btn-primary me-2"
                                           onClick={() => {
                                               const rollNo = prompt('Enter claimer roll number:');
                                               if (rollNo) {
                                                   setClaimRollNo(rollNo);
                                                   openClaimModal(item);
                                                   // Automatically trigger claim after getting roll number
                                                   setItems(prevItems => prevItems.map(i => 
                                                       i._id === item._id 
                                                           ? { ...i, status: 'claimed', claimedByRollNo: rollNo }
                                                           : i
                                                   ));
                                               }
                                           }}
                                       >
                                           Update Status
                                       </button>
                                   )}
                                   <button 
                                       className="btn btn-sm btn-danger"
                                       onClick={() => handleDelete(item._id)}
                                   >
                                       Delete
                                   </button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>
   );
};

export default Admin;