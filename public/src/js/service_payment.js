/*
   Funcao que renderiza a pagina service_payment.
   */
function loadServicePaymentPage(s){
	loadHTML('#contentSection', 'service_payment', loadServicePaymentResources);
	newScheduling = s;
}

/*
   Funcao que limpa todos os conteudos carregados na service_payment page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearServicePaymentPage(){
	$('#contentSection').empty();
	removeCSS('service_payment');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadServicePaymentResources(){
	
	//Carregando os dados do agendamento	
	$.get('/services', function(data){
		for(let i=0;i<data.length;i++){
			if(data[i].obj && data[i]._id == newScheduling.idService){
				let date = newScheduling.day + '/' + newScheduling.month;
				let hour = newScheduling.hour;
				$('#servicesSummaryTableRow1').append('<td>'+date+'</td>');
				$('#servicesSummaryTableRow1').append('<td>'+hour+'</td>');
				$.get('/animal/'+newScheduling.idAnimal, function(animal){					
					$('#servicesSummaryTableRow1').append('<td>'+animal.obj.name+'</td>');
					$('#servicesSummaryTableRow1').append('<td>'+data[i].obj.name+'</td>');
					$('#servicesSummaryTableRow1').append('<td>'+'R$ '+data[i].obj.price+'</td>');
					$('#serviceTotalValue').text('R$ '+data[i].obj.price);
				});								
			}
		}
	});
	
	//Desativando botao
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
	 
	// Trata o clique no botao "Cancelar"
	$('#returnButton').click(function (){
		alterPage('service', clearHomeServicePage, loadHomeServicePage);
	});
	// Trata o clique no botao "Editar"
	$('#editButton').click(function (){
		alterPage('serviceReg', clearRegisterServicePage, loadRegisterServicePage,newScheduling);
	});
	// Trata o clique no botao "Confirmar"
	$('#confirmButton').click(function (event){
		event.preventDefault();
		validData();	
	});
}

/*
	Valida se os dados estão corretos para armazenamento.
*/
function validData(){
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
	
	//Se ok entao armazena
	if(ok == true){
		//Atualizando a quantidade de serviços solicitados
		$.get('/services/'+newScheduling.idService, function (data){			
			(data.obj.scheduledAmount)++;
			$.post('/services/'+newScheduling.idService, data).done(function(response){
				if(response.data.ok){
					if($('#credit').is(':checked')){
						$.post('/scheduling/add', newScheduling).done(function(res){
							alert('Agendamento confirmado.');
							alterPage('service', clearHomeServicePage, loadHomeServicePage);	
						});						
					}
					else{
						$.post('/scheduling/add', newScheduling).done(function(res){
							alert('Agendamento confirmado. Seu boleto foi enviado por email para pagamento.');
							alterPage('service', clearHomeServicePage, loadHomeServicePage);	
						});						
					}
					
				}
			});
		});	
	}
}
