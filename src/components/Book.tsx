import React, { useEffect, useState } from "react";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
  green,
  blue,
  orange,
  pink,
  red,
  grey,
  deepPurple,
  blueGrey,
  yellow,
} from "@material-ui/core/colors";

import { getBookAuthorApi } from "../services/api";
import { fbStorage } from "../services/firebase";
import { IFirestoreBook } from "../services/types";

const colors = [
  green,
  blue,
  orange,
  pink,
  red,
  grey,
  deepPurple,
  blueGrey,
  yellow,
];

const useStyles = makeStyles({
  container: {
    maxWidth: 300,
    minHeight: 170,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "translateX(10px)",
    },
  },
  media: {
    height: 170,
    paddingTop: "56.25%",
  },
  avatar: {
    backgroundColor: (props: { colorAvatar: string }) => props.colorAvatar,
  },
  loadingImage: {
    margin: "auto",
    display: "block",
  },
});

interface IProps {
  /** Indice para pegar a imagem do livro */
  index: number;
}

const generateRandomColorAvatar = (colors: any[]): any => {
  const indexColor = Math.floor(Math.random() * (colors.length - 1));
  return colors[indexColor][500];
};

/**
 * Livro obtido do firestore
 */
const Book: React.FC<IFirestoreBook & IProps> = ({
  name,
  price,
  id,
  index,
}) => {
  const classes = useStyles({
    colorAvatar: generateRandomColorAvatar(colors),
  });
  const [author, setAuthor] = useState("Autor Desconhecido");
  const [urlImage, setUrlImage] = useState("https://via.placeholder.com/150");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuthorData();
    getBookImage(index);
  }, [index]);

  const loadAuthorData = async () => {
    try {
      setLoading(true);
      const authorName = await getBookAuthorApi(id);
      if (authorName) setAuthor(authorName);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getBookImage = async (index: number) => {
    // Obtem imagem a partir do indice do livro no array
    try {
      setLoading(true);
      const { items } = await fbStorage.ref().child("books").listAll();

      if (!items[index].getDownloadURL) return;

      const urlImage = await items[index].getDownloadURL();
      setUrlImage(urlImage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getInitialsLatters = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((name: string, index: number) =>
        index < 2 ? name.split("")[0] : ""
      )
      .toString()
      .replace(/\,/g, "");
  };

  const formatPrice = (price: number): string => {
    const priceFormated = price ? `Preço: R$ ${price}` : "Sem preço";
    return priceFormated;
  };

  return (
    <Card className={classes.container}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {getInitialsLatters(author)}
          </Avatar>
        }
        title={author}
      />
      {loading ? (
        <CircularProgress className={classes.loadingImage} />
      ) : (
        <CardMedia className={classes.media} image={urlImage} title={name} />
      )}
      <CardContent>
        <Typography color="textPrimary" gutterBottom>
          {name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {formatPrice(price)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Book;
