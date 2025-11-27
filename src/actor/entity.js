export class Actor {
    constructor(nombre, edad, nacionalidad, peliculas = []) {
        this.nombre = nombre;
        this.edad = edad;
        this.nacionalidad = nacionalidad;
        this.peliculas = peliculas; // Array de IDs de películas
    }
}
