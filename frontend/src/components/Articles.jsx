import { useTheme } from "@emotion/react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";

export default function Articles(props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!props.articles || props.articles.length < 1) {
    return (
      <Grid item xs={12}>
        <Typography variant="h6">No records</Typography>
      </Grid>
    );
  }
  return props.articles.map((article) => (
    <Grid item xs={12} key={article.id}>
      <Card
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <CardMedia
          component="img"
          sx={isSmallScreen ? {} : { width: 200 }}
          image={article.image ?? "/no-image.jpg"}
          alt={article.title}
        />
        <CardContent>
          <Typography variant="h6">{article.title}</Typography>
          <Typography variant="subtitle2">{article.publishedDate}</Typography>
          <Typography variant="body2" color="textSecondary">
            Author: {article.authors}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Category: {article.category}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Source: {article.source}
          </Typography>
          <Typography variant="body2">{article.description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ));
}
