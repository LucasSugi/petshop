/*
    Funcao que carrega a pagina 'forgot_user_pass'.
*/
function loadForgotUserPassPage(){
    loadHTML('#contentSection', 'forgot_user_pass', loadForgotUserPassResources);
}

/*
    Funcao que limpa todos os conteudos carregados na forgot_user_pass page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearForgotUserPassPage(){
    $('#contentSection').empty();
    removeCSS('forgot_user_pass');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes da tela.
*/
function loadForgotUserPassResources(){
    //Verifica se o usuario existe no banco de dados para enviar suas informacoes via email
    $('#askForDataButton').click(function (event){
	event.preventDefault();
       	
	//Variavel que indicara se tudo esta correto
	let ok = true;

	//Verificando se esta tudo preenchido
	if($('#userCPF').val() == "" && $('#userEmail').val() == ""){
		alert("Preencha algum dos campos.");
		ok = false;
	}

	
	//Expressoes regulares para validacao	
	let validaCpf = new RegExp('[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}-[0-9]{2}');	
	let validaEmail = new RegExp('[A-Za-z0-9\\._-]+@[A-Za-z]+\\.[A-Za-z]+');
	

	//Validando o cpf
	if($('#userCPF').val() != "" && validaCpf.exec($('#userCPF').val()) == null){
		alert("CPF inválido. Digite no seguinte formato: ___.___.__-__");
		ok = false;
	}
	
	//Valida o email
	if($('#userEmail').val() != "" &&  validaEmail.exec($('#userEmail').val()) == null){
		alert("Email inválido. Digite no seguinte formato: _@_._");
		ok = false;
	}

	//Procura pelo usuario na base de dados
	if(ok == true){
		$.get('/users',function(data){
			let cpf = $('#userCPF').val();
			let email = $('#userEmail').val();
			let exist = false;
			for(let i=0;i<data.length;i++){
				if(data[i].obj){
					if(cpf == data[i].obj.cpf || email == data[i].obj.email){
						exist = true;
						break;	
					}
				}
			}
			if(exist == false){
				alert("Não existe nenhum usuário com este email ou cpf fornecidos.");
			}
			else{
				alert("Enviamos um email com sua nova senha de acesso.");
				// Limpa o conteudo atual e recarrega a home page (Apenas se der certo)
				clearForgotUserPassPage();
				loadHomePage();
			}
		});
	}	
    });    
    
    //Volta para a pagina principal
    $('#returnButton').click(function (){
        clearForgotUserPassPage();
        loadHomePage();
    });
}
