const { Client } = require("pg");
const Elo = require("elo-calculator");

// Elo engine, using same params as International Chess Federation (FIDE)
const elo = new Elo({
  rating: 1200,
  k: [40, 20, 10],
});
console.log("ELO engine ready.");

// Dictionary to store runner ELO and stats
const runners = {};
function getRunner(id) {
  var ans = runners[id];
  if (ans == null) {
    ans = {
      runner_id: id,
      elo: elo.createPlayer(),
      won: 0,
      draw: 0,
      lost: 0,
    };
    runners[id] = ans;
  }
  return ans;
}

async function run() {
  // Postgres connection
  const client = new Client();
  await client.connect();
  console.log("Connected to DB.");

  // Load votes
  var q = "SELECT * from elo.vote;";
  var votes = await client.query(q);
  votes = votes.rows;
  console.log("Num votes", votes.length);

  // Preparing updates
  var lastVote = null;
  var updates = [];
  for (var i = 0; i < votes.length; i++) {
    var vote = votes[i];
    if (lastVote == null || vote.time > lastVote) {
      lastVote = vote.time;
    }
    var runner1 = getRunner(vote.runner1);
    var runner2 = getRunner(vote.runner2);
    var result = vote.result;
    if (result === 0) {
      runner1.draw++;
      runner2.draw++;
      result = 0.5;
    } else if (result === 1) {
      runner1.won++;
      runner2.lost++;
      result = 1;
    } else if (result === 2) {
      runner1.lost++;
      runner2.won++;
      result = 0;
    }
    updates.push([runner1.elo, runner2.elo, result]);
  }
  console.log("Ready to calculate ratings");

  // Do the magic
  elo.updateRatings(updates);

  // Print results
  for (var id in runners) {
    var runner = runners[id];
    runner.rating = Math.round(runner.elo.rating);
    delete runner.elo;
    console.log(runner);
  }
  console.log("Last vote used", lastVote);

  // Update Postgres

  var q1 = "update elo.rating set previous_rating = rating ;";
  await client.query(q1);
  console.log("Updated previous ratings");

  var q2 =
    "INSERT INTO elo.rating(runner_id, rating, won, draw, lost) VALUES($1, $2, $3, $4, $5) ";
  q2 +=
    "ON CONFLICT(runner_id) DO UPDATE SET rating=$2, won=$3, draw=$4, lost=$5 ;";
  for (var id in runners) {
    var runner = runners[id];
    var params = [
      runner.runner_id,
      runner.rating,
      runner.won,
      runner.draw,
      runner.lost,
    ];
    await client.query(q2, params);
  }
  console.log("Updated ratings");

  var q3 = "INSERT INTO elo.elo_batch(last_vote) VALUES($1) ";
  await client.query(q3, [lastVote]);
  console.log("Updated batch");

  console.log("Done");

  await client.end();
}

run();
