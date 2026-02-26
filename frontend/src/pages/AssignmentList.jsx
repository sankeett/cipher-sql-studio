import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Database, TrendingUp, AlertCircle } from 'lucide-react';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get('/api/assignments');
        setAssignments(data);
      } catch (err) {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <div className="page-loader">Loading assignments...</div>;
  if (error) return <div className="alert alert--error">{error}</div>;

  return (
    <div className="assignment-list-page">
      <div className="page-header">
        <h1>SQL Assignments</h1>
        <p>Practice your SQL skills against real-world schemas.</p>
      </div>

      <div className="assignment-grid">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="assignment-card">
            <div className="assignment-card__header">
              <span className={`diff-badge diff-badge--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
              </span>
            </div>
            <h3 className="assignment-card__title">{assignment.title}</h3>
            <p className="assignment-card__desc">{assignment.description}</p>
            <div className="assignment-card__footer">
              <Link to={`/assignments/${assignment._id}`} className="btn btn--secondary">
                Attempt Challenge
              </Link>
            </div>
          </div>
        ))}
        {assignments.length === 0 && (
          <div className="empty-state">
            <Database size={48} />
            <p>No assignments found. Please contact an administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
