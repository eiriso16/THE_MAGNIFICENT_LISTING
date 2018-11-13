const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const localConnectionString = 'postgres://pohhgdgduosdgi:c6612987183717a2e99d6652a12dddcf5adde3f936f9d04ea1fb53dff51e34c1@ec2-54-217-236-201.eu-west-1.compute.amazonaws.com:5432/ddejijks57b50h';

const db = {} //må et objekt returneres fra modulen?

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
    }).catch(function(err){
      console.error(err);
    });

    for (let row in res.rows) {
      //console.log(res.rows[row]);
    //  console.log(JSON.stringify(res.rows[row]));
    }
    response = res.rows;
    await client.end();

  }

  catch (error) { /*error*/ }

  return response;
}

module.exports = db;