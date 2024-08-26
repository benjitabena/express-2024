//http://localhost:3000/persons
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const uri = "mongodb+srv://benjabena56:4735290920071007@express-test.teijv.mongodb.net/?retryWrites=true&w=majority&appName=Express-test";


const client = new MongoClient(uri);

app.use(express.json());  

async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a la base de datos');
        return client.db('<dbname>');
    } catch (err) {
        console.error(err);
    }
}

// create/crear
app.post('/persons', async (req, res) => {
    const db = await connectDB();
    const newPerson = req.body;

    try {
        const result = await db.collection('persons').insertOne(newPerson);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el contacto', error: err });
    }
});

// read/leer/obtener
app.get('/persons', async (req, res) => {
    const db = await connectDB();

    try {
        const persons = await db.collection('persons').find({}).toArray();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los contactos', error: err });
    }
});

app.delete('/persons/:id', async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;

  try {
      const result = await db.collection('persons').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
          res.json({ message: 'Contacto eliminado' });
      } else {
          res.status(404).json({ message: 'Contacto no encontrado' });
      }
  } catch (err) {
      res.status(500).json({ message: 'Error al eliminar el contacto', error: err });
  }
});


app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
