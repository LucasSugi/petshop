/*
   Funcao que renderiza a pagina cart_client.
   */
function loadCartClientPage(){
	loadHTML('#contentSection', 'cart_client', loadCartClientResources);
}

/*
   Funcao que limpa todos os conteudos carregados na cart_client page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearCartClientPage(){
	$('#contentSection').empty();
	removeCSS('cart_client');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadCartClientResources(){

	//Carregando produtos
	$.get('/cartpurchase/'+objUser.obj.email,function(cart){
		for(let i=0;i<cart.length;i++){
			//Pega o produto associado ao carrinho
			$.get('/products/'+cart[i].obj.idProduct,function(product){
				insertCartPurchase(product,cart[i],i);	
			});			
		}	
	});

	// Trata o clique no botao "Comprar"
	$.getScript("./src/js/purchase_client.js", function (){
		$('#linkBuy').click(function (){
			alterPage('purchase', clearPurchaseClientPage, loadPurchaseClientPage);
		});
	});
	// Trata o clique no botao "Home"
	$('#linkList').click(function (){
		alterPage('home', clearHomeProductPage, loadHomeProductPage);
	});
	// Trata o clique no botao "Limpar Carrinho"
	$('#cleanPurchase').click(function (){
		$.get('/cartpurchase/'+objUser.obj.email,function(data){
			for(let i=0;i<data.length;i++){
				$.post('/cartpurchase/delete',data[i]).done(function(response){
					if(response.data.ok == true){
						console.log("clean cartpurchase");
					}
				});	
			}	
			$('#divCartProduct').empty();
			alterPage('home', clearHomeProductPage, loadHomeProductPage);
		});
	});
	// Trata o clique no botao "Finalizar Compra"
	$.getScript("./src/js/purchase_payment.js", function (){
		$('#finalizePurchase').click(function (){
			alterPage('purchasePay', clearPurchasePaymentPage, loadPurchasePaymentPage);
		});
	});
}

/*
 * Insere um produto no carrinho
 */
function insertCartPurchase(product,cart,index){
	let id = cart._id;
	$('#divCartProduct').append('<div class="product" id="cartProduct' + id  + '"></div>');	
	$('#cartProduct'+id).append('<img alt="Foto do Produto" class="postImage" src="' + product.obj.picture + '">');
	$('#cartProduct'+id).append('<h3>' + product.obj.name  + '</h3>');
	$('#cartProduct'+id).append('<h3>' + 'R$' + product.obj.price  + '</h3>');
	$('#cartProduct'+id).append('<input class="inputStyle1 removeProduct" onclick="remove('+id+');" type="submit" value="Remover produto">');
	$('#cartProduct'+id).append('<input class="inputStyle2" type="text" id="text'+id+'" value="'+ cart.obj.qtd + '">');
	$('#cartProduct'+id).append('<input class="inputStyle1 addProduct" onclick="changeAmountLess('+id+');" type="submit" value="<">');
	$('#cartProduct'+id).append('<input class="inputStyle1 addProduct" onclick="changeAmountMore('+id+');" type="submit" value=">">');
}
			
/*
  Remove o produto da pagina
*/
function remove(id){
	$.get('/cartpurchase/unique/'+id,function(data){
		$('#cartProduct'+id).remove();
		$.post('/cartpurchase/delete',data).done(function(response){
			if(data.data.ok == true){
				console.log("cartpurchase deleted");
			}
		});
	});
}

/*
  Aumenta a quatidade do produto
*/
function changeAmountMore(id){
	$.get('/cartpurchase/unique/'+id,function(data){
		data.obj.qtd++;
		$('#text'+id).val(data.obj.qtd);
		$.post('/cartpurchase/update',data).done(function(response){
			if(response.data.ok == true){
				console.log("cartpurchase updated");
			}
		});
	});
}

/*
  Diminui a quatidade do produto
*/
function changeAmountLess(id){
	$.get('/cartpurchase/unique/'+id,function(data){
		data.obj.qtd--;
		if(data.obj.qtd<1){
			data.obj.qtd = 1;
		}
		$('#text'+id).val(data.obj.qtd);
		$.post('/cartpurchase/update',data).done(function(response){
			if(response.data.ok == true){
				console.log("cartpurchase updated");
			}
		});
	});
}
