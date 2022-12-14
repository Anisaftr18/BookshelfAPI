/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const postBookHandler = (request, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, res) => {
  const { bookId } = request.params;
  const book = books.filter((bk) => bk.id === bookId)[0];
  if (bookId !== undefined) {
    if (book === undefined) {
      return res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
        .code(404);
    }

    return res.response({
      status: 'success',
      data: {
        book,
      },
    })
      .code(200);
  }

  const { name, reading, finished } = request.query;
  let listBooks = books;
  if (name !== undefined) {
    listBooks = listBooks.filter((bk) => bk.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined) listBooks = listBooks.filter((bk) => bk.reading === (reading === '1'));
  if (finished !== undefined) listBooks = listBooks.filter((bk) => bk.finished === (finished === '1'));

  const response = res.response({
    status: 'success',
    data: {
      books: listBooks.map((bk) => ({
        id: bk.id,
        name: bk.name,
        publisher: bk.publisher,
      })),
    },
  });
  return response;
};

const editBookByIdHandler = (request, res) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, res) => {
  const { bookId } = request.params;
  const index = books.findIndex((bk) => bk.id === bookId);
  const book = books.filter((bk) => bk.id === bookId);

  if (book !== undefined) {
    books.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postBookHandler,
  getAllBooksHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
