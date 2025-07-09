
import React from 'react';
import { format } from 'date-fns';

const NoteCard = ({ note, onDelete }) => {
    return (
        <div className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Created: {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}</small>
            <button onClick={() => onDelete(note._id)} className="btn btn-danger btn-sm">Delete</button>
        </div>
    );
};

export default NoteCard;