// configuração axios
axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';
const urlGET = "https://mock-api.driven.com.br/api/v4/shirts-api/shirts";
const urlPOST = "https://mock-api.driven.com.br/api/v4/shirts-api/shirt";

// variáveis globais
let userName;                                        // nome usuário
const link = document.querySelector("input");        // input
let criterioFiltro = "all";                       // criterio do filtro começa setado em todos
let idIntervaloMontarBlusa;                         // id do set intervalal para montar as blusas

// monitora teclado para atualizar layout do botao
link.addEventListener(("keyup"), habilitaBotao);

// funções
function encomendar(objBlusa) {
    const encomendou = confirm("Deseja realmente encomendar essa peça?");
    if (encomendou)
        alert(`=> CONFIRMAÇÃO DE ENCOMENDA <=\n
                * Modelo: ${objBlusa.model} *\n
                * Gola: ${objBlusa.neck} *\n
                * Material: ${objBlusa.material} *`);
}

function renderizaBlusas() {
    // lista blusas
    const promise = axios.get(urlGET);

    promise.then((resposta) => {
        const listaBlusas = resposta.data;

        // renderiza
        const ultimosPedidos = document.querySelector(".ultimos-pedidos");
        ultimosPedidos.innerHTML = "";
        let blusasFiltradas;

        if (criterioFiltro !== "all") {
            blusasFiltradas = listaBlusas.filter((b) => b.model === criterioFiltro);
        }
        else {
            blusasFiltradas = listaBlusas;
        }

        if (blusasFiltradas.length !== 0) {
            blusasFiltradas.forEach((b) => {
                ultimosPedidos.innerHTML += `<div>
                    <img src="${b.image}" alt="">
                    <span><span>Criador: </span><span>${b.owner}</span></span>
                    </div>`;
            });

            // usamos o indice do vetor nodeList e os dados do vetor de objetos lado a lado
            const listaEncomendas = document.querySelectorAll(".ultimos-pedidos div");
            for (let i = 0; i < listaEncomendas.length; i++){
                listaEncomendas[i].addEventListener("click", () => encomendar(blusasFiltradas[i]));
                //console.log(i + ", " + blusasFiltradas[i].image);
            }
        }
        else {
            ultimosPedidos.innerHTML = `<span class="erro-filtro-blusas">Sua busca não obteve resultados...</span>`;
        }

    });

    promise.catch(() => {
        alert("Ocorreu um erro ao buscar as blusas! Tente novamente");
    });
}

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

function efeitosFiltroPesquisa(elemento) {

    const selecionado = elemento.classList.contains("opcao-selecionada");

    if (!selecionado) { // se clicou em um item não selecionado
        // seleciona menu
        const menu = elemento.parentNode;

        // seleciona as divs do menu
        const listaOpcoes = menu.querySelectorAll(".menu-op");
        // remove o efeito de todos os itens
        listaOpcoes.forEach((o) => o.classList.remove("opcao-selecionada"));
        // adiciona o efeito apenas no desejado
        elemento.classList.toggle("opcao-selecionada");
        // guarda informação do selecionado
        criterioFiltro = traduzNome(elemento.innerHTML);
    }

    // renderiza
    renderizaBlusas();
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

// tradução portugês/inglês dos nomes para manter consistente o servidor
function traduzNome(nome) {
    switch (nome.toLowerCase())
    {
        case "camiseta":
            return "top-tank";
            break;
        case "manga longa":
            return "long";
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
            break;
        case "todos os modelos":
            return "all";
            break;
        default:
            return "t-shirt";
    }
}

function removeEfeitosTextoGenerico(tipoMensagem) {
    if (tipoMensagem === "sucesso")
    {
        const span = document.querySelector(".container-status-pedido span");
        span.style.textShadow = "none";
        const containerPedido = document.querySelector(".container-status-pedido");
        containerPedido.style.marginTop = 65 + "px";
    }
    else if (tipoMensagem === "erro")
    {
        const spanErro1 = document.querySelector(".status-erro");
        const spanErro2 = document.querySelector(".timer");
        spanErro1.style.textShadow = "none";
        spanErro2.style.textShadow = "none";

        const containerPedidoErro = document.querySelector(".container-status-pedido-erro");
        containerPedidoErro.style.marginTop = 65 + "px";
    }
}

function renderizaErroPedido(mensagem) {
    const container = document.querySelector(".conteudo");
    const conteudoAntes = container.innerHTML;
    
    container.innerHTML = "";
    let templateErroPedido = `
    <div class="container-status-pedido-erro">
        <h1>Algo deu errado!</h1>
        <div><span class="status-erro">${mensagem}</span></div>
        <div><img src="./images/Blusa-erro.png" alt=""></div>
        <div><span class="timer">Voltando para a página principal em 10s</span></div>
    </div>`;
    container.innerHTML = templateErroPedido;
    removeEfeitosTextoGenerico("erro");

    // atualiza timer 10 segundos
    let i = 10;
    let span = document.querySelector(".timer");
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

        renderizaBlusas();
    }, 10000);
}

function renderizaSucessoPedido(urlImagem) {
    const container = document.querySelector(".conteudo");
    const conteudoAntes = container.innerHTML;

    container.innerHTML = "";
    let templateSucessoPedido = `
    <div class="container-status-pedido">
        <h1>Pedido feito com sucesso!</h1>
        <img src="${urlImagem}" alt="">
        <div><span class="timer">Voltando para a página principal em 10s</span></div>
    </div>`;
    container.innerHTML = templateSucessoPedido;
    removeEfeitosTextoGenerico("sucesso");

    // atualiza timer 10 segundos
    let i = 10;
    let span = document.querySelector(".timer");
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

        renderizaBlusas();

    }, 10000);
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
    const nomesItensTraduzidos = nomesItens.map((n) => traduzNome(n));
    const camiseta = {
                    "model": nomesItensTraduzidos[0], 
                    "neck": nomesItensTraduzidos[1], 
                    "material": nomesItensTraduzidos[2], 
                    "image": link.value, 
                    "owner": userName, 
                    "author": userName};

    // construção da requisição
    const promise = axios.post(urlPOST, camiseta);
    promise.then((res) => { renderizaSucessoPedido(res.data.image) });
    promise.catch((erro) => {
        const codigo = erro.response.status;
        let mensagem = "";
        if (codigo === 422)
            mensagem = "Parece que algum campo não foi preenchido da maneira correta. Tente novamente!";
        else
            mensagem = "Estamos enfrentando alguns problemas internos. Tente novamente mais tarde!"
        renderizaErroPedido(mensagem);
    });
}

fazerLogin();
renderizaBlusas();
