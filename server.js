const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const DATA_FILE = path.join(__dirname, 'users.json');
function readUsers(){ try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]') }catch(e){ return [] } }
function writeUsers(u){ fs.writeFileSync(DATA_FILE, JSON.stringify(u,null,2)) }

app.post('/register', (req,res)=>{
  const users = readUsers();
  const { username, password } = req.body;
  if(users.find(u=>u.username===username)) return res.status(409).json({ error: 'exists' });
  users.push({ username, password });
  writeUsers(users);
  return res.json({ ok: true });
});

app.post('/login', (req,res)=>{
  const users = readUsers();
  const { username, password } = req.body;
  const u = users.find(x=>x.username===username && x.password===password);
  if(!u) return res.status(401).json({ error: 'invalid' });
  return res.json({ ok: true });
});

app.get('/', (req,res)=> res.send('Backend running'));
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server running on', port));