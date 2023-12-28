import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Header from "../../components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as yup from "yup";

const ArticleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sitesList, setSitesList] = useState([]);
  const [content, setContent] = useState("");
  const [initialArticleData, setInitialArticleData] = useState(null);
  const [chatGPTResponse, setChatGPTResponse] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fetchSitesList = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/sites`);

        if (response.ok) {
          const data = await response.json();
          setSitesList(data);
        } else {
          toast.error("Error while fetching sites list");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchArticleData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`);

        if (response.ok) {
          const data = await response.json();
          setInitialArticleData(data);
          setContent(data.content);
        } else {
          toast.error("Error while fetching article data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSitesList();
    fetchArticleData();
  }, [id]);

  const handleFormSubmit = async (values) => {
    try {
      const dataToSend = {
        ...values,
        site: parseInt(values.site),
        content: `${values.content}\n\n${chatGPTResponse}`,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Article updated successfully");
        navigate("/article");
      } else {
        toast.error("Failed to update Article");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const generateChatGPTResponse = async (question) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chatgpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (response.ok) {
            const data = await response.json();
            setChatGPTResponse(data.chatGPTResponse);
            setContent(`${content}\n\n${data.chatGPTResponse}`);
        } else {
            console.error('Error fetching ChatGPT response:', response.status);
            setChatGPTResponse('Error fetching response');
        }
    } catch (error) {
        console.error('Error fetching ChatGPT response:', error);
        setChatGPTResponse('Error fetching response');
    }
};

const handleAskQuestion = async () => {
    await generateChatGPTResponse(question);
};


  return (
    <Box m="20px">
      <Header title="EDIT ARTICLE" subtitle="Edit Article" />
      {initialArticleData && (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialArticleData}
          validationSchema={articleSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Image URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.image}
                name="image"
                sx={{ mb: 2 }}
              />
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ align: [] }],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "link",
                  "image",
                ]}
                placeholder="Write something amazing..."
                style={{
                  marginBottom: "60px",
                  height: "200px",
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                select
                label="Site"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.site}
                name="site"
                sx={{ mb: 2 }}
              >
                {sitesList.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.nom}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Ask a Question"
                onBlur={handleQuestionChange}
                onChange={handleQuestionChange}
                value={question}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleAskQuestion}>
                Ask Question
              </Button>

              <Button variant="contained" color="secondary" type="submit">
                Update
              </Button>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

const articleSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image URL is required"),
  site: yup.string().required("Site is required"),
});

export default ArticleEdit;
