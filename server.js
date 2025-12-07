const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

// Load data
const artists = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'artists.json')));
const galleries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'galleries.json')));
const paintings = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'paintings-nested.json')));


app.use(express.json());

// --- Paintings APIs ---

app.get('/api/paintings', (req, res) => {
  res.json(paintings);
});

app.get('/api/painting/:id', (req, res) => {
  const painting = paintings.find(p => p.id == req.params.id);
  if (!painting) return res.status(404).json({ message: "Painting not found" });
  res.json(painting);
});

app.get('/api/painting/gallery/:id', (req, res) => {
  const filtered = paintings.filter(p => p.galleryId == req.params.id);
  if (filtered.length === 0) return res.status(404).json({ message: "No paintings found for this gallery" });
  res.json(filtered);
});

app.get('/api/painting/artist/:id', (req, res) => {
  const filtered = paintings.filter(p => p.artistId == req.params.id);
  if (filtered.length === 0) return res.status(404).json({ message: "No paintings found for this artist" });
  res.json(filtered);
});

app.get('/api/painting/year/:min/:max', (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  const filtered = paintings.filter(p => p.yearOfWork >= min && p.yearOfWork <= max);
  if (filtered.length === 0) return res.status(404).json({ message: "No paintings found in this year range" });
  res.json(filtered);
});

app.get('/api/painting/title/:text', (req, res) => {
  const text = req.params.text.toLowerCase();
  const filtered = paintings.filter(p => p.title.toLowerCase().includes(text));
  if (filtered.length === 0) return res.status(404).json({ message: "No paintings found with this title" });
  res.json(filtered);
});

app.get('/api/painting/color/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const filtered = paintings.filter(p => p.dominantColors.some(c => c.name.toLowerCase() === name));
  if (filtered.length === 0) return res.status(404).json({ message: "No paintings found with this color" });
  res.json(filtered);
});

// --- Artists APIs ---

app.get('/api/artists', (req, res) => {
  res.json(artists);
});

app.get('/api/artists/:country', (req, res) => {
  const country = req.params.country.toLowerCase();
  const filtered = artists.filter(a => a.country.toLowerCase() === country);
  if (filtered.length === 0) return res.status(404).json({ message: "No artists found from this country" });
  res.json(filtered);
});

// --- Galleries APIs ---

app.get('/api/galleries', (req, res) => {
  res.json(galleries);
});

app.get('/api/galleries/:country', (req, res) => {
  const country = req.params.country.toLowerCase();
  const filtered = galleries.filter(g => g.country.toLowerCase() === country);
  if (filtered.length === 0) return res.status(404).json({ message: "No galleries found from this country" });
  res.json(filtered);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
