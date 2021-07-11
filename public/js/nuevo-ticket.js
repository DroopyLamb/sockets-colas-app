// Referencias del HTML
const lblNuevoTicket  = document.querySelector('#lblNuevoTicket');
const btnCrear  = document.querySelector('button');

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnCrear.disable = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnCrear.disable = false;
});

// Mostrar último ticket, mensaje emitido desde el servidor
socket.on('ultimo-ticket', (ultimoTicket) => {
    lblNuevoTicket.innerText = 'Ticket '+ ultimoTicket;
});


btnCrear.addEventListener( 'click', () => {
    
    socket.emit('siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText =  ticket;
    });

});