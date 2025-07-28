import { Stack, Button } from "@mui/material";
import { useEditor } from "../../state/useEditor";

const ImageToolPanel = () => {
    const { createElement } = useEditor();

    return (
        <Stack spacing={1}>
            <Button size="small" variant="contained" onClick={() => createElement("image")}>
                Добавить изображение
            </Button>
        </Stack>
    );
};

export default ImageToolPanel;
