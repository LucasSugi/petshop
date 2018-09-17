//Variavel global que controla quais produtos sao exibidos
var showMoreProduct = 0;

/*
   Funcao que renderiza a pagina purchase_client.
   */
function loadPurchaseClientPage(){
	loadHTML('#contentSection', 'purchase_client', loadPurchaseClientResources);
}

/*
   Funcao que limpa todos os conteudos carregados na purchase_client page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearPurchaseClientPage(){
	$('#contentSection').empty();
	removeCSS('purchase_client');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadPurchaseClientResources(){

	//Pegando todos os produtos
	$.get('/products',function(data){
		let counter = 0;
		for(let i=showMoreProduct;i<showMoreProduct+4 && i<data.length;i++){
			if(data[i].obj){
				$('#divProduct').append('<div class="product" id="product' + counter + '"></div>');			
				$('#product'+counter).append('<img alt="foto do produto" class="postImage" src="' + data[i].obj.picture +  '">');
				$('#product'+counter).append('<h3>' + data[i].obj.name  +'</h3>');
				$('#product'+counter).append('<h3>' + 'R$ ' + data[i].obj.price  +'</h3>');
				$('#product'+counter).append('<button onclick="addCart'+counter+'();" class="inputStyle addProduct" type="submit">Adicionar ao carrinho</button>');
				counter++;
			}
		}		
	});
		
	//Trata o botao de mostrar mais 4 produtos
	$('#nextPage2').click(function(){
		//Apagando produtos atuais
		$('#divProduct').empty();	
		
		let counter = 0;
	
		$.get('/products',function(data){
			//Mostra os proximos 4 produtos
			showMoreProduct += 4;
			if(showMoreProduct>data.length){
				showMoreProduct -= 4;
			}
			for(let i=showMoreProduct;i<showMoreProduct+4 &&i<data.length;i++){
				if(data[i].obj){
					$('#divProduct').append('<div class="product" id="product' + counter + '"></div>');			
					$('#product'+counter).append('<img alt="foto do produto" class="postImage" src="' + data[i].obj.picture +  '">');
					$('#product'+counter).append('<h3>' + data[i].obj.name  +'</h3>');
					$('#product'+counter).append('<h3>' + 'R$ ' + data[i].obj.price  +'</h3>');
					$('#product'+counter).append('<button onclick="addCart'+counter+'();" class="inputStyle addProduct" type="submit">Adicionar ao carrinho</button>');
					counter++;
				}
			}
		});
	});
	
	//Trata o botao de mostrar os 4 produtos anteriores
	$('#nextPage1').click(function(){
		//Apagando produtos atuais
		$('#divProduct').empty();	
		
		let counter = 0;
		
		$.get('/products',function(data){	
			//Mostra os 4 produtos anteriores
			showMoreProduct -= 4;
			if(showMoreProduct<0){
				showMoreProduct = 0;
			}
			for(let i=showMoreProduct;i<showMoreProduct+4 &&i<data.length;i++){
				if(data[i].obj){
					$('#divProduct').append('<div class="product" id="product' + counter + '"></div>');			
					$('#product'+counter).append('<img alt="foto do produto" class="postImage" src="' + data[i].obj.picture +  '">');
					$('#product'+counter).append('<h3>' + data[i].obj.name  +'</h3>');
					$('#product'+counter).append('<h3>' + 'R$ ' + data[i].obj.price  +'</h3>');
					$('#product'+counter).append('<button onclick="addCart'+counter+'();" class="inputStyle addProduct" type="submit">Adicionar ao carrinho</button>');
					counter++;
				}
			}
		});
	});
		
	// Trata o clique no botao "Carrinho"
	$.getScript("./src/js/cart_client.js", function (){
		$('#linkCart').click(function (){
			alterPage('cart', clearCartClientPage, loadCartClientPage);
		});
	});
	// Trata o clique no botao "Home"
	$('#linkList').click(function (){
		alterPage('home', clearHomeProductPage, loadHomeProductPage);
	});
}

//Adiciona ao carrinho o produto 0
function addCart0(){
	$.get('/products',function(data){	
		addCart(data[showMoreProduct]);
	});
}

//Adiciona ao carrinho o produto 1
function addCart1(){
	$.get('/products',function(data){	
		addCart(data[showMoreProduct+1]);
	});
}

//Adiciona ao carrinho o produto 2
function addCart2(){
	$.get('/products',function(data){	
		addCart(data[showMoreProduct+2]);
	});
}

//Adiciona ao carrinho o produto 3
function addCart3(){
	$.get('/products',function(data){	
		addCart(data[showMoreProduct+3]);
	});
}

//Adiciona ao carrinho
function addCart(product){
	//Verificando se o carrinho ja existe para adicionar mais produtos
	$.get('/cartpurchase/'+objUser.obj.email,function(data){
		let exist = false;
		for(let i=0;i<data.length;i++){
			if(data[i].obj){
				//Verifica se o carrinho pertence ao usuario
				if(data[i].obj.idProduct == product._id){
					data[i].obj.qtd = parseInt(data[i].obj.qtd)+1;	
					//Atualiza
					$.post('/cartpurchase/update/',data[i]).done(function(data){
						if(data.data.ok == true){
							console.log("cartpurchase updated");
						}
					});
					exist = true;
					break;
				}
			}
		}
		if(exist == false){
			let  newCartPurchase = {
				email:objUser.obj.email,
				idProduct:product._id,
				qtd:1
			};
			$.get('/cartpurchase',function(data){
				let size = data.length+1;
				$.post('/cartpurchase/add/'+size,newCartPurchase).done(function(data){
					if(data.data.ok == true){
						console.log("cartpurchase added");
					}	
				});
			});
		}	
	});
}
