import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';

const VueArticles = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          console.error("Error fetching article");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <Box>
      <Typography variant="h1">Vue de l'article</Typography>
      {article && (
        <Box mt={4}>
          <Typography variant="h4">{article.title}</Typography>
          <Typography variant="body1" mt={2} dangerouslySetInnerHTML={{ __html: article.content }} />
        </Box>
      )}
    </Box>
  );
};

export default VueArticles;
