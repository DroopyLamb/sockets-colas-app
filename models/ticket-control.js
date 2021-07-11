
const path = require('path');
const fs = require('fs');


// modelo del ticket
class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;

    }
}




class TicketControl {

    constructor() {
        // Último ticket atendido
        this.ultimo = 0;
        // Fecha actual
        this.hoy = new Date().getDate();
        // Cola de tickets
        this.tickets = [];
        // Cola Últimos 4 tickets
        this.ultimos4 = [];

        this.init();

    }

    // Propiedades que quiero grabar
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }


    init() {
        // Obtener información del archivo JSON
        const { ultimo, hoy, tickets, ultimos4, } = require('../db/data.json');

        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro día reinicia la base de datos
            this.guardarDB();
        }
    }

    guardarDB() {
        // ruta donde guardaremos
        const dbPath = path.join(__dirname, '../db/data.json');

        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente() {
        // Creamos un número de ticket creado
        this.ultimo += 1;

        // Instancia de la clase ticket la cual rellenamos 
        // donde this.ultimo es el número de ticket creado hasta ahora
        // escritorio será null porque significa que ese ticket no se ha
        // asignado a ningún escritorio
        const ticket = new Ticket(this.ultimo, null);

        // Lo incluimos en nuestro array contenedor de tickets
        this.tickets.push(ticket);

        // Guardamos en la base dedatos
        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio) {

        // Si no tenemos tickets
        if (this.tickets.length === 0) {
            return null;
        }

        // Si hay tickets 
        // Tomamos el primer ticket y lo eliminamos del
        // array de tickets y lo almacenamos en la variable ticket
        const ticket = this.tickets.shift();

        console.log(ticket);
        ticket.escritorio = escritorio;

        // Añadimos un elemento nuevo al arreglo al inicio
        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4) {
            // Si tiene más de 4 elementos, quitará el último
            // elemento del arreglo
            this.ultimos4.splice(-1, 1);
        }


        this.guardarDB();

        // Retornará null si no hay tickets por atender 
        // o retornará el ticket que ese escritorio tiene que atender
        return ticket;
    }
}


module.exports = TicketControl;