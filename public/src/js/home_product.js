/*
   Funcao que renderiza a pagina home_product.
   */
function loadHomeProductPage(){
	loadHTML('#contentSection', 'home_product', loadHomeProductResources);
}

/*
   Funcao que limpa todos os conteudos carregados na home_product page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearHomeProductPage(){
	$('#contentSection').empty();
	removeCSS('home_product');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadHomeProductResources(){

	loadProduct();

	// Trata o clique no botao "Carrinho"
	$.getScript("./src/js/cart_client.js", function (){
		$('#cartClientButton').click(function (){
			alterPage('cart', clearCartClientPage, loadCartClientPage);
		});
	});
	// Trata o clique no botao "Comprar"
	$.getScript("./src/js/purchase_client.js", function (){
		$('#purchaseClientButton').click(function (){
			alterPage('purchase', clearPurchaseClientPage, loadPurchaseClientPage);
		});
	});
}

/*
   Funcao que carrega que os pedidos na tabela
*/
function loadProduct(user){
	
	let counter,counterHistory;
	let d = new Date();
	let day = d.getDate();
	let month = d.getMonth()+1;

	//Preenche tabelas	
	$.get('/solicitation/user/'+objUser.obj.email,function(data){
		let counter = counterHistory = 0;
		for(let i=0;i<data.length;i++){
			if(data[i].obj.month == month){
				if(data[i].obj.day >= day){
					addServiceResume(data[i].obj,counter,data[i]._id);
					counter++;
				}
				else{
					addServiceHistory(data[i].obj,counterHistory,data[i]._id);
					counterHistory++;
				}
			}
			else if(data[i].obj.month > month){
				addServiceResume(data[i].obj,counter,data[i]._id);
				counter++;
			}
			else{
				addServiceHistory(data[i].obj,counterHistory,data[i]._id);
				counterHistory++;
			}
		}	
	});
}

function addServiceResume(solicitation,counter,id){
	$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + counter  + '"></tr>');	
	$('#servicesResumeTableRow'+counter).append('<td>'+ id.substring(24,31)  + '</td>');
	$('#servicesResumeTableRow'+counter).append('<td>'+ solicitation.situation  + '</td>');
	$('#servicesResumeTableRow'+counter).append('<td>'+ solicitation.tracking  + '</td>');
	let date = solicitation.day + '/' + solicitation.month;
	$('#servicesResumeTableRow'+counter).append('<td>'+ date  + '</td>');
	$('#servicesResumeTableRow'+counter).append('<td>'+ 'R$ ' + solicitation.value  + '</td>');
}

function addServiceHistory(solicitation,counterHistory,id){
	$('#servicesHistoryTable').append('<tr id="servicesHistoryTableRow' + counterHistory  + '"></tr>');	
	$('#servicesHistoryTableRow'+counterHistory).append('<td>'+ id.substring(24,31)  + '</td>');
	$('#servicesHistoryTableRow'+counterHistory).append('<td>'+ solicitation.situation  + '</td>');
	$('#servicesHistoryTableRow'+counterHistory).append('<td>'+ solicitation.tracking  + '</td>');
	let date = solicitation.day + '/' + solicitation.month;
	$('#servicesHistoryTableRow'+counterHistory).append('<td>'+ date  + '</td>');
	$('#servicesHistoryTableRow'+counterHistory).append('<td>'+ 'R$ ' + solicitation.value  + '</td>');
}
