
// https://docs.mapbox.com/playground/geocoding/?search_text=Tokyo%2C%20japo&proximity=ip&language=es&access_token=pk.eyJ1IjoiY2hyaXM3MTkiLCJhIjoiY2xldDNnbHY3MDJobDN4bzNnNjE5ZW9mMCJ9.rAT-ZaJGLFGhhBcTDUh-DQ


import fs from 'fs';
import axios from 'axios';

class Busquedas {

    historial = [];
    dbPath = './db/database.json';
    

    constructor() {
        this.leerDB();
    }

    /* 
    historialCapitalizado( ){  // Lo mismo de abajo pero como función
        
        this.historial.forEach( ( lugar, i) => {
            const arr = lugar.split(" ");
            for (var j = 0; j < arr.length; j++) {
                arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1);
            
            }
            const str2 = arr.join(" ");
            const idx = `${ i + 1 }.`.green;
            console.log(`${ idx } ${ str2 }`);
        })

         //return this.historial;
    }
    */

   get historialCapitalizado2() {       // Lo mismo de arriba pero como get
    const historial2 = [];
    this.historial.forEach( ( lugar, i) => {
        const arr = lugar.split(" ");
        for (var j = 0; j < arr.length; j++) {
            arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1);
        }
        const str2 = arr.join(" ");
        historial2.push( str2 );
    })
    return historial2;
   }

    get paramsMapbox() {
        return {
            'language':'es',
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
        }
    }

    get paramsOpernWeatherMap() {
        return {
            'appid': process.env.OPENWEATHER_KEy,
            'units':'metric',
            'lang':'es',
        }
    }

    async ciudad( lugar = '' ) {

        // Petición http
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            params: this.paramsMapbox
        })

        const resp = await instance.get();
        //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Tokyo%2C%20japo.json?proximity=ip&language=es&access_token=pk.eyJ1IjoiY2hyaXM3MTkiLCJhIjoiY2xldDNrOWZnMGIyMjN4czkxZGNzNGtsNSJ9.7Y-LTkMK9d3jFS4SWbuADA');
        return resp.data.features.map( lugar => ({      // Esté nuevo ({}) significa que voy a devolver un objeto de dorma implicita
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1],
        }));


    }

    async climaLugar( lat, lon ) {
        try {

            const instance = axios.create({
                //baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }&appid=${ process.env.OPENWEATHER_KEy }&units=metric&lang=es`,
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsOpernWeatherMap, lat, lon }
            })
            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min:  main.temp_min,
                max:  main.temp_max,
                temp: main.temp,
            }
        } catch( error ) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {

        if( this.historial.includes (lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,5); // para qeu muestre solo los ultimos 6 registros del historial

        this.historial.unshift( lugar.toLocaleLowerCase() );
        
        // Grabar historial
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));

    }

    leerDB( ){

        if (!fs.existsSync(this.dbPath) ) {
            return null;
        }
    
        const info = fs.readFileSync( this.dbPath, 'utf8' );        // Retorna lo guardado en el .json como un string
        const data = JSON.parse( info );                        // Convierte lo cuardado del .json en un arreglo
        this.historial = data.historial;
    }

}

export {
    Busquedas,
}