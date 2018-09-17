/*
   Funcao que renderiza a pagina purchase_payment.
   */
function loadPurchasePaymentPage(){
	loadHTML('#contentSection', 'purchase_payment', loadPurchasePaymentResources);
}

/*
   Funcao que limpa todos os conteudos carregados na purchase_payment page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearPurchasePaymentPage(){
	$('#contentSection').empty();
	removeCSS('purchase_payment');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadPurchasePaymentResources(){
	
	//Adiciona os produtos do carrinho	
	addCartProduct();

	//Adiciona o endereco
	addAdress();
	
	//Inicialmente desabilita o botao de boleto
	$('#barcodeButton').prop('disabled',true);
		
	$('#credit').change(function(){
		$('#cardNumber').prop('disabled',false);
		$('#cardMonth').prop('disabled',false);
		$('#cardYear').prop('disabled',false);
		$('#cardCVV').prop('disabled',false);	
	});
	
	$('#cash').change(function(){
		$('#cardNumber').prop('disabled',true);
		$('#cardMonth').prop('disabled',true);
		$('#cardYear').prop('disabled',true);
		$('#cardCVV').prop('disabled',true);
	});

	// Trata o clique no botao "Editar (endereco)"
	$('#editAddressButton').click(function (event){
		event.preventDefault();
		$('#userAddress').prop('disabled',false);
		$('#userAddressDistrict').prop('disabled',false);
		$('#userAddressCity').prop('disabled',false);
		$('#userAddressState').prop('disabled',false);
		$('#userAddressCountry').prop('disabled',false);
	});
	// Trata o clique no botao "Cancelar"
	$('#returnButton').click(function (){
		/* Alerta de confirmacao ? */
		alterPage('product', clearHomeProductPage, loadHomeProductPage);
	});
	// Trata o clique no botao "Editar (parte inferior)"
	$('#editButton').click(function (){
		alterPage('cartClient', clearCartClientPage, loadCartClientPage);
	});
	// Trata o clique no botao "Confirmar"
	$('#confirmButton').click(function (event){
		event.preventDefault();
		validPurchase();
	});
}

/*
   Adiciona os produtos do carrinho no resumo.
*/
function addCartProduct(user){
	$.get('/cartpurchase/'+objUser.obj.email,function(cart){
		$.get('/products',function(product){
			let subtotal = 0;
			for(let i=0;i<cart.length;i++){
				for(j=0;j<product.length;j++){
					if(cart[i].obj.idProduct == product[j]._id){
						$('#purchaseSummaryTable').append('<tr id="purchaseSummaryTableRow'+i+'"></tr>');
						$('#purchaseSummaryTableRow'+i).append('<td>'+product[j].obj.name+'</td>');
						$('#purchaseSummaryTableRow'+i).append('<td>'+cart[i].obj.qtd+'</td>');
						let value = product[j].obj.price * cart[i].obj.qtd;
						subtotal += value;
						$('#purchaseSummaryTableRow'+i).append('<td>'+'R$ '+value+'</td>');
						break;		
					}
				}
			}	
			$('#freight').text('R$ '+subtotal*0.05);
			subtotal = subtotal + (subtotal*0.05);
			$('#purchaseTotalValue').text('R$ '+subtotal);
		});
	});	
}

/*
   Adiciona o endereço do usuário.
*/
function addAdress(user){
	$('#userAddress').val(objUser.obj.address);
	$('#userAddressDistrict').val(objUser.obj.district);
	$('#userAddressCity').val(objUser.obj.city);
	$('#userAddressState').val(objUser.obj.state);
	$('#userAddressCountry').val(objUser.obj.country);
}

/*
   Valida os dados do cartão de crédito.
*/
function validPurchase(){
	
	let ok = true;

	//Verifica se o cartao de credito esta selecionado
	if($('#credit').is(':checked')){
		//Verifica se os campos estao corretos
		if($('#cardMonth').val()<1 || $('#cardMonth')>12){
			alert("Mês do cartão está incorreto.");	
			ok = false;
		}
		if($('#cardYear').val()<18 || $('#cardYear')>30){
			alert("Ano do cartão está incorreto.");	
			ok = false;
		}
		if($('#cardCVV').val()<1 || $('#cardCVV')>999){
			alert("CVV do cartão está incorreto.");	
			ok = false;
		}

		//Expressoes regulares
		let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
		let mastercard = new RegExp('^5[1-5][0-9]{14}$');

		//Checando o numero do cartao de credito
		if( visa.exec($('#cardNumber').val()) == null && mastercard.exec($('#cardNumber').val()) == null){
			alert("Número do cartão está incorreto.");
			ok = false;
		}
	}		
		
	//Finaliza a compra	
	if(ok == true){		
		//Endereco
		let userAddress = $('#userAddress').val();
		let userDistrict = $('#userAddressDistrict').val();
		let userCity = $('#userAddressCity').val();
		let userState = $('#userAddressState').val();
		let userCountry = $('#userAddressCountry').val();
		let obj = {address:userAddress,district:userDistrict,city:userCity,state:userState,country:userCountry};
		deletePurchase();
		createSolicitation(obj);		
	}
}

/*
   Deleta os produtos do carrinho.
*/
function deletePurchase(){
	$.get('/cartpurchase/'+objUser.obj.email,function(data){
		for(let i=0;i<data.length;i++){
			updateAmount(data[i].obj.idProduct,data[i].obj.qtd);
			$.post('/cartpurchase/delete',data[i]).done(function(response){
				if(response.data.ok == true){
					console.log("clean cartpurchase");
				}
			});	
		}	
	});
}

/*
   Atualiza a quantidade do produto vendido.
*/
function updateAmount(id,qtd){
	$.get('/products/'+id,function(data){
		data.obj.soldAmount = parseInt(data.obj.soldAmount)+parseInt(qtd);
		$.post('/products/update',data).done(function(response){
			if(response.data.ok == true){
				console.log("product updated");
			}
		});
	});
}

/*
   Cria um novo pedido.
*/
function createSolicitation(obj){
	
	$.get('/cartpurchase/'+objUser.obj.email,function(cart){
		$.get('/products',function(product){
			let total = 0;
			for(let i=0;i<cart.length;i++){
				for(let j=0;j<product.length;j++){
					if(cart[i].obj.idProduct == product[j]._id){
						total += cart[i].obj.qtd * product[j].obj.price;
						break;
					}	
				}
			}	
		
			//Somando total ao frete
			total = total + (total*0.05);
			
			//Dia para entrega
			let d = new Date();
			let currentDay = d.getDate();
			let currentMonth = d.getMonth() + 1;
			if(currentDay+10>31){
				currentDay = 10 - (31-currentDay);
				currentMonth++;
			}
			else{
				currentDay += 10;	
			}
			
			if($('#credit').is(':checked')){
				alert("Compra realizada com sucesso.");
				$.post('/solicitation',{email:objUser.obj.email,situation:"'Enviado para transporte",tracking:'-',day:currentDay,month:currentMonth,value:total,address:obj.address,district:obj.district,city:obj.city,state:obj.state,country:obj.country}).done(function(response){
					console.log("solicitation added");
					alterPage('product', clearHomeProductPage, loadHomeProductPage);
				});
			}
			else{
				alert("Compra realizada com sucesso. Seu boleto foi enviado para o email.");
				$.post('solicitation',{email:objUser.obj.email,situation:"Aguardando pagamento",tracking:"-",day:currentDay,month:currentMonth,value:total,address:obj.address,district:obj.district,city:obj.city,state:obj.state,country:obj.country}).done(function(response){
					console.log("solicitation added");
					alterPage('product', clearHomeProductPage, loadHomeProductPage);
				});
			}
		});
	});	
}
