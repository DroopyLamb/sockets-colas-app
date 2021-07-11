const TicketControl = require("../models/ticket-control");

// Creamos una instancia de la clase TicketControl, 
// al crear la instancia, se ejecutará el constructor y ejecutar´
// la clase.
const ticketControl = new TicketControl();


const socketController = (socket) => {

    // Eventos que se disparan cuando un nuevo cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets);

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        // enviamos en el callback el ticket creado
        callback(siguiente);

        // tickets pendientes por asignar
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets);

    });

    // Evento para atender socket
    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }


        // TODO: Notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        // Emitir tickets pendientes
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets);

        // Ticket para atender
        const ticket = ticketControl.atenderTicket(escritorio);

        if (!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            return callback({
                ok: true,
                ticket
            });
        }

    });

}



module.exports = {
    socketController
}

