// ===========================================
// SANTA ROSA MALHAS
// MOVIMENTAR ESTOQUE
// ===========================================

// URL do seu Apps Script
const API =
"https://SEU_SCRIPT.exec";

// Elementos
const btnCamera = document.getElementById("btnAbrirCamera");

const reader = document.getElementById("reader");

const idProduto = document.getElementById("idProduto");

const nomeProduto = document.getElementById("nomeProduto");

const estoqueAtual = document.getElementById("estoqueAtual");

const fotoProduto = document.getElementById("fotoProduto");

const produtoBox = document.getElementById("produtoBox");

const quantidade = document.getElementById("quantidade");

const cpf = document.getElementById("cpf");

const mensagem = document.getElementById("mensagem");

const btnRegistrar = document.getElementById("btnRegistrar");

document.getElementById("ano").innerHTML =
new Date().getFullYear();

let scanner;

// ===========================================
// ABRIR CAMERA
// ===========================================

btnCamera.addEventListener("click", abrirCamera);

function abrirCamera(){

    reader.classList.remove("hidden");

    scanner = new Html5QrcodeScanner(

        "reader",

        {

            fps:10,

            qrbox:250

        },

        false

    );

    scanner.render(qrLido,erroLeitura);

}

// ===========================================
// QR CODE LIDO
// ===========================================

function qrLido(texto){

    scanner.clear();

    reader.classList.add("hidden");

    let id;

    try{

        const url = new URL(texto);

        id = url.searchParams.get("id");

    }catch{

        id = texto;

    }

    idProduto.value = id;

    buscarProduto(id);

}

// ===========================================
// IGNORAR ERROS DO LEITOR
// ===========================================

function erroLeitura(){

}

// ===========================================
// BUSCAR PRODUTO
// ===========================================

async function buscarProduto(id){

    produtoBox.classList.add("hidden");

    esconderMensagem();

    try{

        const resposta = await fetch(

            API + "?id=" + encodeURIComponent(id)

        );

        const dados = await resposta.json();

        if(!dados.encontrado){

            mostrarMensagem(

                "Produto não encontrado.",

                false

            );

            return;

        }

        nomeProduto.innerHTML = dados.nome;

        estoqueAtual.innerHTML =
        dados.quantidade;

        if(dados.imagem){

            fotoProduto.src =
            dados.imagem;

        }else{

            fotoProduto.src =
            "sem-imagem.png";

        }

        produtoBox.classList.remove("hidden");

    }

    catch(e){

        mostrarMensagem(

            "Erro ao consultar o produto.",

            false

        );

    }

}
