/*
   Funcao que renderiza a pagina home_pet.
   */
function loadHomePetPage(){
	loadHTML('#contentSection', 'home_pet', loadHomePetResources);
}

/*
   Funcao que limpa todos os conteudos carregados na home_pet page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearHomePetPage(){
	$('#contentSection').empty();
	removeCSS('home_pet');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
   */
function loadHomePetResources(){

	//Preencha a tabela de animais	
	$.getScript("./src/js/edit_pet.js", function (){
		$.getScript("./src/js/view_pet.js", function (){
			loadTablePet();
		})
	});

	// Trata o clique no botao "Cadastrar animal"
	$.getScript("./src/js/register_pet.js", function (){
		$('#newPetButton').click(function (){
			alterPage('petReg', clearRegisterPetPage, loadRegisterPetPage);
		});
	});
}

/*
   Preenche a tabela de animais
   */
function loadTablePet(){
	
	//Pega os animais pertencentes ao usuario
	$.get('/animal/user/'+objUser.obj.email,function(data){
		for(let i=0;i<data.length;i++){
			$('#servicesResumeTable').append('<tr id="servicesResumeTableRow' + i + '"></tr>');	
			$('#servicesResumeTableRow'+i).append('<td>' + data[i].obj.name + '</td>');	
			$('#servicesResumeTableRow'+i).append('<td><img alt="editar" id="editButton' + i + '" class="postImage" src="./src/images/ir.png"></td>');	
			$('#servicesResumeTableRow'+i).append('<td><img alt="consultar" id="viewButton' + i + '" class="postImage" src="./src/images/ir.png"></td>');
			$('#editButton'+i).click(function (){
				alterPage('petEdit', clearEditPetPage, loadEditPetPage, data[i]);
			});
			$('#viewButton'+i).click(function () {
				alterPage('petView', clearViewPetPage, loadViewPetPage, data[i]);
			});
		}	
	});
}
