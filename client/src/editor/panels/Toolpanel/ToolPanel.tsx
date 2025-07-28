import { Box, Typography } from "@mui/material";
import ShapeToolPanel from "./ShapeToolPanel";
import TextToolPanel from "./TextToolPanel";
import ImageToolPanel from "./ImageToolPanel";
import { useTool } from "../../state/useTool";

const ToolPanel = () => {
    const { activeTool } = useTool();

    return (
        <Box p={2}>
            <Typography variant="subtitle1" gutterBottom>
                Инструмент: {activeTool || "Не выбран"}
            </Typography>

            {activeTool === "shape" && <ShapeToolPanel />}
            {activeTool === "text" && <TextToolPanel />}
            {activeTool === "image" && <ImageToolPanel />}
        </Box>
    );
};

export default ToolPanel;
