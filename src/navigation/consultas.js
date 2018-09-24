
registrar los datos de detalle
var d= database.ref().child('transporte').child('-LN1UK-W6Hm0Edb0DDn6').child('detallePasajero').push().update({ubicacion:{latitude:0,longitude:0},pago:false,precio:5,idUser:123,inicio:false,fin:false});

registrar usuario nuevos
database.ref().child('users').child('identificador del usuario').child('detallePasajero').update({ubicacion:{latitude:0,longitude:0},pago:false,precio:5,idUser:123,inicio:false});


existe campo