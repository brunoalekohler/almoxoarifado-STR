function sucesso(texto){

    const audio = new Audio("sons/bip.mp3");
    audio.play();

    if(navigator.vibrate){
        navigator.vibrate(200);
    }

    setTimeout(() => {

        window.location.href = texto;

    }, 150);

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
