import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Header from "../../components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import * as yup from "yup";

const Articlesadd = () => {
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [sitesList, setSitesList] = useState([]);
  const [content, setContent] = useState("");

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

    fetchSitesList();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const dataToSend = { ...values, site: parseInt(values.site), content };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/articlesadd`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        toast.success("Article added successfully");
        navigate("/article");
      } else {
        toast.error("Failed to add Article");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <Box m="20px">
      <Header title="ADD ARTICLE" subtitle="Add a New Article" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                backgroundColor: "#293040",
                marginBottom: "20px",

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

            <Button variant="contained" color="secondary" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const articleSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image URL is required"),
  site: yup.string().required("Site is required"),
});

const initialValues = {
  title: "",
  description: "",
  image: "",
  site: "",
};

export default Articlesadd;