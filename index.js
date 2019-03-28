
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');

console.log("Data: " + Date.now().toString());

// connect to Mongo daemon
mongoose
  .connect(
    //'mongodb://mongo:27017/express-mongo',
    'mongodb://localhost:27017/express-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// building models, TODO: move this code into each schema file respectively

const SurveyTemplateModel = require('./models/SurveyTemplate');

const VehicleSaleModel = require('./models/VehicleSale');

const companyModel = require('./models/Company'); // ? implement this

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//app.use(express.static('client/build'));
app.use(express.static(path.join(__dirname, 'clientApp/build')));



/*
// Serve the static files from the React app, this may not necessarily be needed
app.use(express.static(path.join(__dirname, 'client/build')));
*/
//Post route

/********** UNPROTECTED ROUTES ************/

// TODO - THIS ONE
app.get('/api/tokenSurvey', (req, res) => {
  const token = req.query.token;

  if(token) {
    // use token to retrieve 

    console.log("token: " + token);

    VehicleSaleModel.findOne({ surveyToken: token }, (err, vehicle) => {
      
      if(vehicle && !vehicle.surveyCompleted) {

        console.log("retrieved vehicle " + vehicle.stockNumber + " " + vehicle.make);
        
        // get templateId
        const templateId = vehicle.templateId;
        
        // get survey template based on id
        SurveyTemplateModel.findOne({ templateId: templateId }, (err, template) => {

          if(template) {
            res.status(200).json({vehicle: vehicle, questions: template.data})
          } else if(err) {
            res.status(500).json(err);
          }
        });
      } else if(vehicle && vehicle.surveyCompleted) {
        res.json({
          error: "Survey already completed",
          completed: true          
        });
      } else {
        res.status(404).json({error: "Could not retreive survey"});
      }
    });
  } else {
    res.json({errCode: 3, errMsg: "Could not find survey"});
  }
});

app.post('/api/tokenSurvey', (req, res) => {
  console.log("received post survey request");

  const token = req.body.token;
  const answers = req.body.answers;

  console.log("token: " + token);
  
  // update vehiclerecord
  VehicleSaleModel.findOne({ surveyToken: token }, (err, vehicle) => {
    if(vehicle) {

      //res.json({ msg: "received answers" });
      
      var make = vehicle.make;
      var dateSold = vehicle.dateSold;

      console.log("vehicle props: make: " + make + " dateSold: " + dateSold);

      vehicle.surveyData = answers;
      vehicle.surveyCompleted = true;

      vehicle.save().then(err => {
        console.log("SUCCESS");
        res.json({msg: "success"});
      }); 
    }
    else {
      res.json({msg : "could not save survey"});
    }
  });  
});


// login

app.post('/api/login', (req, res) => {

  console.log("received login request");

  const username = req.body.Username;
  const password = req.body.Password;

  // use bcrypt to check password, for now just let it slide

  var token = uuidv4();

  res.json({msg: 'success', token: token});

});

// register 

app.post('/api/register', (req, res) => {
  console.log("received registration request");

  const token = req.body.RegToken; // special token sent by main administrator
  const username = req.body.Username;
  const password = req.body.Password;

  // authenticate RegToken
  
});

/// protection route here ------
/*
app.use((req, res, next) => {
  
  const token = req.header('AuthToken');

  console.log("Token = " + token);

  if(token == "abc123") {
    next();
  } else {
    res.status(401).json({err: "No token found"});
  }
});
*/



const isAuthenticated = (req, res, next) => {
  // do any checks you want to in here
  const token = req.header('AuthToken');


  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (token == "abc123") {
      return next();
  }
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  //res.redirect('/');
  res.status(401).json({err: "no token"});
}





// PROTECTED ROUTES FROM NOW ON *******************************/

// todo - use middleware to protect these routes

/********** TEMPLATE ROUTE **********/

app.post('/api/another', isAuthenticated, (req, res) => {
  console.log("received another request");

  var another = req.body.another;

  console.log("another = " + another);

  res.status(200).json({msg: "success"});
});

app.post('/api/template', isAuthenticated, (req, res) => {
  console.log("received post template request");

  var templateId = req.body.templateid;

  console.log("templateId: " + templateId);

  const data = JSON.parse(req.body.data);
  const description = req.body.description;
  const date = req.body.date;

  

  // check if templateId already exists,
  SurveyTemplateModel.findOne({ templateId: templateId }, (err, template) => {
    if(template) {
      res.json({failure : "templateId already exists"});
    } else {
      // create it
      const newTemplate = new SurveyTemplateModel({ 
    
        templateId : templateId,
        data: data,
        description : description,
        date: date

      });
    
      newTemplate.save().then(newTemplate => {
        console.log("created new db obj? " + newTemplate.templateId);
        //res.redirect('/');
        res.json({msg: 'success', token: newTemplate.templateId});
      });
    }
  });

  // if not, create new record based on this

});

app.get('/api/template', isAuthenticated, (req, res) => {
  console.log("received get template request");
  res.json({msg : "ok"});
});

/********** COMPANY ROUTE **********/

app.post('/api/company', isAuthenticated, (req, res) => {
  console.log("received post company request");
  res.json({msg : "ok"});
});

app.get('/api/company', isAuthenticated, (req, res) => {
  console.log("received get company request");
  res.json({msg : "ok"});
});

/********** VEHICLE SALE *********/

app.post('/api/vehicle', isAuthenticated, (req, res) => {

  /*

  surveydata: {
    type: Object,
    default: {}

  */

  var companyId = req.body.CompanyId; // int
  var stockNumber = req.body.StockNumber; // int
  var make = req.body.Make; // string
  var dateSold = req.body.DateSold; // string xxxx-xx-xx
  var templateId = req.body.TemplateId; // int

  // generate
  var token = uuidv4(); // for surveytoken

  console.log("received request");

  // try to find vehicle by stockNumber and companyId

  VehicleSaleModel.findOne({ companyId: companyId, stockNumber: stockNumber }, (err, vehicle) => {
    if(vehicle) {
      console.log("found vehicle");
      res.json({error: 'failure, vehicle already exists'});
    } else {
      console.log("did not find vehicle");

      const newVehicleSale = new VehicleSaleModel({
    
        surveyToken: token,
        stockNumber: stockNumber,
        companyId: companyId,
        make: make,
        templateId: templateId,
        dateSold: dateSold

      });
    
      newVehicleSale.save().then(item => {
        console.log("created new db obj? " + item.name);
        //res.redirect('/');
        res.json({msg: 'success', token: item.surveyToken});
      });
    }
  });
});

app.get('/api/allcompletedsurveys', isAuthenticated, (req, res) => {
  const companyId = req.query.companyId;

  VehicleSaleModel.find({ companyId: companyId, surveyCompleted: true }, (err, vehicles) => {
    if(vehicles) {
      vehicles.forEach(vehicle => {
        console.log(vehicle);
        
      });

      res.json(vehicles);
    }
  });
});

// get an array of all vehicles for a given companyId
app.get('/api/allvehicles', isAuthenticated, (req, res) => {
  const companyId = req.query.companyId;

  VehicleSaleModel.find({ companyId: companyId }, (err, vehicles) => {
    if(vehicles) {
      vehicles.forEach(vehicle => {
        console.log(vehicle);
        
      });

      res.json(vehicles);
    }
  });
});

app.get('/api/vehicle', isAuthenticated, (req, res) => {

  const companyId = req.query.companyId;
  const stockNumber = req.query.stockNumber;

  // return a given vehicle from its companyid and stockid or surveytoken?
  VehicleSaleModel.findOne({ companyId: companyId, stockNumber: stockNumber }, (err, vehicle) => {
    if(vehicle) {
      console.log("found vehicle");
      res.json(vehicle);
    } else {
      res.json({msg: "Could not find vehicle"});
    }
  });
});

/*
app.post('/api/manyvehicles', (req, res) => {
  
  // get json of request
  const vehicles = JSON.parse(req.body.vehicles);

  // should be an array of vehicle objects in javascript format
  vehicles.forEach(vehicle => {

  });

  // meh finish this later, it's not necessary


});
*/

// lets try finding, then deleting
app.delete('/api/vehicle', isAuthenticated, (req, res) => {
  const companyId = req.body.CompanyId; // int
  const stockNumber = req.body.StockNumber; // int

  VehicleSaleModel.findOneAndDelete({ companyId: companyId, stockNumber: stockNumber }, (err, resp) => {
    console.log(resp);
    res.json({resp: resp});
  });
});

/*
// for serving react production build
app.get('*', (req,res) =>{
  //res.sendFile(path.join(__dirname+'/client/build/index.html'));
  res.sendFile(path.join(__dirname + '/index.html'));
});
*/


//app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')));

app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname+'/clientApp/build/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Server running on port ' + port));