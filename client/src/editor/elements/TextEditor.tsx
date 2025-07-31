// textEditor.tsx

import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Html } from 'react-konva-utils';
import type { EditorConfig } from './TextElement';
import { useEditor } from '../state/useEditor';

interface Props {
    config: EditorConfig;
    onChange: (newText: string, newHeight?: number) => void;
    onClose: () => void;
    setCloseEditor: (n: boolean) => void;
    closeEditor: boolean
}

export const TextEditor = ({ config, onChange, onClose, setCloseEditor, closeEditor }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { editingId, setEditingId } = useEditor()

    useEffect(() => {
        if (!textareaRef.current) return;
        setCloseEditor(false)
        const textarea = textareaRef.current;
        textarea.value = config.text;
        textarea.style.position = 'absolute';
        textarea.style.top = `${config.y}px`;
        textarea.style.left = `${config.x}px`;
        textarea.style.width = `${config.width - config.padding * 2}px`;
        textarea.style.height = `${config.height - config.padding * 2 + 5}px`;
        textarea.style.fontSize = `${config.fontSize}px`;
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

        const handleOutsideClick = (e: MouseEvent) => {
            console.log(closeEditor)
            if ((e.target !== textarea) && !closeEditor) {
                onChange(textarea.value, textarea.scrollHeight + 3);
                setCloseEditor(true)
                onClose()
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey && !closeEditor) {

                e.preventDefault();
                onChange(textarea.value, textarea.scrollHeight + 3);
                setCloseEditor(true)
                window.removeEventListener('click', handleOutsideClick);
                onClose()
            }
            if (e.key === 'Escape') {
                setCloseEditor(true)
                onClose()

            }
        };
        function handleInput(this: HTMLTextAreaElement) {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight + 3}px`;
        }


        textarea.addEventListener('keydown', handleKeyDown);
        textarea.addEventListener('input', handleInput);
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick, { once: true });
        });

        return () => {
            textarea.removeEventListener('keydown', handleKeyDown);
            textarea.removeEventListener('input', handleInput);
            window.removeEventListener('click', handleOutsideClick);

        };
    }, [config, onChange, onClose]);

    return (
        <Html>
            <textarea
                ref={textareaRef}
                style={{
                    position: 'absolute',
                    minHeight: '1em',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                }}
            />
        </Html>
    );
};

