import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Articles from "../components/Articles";
import ArticlesSkeleton from "../components/ArticlesSkeletion";
import { MenuItem, Paper, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";
import useUsersStore from "../stores/users";
import categoryOptions from "../categories";

const defaultTheme = createTheme();

export default function Home() {
  const currentUser = useUsersStore((state) => state.getUser());

  const [loading, setLoading] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSource, setFilterSource] = useState("");

  const getArticles = useCallback(async () => {
    setLoading(true);
    try {
      if (currentUser) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${currentUser.access_token}`;
      }
      const { data } = await api.get("/api/articles", {
        params: {
          filters: {
            filterText,
            filterDate,
            filterCategory,
            filterSource,
          },
        },
      });
      setNewsArticles(data.articles);
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  }, [filterText, filterDate, filterCategory, filterSource, currentUser]);

  useEffect(() => {
    getArticles();
  }, []);

  const handleTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleDateChange = (date) => {
    setFilterDate(date);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleSourceChange = (event) => {
    setFilterSource(event.target.value);
  };

  const filterResults = () => {
    getArticles();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <main>
        <Container maxWidth="md">
          <Paper variant="outlined" sx={{ my: { xs: 2 }, p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Search keyword"
                  variant="outlined"
                  fullWidth
                  value={filterText}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Date"
                    inputVariant="outlined"
                    value={filterDate}
                    onChange={handleDateChange}
                    fullWidth
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Category"
                  variant="outlined"
                  select
                  fullWidth
                  value={filterCategory}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Source"
                  variant="outlined"
                  select
                  fullWidth
                  value={filterSource}
                  onChange={handleSourceChange}
                >
                  <MenuItem value="">All Sources</MenuItem>
                  {[
                    { value: "newyorktimes", label: "The New York Times" },
                    { value: "theguardian", label: "The Guardian" },
                    { value: "newsapi", label: "News API" },
                  ].map((source) => (
                    <MenuItem key={source.value} value={source.value}>
                      {source.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button variant="contained" onClick={filterResults}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        <Container maxWidth="md">
          {currentUser && (
            <Typography sx={{ my: 2 }}>Welcome {currentUser.name}</Typography>
          )}
          <Grid container spacing={4}>
            {loading ? (
              <ArticlesSkeleton />
            ) : (
              <Articles articles={newsArticles} />
            )}
          </Grid>
        </Container>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
