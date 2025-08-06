import { Box, Button, Stack, Typography } from "@mui/material";
import ShapeToolPanel from "./ShapeToolPanel";
import TextToolPanel from "./TextToolPanel";
import ImageToolPanel from "./ImageToolPanel";
import DatamatrixToolPanel from "./DatamatrixToolPanel";
import { useTool } from "../../state/useTool";
import { useEditor } from "../../state/useEditor";
import TemplatesToolPanel from "./TemplatesToolPanel";

const ToolPanel = () => {
    const { activeTool } = useTool();
    const { clearStore } = useEditor();

    return (
        <Box p={2} color='black'>
            <Typography variant="subtitle1" gutterBottom>
                Инструмент: {activeTool || "Не выбран"}
            </Typography>

            {activeTool === "shape" && <ShapeToolPanel />}
            {activeTool === "text" && <TextToolPanel />}
            {activeTool === "image" && <ImageToolPanel />}
            {activeTool === "datamatrix" && <DatamatrixToolPanel />}
            {activeTool === "templates" && <TemplatesToolPanel />}
            {activeTool === "clear" && (
                <Stack spacing={1}>
                    <Button size="small" variant="contained" onClick={clearStore}>
                        Очистить холст
                    </Button>
                </Stack>
            )
            }
        </Box >
    );
};

export default ToolPanel;
