import { Stack, Button, Typography } from "@mui/material";
import { useEditor } from "../../state/useEditor";

const TextToolPanel = () => {
    const { createElement } = useEditor();

    const addHeading1 = () => {
        createElement("text", {
            text: "Заголовок 1",
            fontSize: 36,
            fontStyle: "bold",
            fontFamily: "Arial",
        });
    };

    const addHeading2 = () => {
        createElement("text", {
            text: "Заголовок 2",
            fontSize: 24,
            fontStyle: "bold",
            fontFamily: "Arial",
        });
    };

    const addParagraph = () => {
        createElement("text", {
            text: "Обычный текст",
            fontSize: 16,
            fontStyle: "normal",
            fontFamily: "Arial",
        });
    };

    return (
        <Stack
            spacing={1}
            sx={{
                p: 2,
                bgcolor: "background.paper", // Явный фон для контраста
                borderRadius: 1,
            }}
        >
            <Typography
                onClick={addHeading1}
                sx={{
                    fontSize: 36,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    color: "text.primary", // Явный цвет текста
                    cursor: "pointer",
                    "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                    },
                }}
            >
                Заголовок 1
            </Typography>
            <Typography
                onClick={addHeading2}
                sx={{
                    fontSize: 24,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    color: "text.primary", // Явный цвет текста
                    cursor: "pointer",
                    "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                    },
                }}
            >
                Заголовок 2
            </Typography>
            <Typography
                onClick={addParagraph}
                sx={{
                    fontSize: 16,
                    fontStyle: "normal",
                    fontFamily: "Arial",
                    color: "text.primary", // Явный цвет текста
                    cursor: "pointer",
                    "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                    },
                }}
            >
                Обычный текст
            </Typography>
        </Stack>
    );
};

export default TextToolPanel;