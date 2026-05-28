function updatePreview() {
  const html = document.getElementById('htmlEditor').value;
  const css = '<style>' + document.getElementById('cssEditor').value + '</style>';
  const js = '<script>' + document.getElementById('jsEditor').value + '<' + '/script>';
  const frame = document.getElementById('previewFrame');
  const doc = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(html.replace('</head>', css + '</head>').replace('</body>', js + '</body>'));
  doc.close();
}

document.getElementById('previewBtn').addEventListener('click', updatePreview);

async function downloadProjectZip() {
  const zip = new JSZip();
  const html = document.getElementById('htmlEditor').value;
  const css = document.getElementById('cssEditor').value;
  const js = document.getElementById('jsEditor').value;

  // Frontend files
  zip.file('index.html', html);
  zip.file('styles.css', css);
  zip.file('script.js', js);

  // Backend files (simple Node/Express starter)
  zip.file('server.js', `const express = require('express');\nconst fs = require('fs');\nconst path = require('path');\nconst cors = require('cors');\nconst app = express();\napp.use(cors());\napp.use(express.json());\nconst DATA_FILE = path.join(__dirname, 'users.json');\nfunction readUsers(){ try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]') }catch(e){ return [] } }\nfunction writeUsers(u){ fs.writeFileSync(DATA_FILE, JSON.stringify(u,null,2)) }\napp.post('/register', (req,res)=>{ const users=readUsers(); const {username,password}=req.body; if(users.find(u=>u.username===username)) return res.status(409).json({error:'exists'}); users.push({username,password}); writeUsers(users); return res.json({ok:true}); });\napp.post('/login',(req,res)=>{ const users=readUsers(); const {username,password}=req.body; const u=users.find(x=>x.username===username && x.password===password); if(!u) return res.status(401).json({error:'invalid'}); return res.json({ok:true}); });\napp.get('/',(req,res)=>res.send('Backend running'));\nconst port=process.env.PORT||3000; app.listen(port,()=>console.log('Server running on',port));`);

  zip.file('package.json', `{
  "name": "how-to-website-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js", "dev": "nodemon server.js" },
  "dependencies": { "express": "^4.18.2", "cors": "^2.8.5" }
}`);

  zip.file('README.md', `This project was generated from the interactive tutorial. Run backend: \n\n1. cd how to make a website\n2. npm install\n3. npm start\n\nFrontend: open index.html in your browser for the interactive editor and preview.\n\nTo deploy: init a git repo, push to GitHub, connect Render or your preferred host.`);

  zip.file('users.json', '[]');

  const content = await zip.generateAsync({type:'blob'});
  saveAs(content, 'how-to-website.zip');
}

document.getElementById('downloadZipBtn').addEventListener('click', downloadProjectZip);

// Auto-preview on load
updatePreview();

// Smooth scroll from hero start button
const startBtn = document.getElementById('startBtn');
if(startBtn){
  startBtn.addEventListener('click', ()=>{
    document.getElementById('tutorial').scrollIntoView({behavior:'smooth'});
  });
}

// Load a friendly example into editors
const loadExampleBtn = document.getElementById('loadExampleBtn');
if(loadExampleBtn){
  loadExampleBtn.addEventListener('click', ()=>{
    const exampleHTML = `<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Alex — Personal Page</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <header>\n      <h1>Hi, I'm Alex</h1>\n      <p>I make small websites that teach people.</p>\n    </header>\n    <main>\n      <button id="hello">Say hello</button>\n    </main>\n    <script src="script.js"></script>\n  </body>\n</html>`;
    const exampleCSS = `body{font-family:Inter,Arial,sans-serif;padding:24px;background:#fff}h1{color:#0b63ff}`;
    const exampleJS = `document.addEventListener('DOMContentLoaded',()=>{ const b=document.getElementById('hello'); if(b) b.addEventListener('click',()=> alert('Hello from Alex!')); });`;
    document.getElementById('htmlEditor').value = exampleHTML;
    document.getElementById('cssEditor').value = exampleCSS;
    document.getElementById('jsEditor').value = exampleJS;
    updatePreview();
    document.getElementById('editorSection').scrollIntoView({behavior:'smooth'});
  });
}

// Open the preview HTML in a new tab using a data URL
const openExampleNewTab = document.getElementById('openExampleNewTab');
if(openExampleNewTab){
  openExampleNewTab.addEventListener('click', ()=>{
    const html = document.getElementById('htmlEditor').value;
    const css = '<style>' + document.getElementById('cssEditor').value + '</style>';
    const js = '<script>' + document.getElementById('jsEditor').value + '<' + '/script>';
    const full = html.replace('</head>', css + '</head>').replace('</body>', js + '</body>');
    // Use a Blob so modern browsers execute scripts reliably
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    // revoke the object URL after a delay to allow the new tab to load
    setTimeout(()=> URL.revokeObjectURL(url), 2000);
    if(!w) alert('Pop-up blocked. Allow pop-ups for this site to open the example.');
  });
}

// Auto-update preview while editing (debounced)
function debounce(fn, wait){ let t; return function(...args){ clearTimeout(t); t = setTimeout(()=> fn.apply(this,args), wait); }}
const inputs = ['htmlEditor','cssEditor','jsEditor'];
inputs.forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', debounce(updatePreview, 600));
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  const setTheme = (dark)=>{ if(dark) document.body.classList.add('theme-dark'); else document.body.classList.remove('theme-dark'); localStorage.setItem('theme-dark', dark? '1':'0') };
  const stored = localStorage.getItem('theme-dark') === '1';
  setTheme(stored);
  themeToggle.addEventListener('click', ()=>{ const isDark = !document.body.classList.contains('theme-dark'); setTheme(isDark); });
}

// Game preview update function
function updateGamePreview() {
  const html = document.getElementById('gameHtmlEditor').value;
  const css = '<style>' + document.getElementById('gameCssEditor').value + '</style>';
  const js = '<script>' + document.getElementById('gameJsEditor').value + '<' + '/script>';
  const frame = document.getElementById('gameFrame');
  const doc = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(html.replace('</head>', css + '</head>').replace('</body>', js + '</body>'));
  doc.close();
}

// Game preview button listener
const gamePreviewBtn = document.getElementById('gamePreviewBtn');
if(gamePreviewBtn){
  gamePreviewBtn.addEventListener('click', updateGamePreview);
}

// Auto-update game preview while editing (debounced)
const gameInputs = ['gameHtmlEditor','gameCssEditor','gameJsEditor'];
gameInputs.forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', debounce(updateGamePreview, 600));
});

// Initialize game preview on load
updateGamePreview();