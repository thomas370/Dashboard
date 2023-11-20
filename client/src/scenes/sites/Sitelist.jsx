import React, { useEffect, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SiteList = () => {
    const [sites, setSites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "/sites");
                const data = await response.json();
                setSites(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSites();
    }, []);

    const handleDelete = async (siteId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/sites/${siteId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                toast.success("Site deleted");
                const updatedSites = sites.filter((site) => site.id !== siteId);
                setSites(updatedSites);
            } else {
                toast.error("Error while deleting site");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (siteId) => {
        navigate(`/sitemodif/${siteId}`);
    };

    const handleGoToForm = () => {
        navigate("/form");
    };

    return (
        <Box m="20px">
            <h1>Site List</h1>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleGoToForm}
                style={{ marginBottom: "20px" }}
            >
                Go to Form
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sites.map((site) => (
                            <TableRow key={site.id}>
                                <TableCell>{site.id}</TableCell>
                                <TableCell>{site.nom}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(site.id)}
                                    >
                                        Supprimer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleEdit(site.id)}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Modifier
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SiteList;
