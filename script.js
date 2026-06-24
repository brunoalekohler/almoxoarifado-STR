// =====================================
// SANTA ROSA MALHAS
// CONSULTA DE ESTOQUE
// =====================================

// URL da API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbz0R_heJ6HZ_mrJZuerGE4XxCi-Fom9fcNxTpn1BK_SuLrIJoc2Zzt7l_sIEXgYnm1N/exec";

const codigo = document.getElementById("codigo");
const parametros = new URLSearchParams(window.location.search);

const idURL = parametros.get("id");

if(idURL){

    codigo.value=idURL;

    window.addEventListener("load",()=>{

        pesquisar();

    });

}
const btnPesquisar = document.getElementById("btnPesquisar");

const loading = document.getElementById("loading");

const resultado = document.getElementById("resultado");
const naoEncontrado = document.getElementById("naoEncontrado");

const resId = document.getElementById("resId");
const resNome = document.getElementById("resNome");
const resQtd = document.getElementById("resQtd");

const estoqueStatus = document.getElementById("estoqueStatus");
const fotoProduto = document.getElementById("fotoProduto");

document.getElementById("ano").textContent =
new Date().getFullYear();

btnPesquisar.addEventListener("click", pesquisar);

codigo.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        pesquisar();

    }

});

async function pesquisar(){

    const id = codigo.value.trim();

    if(id === ""){

        alert("Digite o ID do produto.");

        codigo.focus();

        return;

    }

    resultado.classList.add("hidden");
    naoEncontrado.classList.add("hidden");
    loading.classList.remove("hidden");

    try{

        const resposta = await fetch(

            `${API_URL}?id=${encodeURIComponent(id)}`

        );

        const produto = await resposta.json();

        loading.classList.add("hidden");

        if(!produto.encontrado){

            naoEncontrado.classList.remove("hidden");

            return;

        }

        mostrarProduto(produto);

    }

    catch(erro){

        console.error(erro);

        loading.classList.add("hidden");

        alert("Erro ao consultar a planilha.");

    }

}

function mostrarProduto(produto){

    resultado.classList.remove("hidden");

    resId.textContent = produto.id;

    resNome.textContent = produto.nome;

    resQtd.textContent = produto.quantidade;

    fotoProduto.src = produto.imagem;

    fotoProduto.onerror = function(){

        this.src =
        "https://placehold.co/500x500?text=Sem+Imagem";

    };

        atualizarStatus(produto.quantidade);

}

function atualizarStatus(qtd){

    qtd = Number(qtd);

    estoqueStatus.classList.remove(
        "status-verde",
        "status-amarelo",
        "status-vermelho"
    );

    if(qtd <= 0){

        estoqueStatus.classList.add("status-vermelho");

        estoqueStatus.innerHTML =
        "🔴 Produto sem estoque";

        return;

    }

    if(qtd <= 20){

        estoqueStatus.classList.add("status-amarelo");

        estoqueStatus.innerHTML =
        "🟡 Estoque baixo";

        return;

    }

    estoqueStatus.classList.add("status-verde");

    estoqueStatus.innerHTML =
    "🟢 Produto disponível";

}

// Coloca o cursor no campo ao abrir a página
window.addEventListener("load", () => {

    codigo.focus();

});

// Seleciona todo o conteúdo ao clicar no campo
codigo.addEventListener("focus", () => {

    codigo.select();

});


// ===========================================
// BOTÃO MOVIMENTAR
// ===========================================

const btnMovimentar = document.getElementById("btnMovimentar");

if(btnMovimentar){

    btnMovimentar.addEventListener("click",()=>{

        window.location.href="movimentar.html";

    });

}

// ===========================================
// ENTER PARA PESQUISAR
// ===========================================

codigo.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        pesquisar();

    }

});


// ===========================================
// FOCAR O CAMPO AO ABRIR
// ===========================================

window.onload=()=>{

    codigo.focus();

}
