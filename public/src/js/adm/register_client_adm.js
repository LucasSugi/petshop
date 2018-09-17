/*
    Funcao que renderiza a pagina register_client_adm.
*/
function loadRegisterClientAdmPage(){
	loadHTML('#contentSection', 'adm/register_client_adm', loadRegisterClientAdmResources);
}

/*
    Funcao que limpa todos os conteudos carregados na register_client_adm page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearRegisterClientAdmPage(){
    $('#contentSection').empty();
    removeCSS('adm/register_client_adm');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadRegisterClientAdmResources(){
    // Trata o botao 'Cadastrar'
    $('#registerButton').click(function (event) {
        event.preventDefault();
        if(clientAdmValidator()){ // Verifica se o Form eh valido
            // Cria o novo cliente
            let newClientAdm = {
                email: $('#userEmail').val(),
                password: $('#userPassword').val(),
                name: $('#userName').val(),
                cpf: $('#userCPF').val(),
                tel: $('#userPhone').val(),
                address: $('#userAddress').val(),
                district: $('#userAddressDistrict').val(),
                city: $('#userAddressCity').val(),
                state: $('#userAddressState').val(),
                country: $('#userAddressCountry').val(),
                adm: ($('#userAdmCheck').is(':checked')) ? true : false,
                active: false
            };
            //Verifica se existe algum usuario com o mesmo email
            let exist = false;
            $.get('/users',function(data){
                for(let i=0;i<data.length;i++){
                    if(data[i].obj){
                        if(data[i].obj.email == newClientAdm.email || data[i].obj.cpf == newClientAdm.cpf){
                            exist = true;
                            break;
                        }
                    }
                }
                if(!exist){
                    $.post('/users/add',newClientAdm).done(function(data){
                        if(data.data.ok == true){
                            alert("Usuário criado com sucesso.");
                            clearRegisterClientAdmPage();
                            loadHomeAdmPage();
                        }
                    });
                }
                else{
                    alert("Usuário já existente.");
                }	
            });
        }
    });
    // Trata o botao 'Voltar'
    $('#returnButton').click(function () {
        clearRegisterClientAdmPage();
        loadHomeAdmPage();
    });
}

/*
    Funcao que valida o formulario do usuario
*/
function clientAdmValidator(){
    //Verificando se todos os campos estao preenchidos
	if($('#userEmail').val() == ""){
		alert("Campo email não está preenchido.");
		return false;
    } 
    if($('#userPassword').val() == ""){
		alert("Campo senha não está preenchido.");
		return false;
    }
    if($('#userPasswordConfirm').val() == ""){
		alert("Campo senha não está preenchido.");
		return false;
    } 
    if($('#userName').val() == ""){
		alert("Campo nome não está preenchido.");
		return false;
	}
	if($('#userCPF').val() == ""){
		alert("Campo CPF não está preenchido.");
		return false;
	}
	if($('#userPhone').val() == ""){
		alert("Campo telefone não está preenchido.");
		return false;
	}
	if($('#userAddress').val() == ""){
		alert("Campo endereço não está preenchido.");
		return false;
	}
	if($('#userAddressCity').val() == ""){
		alert("Campo cidade não está preenchido.");
		return false;
	}
	if($('#userAddressState').val() == ""){
		alert("Campo estado não está preenchido.");
		return false;
	}
	if($('#userAddressCountry').val() == ""){
		alert("Campo país não está preenchido.");
		return false;
    }
    //Expressoes regulares para validacao	
	let validaCpfAdm = new RegExp('[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}-[0-9]{2}');	
	let validaTelAdm = new RegExp('[\(][0-9]{2}[\)][0-9]{5}-[0-9]{4}');
	let validaEmailAdm = new RegExp('[A-Za-z0-9\\._-]+@[A-Za-z]+\\.[A-Za-z]+');
	let validaSenhaAdm = new RegExp('.{6,}');
	//Validando o cpf
	if(validaCpfAdm.exec($('#userCPF').val()) == null){
		alert("CPF inválido. Digite no seguinte formato: ___.___.__-__");
		return false;
	}	
	//Validando o email
	if(validaEmailAdm.exec($('#userEmail').val()) == null){
		alert("Email inválido. Digite no seguinte formato:_@_._");
		return false;
	}	
	//Validando o telefone
	if(validaTelAdm.exec($('#userPhone').val()) == null){
		alert("Telefone inválido. Digite no seguinte formato: (__)_____-____");
		return false;
	}
	//Validando a senha
	if(validaSenhaAdm.exec($('#userPassword').val()) == null){
		alert("Senha inválida. Digite no mínimo 6 caracteres");
		return false;
	}
	//Verifica se as senhas sao iguais
	if( $('#userPasswordConfirm').val() != $('#userPassword').val() ){
		alert("As senhas não coincidem.");
		return false;
	}
    return true;
}
