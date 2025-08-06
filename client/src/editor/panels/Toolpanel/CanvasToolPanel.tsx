// src/components/tools/CanvasToolPanel.tsx
import { Box, FormControlLabel, Switch, TextField, Stack, Typography, Button } from "@mui/material";
import { useEditor } from "../../state/useEditor";
import { useState } from "react";

const CanvasToolPanel = () => {
    const { CANVAS_SIZE, setCanvasSize, showGrid, setShowGrid } = useEditor();
    const [width, setWidth] = useState(CANVAS_SIZE.width);
    const [height, setHeight] = useState(CANVAS_SIZE.height);

    const applySize = () => {
        setCanvasSize(width, height);
    };

    return (
        <Box p={2}>
            <Typography variant="subtitle1" gutterBottom>
                Настройки холста
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Ширина (px)"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                />
                <TextField
                    label="Высота (px)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                />
                <Button variant="contained" onClick={applySize}>
                    Применить размер
                </Button>

                <FormControlLabel
                    control={
                        <Switch
                            checked={showGrid}
                            onChange={(e) => setShowGrid(e.target.checked)}
                        />
                    }
                    label="Показать разметку"
                />
            </Stack>
        </Box>
    );
};

export default CanvasToolPanel;
