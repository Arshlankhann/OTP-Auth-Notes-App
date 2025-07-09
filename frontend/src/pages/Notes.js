
import React, { useState, useEffect } from 'react';
import noteService from '../services/noteService';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [createLoading, setCreateLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchNotes();
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
        setCreateLoading(true);
        setError('');
        try {
            const newNote = await noteService.createNote({ title, content });
            setNotes([newNote, ...notes]);
            setTitle('');
            setContent('');
            toast.success('Note created successfully!');
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

    if (loading) {
        return <div className="loading-message">Loading notes...</div>;
    }

    return (
        <div className="notes-container">
            <h2>My Notes</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="note-form-section">
                <h3>Create New Note</h3>
                <form onSubmit={handleCreateNote} className="create-note-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Note Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="5"
                            className="form-control"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={createLoading} className="btn btn-primary">
                        {createLoading ? 'Creating...' : 'Add Note'}
                    </button>
                </form>
            </div>

            <div className="notes-list-section">
                {notes.length === 0 ? (
                    <p>No notes yet. Start by creating one!</p>
                ) : (
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;