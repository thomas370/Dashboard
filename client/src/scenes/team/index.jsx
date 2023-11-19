import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);


  const columns = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "Access level",
      headerName: "Access level",
      flex: 1,
      renderCell: ({ row }) => {
        const access = row.role;
        return renderAccessLevelBox(access);
      },
    },
  ];

  const renderAccessLevelBox = (access) => (
    <Box
      width="60%"
      p="5px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor={
        access === "admin"
          ? colors.greenAccent[600]
          : access === "manager"
          ? colors.greenAccent[700]
          : colors.greenAccent[700]
      }
      borderRadius="4px"
    >
      {renderAccessLevelIcon(access)}
      <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
        {access}
      </Typography>
    </Box>
  );

  const renderAccessLevelIcon = (access) => {
    switch (access) {
      case "admin":
        return <AdminPanelSettingsOutlinedIcon />;
      case "manager":
        return <SecurityOutlinedIcon />;
      case "user":
        return <LockOpenOutlinedIcon />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const response = await fetch(process.env.REACT_APP_API_URL + "/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid checkboxSelection rows={userData} columns={columns} />
        )}
      </Box>
    </Box>
  );
};

export default Team;
