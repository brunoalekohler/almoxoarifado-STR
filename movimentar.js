// ===========================================
// SANTA ROSA MALHAS
// MOVIMENTAR ESTOQUE
// ===========================================

// URL do seu Apps Script
const API =
"https://script.google.com/macros/s/AKfycbz0R_heJ6HZ_mrJZuerGE4XxCi-Fom9fcNxTpn1BK_SuLrIJoc2Zzt7l_sIEXgYnm1N/exec";

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


// ===========================================
// REGISTRAR MOVIMENTAÇÃO
// ===========================================

btnRegistrar.addEventListener("click", registrarMovimentacao);

async function registrarMovimentacao(){

    esconderMensagem();

    if(idProduto.value.trim() == ""){

        mostrarMensagem(
            "Leia o QR Code do produto.",
            false
        );

        return;

    }

    const tipo = document.querySelector(
        "input[name='tipo']:checked"
    );

    if(!tipo){

        mostrarMensagem(
            "Selecione Entrada ou Saída.",
            false
        );

        return;

    }

    if(quantidade.value.trim() == ""){

        mostrarMensagem(
            "Informe a quantidade.",
            false
        );

        return;

    }

    const qtd = Number(quantidade.value);

    if(qtd <= 0){

        mostrarMensagem(
            "Quantidade inválida.",
            false
        );

        return;

    }

    const estoque = Number(estoqueAtual.innerText);

    if(tipo.value == "saida" && qtd > estoque){

        mostrarMensagem(
            "Estoque insuficiente.",
            false
        );

        return;

    }

    const cpfLimpo = cpf.value.replace(/\D/g,"");

    if(cpfLimpo.length != 11){

        mostrarMensagem(
            "CPF inválido.",
            false
        );

        return;

    }

    if(!confirm(

`Confirma esta movimentação?

Produto: ${nomeProduto.innerText}

Tipo: ${tipo.value.toUpperCase()}

Quantidade: ${qtd}

CPF: ${cpf.value}`

    )){

        return;

    }

    btnRegistrar.disabled = true;

    btnRegistrar.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';

    try{

        const resposta = await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                id:idProduto.value,

                tipo:tipo.value,

                quantidade:qtd,

                cpf:cpfLimpo

            })

        });

        const retorno = await resposta.json();

        if(retorno.sucesso){

            mostrarMensagem(

                "Movimentação registrada com sucesso.",

                true

            );

            limparFormulario();

        }else{

            mostrarMensagem(

                retorno.mensagem,

                false

            );

        }

    }catch(e){

        mostrarMensagem(

            "Erro ao registrar movimentação.",

            false

        );

    }

    btnRegistrar.disabled = false;

    btnRegistrar.innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Registrar Movimentação';

}

// ===========================================
// LIMPAR FORMULÁRIO
// ===========================================

function limparFormulario(){

    idProduto.value="";

    nomeProduto.innerHTML="";

    estoqueAtual.innerHTML="";

    fotoProduto.src="";

    quantidade.value="";

    cpf.value="";

    produtoBox.classList.add("hidden");

    document
    .querySelectorAll("input[name='tipo']")
    .forEach(r=>r.checked=false);

}

// ===========================================
// MENSAGENS
// ===========================================

function mostrarMensagem(texto,sucesso){

    mensagem.classList.remove(
        "hidden",
        "sucesso",
        "erro"
    );

    mensagem.classList.add(

        sucesso
        ? "sucesso"
        : "erro"

    );

    mensagem.innerHTML=texto;

}

function esconderMensagem(){

    mensagem.classList.add("hidden");

}

// ===========================================
// MÁSCARA CPF
// ===========================================

cpf.addEventListener("input",()=>{

    let valor = cpf.value.replace(/\D/g,"");

    valor = valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    valor = valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    valor = valor.replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
    );

    cpf.value = valor;

});
