
// axios https://www.npmjs.com/package/axios npm i axios // Se usa para recibir información desde una api

import dotenv from 'dotenv';
dotenv.config();

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

console.log( process.env.MAPBOX_KEY);

const main = async() => {

    let opcion;
    let busquedas = new Busquedas();

    do{

        console.clear();
        opcion = await inquirerMenu();

        switch( opcion ) {
            
            case 1:
                
                // Mostar mensaje
                const lugar = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad( lugar );

                 // Seleccionar el lugar
                const id = await listarLugares( lugares );
                if ( id ==='0' ) continue;

                const lugarSel = lugares.find( l => l.id === id );
                // Guardar DB
                busquedas.agregarHistorial( lugarSel.nombre );

                // Clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng )

                // Mostrar resultados
                //console.clear();
                console.log( '\nInformación de la ciudad:\n'.green);
                console.log( 'Ciudad:' , lugarSel.nombre.green );
                console.log( 'Lat:', lugarSel.lat );
                console.log( 'Lng:', lugarSel.lng );
                console.log( 'Temperatura:', clima.temp );
                console.log( 'Mínima:', clima.min );
                console.log( 'Máxima:', clima.max );
                console.log( 'clima:', clima.desc.green );
            
                break;
            
                case 2:
                    /*
                    busquedas.historial.forEach( ( lugar , i ) => {
                        const idx = `${ i + 1 }.`.green;
                        console.log(`${ idx } ${ lugar }`);
                    })
                    console.log( '**************' );
                    */
                    // busquedas.historialCapitalizado()
                    busquedas.historialCapitalizado2.forEach( ( lugar , i ) => {
                        const idx = `${ i + 1 }.`.green;
                        console.log(`${ idx } ${ lugar }`);
                    })
                break;

        }

        if ( opcion !== 0 ) {
            await pausa();
        }
            
    } while ( opcion !== 0 )

}

main();