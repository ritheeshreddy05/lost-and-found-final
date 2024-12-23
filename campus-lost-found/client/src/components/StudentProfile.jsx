import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const StudentProfile = () => {
    const [reportedItems, setReportedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rewardPoints, setRewardPoints] = useState(0);
    const { rollNo } = useParams();

    const getBranchName = (code) => {
        // Convert code to uppercase to handle both cases
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
        const branchCode = rollNo.substring(6, 8); // Changed to get 7th and 8th characters
        
        // Calculate year of study based on academic year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        
        // If current month is before June (academic year transition), subtract 1 from current year
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

    useEffect(() => {
        fetchReportedItems();
    }, [rollNo]);

    const fetchReportedItems = async () => {
        try {
            const allItems = await api.getAllItems();
            const studentItems = allItems.filter(item => item.reporterRollNo === rollNo);
            setReportedItems(studentItems);
            setRewardPoints(studentItems.length * 10);
        } catch (error) {
            console.error('Error fetching reported items:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateItemStatus = async (itemId, newStatus) => {
        try {
            await api.updateItemStatus(itemId, newStatus);
            fetchReportedItems(); // Refresh data
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const studentDetails = getStudentDetails(rollNo);

    return (
        <div className="container py-4">
            <div className="row">
                {/* Basic Info Card */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Student Info</h5>
                            <div className="student-details">
                                <p><strong>Roll No:</strong> {rollNo}</p>
                                <p><strong>Branch:</strong> {studentDetails?.branch}</p>
                                <p><strong>Year Joined:</strong> {studentDetails?.yearJoined}</p>
                                <p><strong>Current Year:</strong> {studentDetails?.yearOfStudy}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rewards Card */}
                    <div className="card mt-4 border-0 shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title mb-4">
                                <i className="fas fa-trophy text-warning me-2"></i>
                                Rewards & Achievements
                            </h5>
                            <div className="reward-stats">
                                <div className="mb-4">
                                    <div className="display-4 text-primary mb-2">{rewardPoints}</div>
                                    <div className="text-muted">Total Points Earned</div>
                                </div>
                                <div className="reward-milestone p-3 bg-light rounded">
                                    <div className="h2 mb-2">
                                        <i className="fas fa-star text-warning me-2"></i>
                                        {reportedItems.length}
                                    </div>
                                    <div className="text-muted">Items Successfully Reported</div>
                                </div>
                                <div className="mt-4">
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div 
                                            className="progress-bar bg-success" 
                                            role="progressbar" 
                                            style={{ width: `${Math.min((rewardPoints / 100) * 100, 100)}%` }}
                                            aria-valuenow={rewardPoints} 
                                            aria-valuemin="0" 
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <small className="text-muted">Progress to next level</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reported Items */}
                <div className="col-md-8">
                    <h4>Reported Items</h4>
                    {reportedItems.map(item => (
                        <div key={item._id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                                <div className="mt-3">
                                    <p><strong>Status:</strong> 
                                        <span className={`badge bg-${
                                            item.status === 'pending' ? 'warning' :
                                            item.status === 'claimed' ? 'info' :
                                            'success'
                                        } ms-2`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </p>
                                    <p><strong>Found at:</strong> {item.foundLocation}</p>
                                    <p><strong>Handover Location:</strong> {item.handoverLocation}</p>
                                    {item.handoverDate && (
                                        <p><strong>Handover Date:</strong> {new Date(item.handoverDate).toLocaleDateString()}</p>
                                    )}
                                </div>
                                {item.status === 'claimed' && (
                                    <button
                                        className="btn btn-success mt-2"
                                        onClick={() => updateItemStatus(item._id, 'handovered')}
                                    >
                                        Mark as Handovered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {reportedItems.length === 0 && (
                        <p className="text-center">No items reported yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;