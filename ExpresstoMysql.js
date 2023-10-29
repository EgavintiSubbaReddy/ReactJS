const mssql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbConfig = {
  host: 'localhost',
  database: 'hello',
  user: 'root',
  password: 'root',
  port: 3306
};

const mssqlconnection = mssql.createConnection(dbConfig);

function checkConnection() {
  console.log('Connected to the database......');
}

mssqlconnection.connect(checkConnection);

function processResults(error, results, response) {
  if (error) {
    console.error(error.errno);
    console.error(error.message);
    response.status(500).json({ error: error.message });
  } else {
    console.log(results);
    response.status(200).json(results);
  }
}

function displayAllUsers(request, response) {
  mssqlconnection.query('SELECT * FROM users', (error, results) => {
    processResults(error, results, response);
  });
}

app.get('/getAll', displayAllUsers);

function insertUser(request, response) {
  const { uid, password, emailid } = request.body;

  mssqlconnection.query(
    'INSERT INTO users (userid, password, emailid) VALUES (?, ?, ?)',
    [uid, password, emailid],
    (error) => {
      if (error) {
        console.error(error.errno);
        console.error(error.message);
        response.status(500).json({ error: error.message });
      } else {
        response.status(200).json({ message: 'Insert Successful' });
      }
    }
  );
}

app.post('/insertUser', (request, response) => {
  insertUser(request, response);
});

function deleteUser(request, response) {
  const userid = request.query.uid;

  mssqlconnection.query(
    'DELETE FROM users WHERE userid = ?',
    [userid],
    (error) => {
      if (error) {
        console.error(error.errno);
        console.error(error.message);
        response.status(500).json({ error: error.message });
      } else {
        response.status(200).json({ message: 'Delete Successful' });
      }
    }
  );
}

app.delete('/deleteUser', (request, response) => {
  deleteUser(request, response);
});

function updateUser(request, response) {
  const { uid, password, emailid } = request.body;

  mssqlconnection.query(
    'UPDATE users SET password = ?, emailid = ? WHERE userid = ?',
    [password, emailid, uid],
    (error) => {
      if (error) {
        console.error(error.errno);
        console.error(error.message);
        response.status(500).json({ error: error.message });
      } else {
        response.status(200).json({ message: 'Update Successful' });
      }
    }
  );
}

app.put('/updateUser', (request, response) => {
  updateUser(request, response);
});

app.listen(8001, () => {
  console.log('Open the browser and visit http://localhost:8001/welcome');
});
