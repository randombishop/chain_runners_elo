const fastify = require('fastify')({ logger: true })
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Add cors allow
fastify.register(require('fastify-cors'), {}) ;

// Connect to Postgres
const { Client } = require('pg')
const client = new Client()
client.connect()


// Declare the main public route
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../app/build'),
  prefix: '/',
})


// Return current ratings
fastify.get('/ranking', async (request, reply) => {
    var q = 'SELECT * from elo.runner inner join elo.rating on runner.id=rating.runner_id  order by rating desc;' ;
    client
        .query(q)
        .then(res => {reply.send(res.rows)})
        .catch(e => {
            console.error(e.stack);
            reply.send({status:'error'}) ;
        })
}) ;

// Declare our json handling route
fastify.post('/submit_vote', async (request, reply) => {
    var q = 'INSERT INTO elo.vote(address, runner1, runner2, result) VALUES($1, $2, $3, $4) ;' ;
    var data = request.body ;
    var address = data.address ;
    if (address==null) {
        address="anon" ;
    }
    var runner1 = data.runner1 ;
    var runner2 = data.runner2 ;
    var result = data.result ;
    var params = [address, runner1, runner2, result] ;
    client
        .query(q, params)
        .then(res => {reply.send({status:'ok'}) ;})
        .catch(e => {
            console.error(e.stack);
            reply.send({status:'error'}) ;
        })
}) ;

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3001)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
