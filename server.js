// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://@ds044689.mlab.com:44689/jct', {
      user: "db_backend",
      pass: "password123",
      useMongoClient: true
    });

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =================
    var Ticket = mongoose.model('Ticket', {
      subject : String,
      body : String
    });

    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all tickets
    app.get('/api/tickets', function(req, res) {
        // use mongoose to get all tickets in the database
        Ticket.find(function(err, tickets) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(tickets); // return all tickets in JSON format
        });
    });
      
    // create ticket and send back all tickets after creation
    app.post('/api/tickets', function(req, res) {

        // create a ticket, information comes from AJAX request from Angular
        Ticket.create({
            subject : req.body.text,
            body : req.body.text,
            done : false
        }, function(err, ticket) {
            if (err)
                res.send(err);

            // get and return all the tickets after you create another
            Ticket.find(function(err, tickets) {
                if (err)
                    res.send(err)
                res.json(tickets);
            });
        });

    });

    // delete a ticket
    app.delete('/api/tickets/:ticket_id', function(req, res) {
        Ticket.remove({
            _id : req.params.ticket_id
        }, function(err, ticket) {
            if (err)
                res.send(err);

            // get and return all the tickets after you create another
            Ticket.find(function(err, tickets) {
                if (err)
                    res.send(err)
                res.json(tickets);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

