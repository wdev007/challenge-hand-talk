/**
 * Livro guardado no firestore
 */
export interface IFirestoreBook {
  /** id do livro */
  id: string;
  /** Nome do livro */
  name: string;
  /** Preço do livro  */
  price: number;
}
