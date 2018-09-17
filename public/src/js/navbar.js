/*
    Funcao que renderiza a pagina navbar.
*/
function loadNavbarPage(){
    loadAppendHTML('#root', 'navbar', '<nav></nav>', 'nav', loadNavbarResources, '#contentSection');
}

/*
    Funcao que limpa todos os conteudos carregados na navbar page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearNavbarPage(){
    $('nav').remove();
    removeCSS('navbar');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes da area de login.
*/
function loadNavbarResources(){
	
    //Setando o nome do usuario
    $('#userNameDiv').text(objUser.obj.name);

    // Trata o clique do botao 'Home'
    $('#homeButton').click(function () {
        alterPage('home', clearHomeClientPage, loadHomeClientPage);
    });
    // Trata o clique do botao 'Animais'
    $.getScript('./src/js/home_pet.js', function () {
        $('#petsButton').click(function () {
            alterPage('pet', clearHomePetPage, loadHomePetPage);
        });
    });
    // Trata o clique do botao 'Servicos'
    $.getScript('./src/js/home_service.js', function () {
        $('#servicesButton').click(function () {
            alterPage('service', clearHomeServicePage, loadHomeServicePage);
        });
    });
    // Trata o clique do botao 'Produtos'
    $.getScript('./src/js/home_product.js', function () {
        $('#productsButton').click(function () {
            alterPage('product', clearHomeProductPage, loadHomeProductPage);
        });
    });
    // Trata o clique do botao 'Editar'
    $.getScript('./src/js/edit_client.js', function () {
        $('#editUserButton').click(function () {
            alterPage('edit', clearEditClientPage, loadEditClientPage);
        });
    });
    // Trata o clique do botao 'Logout'
    $('#logoutButton').click(function () {
        currentPage.clear();
        clearNavbarPage();        
        loadHomePage();
    });
}

/*
    Funcao que altera a pagina que esta sendo exibida, por conta de um
    Event Handler da barra de navegacao.
        - id: Identificador da pagina a ser exibida;
        - clear: Funcao que remove a pagina a ser exibida da tela;
        - load: Funcao que carrega a pagina a ser exibida na tela;
        - payload: Conteudo a ser passado para a proxima pagina;
*/
function alterPage(id, clear, load, payload = null){
    if(id === currentPage.id){
        return;
    }
    currentPage.clear();
    setCurrentPage(id, clear);
    load(payload);
}
