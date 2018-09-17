/*
   Funcao que renderiza a pagina view_pet.
   */
function loadViewPetPage(p){
	pet = p;
	loadHTML('#contentSection', 'view_pet', loadViewPetResources);
}

/*
   Funcao que limpa todos os conteudos carregados na view_pet page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearViewPetPage(){
	$('#contentSection').empty();
	removeCSS('view_pet');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadViewPetResources(){
	// Carrega os dados
	loadViewPetData();
	// Trata o clique no botao "Voltar"
	$('#linkBack').click(function (){
		alterPage('pet', clearHomePetPage, loadHomePetPage);
	});
}

/* 
   Funcao que carrega os dados do animal contidos na base de dados.
   */
function loadViewPetData(){
	$('#petName').html(pet.obj.name);
	
	$.get('/scheduling/user/'+objUser.obj.email,function(data){
		//Objeto que sera utilizado para determinar em qual tabela ira o agendamento
		let d = new Date();
		let currentDay = d.getDate();
		let currentMonth = d.getMonth()+1;
		
		let currentCont = historyCont = 0;
		for(let i=0;i<data.length;i++){
			if(data[i].obj.idAnimal == pet._id){
				if(data[i].obj.month == currentMonth){
					if(data[i].obj.day >= currentDay){
						addViewPetServicesTableRow(currentCont,data[i].obj);	
						currentCont++;
					}
					else{
						addViewPetServicesHistoryTableRow(historyCont,data[i].obj);	
						historyCont++;
					}	
				}
				else if(data[i].obj.month > currentMonth){
					addViewPetServicesTableRow(currentCont,data[i].obj);	
					currentCont++;
				}
				else{
					addViewPetServicesHistoryTableRow(historyCont,data[i].obj);	
					historyCont++;
				}
			} 
		}
	});
}

/* 
   Funcao que adiciona uma linha na tabela de Agendamentos
   */
function addViewPetServicesTableRow(counter, solicitation){
	$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + counter  + '"></tr>');	
	$('#servicesResumeTableRow'+counter).append('<td>'+ solicitation.day  + '/' + solicitation.month + '</td>');
	$('#servicesResumeTableRow'+counter).append('<td>'+ solicitation.hour  + '</td>');
	$.get('/services/'+solicitation.idService,function(data){
		$('#servicesResumeTableRow'+counter).append('<td>'+ data.obj.name  + '</td>');
		$('#servicesResumeTableRow'+counter).append('<td>R$'+ data.obj.price  + '</td>');
	});
}

/* 
   Funcao que adiciona uma linha na tabela de Historico
   */
function addViewPetServicesHistoryTableRow(counter, solicitation){
	$('#servicesHistoryTable').append('<tr id="servicesHistoryTableRow' + counter  + '"></tr>');	
	$('#servicesHistoryTableRow'+counter).append('<td>'+ solicitation.day  + '/' + solicitation.month + '</td>');
	$('#servicesHistoryTableRow'+counter).append('<td>'+ solicitation.hour  + '</td>');
	$.get('/services/'+solicitation.idService,function(data){
		$('#servicesHistoryTableRow'+counter).append('<td>'+ data.obj.name  + '</td>');
		$('#servicesHistoryTableRow'+counter).append('<td>R$'+ data.obj.price  + '</td>');
	});
}
