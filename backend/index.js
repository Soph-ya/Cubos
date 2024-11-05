import http from 'http';
import PG from 'pg';


const port = Number(process.env.PORT);

const client = new PG.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 5432,
});


let successfulConnection = false;

client.connect()
  .then(() => {
    successfulConnection = true;
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database not connected -', err.stack);
  });

http.createServer(async (req, res) => {
  console.log(`Request: ${req.url}`);

  if (req.url === "/api/") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);

    let result;

    try {
      const queryResult = await client.query("SELECT * FROM users");
      if (queryResult.rows.length > 0) {
        result = queryResult.rows[0];
      } else {
        console.log('No users found');
      }
    } catch (error) {
      console.error('Query error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database query failed' }));
      return;
    }

    const data = {
      database: successfulConnection,
      userAdmin: result?.role === "admin"
    }

    res.end(JSON.stringify(data));
  } else {
    res.writeHead(503);
    res.end("Internal Server Error");
  }

}).listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});