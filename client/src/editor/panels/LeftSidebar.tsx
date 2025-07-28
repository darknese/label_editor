// src/components/LeftSidebar.tsx
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { useTool } from "../state/useTool";

const LeftSidebar = () => {
    const { activeTool, setTool } = useTool();

    const tools = [
        { type: "text", icon: <TextFieldsIcon />, label: "Текст" },
        { type: "image", icon: <ImageIcon />, label: "Изображение" },
        { type: "shape", icon: <CropSquareIcon />, label: "Фигура" },
        { type: "clear", icon: <DeleteIcon />, label: "Очистить" },
    ] as const;

    return (
        <Stack spacing={1} p={1} alignItems="center">
            {tools.map((tool) => (
                <Tooltip key={tool.type} title={tool.label} placement="right">
                    <IconButton
                        size="small"
                        onClick={() => setTool(tool.type)}
                        color={activeTool === tool.type ? "primary" : "default"}
                    >
                        {tool.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </Stack>
    );
};

export default LeftSidebar;
