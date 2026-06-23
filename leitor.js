function sucesso(texto){

    window.location.href = texto;

}

function erro(){

}

const scanner = new Html5QrcodeScanner(

    "reader",

    {

        fps:10,

        qrbox:250

    },

    false

);

scanner.render(sucesso,erro);
