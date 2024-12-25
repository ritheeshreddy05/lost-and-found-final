import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [userType, setUserType] = useState('student'); // student, faculty, admin
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setRollNo: setGlobalRollNo } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userType === 'admin') {
      if (rollNo === 'admin' && password === 'admin') {
        setGlobalRollNo('admin');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid admin credentials');
      }
    } else if (userType === 'faculty') {
      if (password === 'faculty') { // Simple faculty password validation
        setGlobalRollNo(`faculty_${rollNo}`);
        navigate('/', { replace: true });
      } else {
        setError('Invalid faculty credentials');
      }
    } else {
      if (password === 'vnrvjiet') {
        setGlobalRollNo(rollNo);
        navigate('/', { replace: true });
      } else {
        setError('Invalid student credentials');
      }
    }
  };

  const switchUserType = (type) => {
    setUserType(type);
    setError('');
    setRollNo('');
    setPassword('');
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow border-0 rounded-3">
              <div className="card-header bg-primary text-white text-center py-3">
                <h3 className="mb-0">Campus Lost & Found</h3>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${userType === 'student' ? 'btn-primary' : 'btn-outline-primary'} w-33`}
                      onClick={() => switchUserType('student')}
                    >
                      <i className="bi bi-person-fill me-2"></i>
                      Student
                    </button>
                    <button
                      type="button"
                      className={`btn ${userType === 'faculty' ? 'btn-primary' : 'btn-outline-primary'} w-33`}
                      onClick={() => switchUserType('faculty')}
                    >
                      <i className="bi bi-person-badge-fill me-2"></i>
                      Faculty
                    </button>
                    <button
                      type="button"
                      className={`btn ${userType === 'admin' ? 'btn-primary' : 'btn-outline-primary'} w-33`}
                      onClick={() => switchUserType('admin')}
                    >
                      <i className="bi bi-shield-lock-fill me-2"></i>
                      Admin
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 text-center" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="rollNo"
                      placeholder={
                        userType === 'admin' ? 'Enter admin username' : 
                        userType === 'faculty' ? 'Enter faculty ID' : 
                        'Enter roll number'
                      }
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                    />
                    <label htmlFor="rollNo">
                      {userType === 'admin' ? 'Admin Username' : 
                       userType === 'faculty' ? 'Faculty ID' : 
                       'Roll Number'}
                    </label>
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    {`Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;