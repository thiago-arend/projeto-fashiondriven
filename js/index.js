// configuração axios
axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';
const urlGET = "https://mock-api.driven.com.br/api/v4/shirts-api/shirts";
const urlPOST = "https://mock-api.driven.com.br/api/v4/shirts-api/shirts";

// variáveis globais
let userName;                                        // nome usuário
const link = document.querySelector("input");        // input
const blusas = []                                    // blusas do servidor
const idsAleatorios = [];                           // ids aleatorios e nao repetidos para o POST ao servidor
let idIntervaloMontarBlusa;                         // id do set intervalal para montar as blusas

// monitora teclado para atualizar layout do botao
link.addEventListener(("keyup"), habilitaBotao);

// funções
// function listaBlusas() {

// }

function habilitaBotao() {
    const botao = document.querySelector("button");   // button

    // validação da montagem da roupa
    const modelo = document.querySelector(".modelo"); // div modelo
    const gola = document.querySelector(".gola");     // div gola
    const tecido = document.querySelector(".tecido"); // div tecido

    // validação input
    const regexValidaInput = /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/gm; // regex para validação da url do input
    const passouRegex = link.value.match(regexValidaInput) !== null; // flag guarda true se regex encontrou pelo menos um match

    // querySelector devolve null caso nao exista o nodo procurado (null é avaliado como false)
    if (modelo.querySelector(".selecionado")    // se foi selecionado item em modelo && 
        && gola.querySelector(".selecionado")   // em gola && 
        && tecido.querySelector(".selecionado") // em tecido &&
        && passouRegex)                         // a flag de validação do input for verdadeira
    {
        botao.classList.add("validado");        // altera layout do botao e habilita
        botao.disabled = false;
    }
    else                                        // senão
    {
        botao.classList.remove("validado");     // altera layout do botao e desabilita
        botao.disabled = true;
    }
}

function efeitosMontarBlusa(elemento){
    // querySelector devolve null caso nao exista o nodo procurado (null é avaliado como false)
    const selecionado = elemento.querySelector(".selecionado");
    if (selecionado) { // se clicou em um item já selecionado
        selecionado.classList.toggle("selecionado"); // altera seu estilo
    }
    else { // senão, se clicou em um item ainda não selecionado
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

    if (userName == "" || userName == undefined || userName == null) { // se o nome é iválido
        alert("Digite um nome válido!"); // recarrega a página com msg de erro
        window.location.reload();
    }

    // userName válido; atualiza layout
    document.querySelector(".header div > span span").innerHTML = userName;
}

function geraIdAleatorio(min, max) {
    if (idsAleatorios.length < (max - min + 1)) // se há menos elementos no vetor que o inervalo válido para geração de ids
    {
        let num = Math.round(Math.random() * (max - min) + min);
        while (idsAleatorios.includes(num)) { // gera id enquanto o id ainda nao tiver sido incluído na lista
            num = Math.round(Math.random() * (max - min) + min);
        }
        idsAleatorios.push(num); // depois de garantido que o id não estava na lista, insere
    
        return num; // retorna id aleatorio
    }
}

// tradução portugês/inglês dos nomes para manter consistente o servidor
function traduzNome(nome) {
    switch (nome.toLowerCase())
    {
        case "camiseta":
            return "top-tank";
            break;
        case "manga longa":
            return "long-sleeved";
            break;
        case "gola v":
            return "v-neck"
            break;
        case "gola redonda":
            return "round";
            break;
        case "gola polo":
            return "polo";
            break;
        case "algodão":
            return "cotton";
            break;
        case "seda":
            return "silk";
            break;
        case "poliéster":
            return "polyester";
        default:
            return "t-shirt";
    }
}

function montarBlusa() {
    // dados para a requisição POST
    const itensSelecionados = document.querySelectorAll(".selecionado");
    const nomesItens = [];

    itensSelecionados.forEach((s) => {
        const divPai = s.parentNode;
        const textoSpan = divPai.querySelector("span").innerHTML;
        nomesItens.push(textoSpan);
    });

    const id = geraIdAleatorio(5800, 5900);
    const camiseta = {"id": id, 
                    "model": nomesItens[0], 
                    "neck": nomesItens[1], 
                    "material": nomesItens[2], 
                    "owner": userName, 
                    "image": link.value};

    const nomesItensTraduzidos = nomesItens.map((n) => traduzNome(n));

    const container = document.querySelector(".conteudo");
    const conteudoAntes = container.innerHTML;
    container.innerHTML = "";
    let templateSucessoPedido = `
    <div class="container-sucesso-pedido">
        <h1>Pedido feito com sucesso!</h1>
        <img src="./images/Blusa1.png" alt="">
        <div><span>Voltando para a página principal em 10s</span></div>
    </div>`;
    container.innerHTML = templateSucessoPedido;

    // atualiza timer 10 segundos
    let i = 10;
    let span = document.querySelector(".container-sucesso-pedido span");
    idIntervaloMontarBlusa = setInterval(() => {
        i--;
        if (i !== 0) { // consicional apenas para não exibir o 0 ao final
            span.innerHTML = `Voltando para a página principal em ${i}s`;
        }
        
    }, 1000);

    // agenda volta para a tela antiga
    setTimeout(() => {
        clearInterval(idIntervaloMontarBlusa);
        container.innerHTML = conteudoAntes;

        // limpa os campos
        link.value = "";
        // seleciona os itens marcados
        const itensSelecionados = document.querySelectorAll(".selecionado");
        // remove o efeito de todos os itens marcados
        itensSelecionados.forEach((c) => c.classList.remove("selecionado"));

    }, 10000);

    // construção da requisição
    const promise = axios.post(urlPOST, camiseta);
    promise.then((resposta) => {
        console.log(resposta);
    });
    promise.catch((erro) => {
        console.log(erro);
        alert("Ops, não conseguimos processar sua encomenda");
    });
}

fazerLogin();

