const Note = require('../models/note.model');
const Customer = require('../models/customer.model');

const getAllNotes = async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const customer = await Customer.findById(note.customer).lean().exec();
      return { ...note, username: customer.username };
    })
  );

  res.send(notesWithUser);
};

const createNewNote = async (req, res) => {
  const { customer, title, text } = req.body;
  if (!customer || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }
  const noteObject = { customer,title, text };
  console.log(noteObject);
  const note = await Note.create(noteObject);
  console.log(note);

  if (note) {
    return res.status(201).json({ message: 'New note created' });
  } else {
    return res.status(400).json({ message: 'Invalid note data received' });
  }
};

module.exports = {
  getAllNotes,
  createNewNote,
};
