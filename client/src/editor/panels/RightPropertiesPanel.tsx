import { Box, Typography, TextField, Slider } from "@mui/material";
import { useEditor } from "../state/useEditor";

const PropertiesPanel = () => {
    const { selectedId, elements, updateElement } = useEditor();
    const element: any = elements.find(e => e.id === selectedId);

    if (!element) return null;

    const handleChange = (key: string, value: any) => {
        updateElement(element.id, { [key]: value });
    };

    return (
        <Box p={2} width="100%" bgcolor="white" borderLeft="1px solid #ccc" sx={{
            boxSizing: 'border-box',
        }}>
            <Typography variant="h6" gutterBottom>Свойства</Typography>
            {element.type === 'text' && (
                <>
                    <TextField
                        label="Текст"
                        value={element.props.text}
                        onChange={(e) => handleChange("text", e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Размер шрифта"
                        type="number"
                        value={element.props.fontSize}
                        onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
                        fullWidth
                        margin="normal"
                    />
                </>
            )}
            {element.type === 'image' && (
                <>
                    <Typography variant="body1">ID изображения: {element.fileId}</Typography>
                    {/* Можно добавить выбор нового изображения */}
                </>
            )}
            {element.type === 'datamatrix' && (
                <>
                    <TextField
                        label="Код"
                        value={element.props.datamatrixCode}
                        onChange={(e) => handleChange("datamatrixCode", e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </>
            )}
        </Box>
    );
};

export default PropertiesPanel;
