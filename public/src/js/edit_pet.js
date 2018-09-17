/*
    Funcao que renderiza a pagina edit_pet.
*/
function loadEditPetPage(p){
    pet = p;
    loadHTML('#contentSection', 'edit_pet', loadEditPetResources);
}

/*
    Funcao que limpa todos os conteudos carregados na edit_pet page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearEditPetPage(){
    $('#contentSection').empty();
    removeCSS('edit_pet');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadEditPetResources(){
    // Trata o botao "SELECIONAR"
    selectImage();
    // Carrega os dados
    loadEditPetData();
    // Trata o clique no botao "Confirmar"
    $('#registerButton').click(function (){
        event.preventDefault();
        if(petEditValidator()){
		pet.obj.name = $('#animalName').val();
		pet.obj.breed = $('#animalBreed').val();
		pet.obj.age = parseInt($('#animalAge').val());
		pet.obj.picture = $('#animalImage').attr('src');
	    $.post('/animal/update',pet).done(function(data){
		   if(data.data.ok == true){
		    	alert('Dados alterados com sucesso');
		    	alterPage('pet', clearHomePetPage, loadHomePetPage);
		   }
	    });
	}
    });
    // Trata o clique no botao "Voltar"
    $('#returnButton').click(function (){
        alterPage('pet', clearHomePetPage, loadHomePetPage);
    });
}

/* 
   Altera o as informações do animal nos seus agendamentos.
*/
function changeSchedulingAnimal(newPet){

}

/* 
    Funcao que carrega os dados do animal contidos na base de dados.
*/
function loadEditPetData(){
    $('#animalImage').attr('src', pet.obj.picture);
    $('#animalName').attr('value', pet.obj.name);
    $('#animalBreed').attr('value', pet.obj.breed);
    $('#animalAge').attr('value', pet.obj.age);
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
function petEditValidator(){
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
