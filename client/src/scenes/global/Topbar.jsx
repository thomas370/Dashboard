import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ColorModeContext,
  tokens
} from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const excludedPaths = ["", "register"];
  const [notifications, setNotifications] = useState([]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        await fetch(process.env.REACT_APP_API_URL + '/notifications/expired', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        const response = await fetch(process.env.REACT_APP_API_URL + '/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);

          const unreadCount = data.filter((notification) => !notification.isRead).length;
          setUnreadNotificationsCount(unreadCount);
        } else {
          console.error('Error fetching notifications:', response.status);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const shouldDisplayFooter = !excludedPaths.includes(
    location.pathname.split("/")[1]
  );

  return shouldDisplayFooter ? (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadNotificationsCount} color="secondary">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>

        <Popover
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ maxHeight: "320px", overflowY: notifications.length > 5 ? "auto" : "hidden" }}
        >
  <Box p={2} minWidth="500px">
    <Typography variant="h6" gutterBottom color="textSecondary">
      Modifications récentes
    </Typography>
    <hr
      style={{
        backgroundColor: colors.primary[500],
        height: "2px",
        border: "none",
        margin: "8px 0",
      }}
    />
    {notifications.slice(0).reverse().map((notification) => (
      <React.Fragment key={notification.id}>
        <Typography variant="body1" color="secondary" style={{textTransform: "uppercase"}}>
          {notification.type}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {notification.description}
        </Typography>
        <hr
          style={{
            backgroundColor: colors.primary[500],
            height: "2px",
            border: "none",
            margin: "8px 0",
          }}
        />
      </React.Fragment>
    ))}
  </Box>
</Popover>


        <IconButton onClick={() => navigate("/settings")}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/profile")}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  ) : null;
};

export default Topbar;
