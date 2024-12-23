import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReportItem = () => {
  const { rollNo } = useAuth();
  const initialFormState = {
    title: '',
    description: '',
    foundLocation: '',
    handoverLocation: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Submitting...' });

    try {
      // Create the item data object with all required fields
      const itemData = {
        ...formData,
        reporterRollNo: rollNo,
        status: 'pending' // Set default status
      };
      
      await api.createItem(itemData);
      setStatus({ type: 'success', message: 'Item reported successfully!' });
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error creating item:', error);
      setStatus({ 
        type: 'danger', 
        message: error.response?.data?.message || 'Error reporting item. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-5">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-box-seam text-primary" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
            </div>
            <h2 className="display-6 fw-bold text-primary mb-2">Report Found Item</h2>
            <p className="text-muted mb-0">Help return lost items to their rightful owners by submitting a report</p>
          </div>
          
          {status.message && (
            <div className={`alert alert-${status.type} alert-dismissible fade show mb-4`} role="alert">
              {status.message}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-medium">Item Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="title"
                    name="title"
                    placeholder="e.g. Blue Backpack"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-medium">Description</label>
                  <textarea
                    className="form-control form-control-lg"
                    id="description"
                    name="description"
                    placeholder="Provide detailed description of the item..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                    disabled={loading}
                  />
                  <div className="form-text">Include details like brand, color, size, and any distinguishing features</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="foundLocation" className="form-label fw-medium">Found Location</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="foundLocation"
                    name="foundLocation"
                    placeholder="e.g. Library Second Floor"
                    value={formData.foundLocation}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="handoverLocation" className="form-label fw-medium">Handover Location</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="handoverLocation"
                    name="handoverLocation"
                    placeholder="e.g. Campus Security Office"
                    value={formData.handoverLocation}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Report</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;