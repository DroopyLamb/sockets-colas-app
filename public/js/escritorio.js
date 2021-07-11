
/* 
    -----------------------------------------------------------------------
                        Referencias HTML
    -----------------------------------------------------------------------
*/

const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');



/*  
    A la hora de enviare el escritorio desde la visa index.html
    ese input tiene el parámetro name="escritorio", y ese valor
    es el que vamos a validar que venga a la hora de hacer click
    en enviar. 
    Validamos que mandamos el parámetro escritorio
*/
const searchParams = new URLSearchParams(window.location.search);


// si ese parámentro no viene, lo redireccionaremos al index.html
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

//  Saber en qué escritorio me encuentro
// Veremos el valor  lo que mandamos en el input:escritorio
const escritorio = searchParams.get('escritorio');

/* 
    -----------------------------------------------------------------------
                                Socket.io
    -----------------------------------------------------------------------
*/

// Elementos de la interface escritorio
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';



const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnAtender.disable = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnAtender.disable = false;
});



// Tickets pendientes
socket.on('tickets-pendientes', (pendientes) => {
    console.log(pendientes.length)
    // si no hay tickets
    if (pendientes.length === 0){
        lblPendientes.innerText = '';
    }else{
        lblPendientes.innerText = pendientes.length;
    }

});


btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, msg, ticket }) => {

        // if ok es false
        if (!ok) {
            divAlerta.innerText = msg;
            return divAlerta.style.display = '';
        }

        // Si no hay errores, significa que tengo un ticket
        lblTicket.innerText = `Ticket: ${ticket.numero}`;
    });

});