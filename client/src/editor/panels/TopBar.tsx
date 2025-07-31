// src/components/panels/TopBar.tsx
import { Box, Button } from "@mui/material";

const TopBar = () => {
    return (
        <Box
            height="48px"
            bgcolor="#fafafa"
            borderBottom="1px solid #ccc"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
        >
            <Button variant="contained" color="primary">
                Загрузить
            </Button>
        </Box>
    );
};

export default TopBar;
