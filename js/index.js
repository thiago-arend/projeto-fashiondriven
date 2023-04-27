// ============= configuração axios ==============
axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';
const urlGET = "https://mock-api.driven.com.br/api/v4/shirts-api/shirts";
const urlPOST = "https://mock-api.driven.com.br/api/v4/shirts-api/shirts";



// ======== variáveis globais gerais ===========
let userName;                                     // nome usuário
let criterioFiltro = "all";                       // criterio do filtro começa setado em todos
let idIntervaloMontarBlusa;                       // id do set intervalal para montar as blusas



// ====== variaveis para listeners globais ==========
const link = document.querySelector("input");        // input

// pega o fundo e o modal
const fundoModal = document.querySelector(".modal-fundo");
const modal = document.querySelector(".modal-conteudo");

// pega o botao confirmacao de encomenda
const btnConfirm = document.querySelector(".confirma");

// pega o botao de cancelar encomenda
const btnCancel = document.querySelector(".cancela");



// ========= listeners e funções anonimas globais =================
// monitora teclado para atualizar layout do botao
link.addEventListener(("keyup"), habilitaBotao);

// cancelar e confirmar encomenda de outra pessoa
const cancelar = function() {
    localStorage.clear();
    fundoModal.style.display = "none";
}

const confirmar = function() {
    // busca o objeto da local storage
    const objBlusa = JSON.parse(localStorage.getItem("pedido"));
    localStorage.clear();

    // refina o objeto para o post
    const obj = {model: objBlusa.model, neck: objBlusa.neck, material: objBlusa.material, 
        image: objBlusa.image, owner: userName, author: objBlusa.owner};

    // monta uma requisição post para envia a encomenda
    const promise = axios.post(urlPOST, obj);
    promise.then((res) => { // em caso de sucesso
        // limpa conteudo do modal e atualiza
        modal.innerHTML = "";
        modal.innerHTML = `<img src="${obj.image}" alt="">
            <div>
            <div>
            <h1>Pedido feito com sucesso!</h1>
            </div>
            <div>
            <button onclick="cancelar()" class="cancela">Fechar</button>
            </div>
            </div> `;
    });
    promise.catch((err) => { // em caso de erro
        // limpa conteudo do modal e atualiza
        modal.innerHTML = "";
        modal.innerHTML = `<img src="./images/Blusa-erro.png" alt="">
            <div>
            <div>
            <h1>Estamos com problemas para processar o seu pedido.</h1>
            </div>
            <div>
            <button onclick="cancelar()" class="cancela">Fechar</button>
            </div>
            </div> `;       
    });
}

// adiciona função de confirmar e cancelar encomenda
btnCancel.addEventListener("click", cancelar);
btnConfirm.addEventListener("click", confirmar);



// ======== funções de negócio ==============
// encomenda de blusa de outra pessoa
function encomendar(objBlusa) {
    // salva o objeto blusa em local storage
    localStorage.setItem("pedido", JSON.stringify(objBlusa));

    // traduz o objeto
    const objTrad = traduzObjeto(objBlusa);

    // abre o fundo e o modal
    fundoModal.style.display = "block";

    // atualiza o modal com os dados do encomenda
    modal.innerHTML = "";
    modal.innerHTML = `<img src="${objBlusa.image}" alt="">
        <div>
        <div>
        <h1>${objTrad[0]} com ${objTrad[1]} de ${objTrad[2]}</h1>
        <span><span>Criador: </span>${objBlusa.owner}</span>
        </div>
        <div>
        <button onclick="confirmar()" class="confirma">Confirmar <br>pedido</button>
        <button onclick="cancelar()" class="cancela">Cancelar</button>
        </div>
        </div>`;
}

// carrega as blusas criadas na tela
function renderizaBlusas() {
    // prepara a requisição get
    const promise = axios.get(urlGET);

    promise.then((resposta) => { // caso ok
        const listaBlusas = resposta.data;

        // renderiza
        const ultimosPedidos = document.querySelector(".ultimos-pedidos");
        ultimosPedidos.innerHTML = "";
        let blusasFiltradas;

        // aplica o filtro
        if (criterioFiltro !== "all") {
            blusasFiltradas = listaBlusas.filter((b) => b.model === criterioFiltro);
        }
        else {
            blusasFiltradas = listaBlusas;
        }

        // mostra na tela se houver blusas
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
        } // senão mostra mensagem
        else {
            ultimosPedidos.innerHTML = `<span class="erro-filtro-blusas">Sua busca não obteve resultados...</span>`;
        }

    });

    promise.catch(() => { // caso erro
        alert("Ocorreu um erro ao buscar as blusas! Tente novamente");
    });
}

// função que monitora o status do botao de encomenda (se está liberado ou nao)
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

    console.log(botao)
    console.log(botao.disabled)
    console.log("passouRegex ========= "+passouRegex)
}

// renderiza os efeitos do menu de filtros de pesquisa
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
        criterioFiltro = traduzNomePortIng(elemento.innerHTML);
    }

    // renderiza
    renderizaBlusas();
}

// renderiza os efeitos das opções de montagem de blusas
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

// login do usuário
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
function traduzNomePortIng(nome) {
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

// tradução inglês/português dos nomes para manter consistente o servidor
function traduzNomeIngPort(nome) {
    switch (nome.toLowerCase())
    {
        case "top-tank":
            return "camiseta";
            break;
        case "long":
            return "manga longa";
            break;
        case "v-neck":
            return "gola v"
            break;
        case "round":
            return "gola redonda";
            break;
        case "polo":
            return "gola polo";
            break;
        case "cotton":
            return "algodão";
            break;
        case "silk":
            return "seda";
            break;
        case "polyester":
            return "poliéster";
            break;
        default:
            return "t-shirt";
    }
}

// tradução dos dados de um objeto
function traduzObjeto(obj) {
    const listaTrad = [];
    listaTrad.push(traduzNomeIngPort(obj.model));
    listaTrad.push(traduzNomeIngPort(obj.neck));
    listaTrad.push(traduzNomeIngPort(obj.material));

    return listaTrad;
}

// remoção via dom de alguns efeitos de tela
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

// renderização do layout gerado ao receber erro de encomenda
function renderizaErroPedido(mensagem) {
    const container = document.querySelector(".conteudo");
    const conteudoAntes = container.innerHTML; // salva o conteudo anterior do container

    container.innerHTML = "";
    let templateErroPedido = `
    <div class="container-status-pedido-erro">
        <h1>Algo deu errado!</h1>
        <div><span class="status-erro">${mensagem}</span></div>
        <div><img src="./images/Blusa-erro.png" alt=""></div>
        <div><span class="timer">Voltando para a página principal em 10s</span></div>
    </div>`;
    container.innerHTML = templateErroPedido; // faz a troca do layout
    removeEfeitosTextoGenerico("erro"); // remove os efeitos para o acaso de erro

    // configuração do timer
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
        container.innerHTML = conteudoAntes; // carrega novamente os dados antigos da página

        // atualiza o layout do botao
        habilitaBotao();
        renderizaBlusas();
    }, 10000);
}

// renderização do layout gerado ao receber sucesso de encomenda
function renderizaSucessoPedido(urlImagem) {
    const container = document.querySelector(".conteudo");
    const conteudoAntes = container.innerHTML; // salva o conteudo anterior do container

    container.innerHTML = "";
    let templateSucessoPedido = `
    <div class="container-status-pedido">
        <h1>Pedido feito com sucesso!</h1>
        <img src="${urlImagem}" alt="">
        <div><span class="timer">Voltando para a página principal em 10s</span></div>
    </div>`;
    container.innerHTML = templateSucessoPedido;
    removeEfeitosTextoGenerico("sucesso"); // remove efeitos em caso de sucesso

    // configuração do timer
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

        // atualiza o layout do botao
        habilitaBotao();
        renderizaBlusas();

    }, 10000);
}

// montar blusa ao clicar no botao de criação de encomenda
function montarBlusa() {
    // dados para a requisição POST
    const itensSelecionados = document.querySelectorAll(".selecionado");
    const nomesItens = [];
    itensSelecionados.forEach((s) => {
        const divPai = s.parentNode;
        const textoSpan = divPai.querySelector("span").innerHTML;
        nomesItens.push(textoSpan);
    });
    const nomesItensTraduzidos = nomesItens.map((n) => traduzNomePortIng(n));
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
