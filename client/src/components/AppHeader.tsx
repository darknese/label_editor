import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate("/login"); // Перенаправление на страницу логина после выхода
    };

    const handleLogin = () => {
        navigate("/login"); // Перенаправление на страницу логина
    };

    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar variant="dense" sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        Редактор этикеток
                    </Typography>
                </Box>
                {user ? (
                    <Box>
                        <Avatar
                            sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
                            onClick={handleAvatarClick}
                            aria-label="Меню пользователя"
                        >
                            {user.firstName ? user.firstName[0]?.toUpperCase() : "U"}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Войти
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};