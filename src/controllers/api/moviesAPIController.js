const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesAPIController = {
  list: (req, res) => {
    db.Movie.findAll({
      include: ["genre"],
    }).then((movies) => {
      let respuesta = {
        meta: {
          status: 200,
          total: movies.length,
          url: "api/movies",
        },
        data: movies,
      };
      res.json(respuesta);
    });
  },

  detail: (req, res) => {
    db.Movie.findByPk(req.params.id, {
      include: ["genre"],
    }).then((movie) => {
      let respuesta = {
        meta: {
          status: 200,
          total: movie.length,
          url: "/api/movie/:id",
        },
        data: movie,
      };
      res.json(respuesta);
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      include: ["genre"],
      where: {
        rating: { [db.Sequelize.Op.gte]: req.params.rating },
      },
      order: [["rating", "DESC"]],
    })
      .then((movies) => {
        let respuesta = {
          meta: {
            status: 200,
            total: movies.length,
            url: "api/movies/recomended/:rating",
          },
          data: movies,
        };
        res.json(respuesta);
      })
      .catch((error) => console.log(error));
  },
  create: (req, res, movie) => {
    // return console.log(movie.Awards.slice(4, 5));
    Movies.create({
      title: movie.Title ?? req.body.title,
      rating: movie.Ratings[0].Value.slice(0, 3) ?? req.body.rating,
      awards: 9999 ?? req.body.awards,
      release_date: /*movie.Released*/ "2021-01-01" ?? req.body.release_date,
      length: movie.Runtime.slice(0, 3) ?? req.body.length,
      genre_id: req.body.genre_id ?? null,
    })
      .then((confirm) => {
        let respuesta;
        if (confirm) {
          respuesta = {
            meta: {
              status: 200,
              total: confirm.length,
              url: "api/movies/create",
            },
            data: confirm,
          };
        } else {
          respuesta = {
            meta: {
              status: 200,
              total: confirm.length,
              url: "api/movies/create",
            },
            data: confirm,
          };
        }
        // res.json(respuesta);
      })
      .catch((error) => console.log(error));
  },
  update: (req, res) => {
    let movieId = req.params.id;
    Movies.update(
      {
        title: req.body.title,
        rating: req.body.rating,
        awards: req.body.awards,
        release_date: req.body.release_date,
        length: req.body.length,
        genre_id: req.body.genre_id,
      },
      {
        where: { id: movieId },
      }
    )
      .then((confirm) => {
        let respuesta;
        if (confirm) {
          respuesta = {
            meta: {
              status: 200,
              total: confirm.length,
              url: "api/movies/update/:id",
            },
            data: confirm,
          };
        } else {
          respuesta = {
            meta: {
              status: 204,
              total: confirm.length,
              url: "api/movies/update/:id",
            },
            data: confirm,
          };
        }
        res.json(respuesta);
      })
      .catch((error) => res.send(error));
  },
  destroy: (req, res) => {
    let movieId = req.params.id;
    Movies.destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
      .then((confirm) => {
        let respuesta;
        if (confirm) {
          respuesta = {
            meta: {
              status: 200,
              total: confirm.length,
              url: "api/movies/destroy/:id",
            },
            data: confirm,
          };
        } else {
          respuesta = {
            meta: {
              status: 204,
              total: confirm.length,
              url: "api/movies/destroy/:id",
            },
            data: confirm,
          };
        }
        res.json(respuesta);
      })
      .catch((error) => res.send(error));
  },
};

module.exports = moviesAPIController;
