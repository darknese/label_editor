import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthStore } from "../store/useAuthStore";

export const AppHeader = () => {
    const { logout } = useAuthStore();

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

                <Button color="inherit" onClick={logout}>
                    Выйти
                </Button>
            </Toolbar>
        </AppBar>
    );
};
