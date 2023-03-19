const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

const db = {};

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log('DATABASE:', db);
  next();
});

const sleep = async (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * seconds);
  });
};

app.get('/', async (req, res) => {
  res.json(db);
});

app.get('/tickets', async (req, res) => {
  const data = Object.keys(db).map((id) => {
    const register = db[id];
    const { title, description } = register;

    return {
      id,
      title,
      description,
    };
  });

  res.status(200).json(data);
});

app.get('/tickets/:id', async (req, res) => {
  const id = req.params.id;
  const ticket = db[id];
  res.status(200).json({ id, ...ticket });
});

app.post('/tickets', async (req, res) => {
  const id = Date.now();
  db[id] = req.body;
  res.status(201).json({ id: id });
});

app.patch('/tickets/:id', async (req, res) => {
  const id = req.params.id;
  const ticket = db[id];
  const { title, description } = req.body;
  db[id] = {
    title: title || ticket.title,
    description: description || ticket.description,
  };

  res.status(204).json();
});

app.delete('/tickets/:id', async (req, res) => {
  const id = req.params.id;
  delete db[id];
  res.status(204).json();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
