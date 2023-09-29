const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal acccucc.
const PRIVATE_APP_ACCESS = "pat-na1-61a47881-66e7-4fa2-88a6-5dacbc51c360";
const BASE_URL = 'https://api.hubapi.com';
const objectType = 'p43972018_nfl_players';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
  const customObjs = `${BASE_URL}/crm/v3/objects/${objectType}?limit=10&properties=name&properties=college&properties=position&properties=team&archived=false`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(customObjs, { headers });
    const data = response.data.results;

    res.render('homepage', {title: "Players | Cesar's Practicum", data})
  } catch (error) {   
    console.error(error) 
  }

})


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
  res.render('updates', {title: "Update Custom Object Form | Integrating with HubSpot I Practicum"})
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  const playerId = req.query.playerId;
  const body = {
    properties: {
      'name': req.body.name,
      'position': req.body.position,
      'college': req.body.college,
      'team': req.body.team
    }
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  }

  try {
   if(playerId) {
      const updatePlayer = `${BASE_URL}/crm/v3/objects/${objectType}/${playerId}`;
      await axios.patch(updatePlayer, body, {headers})
    } else {
      const createPlayer = `${BASE_URL}/crm/v3/objects/${objectType}/`
      await axios.post(creatPlayer, body, {headers})
    } 
  } catch (error) {
    console.error(error)  
  }

  res.redirect('/')
})

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
