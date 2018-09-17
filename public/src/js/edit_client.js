/*
   Funcao que carrega a pagina 'edit_client'.
   */
function loadEditClientPage(){
	loadHTML('#contentSection', 'edit_client', loadEditClientResources);
}

/*
   Funcao que limpa todos os conteudos carregados na edit_client page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearEditClientPage(){
	$('#contentSection').empty();
	removeCSS('edit_client');
}

/*
   Funcao que associa as funcoes aos eventos correspondentes da tela.
   */
function loadEditClientResources(){
	
	//Id do usuario
	let userId = objUser._id;

	//Armazena as informacoes do usuario
	var editUser;

	// Busca pelo usuário e preenche os dados do formulario
	$.get('/users/' + userId, function (data) {		
		editUser = data;
		$('#userEmail').val(data.obj.email);	
		$('#userPassword').val(data.obj.password);	
		$('#userPasswordConfirm').val(data.obj.password);	
		$('#userName').val(data.obj.name);	
		$('#userCPF').val(data.obj.cpf);	
		$('#userPhone').val(data.obj.tel);	
		$('#userAddress').val(data.obj.address);	
		$('#userAddressDistrict').val(data.obj.district);	
		$('#userAddressCity').val(data.obj.city);	
		$('#userAddressState').val(data.obj.state);	
		$('#userAddressCountry').val(data.obj.country);	
	});

	// Trata o clique no botao 'REGISTRAR'
	$('#editButton').click(function (){
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
		if($('#userAddressDistrict').val() == ""){
			alert("Campo bairro não está preenchido.");
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
			alert("Senha inválida. Digite no mínimo 6 caracteres.");
			ok = false;
		}
	
		//Verifica se as senhas sao iguais
		if( $('#userPasswordConfirm').val() != $('#userPassword').val() ){
			alert("As senhas não coincidem.");
			ok = false;
		}
		
		let exist = false;	
		//Atualizando usuario		
		if(ok == true){
			//Verifica se houve mudancas no email
			if($('#userEmail').val() == editUser.obj.email){
				editUser.obj.password = $('#userPassword').val();	
				//Setando o nome do usuario				
				editUser.obj.name = $('#userName').val();	
				$('#userNameDiv').text(editUser.obj.name);
				editUser.obj.cpf = $('#userCPF').val();	
				editUser.obj.tel = $('#userPhone').val();	
				editUser.obj.address = $('#userAddress').val();	
				editUser.obj.district = $('#userAddressDistrict').val();	
				editUser.obj.city = $('#userAddressCity').val();	
				editUser.obj.state = $('#userAddressState').val();	
				editUser.obj.country = $('#userAddressCountry').val();
				$.post('/users/update',editUser).done(function(data){
					if(data.data.ok == true){
						//Get the new obj
						$.get('/users/'+userId,function(data){
							objUser = data;
						});
						clearEditClientPage();
						setCurrentPage('home', clearHomeClientPage);
						loadHomeClientPage();
						alert('Usuário atualizado.');
					}
				});
			}
			else{
				//Verifica se o email e unico
				$.get('/users',function(data){
					let exist = false;
					for(let i=0;i<data.length;i++){
						if(data[i].obj){
							if(data[i].obj.email == $('#userEmail').val()){
								exist = true;		
								break;
							}
						}
					}
					if(exist){
						alert("Email já existente. Digite outro email.");
					}
					else{
						editUser.obj.email = $('#userEmail').val();	
						editUser.obj.password = $('#userPassword').val();	
						editUser.obj.name = $('#userName').val();	
						editUser.obj.cpf = $('#userCPF').val();	
						editUser.obj.tel = $('#userPhone').val();	
						editUser.obj.address = $('#userAddress').val();	
						editUser.obj.district = $('#userAddressDistrict').val();	
						editUser.obj.city = $('#userAddressCity').val();	
						editUser.obj.state = $('#userAddressState').val();	
						editUser.obj.country = $('#userAddressCountry').val();
						$.post('/users/update',editUser).done(function(data){
							if(data.data.ok == true){
								//Get the new obj
								$.get('/users/'+userId,function(data){
									objUser = data;
								});
								objUser = editUser;
								clearEditClientPage();
								setCurrentPage('home', clearHomeClientPage);
								loadHomeClientPage();
								alert('Usuário atualizado.');
							}
						});
					}	
				});
			}
		}
	});
	// Trata o clique no botao 'VOLTAR'
	$('#returnButton').click(function (){
		clearEditClientPage();
		setCurrentPage('home', clearHomeClientPage);
		loadHomeClientPage();
	});
}
