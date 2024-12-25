import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getAllItems();
      setItems(response || []);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Error fetching items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-warning';
      case 'claimed':
        return 'bg-info';
      case 'handovered':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const ItemCard = ({ item }) => (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-lg border-0 hover-effect">
        <div className="position-relative">
          {item.image && item.image.url ? (
            <img 
              src={item.image.url} 
              className="card-img-top"
              alt={item.title}
              style={{ 
                height: '200px', 
                objectFit: 'cover',
                '@media (max-width: 576px)': {
                  height: '250px'
                }
              }}
            />
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center" 
                 style={{ 
                   height: '200px',
                   '@media (max-width: 576px)': {
                     height: '250px'
                   }
                 }}>
              <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
            </div>
          )}
          <span className={`badge ${getStatusBadgeClass(item.status)} position-absolute top-0 end-0 m-3 px-3 py-2`}>
            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </span>
        </div>
        
        <div className="card-body p-3 p-sm-4">
          <h5 className="card-title fw-bold mb-3 text-break">{item.title}</h5>
          <p className="card-text text-muted mb-4 small">
            {item.description}
          </p>
          
          <div className="details-section">
            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                <i className="bi bi-geo-alt text-primary"></i>
              </div>
              <div className="flex-grow-1">
                <small className="text-muted d-block">Found at</small>
                <strong className="text-break">{item.foundLocation}</strong>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                <i className="bi bi-box-seam text-primary"></i>
              </div>
              <div className="flex-grow-1">
                <small className="text-muted d-block">Pickup Location</small>
                <strong className="text-break">{item.handoverLocation}</strong>
              </div>
            </div>

            {item.claimerRollNo && (
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-light rounded-circle p-2 me-3">
                  <i className="bi bi-person-check text-primary"></i>
                </div>
                <div className="flex-grow-1">
                  <small className="text-muted d-block">Claimed by</small>
                  <strong className="text-break">{item.claimerRollNo}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-top">
            <div className="d-flex align-items-center text-muted small">
              <i className="bi bi-clock me-2"></i>
              <span className="text-wrap">
                Reported on: {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                         item.description.toLowerCase().includes(searchQuery) ||
                         item.foundLocation.toLowerCase().includes(searchQuery);
                         
    if (activeTab === 'pending') {
      return matchesSearch && item.status === 'pending';
    } else {
      return matchesSearch && (item.status === 'claimed' || item.status === 'handovered');
    }
  });

  return (
    <div className="container py-4 py-sm-5">
      <div className="text-center mb-4 mb-sm-5">
        <h2 className="display-6 fw-bold text-primary mb-2">Search Lost Items</h2>
        <p className="text-muted">Find items that have been reported as found on campus</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 px-4 px-sm-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by title, description or location..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Items
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Items
            </button>
          </li>
        </ul>
      </div>

      {error && (
        <div className="alert alert-danger text-center mx-3" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row px-2 px-sm-3">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {!loading && filteredItems.length === 0 && (
            <div className="text-center mt-5">
              <div className="mb-4">
                <i className="bi bi-inbox display-1 text-muted"></i>
              </div>
              <p className="lead text-muted">
                {searchQuery
                  ? 'No items found matching your search.'
                  : `No ${activeTab} items available.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchItems;