const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const localConnectionString = '';

const db = {}

db.runQuery = async function(sql){
  const client = new Client({
    connectionString: connectionString || localConnectionString,
    ssl: true,
  });

  let response = null;

  try {
    await client.connect();

    let res = await client.query(sql).then(function(res){
      return res;
    });

    response = res.rows;
    await client.end();

  } catch (error) {
    console.log(error);
  }

  return response;
}

module.exports = db;
