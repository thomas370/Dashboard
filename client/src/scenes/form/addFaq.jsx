import { Box, Button, TextField, Grid } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddFaq = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/faqadd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("FAQ added successfully");
        navigate("/faq");
      } else {
        toast.error("Failed to add FAQ");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD FAQ" subtitle="Add a New Frequently Asked Question" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={faqSchema}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  multiline
                  minRows={4}
                  maxRows={8}
                  type="text"
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add FAQ
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const faqSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const initialValues = {
  title: "",
  description: "",
};

export default AddFaq;
