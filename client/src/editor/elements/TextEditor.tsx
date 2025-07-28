import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Html } from '@mui/icons-material';

interface Props {
    textNode: Konva.Text;
    onChange: (newText: string) => void;
    onClose: () => void;
}

export const TextEditor = ({ textNode, onChange, onClose }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const stage = textNode.getStage();
        const { x, y } = textNode.absolutePosition();
        const scale = textNode.getAbsoluteScale();

        const stageBox = stage?.container().getBoundingClientRect();
        if (!stageBox) return;

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = `${stageBox.top + y * scale.y}px`;
        textarea.style.left = `${stageBox.left + x * scale.x}px`;
        textarea.style.width = `${textNode.width() * scale.x}px`;
        textarea.style.height = `${textNode.height() * scale.y}px`;
        textarea.style.fontSize = `${textNode.fontSize() * scale.x}px`;
        textarea.style.lineHeight = `${textNode.lineHeight()}`;
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transform = `rotateZ(${textNode.rotation()}deg)`;
        textarea.style.background = 'none';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';

        textarea.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onChange(textarea.value);
                onClose();
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (e.target !== textarea) {
                onChange(textarea.value);
                onClose();
            }
        };

        textarea.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);

        return () => {
            textarea.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [textNode, onChange, onClose]);

    return (
        <Html>
            <textarea ref={textareaRef} />
        </Html>
    );
};
