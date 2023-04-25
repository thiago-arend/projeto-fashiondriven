// configuração axios
axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';

// variáveis globais
let userName;

// funções
function validaMontarRoupa() {
    // validação da montagem da roupa
    const modelo = document.querySelector(".modelo");
    const gola = document.querySelector(".gola");
    const tecido = document.querySelector(".tecido");

    // querySelector devolve null caso nao exista o nodo procurado (null é avaliado como false)
    if (!modelo.querySelector(".selecionado")
        || !gola.querySelector(".selecionado") 
        || !tecido.querySelector(".selecionado")) 
    {

        alert("Selecione o modelo, a gola e o tecido de sua camiseta!");
    }

    // validação do input
    const link = document.querySelector("input");
    const regex = /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/gm;
    const passouRegex = link.value.match(regex) !== null; // flag guarda true se regex encontrou pelo menos um match

    if (link.value === "") {
        alert("O link deve ser preenchido para montar a sua roupa!");
    }
    else if (link.value === null || link.value === undefined || !passouRegex)
    {
        alert("Link Inválido! Tente novamente!");
    }
}

function efeitosMontarRoupa(elemento){
    // querySelector devolve null caso nao exista o nodo procurado (null é avaliado como false)
    const selecionado = elemento.querySelector(".selecionado");
    if (selecionado) { // clicou em um item já selecionado
        selecionado.classList.toggle("selecionado");
    }
    else { // clicou em um item ainda não selecionado
        // seleciona categoria
        const categoria = elemento.parentNode;
        // seleciona os círculos da categoria
        const circulos = categoria.querySelectorAll(".circulo");
        // remove o efeito de todos os círculos
        circulos.forEach((c) => c.classList.remove("selecionado"));
        // adiciona o efeito apenas no desejado
        elemento.querySelector(".circulo").classList.toggle("selecionado");
    }
}

function fazerLogin() {
    userName = prompt("Entre com o seu nome: ");
}

function montarBlusa() {
    validaMontarRoupa();
}

fazerLogin();

