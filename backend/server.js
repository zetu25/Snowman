

const express = require("express");
const app = express();

const port = 3000;

const { Connection, query } = require("stardog");

const databaseName = "database"

const conn = new Connection({
  username: "admin",
  password: "admin",
  endpoint: "http://localhost:5820",
});

const startRequest = 'SELECT ?cell (group_concat(?c3) as ?css)'
  + ' WHERE { ?cell a :Cell . OPTIONAL {?cell :css ?c1}'
  + ' BIND (exists{?cell :css ?c2} AS ?existsCSS ) '
  + ' BIND (IF(?existsCSS , ?c1, "free") as ?c3)}'
  + ' GROUP BY ?cell'
  + ' ORDER BY ?cell';

const requestResetCellPlayerPosition = " DELETE  {   ?player rdf:type :CellPlayer.}" +
  "INSERT {   ?player rdf:type :CellFree.   ?newPlayer rdf:type :CellPlayer.}" +
  "WHERE {   ?player rdf:type :CellPlayer." +
  "?newPlayer rdf:type :CellFree." +
  "?newPlayer :hasX ?xPlayer." +
  "?newPlayer :hasY ?yPlayer." +
  "VALUES ?xPlayer { 1 }." +
  "VALUES ?yPlayer { 1 }.}";

const requestResetCellSmallBallPosition = " DELETE  {   ?small rdf:type :CellSmallBall }" +
  "INSERT {   ?small rdf:type :CellFree.   ?newSmall rdf:type :CellSmallBall.}" +
  "WHERE {   ?small rdf:type :CellSmallBall. " +
  "?newSmall rdf:type :CellFree." +
  "?newSmall :hasX ?xSmall." +
  "?newSmall :hasY ?ySmall." +
  "VALUES ?xSmall { 2 }." +
  "VALUES ?ySmall { 2 }.}";

const requestResetCellMediumBallPosition = " DELETE  {   ?medium rdf:type :CellMediumBall.}" +
  "INSERT {   ?medium rdf:type :CellFree.   ?newMedium rdf:type :CellMediumBall.}" +
  "WHERE {   ?medium rdf:type :CellMediumBall." +
  "?newMedium rdf:type :CellFree." +
  "?newMedium :hasX ?xMedium." +
  "?newMedium :hasY ?yMedium." +
  "VALUES ?xMedium { 3 }." +
  "VALUES ?yMedium { 3 }}";

const requestResetCellBigBallPosition = " DELETE  {   ?big rdf:type :CellBigBall.}" +
  "INSERT {   ?big rdf:type :CellFree.   ?newBig rdf:type :CellBigBall.}" +
  "WHERE {   ?big rdf:type :CellBigBall." +
  "?newBig rdf:type :CellFree." +
  "?newBig :hasX ?xBig." +
  "?newBig :hasY ?yBig." +
  "VALUES ?xBig { 4 }." +
  "VALUES ?yBig { 4 }.}";

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());



app.get("/", async (req, res) => {
  let result = "";
  let myJson = "";


  await query
    .execute(
      conn,
      databaseName,
      startRequest,
      "application/sparql-results+json",
      {
        reasoning: true,
      }
    )
    .then(({ body }) => {
      result = body.results.bindings;
      myJson = JSON.stringify(result);

    });
  res.send(myJson);
});

app.get("/move/:direction", async (req, res) => {
  let direction = req.params.direction;
  let directionProperty =
    "has" + (direction.charAt(0).toUpperCase() + direction.slice(1));

  await query.execute(
    conn,
    databaseName,
    " DELETE  {   ?cellPlayer rdf:type :CellPlayer.   ?nextCell1 rdf:type ?class1.   ?nextCell2 rdf:type ?class2}  INSERT {   ?cellPlayer rdf:type :CellFree.   ?nextCell1 rdf:type :CellPlayer.   ?nextCell2 rdf:type ?class1}WHERE {	?cellPlayer rdf:type :CellPlayer.	?cellPlayer :" +
    directionProperty +
    " ?nextCell1.	{		VALUES ?class1 {:CellFree}		?nextCell1 rdf:type ?class1	}   UNION   {             VALUES ?class1 {:CellBigBall :CellSmallBall :CellMediumBall}      ?nextCell1 rdf:type ?class1.      ?nextCell1 :" +
    directionProperty +
    " ?nextCell2.      VALUES ?class2 {:CellFree }       ?nextCell2 rdf:type ?class2    }   UNION   {             VALUES ?class1 {:CellMediumBall}      ?nextCell1 rdf:type ?class1.      ?nextCell1 :" +
    directionProperty +
    " ?nextCell2.      VALUES ?class3 {:CellBigBall }       ?nextCell2 rdf:type ?class3   }   UNION   {             VALUES ?class1 {:CellSmallBall}      ?nextCell1 rdf:type ?class1.      ?nextCell1 :" +
    directionProperty +
    " ?nextCell2.      VALUES ?class3 {:CellHalfSnowman}       ?nextCell2 rdf:type ?class3   }}",
    "application/sparql-results+json",
    {
      reasoning: true,
    }
  );

  res.send("move");
});

app.get("/reset", async (req, res) => {
  //Reset player position
  await query.execute(
    conn,
    databaseName,
    requestResetCellPlayerPosition,
    {
      reasoning: true,
    }
  );

  //Reset feet position
  await query.execute(
    conn,
    databaseName,
    requestResetCellBigBallPosition,
    {
      reasoning: true,
    }
  );

  //Reset body position
  await query.execute(
    conn,
    databaseName,
    requestResetCellMediumBallPosition,
    {
      reasoning: true,
    }
  );

  //Reset head position
  await query.execute(
    conn,
    databaseName,
    requestResetCellSmallBallPosition,
    {
      reasoning: true,
    }
  );

  res.send("reset");
});


app.listen(port, () => {
  console.log("Le serveur est disponible sur le port "+port);
});
