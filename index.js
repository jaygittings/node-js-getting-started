const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces')

const { Pool } = require('pg')

const Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const PORT = process.env.PORT || 5001

function showTimes() {
  const times = process.env.TIMES || 5
  let result = ''
  for (i = 0; i < times; i++) {
    result += i + ' ' 
  }
  return result
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/db', (req, res) => {
    try {
      const client = await Pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error = " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
