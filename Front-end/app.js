// Grab the elements we need from the HTML
const titleInput = document.getElementById('title-input');
const contentInput = document.getElementById('content-input');
const addNoteButton = document.getElementById('add-note');
const noteList = document.getElementById('note-list');

// This is the URL for our API where we can get and send notes
const API_URL = 'http://localhost:5001/api/notes';
let currentEditId = null; // This will keep track of which note we're editing

// Function to fetch and display the notes
const fetchNotes = async () => {
    const response = await fetch(API_URL); // Get the notes from the API
    const notes = await response.json(); // Convert the response to JSON
    noteList.innerHTML = ''; // Clear the existing notes

    // Loop through each note and create a list item for it
    notes.forEach(note => {
        const li = document.createElement('li'); // Create a new list item
        li.innerHTML = `
            <strong>${note.title}</strong>
            <p>${note.content}</p>
            <button class="edit" onclick="startEdit('${note._id}', '${note.title}', '${note.content}')">Edit</button>
            <button class="delete" onclick="deleteNote('${note._id}')">Delete</button>
        `;
        noteList.appendChild(li); // Add the new list item to the notes list
    });
};

// Function to add a new note or update an existing one
const addNote = async () => {
    // Check if both title and content are filled out
    if (!titleInput.value || !contentInput.value) {
        alert("Both title and content are required!"); // Alert the user if fields are empty
        return; 
    }

    // Create a new note object with the input values
    const newNote = {
        title: titleInput.value,
        content: contentInput.value
    };

    // If we're editing a note, update it; otherwise, create a new one
    if (currentEditId) {
        // Update the existing note
        await fetch(`${API_URL}/${currentEditId}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json' // Tell the server we're sending JSON
            },
            body: JSON.stringify(newNote) // Convert the note object to a JSON string
        });
        currentEditId = null; // Reset after editing
    } else {
        // Create a new note
        await fetch(API_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'            },
            body: JSON.stringify(newNote) // Convert the note object to a JSON string
        });
    }

    // Clear the input fields after adding/updating a note
    titleInput.value = '';
    contentInput.value = '';
    fetchNotes(); // Refresh the list of notes
};

// Function to start editing a note
const startEdit = (id, title, content) => {
    currentEditId = id; // Set the ID of the note we're editing
    titleInput.value = title; 
    contentInput.value = content; 
    addNoteButton.textContent = 'Update Note'; // Change the button text to indicate we're updating
};

// Function to delete a note
const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE' 
    });
    fetchNotes(); // Refresh the list of notes
};


addNoteButton.addEventListener('click', addNote);

// Fetch and display notes when the page loads
fetchNotes();
