import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { FormatAlignCenter } from "@mui/icons-material";
import { useEditor } from "../../state/useEditor";
import PaletteIcon from "@mui/icons-material/Palette"

const CanvasContextBar = () => {
    const {
        selectedId,
        deleteSelected,
        duplicateElement,
        moveLayer,
        alignLeft,
        alignRight,
        alignCenter,
        updateElement
    } = useEditor();

    if (!selectedId) return null;
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateElement(selectedId, { fill: e.target.value });
    };

    return (
        <Box
            position="absolute"
            top={8}
            left="50%"
            sx={{
                transform: "translateX(-50%)",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: 1,
                boxShadow: 1,
                zIndex: 10,
                px: 1,
                py: 0.5,
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Цвет текста">
                    <IconButton component="label" size="small">
                        <PaletteIcon fontSize="small" />
                        <input
                            type="color"
                            hidden
                            id="color-picker"
                            style={{ position: 'absolute', left: '-9999px' }}
                            onChange={handleColorChange}
                        />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                    <IconButton onClick={() => deleteSelected()} size="small">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Дублировать">
                    <IconButton onClick={() => duplicateElement()} size="small">
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="На передний план">
                    <IconButton onClick={() => moveLayer("up")} size="small">
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="На задний план">
                    <IconButton onClick={() => moveLayer("down")} size="small">
                        <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Выровнять по левому краю">
                    <IconButton onClick={() => alignLeft()} size="small">
                        <FormatAlignLeftIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Выровнять по центру">
                    <IconButton onClick={() => alignCenter()} size="small">
                        <FormatAlignCenter fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Выровнять по правому краю">
                    <IconButton onClick={() => alignRight()} size="small">
                        <FormatAlignLeftIcon fontSize="small" style={{ transform: "scaleX(-1)" }} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
};

export default CanvasContextBar;
