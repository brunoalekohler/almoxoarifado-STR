// ===========================================
// SANTA ROSA MALHAS
// MOVIMENTAR ESTOQUE
// ===========================================

// URL do seu Apps Script
const API =
"https://script.google.com/macros/s/AKfycbwkg3qBx_txHmMcsopxxgYK2G98v2-wj13KvG0mnIvEhbZdw6CDo_doBbKj6Fu4jGBm/exec";

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

const valorUnitario =
document.getElementById("valorUnitario");

const grupoValor =
document.getElementById("grupoValor");

document.getElementById("ano").innerHTML =
new Date().getFullYear();

let scanner;

// ===========================================
// VALOR UNITÁRIO APENAS PARA ENTRADA
// ===========================================

document
.querySelectorAll("input[name='tipo']")
.forEach(r=>{

    r.addEventListener("change",()=>{

        if(r.checked && r.value==="entrada"){

            grupoValor.classList.remove("hidden");

        }else{

            grupoValor.classList.add("hidden");

            valorUnitario.value="";

        }

    });

});

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

    const audio = new Audio("sons/bip.mp3");
    audio.play();

    if(navigator.vibrate){
        navigator.vibrate(200);
    }

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

    let valor = 0;

        if(tipo.value==="entrada"){
        
            if(valorUnitario.value.trim()==""){
        
                mostrarMensagem(
                    "Informe o valor unitário.",
                    false
                );
        
                return;
        
            }
        
            valor = Number(
                valorUnitario.value
                .replace(",",".")
            );
        
            if(isNaN(valor) || valor<=0){
        
                mostrarMensagem(
                    "Valor unitário inválido.",
                    false
                );
        
                return;
        
            }
        
        }

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

let mensagemConfirmacao =

`Confirma esta movimentação?

Produto: ${nomeProduto.innerText}

Tipo: ${tipo.value.toUpperCase()}

Quantidade: ${qtd}
`;

if(tipo.value==="entrada"){

    mensagemConfirmacao +=
`Valor Unitário: R$ ${valor.toFixed(2).replace(".",",")}

`;

}

mensagemConfirmacao +=
`CPF: ${cpf.value}`;

if(!confirm(mensagemConfirmacao)){

    return;

}

    btnRegistrar.disabled = true;

try{

    const url =
        API +
        "?acao=movimentar" +
        "&id=" + encodeURIComponent(idProduto.value) +
        "&tipo=" + encodeURIComponent(tipo.value) +
        "&quantidade=" + encodeURIComponent(qtd) +
        "&cpf=" + encodeURIComponent(cpfLimpo) +
        "&valor=" + encodeURIComponent(valor);

    const resposta = await fetch(url);

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

    console.error(e);

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

    valorUnitario.value="";

    grupoValor.classList.add("hidden");

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
