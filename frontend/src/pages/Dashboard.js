import React, { useState, useEffect, useRef } from 'react';
import noteService from '../services/noteService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react'; // Import Trash2 icon

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null); // New state for expanded note

  const createNoteFormRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchNotes();
    }
  }, [user, navigate]);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes.');
      toast.error('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      toast.error('Note title cannot be empty.');
      return;
    }
    setCreateLoading(true);
    setError('');
    try {
      const newNote = await noteService.createNote({ title: newNoteTitle, content: newNoteContent });
      setNotes([newNote, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      toast.success('Note created successfully!');
      setShowCreateForm(false); // Hide the form after successful creation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note.');
      toast.error('Failed to create note.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(id);
        setNotes(notes.filter((note) => note._id !== id));
        toast.success('Note deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete note.');
        toast.error('Failed to delete note.');
      }
    }
  };

  const handleSignOut = () => {
    logout();
  };

  // New function to handle note clicks (expand/collapse)
  const handleNoteClick = (id) => {
    setExpandedNoteId(prevId => (prevId === id ? null : id));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mobile-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-icon">
              <div className="logo-rays">
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
                <div className="ray"></div>
              </div>
            </div>
            <h1 className="dashboard-title">Dashboard</h1>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Card */}
        <div className="welcome-card">
          <h2 className="welcome-title">Welcome, {user.name || user.email}!</h2>
          <p className="welcome-email">Email: {user.email}</p>
        </div>

        {/* Create Note Button */}
        <button
          className="create-note-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Note'}
        </button>

        {/* Create Note Form */}
        {showCreateForm && (
          <form className="create-note-form" onSubmit={handleCreateNote} ref={createNoteFormRef}>
            <input
              type="text"
              placeholder="Note title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="note-input"
              required
            />
            <textarea
              placeholder="Note content"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="note-textarea"
              rows="4"
              required
            />
            <button type="submit" className="save-note-btn" disabled={createLoading}>
              {createLoading ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        )}

        {/* Notes Section */}
        <div className="notes-section">
          <h3 className="notes-title">Notes</h3>
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {loading ? (
            <div className="loading-message" style={{ textAlign: 'center', color: '#64748b' }}>Loading notes...</div>
          ) : notes.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>Your notes will appear here. Click "Create Note" to get started!</p>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`note-item ${expandedNoteId === note._id ? 'note-item-expanded' : ''}`}
                  onClick={() => handleNoteClick(note._id)} // Click handler for expand/collapse
                >
                  <div className="note-header-and-content">
                    <span className="note-title">{note.title}</span>
                    {expandedNoteId === note._id && (
                      <p className="note-content-expanded">{note.content}</p>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent note expansion when deleting
                      handleDeleteNote(note._id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;