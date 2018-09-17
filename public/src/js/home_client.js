/*
    Funcao que renderiza a pagina home_client.
*/
function loadHomeClientPage(){
	loadHTML('#contentSection', 'home_client', loadHomeClientResources);
}

/*
    Funcao que limpa todos os conteudos carregados na home_client page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearHomeClientPage(){
    $('#contentSection').empty();
    removeCSS('home_client');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadHomeClientResources(){
	
	$.get('/scheduling/user/'+objUser.obj.email,function(data){
		for(let i=0;i<data.length;i++){
			let date = data[i].obj.day + '/' + data[i].obj.month;
			$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + i +'"></tr>');
			$('#servicesResumeTableRow' + i).append('<td>'+ date + '</td>');
			$('#servicesResumeTableRow' + i).append('<td>'+ data[i].obj.hour + '</td>');
			$.get('/animal/'+data[i].obj.idAnimal,function(animal){				
				$('#servicesResumeTableRow' + i).append('<td>'+ animal.obj.name + '</td>');
				$.get('/services/'+data[i].obj.idService,function(service){
					$('#servicesResumeTableRow' + i).append('<td>'+ service.obj.name + '</td>');
				});
			});			
		}	
	});	

	$.get('solicitation/user/'+objUser.obj.email,function(data){
		for(let i=0;i<data.length;i++){
			$('#productsResumeTable').append('<tr id="productsResumeTableRow' + i +'"></tr>');
			$('#productsResumeTableRow' + i).append('<td>'+ (data[i]._id).substring(24,31) + '</td>');
			$('#productsResumeTableRow' + i).append('<td>'+ data[i].obj.situation + '</td>');
			$('#productsResumeTableRow' + i).append('<td>'+ data[i].obj.tracking + '</td>');
		}
	});
}
