import { client } from "../common/db.js";
import { ObjectId } from "mongodb";
import { Pelicula } from "./pelicula.js";

const db = client.db("cine-db");
export const peliculaCollection = db.collection("peliculaCollection");

export function handleInsertPeliculaRequest(req, res) {
  const data = req.body;

  const nuevaPelicula = {
    ...Pelicula,
    nombre: data.nombre,
    generos: Array.isArray(data.generos) ? data.generos : [],
    anioEstreno: Number(data.anioEstreno) || 0,
  };

  peliculaCollection
    .insertOne(nuevaPelicula)
    .then(() => {
      res.status(201).json({});
    })
    .catch((error) => {
      console.error("Error al insertar película:", error);
      res.status(500).json({ mensaje: "Error al insertar película" });
    });
}

export function handleGetPeliculasRequest(req, res) {
  peliculaCollection
    .find({})
    .toArray()
    .then((peliculas) => {
      res.status(200).json(peliculas);
    })
    .catch((error) => {
      console.error("Error al obtener películas:", error);
      res.status(500).json({ mensaje: "Error al obtener películas" });
    });
}

export function handleGetPeliculaByIdRequest(req, res) {
  try {
    const objectId = new ObjectId(req.params.id);

    peliculaCollection
      .findOne({ _id: objectId })
      .then((pelicula) => {
        if (!pelicula) {
          return res
            .status(404)
            .json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json(pelicula);
      })
      .catch((error) => {
        console.error("Error al obtener película:", error);
        res.status(500).json({ mensaje: "Error al obtener película" });
      });
  } catch (error) {
    console.error("Id mal formado:", error);
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

export function handleUpdatePeliculaByIdRequest(req, res) {
  try {
    const objectId = new ObjectId(req.params.id);
    const data = req.body;

    const cambios = {};
    if (data.nombre !== undefined) cambios.nombre = data.nombre;
    if (data.generos !== undefined)
      cambios.generos = Array.isArray(data.generos) ? data.generos : [];
    if (data.anioEstreno !== undefined)
      cambios.anioEstreno = Number(data.anioEstreno);

    peliculaCollection
      .updateOne({ _id: objectId }, { $set: cambios })
      .then((resultado) => {
        if (resultado.matchedCount === 0) {
          return res
            .status(404)
            .json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json({});
      })
      .catch((error) => {
        console.error("Error al actualizar película:", error);
        res.status(500).json({ mensaje: "Error al actualizar película" });
      });
  } catch (error) {
    console.error("Id mal formado:", error);
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

export function handleDeletePeliculaByIdRequest(req, res) {
  try {
    const objectId = new ObjectId(req.params.id);

    peliculaCollection
      .deleteOne({ _id: objectId })
      .then((resultado) => {
        if (resultado.deletedCount === 0) {
          return res
            .status(404)
            .json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json({});
      })
      .catch((error) => {
        console.error("Error al eliminar película:", error);
        res.status(500).json({ mensaje: "Error al eliminar película" });
      });
  } catch (error) {
    console.error("Id mal formado:", error);
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}