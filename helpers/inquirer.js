// Aqui se encuentran almacenadas todas las funciones referentes al menú
import inquirer from 'inquirer';
import read from 'readline';
import colors from 'colors';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            { value: 1, name: `${'1'.green}. Buscar ciudad`  },
            { value: 2, name: `${'2'.green}. Historial` },
            { value: 0, name: `${'0'.green}. Salir` },
         ]
    }
];

const inquirerMenu = async() => {
    
    //console.clear();
    console.log(' ===================== '.green);
    console.log(' Seleccione una opción '.green);
    console.log(' ===================== '.green);

    const { opcion } = await inquirer.prompt( preguntas );
    return opcion;
}

const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`,
        }
    ];

    await inquirer.prompt(question);

}

const leerInput = async( message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){                              // Para validar que el leerInput contenga un mensaje
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]

    const { desc } = await inquirer.prompt(question);
    return desc;

}

const listarLugares = async( lugares = []) => {

    const choices = lugares.map( ( lugar, i ) => {

        const idx = ` ${i +1}. `.green;

        return {
            value: lugar.id,
            name: `${idx} ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt( preguntas );
    return id;
    
}

const confirmar = async(message) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt( pregunta );
    return ok;

}

const listadoTareasConfirmar = async( tareas = []) => {

    const choices = tareas.map( ( tarea, i ) => {

        const idx = ` ${i +1}. `.green;

        return {
            value: tarea.id,
            name: `${idx} ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt( pregunta );
    return ids;
    
}


export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    listadoTareasConfirmar
}