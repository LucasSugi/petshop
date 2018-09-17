/*
    Funcao que carrega a pagina 'register_client'.
*/
function loadRegisterClientPage(){
    loadHTML('#contentSection', 'register_client', loadRegisterClientResources);
}

/*
    Funcao que limpa todos os conteudos carregados na register_client page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearRegisterClientPage(){
    $('#contentSection').empty();
    removeCSS('register_client');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes da tela.
*/
function loadRegisterClientResources(){
    //Registra um novo usuario 
    $('#registerButton').click(function (event){
	event.preventDefault();
	
	//Variavel que indica se tudo esta ok
	let ok = true;

	//Verificando se todos os campos estao preenchidos
	if($('#userEmail').val() == ""){
		alert("Campo email não está preenchido.");
		ok = false;
	} 
	if($('#userPassword').val() == ""){
		alert("Campo senha não está preenchido.");
		ok = false;
	}
	if($('#userPasswordConfirm').val() == ""){
		alert("Campo senha não está preenchido.");
		ok = false;
	}
	if($('#userName').val() == ""){
		alert("Campo nome não está preenchido.");
		ok = false;
	}
	if($('#userCPF').val() == ""){
		alert("Campo CPF não está preenchido.");
		ok = false;
	}
	if($('#userPhone').val() == ""){
		alert("Campo telefone não está preenchido.");
		ok = false;
		ok = false;
	}
	if($('#userAddress').val() == ""){
		alert("Campo endereço não está preenchido.");
		ok = false;
	}
	if($('#userAddressCity').val() == ""){
		alert("Campo cidade não está preenchido.");
		ok = false;
	}
	if($('#userAddressState').val() == ""){
		alert("Campo estado não está preenchido.");
		ok = false;
	}
	if($('#userAddressCountry').val() == ""){
		alert("Campo país não está preenchido.");
		ok = false;
	}

	//Expressoes regulares para validacao	
	let validaCpf = new RegExp('[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}-[0-9]{2}');	
	let validaTel = new RegExp('[\(][0-9]{2}[\)][0-9]{5}-[0-9]{4}');
	let validaEmail = new RegExp('[A-Za-z0-9\\._-]+@[A-Za-z]+\\.[A-Za-z]+');
	let validaSenha = new RegExp('.{6,}');
	

	//Validando o cpf
	if(validaCpf.exec($('#userCPF').val()) == null){
		alert("CPF inválido. Digite no seguinte formato: ___.___.__-__");
		ok = false;
	}	

	//Validando o email
	if(validaEmail.exec($('#userEmail').val()) == null){
		alert("Email inválido. Digite no seguinte formato:_@_._");
		ok = false;
	}	
	
	//Validando o telefone
	if(validaTel.exec($('#userPhone').val()) == null){
		alert("Telefone inválido. Digite no seguinte formato: (__)_____-____");
		ok = false;
	}

	//Validando a senha
	if(validaSenha.exec($('#userPassword').val()) == null){
		alert("Senha inválida. Digite no mínimo 6 caracteres");
		ok = false;
	}
	
	//Verifica se as senhas sao iguais
	if( $('#userPasswordConfirm').val() != $('#userPassword').val() ){
		alert("As senhas não coincidem.");
		ok = false;
	}
	
	
	//Tenta criar um novo usuario
	if(ok == true){
		//Criacao do objeto	    
		let user = {email:"", password:"", name:"", cpf:"", tel:"", address:"", district:"", city:"",state:"", country:"", adm:""}; 
		user.email = $('#userEmail').val();
		user.password = $('#userPassword').val();
		user.name = $('#userName').val();
		user.cpf = $('#userCPF').val();
		user.tel = $('#userPhone').val();
		user.address = $('#userAddress').val();
		user.district = $('#userAddressDistrict').val();
		user.city = $('#userAddressCity').val();
		user.state = $('#userAddressState').val();
		user.country = $('#userAddressCountry').val();
		user.adm = false;
	
		//Verifica se existe algum usuario com o mesmo email
		let exist = false;
		$.get('/users',function(data){
			for(let i=0;i<data.length;i++){
				if(data[i].obj){
					if(data[i].obj.email == user.email || data[i].obj.cpf == user.cpf){
						exist = true;
						break;
					}
				}
			}
			if(!exist){
				$.post('/users/add',user).done(function(data){
					if(data.data.ok == true){
						alert("Usuário criado com sucesso.");
					        clearRegisterClientPage();
					        loadHomePage();
					}
				});
			}
			else{
				alert("Usuário já existente.");
			}	
		});
	}
    });
    
    //Voltar para a pagina principal
    $('#returnButton').click(function (){
        clearRegisterClientPage();
        loadHomePage();
    });
}
