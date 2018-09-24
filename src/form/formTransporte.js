import React from 'react';
import t from 'tcomb-form-native';
//const Form = t.form.Form;

export const Transporte = t.struct({
	titulo: t.String,
	hora: t.Date,
	fecha: t.Date,
	pasajeros: t.Number,
	precio: t.Number
});

export const options = {
	fields:{
		titulo:{
			label : 'Título',
			placeholder: 'Viaje Ricolin'
		},
		hora:{
			label: 'Hora de inicio',
			mode: 'time'
		},
		fecha:{
			label: 'Fecha de ejecución',
			mode: 'date'
		},
		pasajeros:{
			label: 'Cantidad de pasajeros',
			placeholder: '4'
		},
		precio:{
			label: 'Precio del pasaje (Bs)',
			placeholder: '4.5'
		}
	}
};