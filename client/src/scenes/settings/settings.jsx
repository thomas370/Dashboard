import React, { useContext } from "react";
import { Box, Typography, Paper, FormControlLabel, Switch } from "@mui/material";
import { ColorModeContext } from "../../theme";

const Settings = () => {
  const colorMode = useContext(ColorModeContext);

  const handleDarkModeToggle = () => {
    colorMode.toggleColorMode();
  };

  const handleChatGPTToggle = () => {
    // Ajoutez votre logique pour gérer l'utilisation de ChatGPT ici
    // Peut-être en utilisant un état supplémentaire
  };


  return (
    <Box>
      <Typography variant="h1">Settings</Typography>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4">Appearance</Typography>
        <Box mt={2}>
          <Typography variant="body1">Dark Mode</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={colorMode.isDark}
                onChange={handleDarkModeToggle}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#fff',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: colorMode.isDark ? '#1976D2' : '#9E9E9E',
                  },
                }}
              />
            }
            labelPlacement="start"
            label={
              <Box display="flex" alignItems="center">
                <Typography variant="body1">Dark Mode</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginLeft: "10px" }}
                >
                  (Disponible)
                </Typography>
              </Box>
            }
          />
        </Box>
      </Paper>

      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4">ChatGPT</Typography>
        <Box mt={2}>
          <Typography variant="body1">Use ChatGPT for articles</Typography>
          <FormControlLabel
            control={
              <Switch
                checked= 'false'
                onChange={handleChatGPTToggle}
              />
            }
            labelPlacement="start"
            label={
              <Box display="flex" alignItems="center">
                <Typography variant="body1">ChatGPT</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginLeft: "10px" }}
                >
                  (Coming soon)
                </Typography>
              </Box>
            }
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;
