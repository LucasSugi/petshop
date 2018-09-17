/*
   Funcao que renderiza a pagina home.
   */
function loadHomePage(){
	loadHTML('#contentSection', 'home_resources', loadHomeResources);
	loadAppendHTML('#root', 'home_login', '<section id="loginSection"></section>', '#loginSection', loadHomeLoginResources, 'footer');
}

/*
   Funcao que limpa todos os conteudos carregados na home page, deixando apenas a
   contentSection renderizada na tela.
   */
function clearHomePage(){
	$('#contentSection').empty();
	$('#loginSection').remove();
	removeCSS('home_resources');
	removeCSS('home_login');
}

/*
	Funcao que esconde o conteudo do footer.
*/
function clearFooter(){
	$('footer').hide();
}

/*
	Funcao que mostra o conteudo do footer.
*/
function showFooter(){
	$('footer').show();
}

/*
   Funcao que carrega os principais servicos/produtos a serem exibidos na tela inicial,
   gerando toda a estrutura HTML adequada para tal.
   */
function loadHomeResources(){	
	
	$.get('/products/priorities',function(data){
		//Sort by prority
		data.sort(function(a,b){ 
			if(a.obj && b.obj){
				return a.obj.priority-b.obj.priority
			}
			return 0;
		});
		for(let i=0;i<4 && i<data.length;i++){
			setProductPicture(data[i].obj,i+1);	
		}
	});

	$.get('/services/priorities',function(data){
		//Sort by prority
		data.sort(function(a,b){ 
			if(a.obj && b.obj){
				return a.obj.priority-b.obj.priority
			}
			return 0;
		});
		for(let i=0;i<4 && i<data.length;i++){
			setServicePicture(data[i].obj,i+1);	
		}
	});
}

/*
   Funcao que associa as funcoes aos eventos correspondentes da area de login.
   */
function loadHomeLoginResources(){
	/*********************************** */
	// Trata o clique no botao "CADASTRE-SE AQUI"
	$.getScript('./src/js/register_client.js', function (){
		$('#newUserButton').click(function (){
			clearHomePage();
			loadRegisterClientPage();
		});
	});
	// Trata o clique no botao "Esqueceu seu nome do usuario ou senha"
	$.getScript("./src/js/forgot_user_pass.js", function (){
		$('#forgotUserPassButton').click(function (){
			clearHomePage();
			loadForgotUserPassPage();
		});
	});
	// Trata o clique no botao "ENTRAR"
	$.getScript('./src/js/home_client.js', function () {
		$('#enterButton').click(function (event) {
			event.preventDefault();

			//Armazenando senha e email do usuario
			let email = $('#emailUser').val();
			let pass = $('#passwordUser').val();
			
			//Verificando se a senha e o email estao corretos
			$.get('/user/'+email,function(data){
				if(data.length==0 || pass != data[0].obj.password){
					alert("Email ou senha inválidos.");	
				}
				else{
					clearHomePage();
					//Verifica se o usuario eh o admin
					if(data[0].obj.adm == true){
						$.getScript('./src/js/adm/home_adm.js', function () {
							objUser = data[0];
							clearFooter();
							loadHomeAdmPage();
						});
					}
					else{
						$.getScript('./src/js/navbar.js', function () { 
							//Armazena o cliente
							objUser = data[0]; 
							setCurrentPage('home', clearHomeClientPage);
							loadNavbarPage(); // Carrega a navbar
							loadHomeClientPage(); // Carrega a Home do Cliente
						});
					}
				}
			});
		});
	});
}

/*Pega do BD os servicos prioritarios */
function setServicePicture(resource,i){
	$('#servicesDiv' + i).append('<div id="servicesImgDiv' + i + '" class="imageDiv"></div>');
	$('#servicesImgDiv' + i).append('<img id="servicesImg' + i + '" alt="Foto do Servico" class="postImage" src="' + resource.picture + '"/>');
	$('#servicesDiv' + i).append('<h3 id="servicesText' + i + '">'+ resource.name + '</h3>');
}

/*Pega do BD os produtos prioritarios */
function setProductPicture(resource,i){
	$('#productsDiv' + i).append('<div id="productsImgDiv' + i + '" class="imageDiv"></div>');
	$('#productsImgDiv' + i).append('<img id="productsImg' + i + '" alt="Foto do Produto" class="postImage" src="' + resource.picture + '"/>');
	$('#productsDiv' + i).append('<h3 id="productsText' + i + '">'+ resource.name + '</h3>');
}
