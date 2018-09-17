/*
    Funcao que renderiza a pagina home_service.
*/
function loadHomeServicePage(){
    loadHTML('#contentSection', 'home_service', loadHomeServiceResources);
}

/*
    Funcao que limpa todos os conteudos carregados na home_service page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearHomeServicePage(){
    $('#contentSection').empty();
    removeCSS('home_service');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes da area de login.
*/
function loadHomeServiceResources(){
 
    //Preenche a tabela de servicos  	
    loadTableScheduling();

    /*
        Tratar o evento em que o usuario clica sobre um agendamento, chamando a pagina
            view_service.
    */
    // Trata o clique no botao "Agendar Servico"
    $.getScript("./src/js/register_service.js", function (){
        $('#newServiceButton').click(function (){
            alterPage('serviceReg', clearRegisterServicePage, loadRegisterServicePage);
        });
    });
}

/*
 * Adiciona uma tupla na tabela history
 */
function addHistory(data,i,counterHistory){
	date = data[i].obj.day + '/' + data[i].obj.month;
	$('#servicesHistoryTable').append('<tr id="servicesHistoryTableRow' + counterHistory + '"></tr>');	
	$('#servicesHistoryTableRow' + counterHistory).append('<td>' + date  + '</td>');	
	$('#servicesHistoryTableRow' + counterHistory).append('<td>' + data[i].obj.hour  + '</td>');		
	$.get('/animal/'+data[i].obj.idAnimal,function(animal){
		$('#servicesHistoryTableRow' + counterHistory).append('<td>' + animal.obj.name  + '</td>');
		$.get('/services/'+data[i].obj.idService,function(service){
			$('#servicesHistoryTableRow' + counterHistory).append('<td>' + service.obj.name  + '</td>');	
			$('#servicesHistoryTableRow' + counterHistory).append('<td>' + 'R$ ' + service.obj.price  + '</td>');	
		});
	});
}

/*
 * Adiciona uma tupla na tabela resume
 */
function addResume(data,i,counter){
	date = data[i].obj.day + '/' + data[i].obj.month;
	$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + counter + '"></tr>');	
	$('#servicesResumeTableRow' + counter).append('<td>' + date  + '</td>');	
	$('#servicesResumeTableRow' + counter).append('<td>' + data[i].obj.hour  + '</td>');		
	$.get('/animal/'+data[i].obj.idAnimal,function(animal){
		$('#servicesResumeTableRow' + counter).append('<td>' + animal.obj.name  + '</td>');
		$.get('/services/'+data[i].obj.idService,function(service){
			$('#servicesResumeTableRow' + counter).append('<td>' + service.obj.name  + '</td>');	
			$('#servicesResumeTableRow' + counter).append('<td>' + 'R$ ' + service.obj.price  + '</td>');	
		});
	});
}

/*
   Preenche a tabela de agendamentos
*/
function loadTableScheduling(){

	//Objeto que sera utilizado para determinar em qual tabela ira o agendamento
	let d = new Date();
	currentDay = d.getDate();
	currentMonth = d.getMonth()+1;
	
	$.get('/scheduling/user/'+objUser.obj.email,function(data){
		let counter = counterHistory = 0;
		for(let i=0;i<data.length;i++){
			if(data[i].obj.month == currentMonth){
				if(data[i].obj.day >= currentDay){
					addResume(data,i,counter);
					counter++;		
				}
				else{
					addHistory(data,i,counterHistory);
					counterHistory++;	
				}
			}
			else if(data[i].obj.month > currentMonth){
				addResume(data,i,counter);
				counter++;		
			}
			else{
				addHistory(data,i,counterHistory);
				counterHistory++;	
			}
		}	
	});
}
