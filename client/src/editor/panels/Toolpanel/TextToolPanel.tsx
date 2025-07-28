import { Stack, Button } from "@mui/material";
import { useEditor } from "../../state/useEditor";

const TextToolPanel = () => {
    const { createElement } = useEditor();

    return (
        <Stack spacing={1}>
            <Button size="small" variant="contained" onClick={() => createElement("text")}>
                Добавить текст
            </Button>
        </Stack>
    );
};

export default TextToolPanel;
