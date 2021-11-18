const fastify = require('fastify')({ logger: true })
const path = require('path');
const ethUtil = require('ethereumjs-util') ;

// Add cors allow
fastify.register(require('fastify-cors'), {}) ;

// Connect to Postgres
const { Client } = require('pg')
const client = new Client()
client.connect()


// Signature verification
function verifySignature(address, nonce, signature) {
    console.log('verifySignature') ;
    var msg = "Hi, I'd like to login into datascience.art\nTimestamp: "+nonce ;
    console.log('msg', msg) ;
    var msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    var msgBuffer = ethUtil.toBuffer(msgBufferHex);
    var msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    var signatureBuffer = ethUtil.toBuffer(signature);
    var signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    var publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    var addressBuffer = ethUtil.publicToAddress(publicKey);
    var signerAddress = ethUtil.bufferToHex(addressBuffer);

    console.log('signerAddress', signerAddress) ;
    console.log('address', address) ;
    // The signature verification is successful if the address provided matches the ecrecover public address
    return (address.toLowerCase() === signerAddress.toLowerCase()) ;
}


// Declare the main public route
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../app/build'),
  prefix: '/',
})


// Return current ratings
fastify.get('/ranking', async (request, reply) => {
    var q = 'SELECT * from elo.runner left join elo.rating on runner.id=rating.runner_id  order by rating desc;' ;
    client
        .query(q)
        .then(res => {reply.send(res.rows)})
        .catch(e => {
            console.error(e.stack);
            reply.send({status:'error'}) ;
        })
}) ;

// Return match history
fastify.get('/runner_history/:runnerId', async (request, reply) => {
    var q = 'select v.address, v.time, r1.name as runner1, r2.name as runner2, v.result ';
        q+= 'from elo.vote as v ' ;
        q+= 'inner join elo.runner as r1 on r1.id=v.runner1  ' ;
        q+= 'inner join elo.runner as r2 on r2.id=v.runner2 ' ;
        q+= 'where v.runner1=$1 or v.runner2=$1 ' ;
        q+= 'order by time ' ;
    var runnerId = request.params.runnerId ;
    client
        .query(q, [runnerId])
        .then(res => {reply.send(res.rows)})
        .catch(e => {
            console.error(e.stack);
            reply.send({status:'error'}) ;
        })
}) ;



// Return last update timestamp
fastify.get('/last_update_timestamp', async (request, reply) => {
    var q = 'SELECT max(last_vote) from elo.elo_batch ;' ;
    client
        .query(q)
        .then(res => {reply.send(res.rows[0].max)})
        .catch(e => {
            console.error(e.stack);
            reply.send({status:'error'}) ;
        })
}) ;

// Declare our json handling route
fastify.post('/submit_vote', async (request, reply) => {
    var data = request.body ;
    var address = data.address ;
    var nonce = data.nonce ;
    var signature = data.signature ;
    var verified = verifySignature(address, nonce, signature) ;
    if (!verified) {
        reply.send({status:'authentication error'}) ;
    }

    var q = 'INSERT INTO elo.vote(address, runner1, runner2, result) VALUES($1, $2, $3, $4) ;' ;
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
