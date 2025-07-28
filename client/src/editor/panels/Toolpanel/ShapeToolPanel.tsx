import { Button, Stack } from "@mui/material";
import { useEditor } from "../../state/useEditor";


const ShapeToolPanel = () => {
    const { createElement } = useEditor();

    return (
        <Stack spacing={1}>
            <Button size="small" variant="contained" onClick={() => createElement("rect")}>
                Добавить прямоугольник
            </Button>
        </Stack>
    );
};

export default ShapeToolPanel;
