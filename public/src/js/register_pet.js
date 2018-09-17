/*
   Funcao que renderiza a pagina register_pet.
*/
function loadRegisterPetPage(){
	loadHTML('#contentSection', 'register_pet', loadRegisterPetResources);
}

/*
   Funcao que limpa todos os conteudos carregados na register_pet page, deixando apenas a
   contentSection renderizada na tela.
*/
function clearRegisterPetPage(){
	$('#contentSection').empty();
	removeCSS('register_pet');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadRegisterPetResources(){
	// Trata o botao "SELECIONAR"
	selectImage();
	// Trata o clique sobre o botao "Cadastrar"
	$('#registerButton').click(function (event) {
		event.preventDefault();
		if(petValidator()){
			let newPet = {
				email: objUser.obj.email,
				name: $('#animalName').val(),
				breed: $('#animalBreed').val(),
				age: $('#animalAge').val(),
				picture: $('#animalImage').attr('src')
			};
			$.post('/animal/add',newPet).done(function(data){
				if(data.data.ok == true){
					alterPage('pet', clearHomePetPage, loadHomePetPage);
				}
			});
		}
	});
	// Trata o clique sobre o botao "Voltar"
	$('#returnButton').click(function () {
		alterPage('pet', clearHomePetPage, loadHomePetPage);
	});
}

/* 
   Funcao que insere os eventos responsaveis pelo input 'file'.
*/
function selectImage(){
	$('.btn').on('click', function() {
		$('.arquivo').trigger('click');
	});

	$('.arquivo').on('change', function() {
		var fileName = $(this)[0].files[0].name;
		$('#animalImageFile').val(fileName);
		$('#animalImage').attr('src', './src/images/animals/' + fileName);
	});
}

/*
   Funcao que valida o formulario do usuario
*/
function petValidator(){
	//Verificando se todos os campos estao preenchidos
	if($('#animalImage').attr('src') === './src/images/animals/white.jpg'){
		alert("Campo imagem não está preenchido.");
		return false;
	} 
	if($('#animalName').val() == ''){
		alert("Campo nome não está preenchido.");
		return false;
	}
	if($('#animalId').val() == ''){
		alert("Campo Id não está preenchido.");
		return false;
	} 
	if($('#animalBreed').val() == ''){
		alert("Campo raça não está preenchido.");
		return false;
	} 
	if($('#animalAge').val() == ''){
		alert("Campo idade não está preenchido.");
		return false;
	}
	return true;
}
