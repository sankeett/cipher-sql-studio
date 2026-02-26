import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import { AuthContext } from '../context/AuthContext';
import { Play, Lightbulb, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM employees;');
  const [results, setResults] = useState(null);
  const [executionError, setExecutionError] = useState('');
  
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(`/api/assignments/${id}`);
        setAssignment(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionError('');
    setResults(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${user.token}` })
        }
      };
      
      const { data } = await axios.post('/api/queries/execute', {
        query,
        assignmentId: id
      }, config);
      
      setResults(data);
    } catch (err) {
      setExecutionError(err.response?.data?.message || 'Error executing query');
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    setHintLoading(true);
    setHint('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${user.token}` })
        }
      };
      const { data } = await axios.post('/api/hints/generate', {
        assignmentId: id,
        userQuery: query,
        currentError: executionError
      }, config);
      
      setHint(data.hint);
    } catch (err) {
      setHint('Failed to load hint. Please try again.');
    } finally {
      setHintLoading(false);
    }
  };

  if (!assignment) return <div className="page-loader">Loading workspace...</div>;

  return (
    <div className="workspace">
      <div className="workspace__header">
        <button className="btn btn--outline" onClick={() => navigate('/assignments')}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="workspace__title">{assignment.title}</h2>
        <div className={`diff-badge diff-badge--${assignment.difficulty.toLowerCase()}`}>
          {assignment.difficulty}
        </div>
      </div>

      <div className="workspace__grid">
        {/* Left Panel: Question & Schema */}
        <div className="workspace__panel workspace__panel--left">
          <div className="panel-section">
            <h3>Problem Description</h3>
            <p>{assignment.description}</p>
          </div>
          <div className="panel-section">
            <h3>Schema Definition</h3>
            <pre className="schema-box">{assignment.schemaDescription}</pre>
          </div>
          <div className="panel-section">
            <h3>Sample Data</h3>
            <pre className="schema-box">{assignment.sampleDataDescription}</pre>
          </div>
        </div>

        {/* Right Panel: Editor & Results */}
        <div className="workspace__panel workspace__panel--right">
          <div className="editor-container">
            <div className="editor-header">
              <span>SQL Editor</span>
              <div className="editor-actions">
                <button 
                  className="btn btn--secondary" 
                  onClick={handleGetHint}
                  disabled={hintLoading}
                >
                  <Lightbulb size={16} /> {hintLoading ? 'Generating...' : 'Get Hint'}
                </button>
                <button 
                  className="btn btn--primary" 
                  onClick={handleExecute}
                  disabled={executing}
                >
                  <Play size={16} /> {executing ? 'Executing...' : 'Run Query'}
                </button>
              </div>
            </div>
            
            <Editor
              height="300px"
              defaultLanguage="sql"
              theme="vs-dark"
              value={query}
              onChange={(value) => setQuery(value)}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {/* Hint Section */}
          {hint && (
            <div className="hint-box">
              <div className="hint-box__header">
                <Lightbulb size={16} /> <span>AI Hint</span>
                <button className="btn-close" onClick={() => setHint('')}>×</button>
              </div>
              <p className="hint-box__content">{hint}</p>
            </div>
          )}

          {/* Results Section */}
          <div className="results-container">
            <h3>Execution Results</h3>
            {executionError && (
              <div className="alert alert--error">
                <XCircle size={16} />
                <span>{executionError}</span>
              </div>
            )}
            {results && (
              <div className="results-table-wrapper">
                <div className="alert alert--success">
                  <CheckCircle size={16} />
                  <span>Query executed successfully. {results.rows?.length} rows returned.</span>
                </div>
                {results.rows?.length > 0 ? (
                  <table className="results-table">
                    <thead>
                      <tr>
                        {results.fields.map(field => (
                          <th key={field.name}>{field.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, idx) => (
                        <tr key={idx}>
                          {results.fields.map(field => (
                            <td key={field.name}>{String(row[field.name])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No rows to display.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;
