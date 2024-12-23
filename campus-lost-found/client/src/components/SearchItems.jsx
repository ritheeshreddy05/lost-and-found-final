import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const fetchItems = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const response = await (query ? api.searchItems(query) : api.getAllItems());
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
    const query = e.target.value;
    setSearchQuery(query);
    const timeoutId = setTimeout(() => {
      fetchItems(query);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
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
    <div className="col-md-6 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{item.title}</h5>
            <span className={`badge ${getStatusBadgeClass(item.status)} rounded-pill`}>
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </span>
          </div>
          <p className="card-text text-muted">{item.description}</p>
          <div className="mt-3">
            <div className="d-flex mb-2">
              <i className="bi bi-geo-alt text-primary me-2"></i>
              <p className="mb-0"><strong>Found at:</strong> {item.foundLocation}</p>
            </div>
            <div className="d-flex mb-2">
              <i className="bi bi-box-seam text-primary me-2"></i>
              <p className="mb-0"><strong>Pickup Location:</strong> {item.handoverLocation}</p>
            </div>
            {item.claimerRollNo && (
              <div className="d-flex mb-2">
                <i className="bi bi-person-check text-primary me-2"></i>
                <p className="mb-0"><strong>Claimed by:</strong> {item.claimerRollNo}</p>
              </div>
            )}
            <div className="d-flex mt-3 text-muted">
              <i className="bi bi-clock me-2"></i>
              <small>
                Reported on: {new Date(item.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredItems = items.filter(item => {
    if (activeTab === 'pending') {
      return item.status === 'pending';
    } else {
      return item.status === 'claimed' || item.status === 'handovered';
    }
  });

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-primary mb-2">Search Lost Items</h2>
        <p className="text-muted">Find items that have been reported as found on campus</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by title..."
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
        <div className="alert alert-danger text-center" role="alert">
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
          <div className="row">
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