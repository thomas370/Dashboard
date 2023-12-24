import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Articles = () => {
  const navigate = useNavigate();
  const [SitesList, setSites] = useState([]);
  const [ArticlesList, setArticles] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const maxCards = 12; // Nombre maximal de cartes à afficher par page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sitesResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/sites`
        );
        if (sitesResponse.ok) {
          const sitesData = await sitesResponse.json();
          setSites(sitesData);

          // Sélectionner automatiquement la première catégorie
          if (sitesData.length > 0) {
            setSelectedSite(sitesData[0].id);
          }
        } else {
          toast.error("Error while fetching sites list");
        }

        const articlesResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/articles`
        );
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setArticles(articlesData);
        } else {
          toast.error("Error while fetching articles");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (articleId) => {
    navigate(`/editarticle/${articleId}`);
  };

  const deleteArticle = async (articleId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/articles/${articleId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Mettez à jour la liste des articles après la suppression
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== articleId)
        );

        toast.success("Article deleted successfully");
      } else {
        toast.error("Error deleting article");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSiteChange = (event) => {
    const selectedSiteId = event.target.value;
    setSelectedSite(selectedSiteId);
  };

  const filteredArticles = ArticlesList.filter(
    (article) => !selectedSite || article.site === selectedSite
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  return (
    <Box m="20px">
      <Header title="ARTICLE" subtitle="Add a New Article" />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/addArticle")}
      >
        Add Article
      </Button>

      <FormControl sx={{ marginLeft: '20px' }}>
        <Select
          value={selectedSite || ""}
          onChange={handleSiteChange}
          displayEmpty
          sx={{ height: '35px' }}
          >
          <MenuItem value="" disabled>
            Choisissez un site
          </MenuItem>
          {SitesList.map((site) => (
            <MenuItem key={site.id} value={site.id}>
              {site.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedSite && (
        <Typography variant="h4" mt={2}>
          {SitesList.find((site) => site.id === selectedSite)?.nom}
        </Typography>
      )}

      <Box mt={2} display="flex" flexWrap="wrap">
        {filteredArticles
          .slice((currentPage - 1) * maxCards, currentPage * maxCards)
          .reverse()
          .map((article) => (
            <Card key={article.id} style={{ margin: "10px" }}>
              <CardContent style={{cursor:"pointer"}} onClick={() => navigate(`/vueArticles/${article.id}`)}>
                {article.image instanceof Blob && (
                  <img src={URL.createObjectURL(article.image)} alt="article" />
                )}

                <Typography variant="h5" component="div">
                  {article.title}
                </Typography>
                <Typography color="text.secondary">
                  {article.description}
                </Typography>
                <Typography color="text.secondary">
                  Date de création: {format(new Date(article.date_creation), "yyyy-MM-dd")}
                </Typography>
                <Typography color="text.secondary">
                  Date de modification: {format(new Date(article.date_update), "yyyy-MM-dd")}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(article.id)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteArticle(article.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={currentPage * maxCards >= filteredArticles.length}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default Articles;
