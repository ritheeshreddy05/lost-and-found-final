import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const StudentProfile = () => {
    const [reportedItems, setReportedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { rollNo } = useParams();

    const getBranchName = (code) => {
        code = code.toUpperCase();
        const branches = {
            '05': 'Computer Science & Engineering',
            'CS': 'Computer Science & Engineering',
            '12': 'Information Technology',
            'IT': 'Information Technology',
            '04': 'Electronics & Communication Engineering',
            'EC': 'Electronics & Communication Engineering',
            '03': 'Electrical & Electronics Engineering',
            'EE': 'Electrical & Electronics Engineering',
            '02': 'Mechanical Engineering',
            'ME': 'Mechanical Engineering',
            '01': 'Civil Engineering',
            'CE': 'Civil Engineering'
        };
        return branches[code] || 'Unknown Branch';
    };

    const getStudentDetails = (rollNo) => {
        if (!rollNo || rollNo.length < 8) return null;

        const year = '20' + rollNo.substring(0, 2);
        const branchCode = rollNo.substring(6, 8);
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        const academicYear = currentMonth < 6 ? currentYear - 1 : currentYear;
        const yearOfStudy = academicYear - parseInt(year) + 1;

        return {
            yearJoined: year,
            yearOfStudy: `${yearOfStudy}${getOrdinalSuffix(yearOfStudy)} Year`,
            branch: getBranchName(branchCode)
        };
    };

    const getOrdinalSuffix = (num) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    };

    const getRewardLevel = (points) => {
        if (points >= 50) return { title: 'Gold Member', color: '#FFD700' };
        if (points >= 30) return { title: 'Silver Member', color: '#C0C0C0' };
        if (points >= 10) return { title: 'Bronze Member', color: '#CD7F32' };
        return { title: 'New Member', color: '#A0A0A0' };
    };

    useEffect(() => {
        fetchReportedItems();
    }, [rollNo]);

    const fetchReportedItems = async () => {
        try {
            const allItems = await api.getAllItems();
            const studentItems = allItems.filter(item => item.reporterRollNo === rollNo);
            setReportedItems(studentItems);
        } catch (error) {
            console.error('Error fetching reported items:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const studentDetails = getStudentDetails(rollNo);
    const points = reportedItems.length * 10;
    const rewardLevel = getRewardLevel(points);

    return (
        <div className="container py-4">
            {/* Student Details Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h4 className="card-title mb-4">Student Information</h4>
                            <div className="row">
                                <div className="col-md-4">
                                    <p><strong>Roll No:</strong> {rollNo}</p>
                                </div>
                                <div className="col-md-4">
                                    <p><strong>Branch:</strong> {studentDetails?.branch}</p>
                                </div>
                                <div className="col-md-4">
                                    <p><strong>Current Year:</strong> {studentDetails?.yearOfStudy}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="points-card text-center p-3 rounded-3" 
                                 style={{
                                     background: `linear-gradient(135deg, ${rewardLevel.color}40, ${rewardLevel.color}90)`,
                                     border: `2px solid ${rewardLevel.color}`,
                                     boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                 }}>
                                <div className="display-4 fw-bold mb-0">{points}</div>
                                <div className="h5 mb-2">REWARD POINTS</div>
                                <div className="badge mb-2" style={{ 
                                    backgroundColor: rewardLevel.color,
                                    color: '#000',
                                    padding: '8px 15px',
                                    fontSize: '1rem'
                                }}>
                                    {rewardLevel.title}
                                </div>
                                <div className="points-details">
                                    <small>
                                        <i className="bi bi-trophy-fill me-1"></i>
                                        {reportedItems.length} items reported
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reported Items Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Reported Items</h4>
                <div className="text-muted">
                    <i className="bi bi-info-circle me-2"></i>
                    Earn 10 points for each item reported
                </div>
            </div>
            <div className="row">
                {reportedItems.length > 0 ? (
                    reportedItems.map(item => (
                        <div key={item._id} className="col-md-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                {item.image && item.image.url && (
                                    <img 
                                        src={item.image.url} 
                                        className="card-img-top" 
                                        alt={item.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title mb-0">{item.title}</h5>
                                        <span className={`badge ${
                                            item.status === 'pending' ? 'bg-warning' :
                                            item.status === 'claimed' ? 'bg-info' :
                                            'bg-success'
                                        }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="card-text text-muted">{item.description}</p>
                                    <div className="mt-3">
                                        <div className="d-flex mb-2">
                                            <i className="bi bi-geo-alt text-primary me-2"></i>
                                            <p className="mb-0"><strong>Found at:</strong> {item.foundLocation}</p>
                                        </div>
                                        <div className="d-flex mt-2 text-muted">
                                            <i className="bi bi-clock me-2"></i>
                                            <small>
                                                Reported on: {new Date(item.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Start reporting lost items to earn reward points!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;