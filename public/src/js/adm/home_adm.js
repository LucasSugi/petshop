/*
    Funcao que renderiza a pagina home_adm.
*/
function loadHomeAdmPage(){
	loadHTML('#contentSection', 'adm/home_adm', loadHomeAdmResources);
}

/*
    Funcao que limpa todos os conteudos carregados na home_adm page, deixando apenas a
    contentSection renderizada na tela.
*/
function clearHomeAdmPage(){
    $('#contentSection').empty();
    removeCSS('adm/home_adm');
}

/*
    Funcao que associa as funcoes aos eventos correspondentes.
*/
function loadHomeAdmResources(){
    // Trata o botao 'Sair'
    $('#logoutButton').click(function () {
        clearHomeAdmPage();
        loadHomePage();
        showFooter();
    });
    // Trata o botao 'Usuarios'
    $.getScript('./src/js/adm/register_client_adm.js', function (){
        $('#registerClientButton').click(function () {
            clearHomeAdmPage();
            loadRegisterClientAdmPage();
        });
    });
    // Trata o botao 'Serviços'
    $.getScript('./src/js/adm/home_service_adm.js', function (){
        $('#manageServicesButton').click(function () {
            clearHomeAdmPage();
            loadHomeServiceAdmPage();
        });
    });
}
