import { client } from "../common/db.js";
import { ObjectId } from "mongodb";
import { Actor } from "./actor.js";

const dbName = "cine-db";
const actorCollectionName = "actorCollection";
const peliculaCollectionName = "peliculaCollection";

const db = client.db(dbName);
const actorCollection = db.collection(actorCollectionName);
const peliculaCollection = db.collection(peliculaCollectionName);

export function handleInsertActorRequest(req, res) {
  const actor = req.body;

  try {
    const peliculaId = new ObjectId(actor.idPelicula);

    peliculaCollection
      .findOne({ _id: peliculaId })
      .then((pelicula) => {
        if (!pelicula) {
          return res.status(400).json({
            mensaje:
              "El idPelicula no existe dentro de la colección de películas",
          });
        }

        const nuevoActor = {
          ...Actor,
          idPelicula: actor.idPelicula,
          nombre: actor.nombre,
          edad: Number(actor.edad) || 0,
          estaRetirado: Boolean(actor.estaRetirado),
          premios: Array.isArray(actor.premios) ? actor.premios : [],
        };

        return actorCollection.insertOne(nuevoActor);
      })
      .then((resultado) => {
        if (resultado) {
          res.status(201).json({});
        }
      })
      .catch((error) => {
        console.error("Error al insertar actor:", error);
        res.status(500).json({ mensaje: "Error al insertar actor" });
      });
  } catch (error) {
    console.error("Id de película mal formado:", error);
    res.status(400).json({ mensaje: "Id de película mal formado" });
  }
}

export function handleGetActoresRequest(req, res) {
  actorCollection
    .find({})
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      console.error("Error al obtener actores:", error);
      res.status(500).json({ mensaje: "Error al obtener actores" });
    });
}

export function handleGetActorByIdRequest(req, res) {
  try {
    const objectId = new ObjectId(req.params.id);

    actorCollection
      .findOne({ _id: objectId })
      .then((actor) => {
        if (!actor) {
          return res.status(404).json({ mensaje: "Actor no encontrado" });
        }
        res.status(200).json(actor);
      })
      .catch((error) => {
        console.error("Error al obtener actor:", error);
        res.status(500).json({ mensaje: "Error al obtener actor" });
      });
  } catch (error) {
    console.error("Id mal formado:", error);
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

export function handleGetActoresByPeliculaIdRequest(req, res) {
  const idPelicula = req.params.pelicula;

  actorCollection
    .find({ idPelicula: idPelicula })
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      console.error(
        "Error al obtener actores por id de película:",
        error
      );
      res.status(500).json({
        mensaje: "Error al obtener actores por id de película",
      });
    });
}
