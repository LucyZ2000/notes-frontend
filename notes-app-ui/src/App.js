import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] =
    useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = 
        await fetch("https://notes-backend-trzl.onrender.com/api/notes")

        const notes = await response.json();

        setNotes(notes)
      } catch (e) {
        console.log(e)
      }
    }

    fetchNotes(); 
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = async (
    event
  ) => {
    event.preventDefault();
    try {

      const response = await fetch(
        "https://notes-backend-trzl.onrender.com/api/notes",
        {
          method:"POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title, 
            content
          }),
        }
      );

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("")
      setContent("");
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateNote = async (event) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `https://notes-backend-trzl.onrender.com/api/notes/${selectedNote.id}`,
        {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            content,
          })
        }
      )

      const updatedNote = await response.json();

      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id
          ? updatedNote
          : note
      );
  
      setNotes(updatedNotesList)
      setTitle("")
      setContent("")
      setSelectedNote(null);

    } catch (e) {
      console.log(e)
    }
  };

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null);
  }

  const deleteNote = async (
    event,
    noteId
  ) => {
    event.stopPropagation();

    try{

      await fetch(
        `https://notes-backend-trzl.onrender.com/api/notes/${noteId}`,
        {
          method: "DELETE",

        }
      );
      const updateNotes = notes.filter(
        (note) => note.id !== noteId
      );
  
      setNotes(updateNotes);
    }catch(e){
      console.log(e)
    }

  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(event) =>
          selectedNote
            ? handleUpdateNote(event)
            : handleAddNote(event)
        }
      >
        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Title"
          required />
        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Content"
          rows={10}
          required>
        </textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button
                onClick={(event) => deleteNote(event, note.id)}
              >
                x
              </button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div >
  );
};

export default App;