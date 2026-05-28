const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, '../users.json');

function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();
  if (users.find(u => u.username === username)) {
    return res.json({ error: 'User exists' });
  }
  users.push({ username, password });
  saveUsers(users);
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ error: 'Invalid credentials' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});

module.exports = app;
