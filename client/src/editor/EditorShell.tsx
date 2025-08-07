import React from "react";
import { Box } from "@mui/material";
import LeftSidebar from "./panels/LeftSidebar";
import ToolPanel from "./panels/Toolpanel/ToolPanel";
import CanvasArea from "./canvas/CanvasArea";
import CanvasContextBar from "./panels/CanvasContextBar/CanvasContextBar";
import TopBar from "./panels/TopBar";
import PropertiesPanel from "./panels/RightPropertiesPanel";

const EditorShell = () => {
    return (
        <Box display="flex" height="calc(100vh - 48px)">
            {/* Левая панель инструментов */}
            <Box width="60px" bgcolor="#f0f0f0" borderRight="1px solid #ccc">
                <LeftSidebar />
            </Box>

            {/* Центральная панель опций инструмента */}
            <Box width="300px" bgcolor="#fff" borderRight="1px solid #ccc" overflow="auto">
                <ToolPanel />
            </Box>

            {/* Рабочая зона с холстом */}
            <Box flex={1} bgcolor="#eaeaea" overflow="auto" position="relative">
                <TopBar />
                <CanvasContextBar />
                <CanvasArea />
            </Box>


            {/* 🆕 Правая панель свойств */}
            <Box width="300px" bgcolor="#fff" borderLeft="1px solid #ccc" overflow="auto">
                <PropertiesPanel />
            </Box>

        </Box>
    );
};

export default EditorShell;
