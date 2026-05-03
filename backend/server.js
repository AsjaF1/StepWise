require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const auth    = require('./middleware/auth');

const app = express();

app.use(cors({
  origin: '*', // tighten this later with your frontend URL
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/decks',    auth, require('./routes/decks'));
app.use('/api/cards',    auth, require('./routes/cards'));
app.use('/api/folders',  auth, require('./routes/folders'));
app.use('/api/progress', auth, require('./routes/progress'));
app.use('/api/sessions', auth, require('./routes/sessions'));
app.use('/api/ai',       auth, require('./routes/ai'));

// Serve frontend
app.use(express.static(path.join(__dirname, '..')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`StepWise running on http://localhost:${PORT}`));