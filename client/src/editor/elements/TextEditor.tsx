import { useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { EditorConfig } from './TextElement';

interface Props {
    config: EditorConfig;
    onChange: (newText: string, newHeight?: number) => void;
    onClose: () => void;
    setCloseEditor: (n: boolean) => void;
    closeEditor: boolean;
}

export const TextEditor = ({ config, onChange, onClose, setCloseEditor, closeEditor }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!textareaRef.current) return;
        setCloseEditor(false);
        const textarea = textareaRef.current;
        textarea.value = config.text;
        textarea.style.position = 'absolute';
        textarea.style.top = `${config.y}px`;
        textarea.style.left = `${config.x}px`;
        textarea.style.width = `${config.width - config.padding * 2}px`;
        textarea.style.height = `${config.height - config.padding * 2 + 5}px`;
        textarea.style.fontSize = `${config.fontSize}px`;
        textarea.style.fontWeight = config.fontStyle;
        textarea.style.fontFamily = config.fontFamily;
        textarea.style.color = config.fill;
        textarea.style.textAlign = config.align;

        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.transformOrigin = 'left top';

        let transform = '';
        if (config.rotation) {
            transform += `rotateZ(${config.rotation}deg)`;
        }
        textarea.style.transform = transform;

        textarea.focus();

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 3}px`;
    }, [config, setCloseEditor]);

    const handleClickAway = () => {
        if (!closeEditor && textareaRef.current) {
            console.log(textareaRef)
            onChange(textareaRef.current.value, textareaRef.current.scrollHeight + 3);
            setCloseEditor(true);
            onClose();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 3}px`;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !closeEditor) {
            e.preventDefault();
            onChange(e.currentTarget.value, e.currentTarget.scrollHeight + 3);
            setCloseEditor(true);
            onClose();
        }
        if (e.key === 'Escape') {
            setCloseEditor(true);
            onClose();
        }
    };

    return (
        <Html>
            <ClickAwayListener
                onClickAway={handleClickAway}
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
            >
                <div role="presentation">
                    <textarea
                        ref={textareaRef}
                        style={{
                            position: 'absolute',
                            minHeight: '1em',
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                        }}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </ClickAwayListener>
        </Html>
    );
};