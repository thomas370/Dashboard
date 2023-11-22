import React from 'react';
import { Box, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Header from '../../components/Header';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';


const Articles = () => {
    const navigate = useNavigate();
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
            <Box height="75vh">
            </Box>


        </Box>
    );
};

export default Articles;
