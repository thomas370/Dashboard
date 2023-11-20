import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SiteModif = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [site, setSite] = useState(null);

    useEffect(() => {
        const fetchSiteDetails = async () => {
            try {

                if (!id) {
                    toast.error("Site ID is undefined");
                    return;
                }

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/sites/${id}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setSite(data);
                } else {
                    toast.error("Error while fetching site details");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSiteDetails();
    }, [id]);

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/sites/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );

            if (response.ok) {
                toast.success("Site updated");
                navigate("/formlist");
            } else {
                toast.error("Error while updating site");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!site) {
        return <p>Loading...</p>;
    }

    return (
        <Box m="20px">
            <h1>Modifier le site</h1>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{ nom: site.nom }}
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
                        />
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                            >
                                Enregistrer les modifications
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const siteSchema = yup.object().shape({
    nom: yup.string().required("Le nom du site est requis"),
});

export default SiteModif;
