import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-toastify";
const {useNavigate} = require("react-router-dom");

const SiteForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/sitesadd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

      if (response.ok) {
        toast.success("Site added");
        navigate("/formlist");
      } else {
        toast("Error while adding site maybe the name is already taken");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Site" subtitle="Create a New Site" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={siteSchema}
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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nom}
                name="nom"
                error={!!touched.nom && !!errors.nom}
                helperText={touched.nom && errors.nom}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Site
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const siteSchema = yup.object().shape({
  nom: yup.string().required("Nom is required"),
});

const initialValues = {
  nom: "",
};

export default SiteForm;
