/* eslint-disable linebreak-style */
const {
  postBookHandler,
  getAllBooksHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId?}',
    handler: getAllBooksHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
