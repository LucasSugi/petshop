//Package couchdb
const nodeCouchdb = require("node-couchdb");

//Package http
const http = require("http");

//Instance of couchdb with default parameters
const couchdb = new nodeCouchdb();

/*
 * Insert data animal inside database
 */
function insertDataAnimal(){
	//INSERT ANIMAL
	insertDocumentTest("animal",{email:"teste@gmail.com", name:"Lua", breed:"Ragdoll", age:5, picture:"./src/images/animals/cat0.jpg"});
	insertDocumentTest("animal",{email:"teste@gmail.com", name:"Fly", breed:"Siberiano", age:6, picture:"./src/images/animals/cat3.jpg"});
	insertDocumentTest("animal",{email:"teste@gmail.com", name:"Cloe", breed:"Persa", age:8, picture:"./src/images/animals/cat4.jpg"});
	insertDocumentTest("animal",{email:"teste@gmail.com", name:"Belie", breed:"Husky Siberiano", age:1, picture:"./src/images/animals/dog0.jpg"});
}

/*
 * Insert data user inside database
 */
function insertDataUser(){
	//INSERT USER
	insertDocumentTest("user",{email:"teste@gmail.com",password:"123456", name:"Teste", cpf:"000.000.000-00", tel:"(00)00000-0000", address:"Endereço teste", district:"Bairro teste", city:"Cidade teste", state:"Estado teste", country:"Pais teste", adm:false});
	insertDocumentTest("user",{email:"admin@gmail.com",password:"admin123", name:"Kelvin Adm", cpf:"473.244.828-31", tel:"(11)99785-9056", address:"Av. Nicolau Vinicius Parodi", district:"Cecap", city:"Itatiba", state:"Sao Paulo", country:"Brasil", adm:true});
}

/*
 * Insert data service inside database
 */
function insertDataService(){
//INSERT SERVICE
	insertDocumentTest("service",{name:"Banho",price:30, description:"Banho em animais", picture:"./src/images/services/shower.png", scheduledAmount:0, priority:1});
	insertDocumentTest("service",{name:"Tosa",price:40, description:"Tosa em animais", picture:"./src/images/services/cut.png", scheduledAmount:0, priority:2});
	insertDocumentTest("service",{name:"Veterinário",price:35, description:"Veterinário para animais", picture:"./src/images/services/vet.png", scheduledAmount:0, priority:3});
	insertDocumentTest("service",{name:"Leva e traz",price:10, description:"Leva e traz animais", picture:"./src/images/services/van.png", scheduledAmount:0, priority:4});
}

/*
 * Insert data product inside database
 */
function insertDataProduct(){
	//INSERT PRODUCTS
	insertDocumentTest("product",{name:"Anti-Inflamatório",brand:"Flamavet", price:16, vality:"01/12/18", stock:30, description:"Anti-Inflamatório para gatos", picture:"./src/images/products/anti_inflamatorio.jpg", soldAmount:0, priority:0});
	insertDocumentTest("product",{name:"Anti-Pulgas",brand:"Capstar", price:13, vality:"01/12/18", stock:50, description:"Anti-Pulgas para cães e gatos", picture:"./src/images/products/antipulgas.jpg", soldAmount:0, priority:0});
	insertDocumentTest("product",{name:"Bebedouro/Comedouro",brand:"IdealDog", price:60, vality:"01/06/25", stock:100, description:"Bebedouro e comedouro para cães", picture:"./src/images/products/bebedouro_comedouro.jpg", soldAmount:0, priority:0});
	insertDocumentTest("product",{name:"Bebedouro",brand:"IdealDog", price:40, vality:"01/06/25", stock:100, description:"Bebedouro para cães", picture:"./src/images/products/bebedouros.jpg", soldAmount:0, priority:0});
	insertDocumentTest("product",{name:"Bolinha de brinquedo",brand:"DiBicho", price:5, vality:"01/06/19", stock:70, description:"Bolinha para cães", picture:"./src/images/products/bolinha_brinquedo.jpg", soldAmount:0, priority:-1});
}

/*
 * Create a view for one database
 * databaseName: Database's name that we want to create the view
 */
function createView(databaseName,filter){
	//JSON string that we want to send
	var postData = '{"language":"javascript","views":{"'+databaseName+'":{"map":"function(doc) {if(doc.obj.'+filter+'){emit(doc.obj.'+filter+',doc)}}"}}}'; 
		
	//Options to connect in couchdb
	var tempString = "/" + databaseName + "/_design/query"
	const options = {
		host: 'localhost',
		port: 5984,
		path: tempString,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
		
	//Request
	var req = http.request(options,function(res){
		res.setEncoding('utf8');

		//Get the response
		var data = '';
		res.on('data', d => data += d);
		res.on('end', () => {});
	});

	//Verify if has error in request
	req.on('error', (e) => {
	  console.log(`Houve um erro: ${e.message}`);
	});

	//Send data
	req.write(postData);

	//Finish
	req.end();
}

/*
 * Create database
 */
function createDatabase(){
	//Check if database exist
	couchdb.listDatabases().then(function(dbs){
		var existAnimal = existCartPurchase = existProduct = existScheduling = existService = existSolicitation = existUser = false;
		for(var i=0;i<dbs.length;i++){
			if(dbs[i] == "animal"){
				existAnimal = true;
			}
			else if(dbs[i] == "cartpurchase"){
				existCartPurchase = true;
			}
			else if(dbs[i] == "product"){
				existProduct = true;
			}	
			else if(dbs[i] == "scheduling"){
				existScheduling = true;
			}	
			else if(dbs[i] == "service"){
				existService = true;
			}	
			else if(dbs[i] == "solicitation"){
				existSolicitation = true;
			}	
			else if(dbs[i] == "user"){
				existUser = true;
			}
		}
		//If not exist then create database animal
		if(!existAnimal){
			couchdb.createDatabase("animal").then(function(){
				createView("animal","email");
				insertDataAnimal();
				console.log("animal created");
			}, function(err){
				console.log("Erro 133");
			});	
		}
		else{
			console.log("Database animal has already been created");
		}
		//If not exist then create database cartpurchase
		if(!existCartPurchase){
			couchdb.createDatabase("cartpurchase").then(function(){
				createView("cartpurchase","email");
				console.log("cartpurchase created");
			}, function(err){
				console.log("Erro 145");
			});	
		}
		else{
			console.log("Database cartpurchase has already been created");
		}
		//If not exist then create database product
		if(!existProduct){
			couchdb.createDatabase("product").then(function(){
				createView("product","name");
				insertDataProduct();
				console.log("product created");
			}, function(err){
				console.log("Erro 158");
			});	
		}
		else{
			console.log("Database product has already been created");
		}				
		//If not exist then create database service
		if(!existService){
			couchdb.createDatabase("service").then(function(){
				createView("service","name");
				insertDataService();
				console.log("service created");
			}, function(err){
				console.log("Erro 171");
			});	
		}
		else{
			console.log("Database service has already been created");
		}	
		//If not exist then create database user
		if(!existUser){
			couchdb.createDatabase("user").then(function(){
				createView("user","email");
				insertDataUser();
				console.log("user created");
			}, function(err){
				console.log("Erro 184");
			});	
		}
		else{
			console.log("Database user has already been created");
		}
		//If not exist then create database scheduling
		if(!existScheduling){
			couchdb.createDatabase("scheduling").then(function(){
				createView("scheduling","email");
				console.log("scheduling created");
			}, function(err){
				console.log("Erro 196");
			});	
		}
		else{
			console.log("Database scheduling has already been created");
		}
		//If not exist then create database solicitation
		if(!existSolicitation){
			couchdb.createDatabase("solicitation").then(function(){
				createView("solicitation","email");
				console.log("solicitation created");
			}, function(err){
				console.log("Erro 208");
			});	
		}
		else{
			console.log("Database solicitation has already been created");
		}			
	},function(err){
		console.log("Erro 215");
	});
}

/*
 * Insert a document in database
 * databaseName: Name of the database in which we want to insert the document
 * object: Object that we want to insert
 * key: key that object use
 * res: Node's event that is used to send the response
 */
function insertDocumentKey(databaseName,object,key,res){
	couchdb.insert(databaseName,{
		_id:key,
		obj: object
	}).then(function(response){
		res.send(response);	
	},function(err){
		res.send(err);
	});
}

/*
 * Insert a document in database
 * databaseName: Name of the database in which we want to insert the document
 * object: Object that we want to insert
 * res: Node's event that is used to send the response
 */
function insertDocument(databaseName,object,res){
	couchdb.uniqid().then(function(ids){
		couchdb.insert(databaseName,{
			_id:ids[0],
			obj: object
		}).then(function(response){
			res.send(response);	
		},function(err){
			res.send(err);
		});
	});
}

/*
 * Insert a document in database
 * databaseName: Name of the database in which we want to insert the document
 * object: Object that we want to insert
 */
function insertDocumentTest(databaseName,object){
	couchdb.uniqid().then(function(ids){
		couchdb.insert(databaseName,{
			_id:ids[0],
			obj: object
		}).then(function(response){},function(err){
			console.log("Erro 267");
		});
	});
}

/*
 * Get all documents from database
 * databaseName: Name of the database in which we want to get the documents
 * res: Node's event that is used to send the response
 */
function getAllDocument(databaseName,res){
	couchdb.get(databaseName,"_all_docs?include_docs=true").then(function(response){
		var objs = response.data.rows;	
		var vector = [];
		for(var i=0;i<response.data.total_rows;i++){
			vector.push(objs[i].doc);
		}
		res.send(vector);
	},function(err){
		res.send(err);
	});
}

/*
 * Get all document from database with filter
 * res: Node's event that is used to send the res
 */
function getAllDocumentFilter(database,filter,res){
	var path = "_design/query/_view/" + database + "?key=" + "%22" + filter + "%22"
	couchdb.get(database,path).then(function(response){
		var objs = response.data.rows;
		var vector = [];
		for(var i=0;i<objs.length;i++){
			vector.push(objs[i].value);
		}
		res.send(vector);
	},function(err){
		res.send(err);
	});
}

/*
 * Get a document from database
 * databaseName: Name of the database in which we want to get the document
 * res: Node's event that is used to send the response
 */
function getDocument(databaseName,id,res){
	couchdb.get(databaseName,id).then(function(response){
		var object = response.data;
		res.send(object);
	},function(err){
		res.send(err);
	});
}

/*
 * Update one document
 * databaseName: Name of the database in which we want to update the document
 * object: Object that we want to update
 * res: Node's event that is used to send the response
 */
function updateDocument(databaseName,object,res){
	couchdb.update(databaseName,object).then(function(response){
		res.send(response);
	},function(err){
		res.send(err);
	});
}

/*
 * Delete one document
 * databaseName: Name of the database in which we want to delete the document
 * object: Object that we want to delete
 * res: Node's event that is used to send the response
 */
function deleteDocument(databaseName,object,res){
	couchdb.del(databaseName,object._id,object._rev).then(function(response){
		res.send(response);
	},function(err){
		res.send(err);
	});
}

//Export function
module.exports = {
	createDatabase: createDatabase,
	insertDocument: insertDocument,
	insertDocumentKey: insertDocumentKey,
	getAllDocument: getAllDocument,
	getAllDocumentFilter: getAllDocumentFilter,
	getDocument: getDocument,
	updateDocument: updateDocument,
	deleteDocument: deleteDocument,
};


/*
MODELO DO BANCO

Animal = {email:, name:, breed:, age:, picture:} 
CartPurchase = {email:, idProduct:, qtd:}
Product = {name:, brand:, price:, vality:, stock:, description:, picture:, soldAmount:, priority:}
Scheduling = {email:, day:, month:, hour:, idAnimal:, idService:}
Service = {name:, price:, description:, picture:, scheduledAmount:, priority:}
Solicitation = {email:,situation:, tracking:, day:, month:, value:} 
User = {email:, password:, name:, cpf:, tel:, adress:, district:, city:, state:, country:, adm:}
*/
