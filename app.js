const express = require("express");
const app = express();

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const nodemon = require("nodemon");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server/Database started Successfully");
    });
  } catch (e) {
    console.log(`Error! ${e.message}`);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getAllPlayerQuery = `
    SELECT *
    FROM cricket_team;
    `;
  const playersArray = await db.all(getAllPlayerQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  const { player_id, player_name, jersey_number, role } = playerDetails;

  const addPlayerQuery = `
INSERT INTO cricket_team
(player_id, player_name, jersey_number, role)
VALUES
(
    ${player_id},
    ${player_name},
    ${jersey_number},
    ${role}
);
`;
  const dbResponse = await db.run(addPlayerQuery);
  //   const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id = ${playerId};
  `;
  const playerDetails = await db.get(getPlayerQuery);
  response.send(playerDetails);
  console.log("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;

  const { playerId_, PlayerName, jerseyNumber, role } = playerDetails;

  const updatePlayerDetailsQuery = `
    UPDATE TABLE cricket_team
    SET
    player_id = ${playerId_},
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${playerId};
    `;
  await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
DELETE FROM cricket_team
WHERE player_id = ${playerId};
`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
