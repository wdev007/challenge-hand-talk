import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";

import Book from "./Book";
import { IFirestoreBook } from "../services/types";
import { fbFirestore } from "../services/firebase";

/**
 * Renderiza a lista de livros do firestore
 */
const BookList: React.FC<{}> = () => {
  const [books, setBooks] = useState<IFirestoreBook[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { docs } = await fbFirestore.collection("books").get();
        const bookList = docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as IFirestoreBook)
        );

        setBooks(bookList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  return (
    <Box p={2}>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid sm={6} xs={6} md={2} lg={3} item key={book.id}>
            <Book name={book.name} price={book.price} id={book.id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default BookList;
