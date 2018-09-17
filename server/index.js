const path = require('path');
const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const database = require('./database');

// Allows this server to provide static resources to user
app.use(express.static(path.join(__dirname, '../public')));

// Allows this server to use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// GET Request to '/'
app.get('/', function (request, response){
    response.sendFile('index.html');
});

//Create database
database.createDatabase();

/*
    USERS
*/

// GET Request to '/users/:userId'
app.get('/users/:userId', function (request, response){
    // Gets the desired user data and responses it
    database.getDocument("user",request.params.userId,response);
});

//GET Request to '/users'
app.get('/users',function(request,response){
	database.getAllDocument("user",response);
});

//GET Request to '/user/:email'
app.get('/user/:email',function(request,response){
	database.getAllDocumentFilter("user",request.params.email,response);
});

// POST Request to '/users'
app.post('/users/update', function (request, response){
    database.updateDocument("user",request.body,response);
});

// POST Request to '/users'
app.post('/users/add', function (request, response){
    database.insertDocument("user",request.body,response);
});


/*
    PRODUCTS
*/

// GET Request to '/products/priorities'
app.get('/products/priorities', function (request, response){
    database.getAllDocument("product",response);
});

// GET Request to '/products'
app.get('/products', function (request, response){
    database.getAllDocument("product",response);
});

// GET Request to '/products'
app.get('/products/:id', function (request, response){
    database.getDocument("product",request.params.id,response);
});

// POST Request to '/products/update'
app.post('/products/update', function (request, response){
    database.updateDocument("product",request.body,response);
});

// POST Request to '/products/add'
app.post('/products/add', function (request, response){
    database.insertDocument("product",request.body,response);
});

/*
    SERVICES
*/

// *** GET Request to '/services'
app.get('/services', function (request, response){
    database.getAllDocument("service",response);
});

// GET Request to '/services/priorities'
app.get('/services/priorities', function (request, response){
    database.getAllDocument("service",response);
});

// GET Request to '/services/:idService'
app.get('/services/:idService', function (request, response){
    database.getDocument("service",request.params.idService,response);
});

app.post('/services/:idService', function (request, response){
    database.updateDocument("service",request.body,response);
});

// POST Request to '/services/add'
app.post('/services/add', function (request, response){
    database.insertDocument("service",request.body,response);
});

/*
    ANIMALS
*/

// GET Request to '/animal/user/:email'
app.get('/animal/user/:email', function (request, response){
    database.getAllDocumentFilter("animal",request.params.email,response);
});

// GET Request to '/animal/:idAnimal'
app.get('/animal/:idAnimal', function (request, response){
    database.getDocument("animal",request.params.idAnimal,response);
});

// POST Request to '/animal/update'
app.post('/animal/update', function (request, response){
    database.updateDocument("animal",request.body,response);
});

// POST Request to '/animal/add'
app.post('/animal/add', function (request, response){
    database.insertDocument("animal",request.body,response);
});

/*
    SCHEDULING
*/
// GET Request to '/scheduling/user/:email'
app.get('/scheduling/user/:email', function (request, response){
    database.getAllDocumentFilter("scheduling",request.params.email,response);
});

//*** GET Request to '/scheduling'
app.get('/scheduling', function (request, response){
    database.getAllDocument("scheduling",response);
});

// POST Request to '/scheduling/update'
app.post('/scheduling/update', function (request, response){
    database.updateDocument("scheduling",request.body,response);
});

// POST Request to '/scheduling/add'
app.post('/scheduling/add', function (request, response){
    database.insertDocument("scheduling",request.body,response);
});

// POST Request to '/scheduling/delete'
app.post('/scheduling/delete', function (request, response){
    database.deleteDocument("scheduling",request.body,response);
});

/*
    SOLICITATION
*/
// GET Request to '/solicitation/user/:email'
app.get('/solicitation/user/:email', function (request, response){
    database.getAllDocumentFilter("solicitation",request.params.email,response);
});

// POST Request to '/solicitation'
app.post('/solicitation', function (request, response){
    database.insertDocument("solicitation",request.body,response);
});

/*
    CARTPURCHASE
*/
// GET Request to '/cartpurchase'
app.get('/cartpurchase', function (request, response){
    database.getAllDocument("cartpurchase",response);
});

// GET Request to '/cartpurchase/unique/:id'
app.get('/cartpurchase/unique/:id', function (request, response){
    database.getDocument("cartpurchase",request.params.id,response);
});

// GET Request to '/cartpurchase/:email'
app.get('/cartpurchase/:email', function (request, response){
    database.getAllDocumentFilter("cartpurchase",request.params.email,response);
});

// POST Request to '/cartpurchase/add'
app.post('/cartpurchase/add/:id', function (request, response){
    database.insertDocumentKey("cartpurchase",request.body,request.params.id,response);
});

// POST Request to '/cartpurchase/update'
app.post('/cartpurchase/update', function (request, response){
    database.updateDocument("cartpurchase",request.body,response);
});

// POST Request to '/cartpurchase/delete'
app.post('/cartpurchase/delete', function (request, response){
    database.deleteDocument("cartpurchase",request.body,response);
});

// Listening on 8081
app.listen('8081', () => console.log('Server listening on 8081.'));
