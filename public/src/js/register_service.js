/*
   Funcao que renderiza a pagina register_service.
*/
function loadRegisterServicePage(s){
	loadHTML('#contentSection', 'register_service', loadRegisterServiceResources);
	newScheduling = s;
}

/*
   Funcao que limpa todos os conteudos carregados na register_service page, deixando apenas a
   contentSection renderizada na tela.
*/
function clearRegisterServicePage(){
	$('#contentSection').empty();
	removeCSS('register_service');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadRegisterServiceResources(){
	
	//Preenche os dados dos campos de agendamento
	fillRegisterService();
	if(newScheduling != null){
		let year = new Date().getFullYear();
		let day,month;
		if(newScheduling.day>=1 && newScheduling.day<=9){
			day = '0'+newScheduling.day;	
		}
		else{
			day = newScheduling.day;
		}
		if(newScheduling.month>=1 && newScheduling.month<=9){
			month = '0'+newScheduling.month;
		}
		else{
			month = newScheduling.month;
		}
		let date = year+'-'+month+'-'+day; 
		$('#scheduleDate').val(date);
		addHour(newScheduling.day,newScheduling.month);
	}
	
	// Trata o clique no botao "Cancelar"
	$('#returnButton').click(function (){
		alterPage('service', clearHomeServicePage, loadHomeServicePage);
	});

	// Trata o clique no botao "Agendar"
	$.getScript("./src/js/service_payment.js", function (){
		$('#confirmButton').click(function (event){
			event.preventDefault();
			let pet = $('#desiredPet option:selected').text();
			let service = $('#desiredService option:selected').text();
			let date = $('#scheduleDate').val();
			let time = $('#scheduleTime option:selected').text();
		
			//Verificando se todos os dados estao preenchidos
			if(pet != "" && service != "" && time != ""){
				$.get('/animal/user/'+objUser.obj.email, function(data){
					for(let i = 0; i < data.length; i++){
						if(data[i].obj && data[i].obj.name == pet){
							addScheduling(objUser.obj,data[i]._id,service,date,time);
						}
					}					
				});											
			}
			else{
				alert("Selecione todos os campos.");
			}
		});
	});
	// Trata de uma mudanca no select
	$('#desiredService').change(function(){
		let serviceName = $('#desiredService option:selected').text();
		if(serviceName != ""){
			$.get('/services', function(data){				
				for(let i=0;i<data.length;i++){
					if(data[i].obj && data[i].obj.name == serviceName){
						$('#serviceTotalValue').text('R$' + data[i].obj.price);
					}
				}
			});
		}
		else{
			$('#serviceTotalValue').text('');
		}
	});
	//Trata uma mudanca na data
	$('#scheduleDate').change(function(){
		let date = $('#scheduleDate').val().split('-');
		let day = parseInt(date[2]);
		let month = parseInt(date[1]);
		let currentDate = new Date();
		let currentDay = currentDate.getDate();
		let currentMonth = currentDate.getMonth()+1;
		deleteHour();
	
		//Verifica se o dia escolhido esta em um intervalo de 10 dias
		if(month == currentMonth){
			if(day<currentDay){
				alert("Selecione uma data em um intervalo de 10 dias.");
			}
			else{
				if(day-currentDay <= 10){
					addHour(day,month);	
				}
				else{
					alert("Selecione uma data em um intervalo de 10 dias.");
					deleteHour();
				}
			}
		}
		else if(month > currentMonth){
			if(31-currentDay+day <= 10){
				addHour(day,month);	
			}
			else{
				alert("Selecione uma data em um intervalo de 10 dias.");
				deleteHour();
			}
		}
		else{
			alert("Selecione uma data em um intervalo de 10 dias.");
			deleteHour();
		}
	});
}

/*
   Armazena um novo agendamento no bando de dados
*/
function addScheduling(user,pet,serviceName,date,time){	
	//Verificando qual é o servico selecionado	
	$.get('/services', function(data){
		for(let i=0;i<data.length;i++){
			if(data[i].obj && data[i].obj.name == serviceName){
				let temp = date.split('-');
				let obj = {email:user.email,day:parseInt(temp[2]),month:parseInt(temp[1]),hour:time,idAnimal:pet,client:user.name,idService:data[i]._id,done:false};				
				alterPage('servicePay', clearServicePaymentPage, loadServicePaymentPage,obj);
				break;	
			}
		}
	});
}


/*
   Seta os horarios disponiveis para um certo dia
*/
function addHour(day,month){

	let availableTime = [8,9,10,11,12,13,14,15,16,17];
	
	//Para um certo dia e mes verifica os horarios disponiveis	
	$.get('/scheduling', function(data){		
		for(let i=0;i<data.length;i++){
			if(data[i].obj && data[i].obj.day == day && data[i].obj.month == month){
				let temp = parseInt(data[i].obj.hour);
				availableTime[temp-8] = -1;
			}	
		}
		let counter = 0;
		for(let i=0;i<availableTime.length;i++){
			if(availableTime[i] != -1){
				let temp = availableTime[i] + ":00";
				if(newScheduling == null){
					$('#scheduleTime').append('<option value="' + counter + '">' + temp +  '</option>');	
				}
				else if(newScheduling.hour == temp){
					$('#scheduleTime').append('<option value="' + counter + '" selected>' + temp +  '</option>');	
				}
				else{
					$('#scheduleTime').append('<option value="' + counter + '">' + temp +  '</option>');	
				}
				counter++;
			}
		}
	});	
}

/*
   Delete os horarios disponiveis
*/
function deleteHour(){
	$('#scheduleTime').empty();
}


/*
   Preenche os dados do agendamento
*/
function fillRegisterService(){	
	fillRegisterServiceResource(objUser.obj);	
}

/*
   Preenche os dados do agendamento
*/
function fillRegisterServiceResource(user){
	
	let counter;

	//Adicionando campos vazios
	$('#desiredService').append('<option value="service0">' + ""  + '</option>');
	$('#desiredPet').append('<option value="pet0">' + ""  + '</option>');

	//Pega todos os servicos disponiveis
	$.get('/services', function(data) {
		counter = 1;
		
		for(let i=0;i<data.length;i++){
			if(data[i].obj){			
				//Setando os servicos
				if(newScheduling == null){
					$('#desiredService').append('<option value="service' + counter + '">' + data[i].obj.name  + '</option>');
				}
				else if(newScheduling.idService == data[i].obj.id){
					$('#desiredService').append('<option value="service' + counter + '" selected>' + data[i].obj.name  + '</option>');
					$('#serviceTotalValue').text('R$' + data[i].obj.price);
				}
				else{
					$('#desiredService').append('<option value="service' + counter + '">' + data[i].obj.name  + '</option>');
				}
				counter++;
			}
		}

		
		$.get('/animal/user/' + objUser.obj.email, function (data){			
			for(let i = 0; i < data.length; i++){
				if(data[i].obj){
					if(newScheduling == null){
						$('#desiredPet').append('<option value="pet' + counter + '">' + data[i].obj.name  + '</option>');
					}
					else if(newScheduling.animal == data[i].obj.name){
						$('#desiredPet').append('<option value="pet' + counter + '" selected>' + data[i].obj.name  + '</option>');
					}
					else{
						$('#desiredPet').append('<option value="pet' + counter + '">' + data[i].obj.name  + '</option>');
					}
					counter++;
				}				
			}
		});
	});
}
