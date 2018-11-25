const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const localConnectionString = 'postgres://dibyhwpyxdtsqk:2e9853a21210046b952b68c2c4c4a639a7320670c095b1a50c965f2ee250f16c@ec2-54-217-236-201.eu-west-1.compute.amazonaws.com:5432/dasffosd9vgdh9';

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
