// =====================================
// SANTA ROSA MALHAS
// CONSULTA DE ESTOQUE
// =====================================

// URL da API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbx3UHWC6iOF3xUzACwU-PON-SNHLwsKs318-Ql7fZugT3qaGICninYmhYPFOMAXEpSX/exec";

const codigo = document.getElementById("codigo");
const btnPesquisar = document.getElementById("btnPesquisar");

const loading = document.getElementById("loading");

const resultado = document.getElementById("resultado");
const naoEncontrado = document.getElementById("naoEncontrado");

const resId = document.getElementById("resId");
const resNome = document.getElementById("resNome");
const resQtd = document.getElementById("resQtd");

const estoqueStatus = document.getElementById("estoqueStatus");

document.getElementById("ano").innerHTML = new Date().getFullYear();

btnPesquisar.addEventListener("click", pesquisar);

codigo.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        pesquisar();

    }

});

async function pesquisar(){

    let id = codigo.value.trim();

    if(id === ""){

        alert("Digite o código do produto.");

        codigo.focus();

        return;

    }

    mostrarLoading();

    try{

        const resposta = await fetch(
            `${API_URL}?id=${encodeURIComponent(id)}`
        );

        const dados = await resposta.json();

        esconderLoading();

        if(dados.encontrado){

            mostrarProduto(dados);

        }else{

            mostrarNaoEncontrado();

        }

    }catch(e){

        esconderLoading();

        alert("Erro ao consultar a planilha.");

        console.error(e);

    }

}

function mostrarLoading(){

    loading.classList.remove("hidden");

    resultado.classList.add("hidden");

    naoEncontrado.classList.add("hidden");

}

function esconderLoading(){

    loading.classList.add("hidden");

}

function mostrarNaoEncontrado(){

    resultado.classList.add("hidden");

    naoEncontrado.classList.remove("hidden");

}

function mostrarProduto(produto){

    naoEncontrado.classList.add("hidden");

    resultado.classList.remove("hidden");

    resId.innerHTML = produto.id;

    resNome.innerHTML = produto.nome;

    resQtd.innerHTML = produto.quantidade;

    atualizarStatus(produto.quantidade);

}

function atualizarStatus(qtd){

    qtd = Number(qtd);

    if(qtd <= 0){

        estoqueStatus.innerHTML =
        "🔴 Produto sem estoque";

        estoqueStatus.className =
        "estoque-status status-vermelho";

        return;

    }

    if(qtd <= 20){

        estoqueStatus.innerHTML =
        "🟡 Estoque baixo";

        estoqueStatus.className =
        "estoque-status status-amarelo";

        return;

    }

    estoqueStatus.innerHTML =
    "🟢 Produto disponível";

    estoqueStatus.className =
    "estoque-status status-verde";

}
