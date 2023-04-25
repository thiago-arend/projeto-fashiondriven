// configuração axios
axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';

// variáveis globais
let userName;
const link = document.querySelector("input");

// monitora teclado para atualizar layout do botao
link.addEventListener(("keyup"), habilitaBotao);

// funções
function habilitaBotao() {
    const botao = document.querySelector("button");

    // validação da montagem da roupa
    const modelo = document.querySelector(".modelo");
    const gola = document.querySelector(".gola");
    const tecido = document.querySelector(".tecido");

    // validação input
    const regex = /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/gm;
    const passouRegex = link.value.match(regex) !== null; // flag guarda true se regex encontrou pelo menos um match

    // querySelector devolve null caso nao exista o nodo procurado (null é avaliado como false)
    if (modelo.querySelector(".selecionado")
        && gola.querySelector(".selecionado") 
        && tecido.querySelector(".selecionado")
        && passouRegex) 
    {
        botao.classList.add("validado");
        botao.disabled = false;
    }
    else
    {
        botao.classList.remove("validado");
        botao.disabled = true;
    }
}

function efeitosMontarBlusa(elemento){
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

    // atualiza o layout do botao
    habilitaBotao();
}

function fazerLogin() {
    userName = prompt("Entre com o seu nome: ");
}

function montarBlusa() {
    console.log('clicou')
}

fazerLogin();

