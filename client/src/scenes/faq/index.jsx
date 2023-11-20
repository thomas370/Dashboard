import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Nouvelle importation
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFaqs = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/faqs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      setFaqs(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleRedirect = () => {
    navigate("/addFaq");
  };

  const handleDelete = async (faqId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/faqs/${faqId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Actualise la liste après la suppression
        fetchFaqs();
      } else {
        console.error("Failed to delete FAQ");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRedirect}
        style={{
          marginBottom: "20px",
          backgroundColor: colors.greenAccent[500],
          color: colors.grey[100],
        }}
      >
        Add Question
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        faqs.slice(0).reverse().map((faq) => (
          <Accordion key={faq.id} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography color={colors.greenAccent[500]} variant="h5">
                {faq.title}
              </Typography>
              <DeleteOutlineIcon
                style={{ cursor: "pointer", marginLeft: "10px" }}
                color={colors.grey[100]}
                hoverColor={colors.greenAccent[500]}
                onClick={() => handleDelete(faq.id)}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default FAQ;
