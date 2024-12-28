import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');

  const handleNotify = () => {
    if (itemName && itemCategory) {
      alert(`You will be notified when an item named "${itemName}" in the category "${itemCategory}" is reported.`);
      setItemName('');
      setItemCategory('');
    } else {
      alert('Please enter both item name and category.');
    }
  };

  return (
    <div className="container-fluid bg-gradient min-vh-100" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'}}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-2 fw-bold mb-3">
            <span className="text-primary">EasyFind</span>
          </h1>
          <p className="lead text-muted mb-0 px-md-5 mx-auto" style={{maxWidth: "700px", lineHeight: "1.8"}}>
            Helping our campus community reconnect with lost belongings through a simple and efficient platform.
          </p>
        </div>
        
        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card h-100 border-0 rounded-4" style={{boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <div className="card-body d-flex flex-column p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-4" style={{width: "100px", height: "100px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-search-heart text-primary" viewBox="0 0 16 16">
                      <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018Z"/>
                      <path d="M13 6.5a6.471 6.471 0 0 1-1.258 3.844c.04.03.078.062.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1.007 1.007 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5ZM6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"/>
                    </svg>
                  </div>
                  <h3 className="h3 fw-bold mb-3">Found Something?</h3>
                  <p className="text-muted mb-4 px-lg-4">
                    Be a hero! Report items you've found on campus and help fellow students recover their belongings.
                  </p>
                </div>
                <Link 
                  to="/report" 
                  className="btn btn-primary btn-lg mt-auto py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                >
                  Report Found Item
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-5">
            <div className="card h-100 border-0 rounded-4" style={{boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <div className="card-body d-flex flex-column p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-4" style={{width: "100px", height: "100px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-box-seam text-primary" viewBox="0 0 16 16">
                      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                    </svg>
                  </div>
                  <h3 className="h3 fw-bold mb-3">Lost Something?</h3>
                  <p className="text-muted mb-4 px-lg-4">
                    Don't worry! Search our database of found items and get reunited with your belongings quickly.
                  </p>
                </div>
                <Link 
                  to="/search" 
                  className="btn btn-primary btn-lg mt-auto py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                >
                  Search Lost Items
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-4 mt-5">
          <div className="col-12 col-md-6">
            <div className="card h-100 border-0 rounded-4" style={{boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}}>
              <div className="card-body d-flex flex-column p-4">
                <h3 className="h3 fw-bold mb-3 text-center">Get Notified</h3>
                <p className="text-muted mb-4 text-center">
                  Enter the item name and select a category to receive notifications when someone reports it.
                </p>
                <input 
                  type="text" 
                  className="form-control mb-3" 
                  placeholder="Item Name" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                />
                <select 
                  className="form-select mb-3" 
                  value={itemCategory} 
                  onChange={(e) => setItemCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Personal belongings">Personal belongings</option>
                  <option value="Academic materials">Academic materials</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Sports equipment">Sports equipment</option>
                  <option value="Food containers/Water bottles">Food containers/Water bottles</option>
                  <option value="Other">Other</option>
                </select>
                <button 
                  className="btn btn-primary mt-auto" 
                  onClick={handleNotify}
                >
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;