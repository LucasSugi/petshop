// Renderiza a pagina inicial assim que o documento for carregado
$(document).ready(render());

/*
    Funcao que renderiza a pagina inicial do site.
*/
function render(){
    $.getScript("./src/js/home.js", function (){
        loadAppendHTML('#root', 'header','<header></header>', 'header'); // Insere o Header
        loadAppendHTML('#root', 'home_resources', '<section id="contentSection"></section>', '#contentSection', loadHomeResources);
        loadAppendHTML('#root', 'home_login', '<section id="loginSection"></section>', '#loginSection', loadHomeLoginResources);
        loadAppendHTML('#root', 'footer', '<footer></footer>', 'footer'); // Insere o Footer
    });
}

/*
    Funcao que carrega um arquivo HTML dentro de um elemento da 'index.html', inserindo um novo elemento no root.
        - rootDOM: Elemento da 'index.html' que se tornara 'parent' do conteudo desejado;
        - filename: Nome do arquivo HTML a ser carregado (a extensao .html nao eh necessaria);
            --> Se houver arquivo CSS correspondente, tambem o carrega;
        - appendElement: Elemento HTML a ser inserido no root para separar o conteudo novo
                            de um possivel conteudo existente no root;
        - rootElement: Elemento HTML no qual o arquivo sera carregado;
        - (opcional) callback: Funcao que deve ser chamada como callback do load;
        - (opcional) before: Elemento HTML no qual o load deve ser feito imediatamente atras
*/
function loadAppendHTML(rootDOM, filename, appendElement, rootElement, callback = null, before = null){
    (before === null) ? $(rootDOM).append(appendElement) : $(before).before(appendElement);
    loadHTML(rootElement, filename, callback);
}

/*
    Funcao que carrega um arquivo HTML dentro de um elemento da 'index.html'.
        - rootDOM: Elemento da 'index.html' que se tornara 'parent' do conteudo desejado;
        - filename: Nome do arquivo HTML a ser carregado (a extensao .html nao eh necessaria);
            --> Se houver arquivo CSS correspondente, tambem o carrega;
        - (opcional) callback: Funcao que deve ser chamada como callback do load;
*/
function loadHTML(rootDOM, filename, callback = null){
    $('head').append('<link rel="stylesheet" type="text/css" href="./src/css/' + filename + '.css">');
    $(rootDOM).load('./src/html/' + filename + '.html', callback);
    window.scrollTo(0, 0);
}

/*
    Funcao que remove um arquivo CSS carregado previamente.
        - filename: Nome do arquivo CSS a ser removido (a extensao .css nao eh necessaria);
*/
function removeCSS(filename){
    $('link[href="./src/css/' + filename + '.css"]').remove();
}

/* 
    Objeto que controla a pagina que esta sendo exibida ao usuario
*/
let currentPage = { id: '', clear: function () {}, };

/*
    Funcao que modifica o registro da pagina que esta sendo exibida na tela
*/
const setCurrentPage = (id, clear) => { currentPage = {id, clear}; };

/* Variavel que armazena os dados do pet a ser editado */
let pet = {};

/* Variavel que armazena o id do usuario ativo */
let objUser = '';
