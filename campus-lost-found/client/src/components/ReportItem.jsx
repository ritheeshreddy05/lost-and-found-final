import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReportItem = ({ onItemReported }) => {
  const { rollNo } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foundLocation: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      foundLocation: ''
    });
    setImage(null);
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    setStatus({ type: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatus({
          type: 'danger',
          message: 'Image size must be less than 5MB'
        });
        e.target.value = '';
        setImage(null);
        setImagePreview(null);
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Uploading...' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('foundLocation', formData.foundLocation);
      formDataToSend.append('reporterRollNo', rollNo);
      formDataToSend.append('handoverLocation', 'Security Office');

      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await api.createItem(formDataToSend);
      
      if (response.success) {
        setStatus({ type: 'success', message: 'Item reported successfully!' });
        resetForm();
        if (onItemReported) {
          onItemReported(response.item);
        }
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: 'danger',
        message: error.response?.data?.message || 'Error creating item'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="alert alert-info mb-4" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Please submit the found item to the Security Office located on the Ground Floor, B Block.
              </div>

              {status.message && (
                <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
                  {status.message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setStatus({ type: '', message: '' })} 
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder="e.g., Blue Backpack, ID Card, Phone"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Brief description with color, brand, and identifying features"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="foundLocation" className="form-label">Found Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="foundLocation"
                    name="foundLocation"
                    placeholder="e.g., Library 2nd Floor, Cafeteria, Room 301"
                    value={formData.foundLocation}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <small className="text-muted d-block mt-1">Max size: 5MB (JPG/PNG)</small>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-2 position-relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }} 
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          const fileInput = document.querySelector('input[type="file"]');
                          if (fileInput) fileInput.value = '';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;