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
       if (!selectedItem || !claimRollNo) return;

       try {
           // Make the real API call to update status
           await api.updateItemStatus(selectedItem._id, 'claimed');
           
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
                                           onClick={() => openClaimModal(item)}
                                           data-bs-toggle="modal"
                                           data-bs-target="#claimModal"
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

           {/* Claim Modal */}
           <div className="modal fade" id="claimModal" tabIndex="-1">
               <div className="modal-dialog">
                   <div className="modal-content">
                       <div className="modal-header">
                           <h5 className="modal-title">Update Item Status</h5>
                           <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                       </div>
                       <form onSubmit={handleClaim}>
                           <div className="modal-body">
                               {selectedItem && (
                                   <div className="mb-3">
                                       <p><strong>Item:</strong> {selectedItem.title}</p>
                                       <p><strong>Description:</strong> {selectedItem.description}</p>
                                   </div>
                               )}
                               <div className="mb-3">
                                   <label htmlFor="claimRollNo" className="form-label">Claimed By (Roll Number)</label>
                                   <input
                                       type="text"
                                       className="form-control"
                                       id="claimRollNo"
                                       value={claimRollNo}
                                       onChange={(e) => setClaimRollNo(e.target.value)}
                                       required
                                   />
                               </div>
                           </div>
                           <div className="modal-footer">
                               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                               <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Update</button>
                           </div>
                       </form>
                   </div>
               </div>
           </div>
       </div>
   );
};

export default Admin;