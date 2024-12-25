import React from 'react';
import { Toast } from 'react-bootstrap';

const Notification = ({ show, onClose, item }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000
      }}
    >
      <Toast show={show} onClose={onClose} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">New Item Reported</strong>
          <small className="text-muted">just now</small>
        </Toast.Header>
        <Toast.Body>
          <div className="d-flex align-items-center">
            {item?.image?.url && (
              <img
                src={item.image.url}
                alt={item.title}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  marginRight: '10px'
                }}
              />
            )}
            <div>
              <strong>{item?.title}</strong>
              <p className="mb-0 text-muted">Found at: {item?.foundLocation}</p>
            </div>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;
