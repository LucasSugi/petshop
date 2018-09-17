/*
   Funcao que renderiza a pagina home_service_adm.
*/
function loadHomeServiceAdmPage(){
	loadHTML('#contentSection', 'adm/home_service_adm', loadHomeServiceAdmResources);
}

/*
   Funcao que limpa todos os conteudos carregados na home_service_adm page, deixando apenas a
   contentSection renderizada na tela.
*/
function clearHomeServiceAdmPage(){
	$('#contentSection').empty();
	removeCSS('adm/home_service_adm');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadHomeServiceAdmResources(){
	// Carrega os dados dos servicos contidos no BD	
	loadServicesAdmData();	
	// Trata o botao 'Voltar'
	$('#returnButton').click(function () {
		clearHomeServiceAdmPage();
		loadHomeAdmPage();
	});
}

/*
   Funcao que carrega os dados do BD, gerando o HTML de forma apropriada.
*/
function loadServicesAdmData(){
	$.get('/scheduling', function(data){
		for(let i = 0; i < data.length; i++){
			if(data[i].obj){
				$.get('/animal/'+data[i].obj.idAnimal,function(animal){					
					$.get('/services/'+data[i].obj.idService,function(service){
						newServiceResumeRowHS(data[i], data[i].obj, animal.obj.name, service.obj.name, i);
					});
				});				
			}
		}		
	});
}

/*
   Funcao que insere um servico no DOM.
*/
function newServiceResumeRowHS(s, service, animal, serviceName, num){
	$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + num +'"></tr>');
	$('#servicesResumeTableRow'+num).append('<td id="dataService'+num+'">'+service.day+'/'+service.month+'</td>');
	$('#servicesResumeTableRow'+num).append('<td id="hourService'+num+'">'+service.hour+'</td>');
	$('#servicesResumeTableRow'+num).append('<td id="animalNameService'+num+'">'+animal+'</td>');
	$('#servicesResumeTableRow'+num).append('<td id="clientNameService'+num+'">'+service.client+'</td>');
	$('#servicesResumeTableRow'+num).append('<td id="nameService'+num+'">'+serviceName+'</td>');
	$('#servicesResumeTableRow'+num).append('<td><a id="editSchedulingButton'+num+'"><img alt="editar" src="./src/images/edit.png" style="display: none" /></a></td>');
	$('#servicesResumeTableRow'+num).append('<td><a id="deleteSchedulingButton'+num+'"><img alt="deletar" src="./src/images/delete.png" /></a></td>');	
	// Trata o botao 'Excluir'
	$('#deleteSchedulingButton'+num).click(function () {
		$.post('/scheduling/delete', s).done(function (data) {
			$('#servicesResumeTableRow'+num).remove();
		})		
	});
}
