import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import { toast } from "react-toastify";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: "",
  });
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfileImage, setNewProfileImage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          username: decodedToken.username,
          email: decodedToken.email,
          profileImage: decodedToken.profileImage,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          username: newUsername || userData.username,
          email: newEmail || userData.email,
          profileImage: newProfileImage || userData.profileImage,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper elevation={3} component={Box} m="20px" p="20px" textAlign="center">
      <Avatar alt={userData.username} src={userData.profileImage} sx={{ width: 80, height: 80, mb: 2, mx: "auto" }} />
      <Typography variant="h2">{userData.username}</Typography>
      <Box mt={3}>
        <TextField
          fullWidth
          variant="outlined"
          type="text"
          label="Username"
          onChange={(e) => setNewUsername(e.target.value)}
          defaultValue={userData.username}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          type="email"
          label="Email"
          onChange={(e) => setNewEmail(e.target.value)}
          defaultValue={userData.email}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          type="text"
          label="Profile Image URL"
          onChange={(e) => setNewProfileImage(e.target.value)}
          defaultValue={userData.profileImage}
          sx={{ mb: 2 }}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </Paper>
  );
};

export default Profile;
