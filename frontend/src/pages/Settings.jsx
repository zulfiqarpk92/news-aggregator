import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import useUsersStore from "../stores/users";
import FeedbackAlert from "../components/FeedbackAlert";
import { useNavigate } from "react-router-dom";
import categoryOptions from "../categories";

function getStyles(needle, haystack, theme) {
  return {
    fontWeight: haystack.find((obj) => obj.value === needle.value)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  };
}

const defaultTheme = createTheme();

export default function Settings() {
  const navigateTo = useNavigate();

  const accessToken = useUsersStore((state) => state.getToken());

  const [newsSources, setNewsSources] = useState({
    newsapi: false,
    theguardian: false,
    newyorktimes: false,
  });
  const [categories, setCategories] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    async function getUserPrefs() {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      try {
        const { data } = await api.get("/api/users/preferences");
        setNewsSources(data.preferences.newsSources);
        setCategories(data.preferences.categories);
      } catch (ex) {
        console.log(ex);
      }
    }
    getUserPrefs();
  }, [accessToken]);

  const handleCategoriesChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNewsSourcesChange = (event) => {
    setNewsSources({
      ...newsSources,
      [event.target.name]: event.target.checked,
    });
  };

  async function updatePrefs() {
    setFeedbackMessage(null);
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const { data } = await api.post("/api/users/preferences", {
        categories,
        newsSources,
      });
      setFeedbackMessage({
        severity: "success",
        message: "Preferences updated successfully.",
      });
    } catch (ex) {
      alert(ex.response.error);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <main>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center">
              Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography component="h6" variant="h6" align="left">
                  News Sources
                </Typography>
                <FormControl component="fieldset" variant="standard">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newsSources.newsapi}
                          onChange={handleNewsSourcesChange}
                          name="newsapi"
                        />
                      }
                      label="News API"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newsSources.theguardian}
                          onChange={handleNewsSourcesChange}
                          name="theguardian"
                        />
                      }
                      label="The Guardian"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newsSources.newyorktimes}
                          onChange={handleNewsSourcesChange}
                          name="newyorktimes"
                        />
                      }
                      label="The New York Times"
                    />
                  </FormGroup>
                  <FormHelperText>
                    Please select one or more news sources.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography component="h6" variant="h6" align="left">
                  Category
                </Typography>
                <FormControl sx={{ mt: 2, width: "100%" }}>
                  <InputLabel id="categories-label">Category</InputLabel>
                  <Select
                    label="Category"
                    labelId="categories-label"
                    id="categories"
                    value={categories}
                    onChange={handleCategoriesChange}
                  >
                    {categoryOptions.map((cat) => (
                      <MenuItem
                        key={cat.value}
                        value={cat.value}
                        style={getStyles(cat, categoryOptions, defaultTheme)}
                      >
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                {feedbackMessage && (
                  <FeedbackAlert feedback={feedbackMessage} />
                )}
                <Stack spacing={2} direction="row">
                  <Button variant="contained" onClick={updatePrefs}>
                    Update
                  </Button>
                  <Button
                    onClick={() => navigateTo("/")}
                    variant="contained"
                    color="secondary"
                  >
                    Go to News Page
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
