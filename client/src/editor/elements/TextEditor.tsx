// textEditor.tsx

import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Html } from 'react-konva-utils';
import type { EditorConfig } from './TextElement';

interface Props {
    config: EditorConfig;
    onChange: (newText: string) => void;
    onClose: () => void;
}

export const TextEditor = ({ config, onChange, onClose }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!textareaRef.current) return;

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
            if (e.target !== textarea) {
                onChange(textarea.value);
                onClose();

            }
        };

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
        function handleInput(this: HTMLTextAreaElement) {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight + 3}px`;
        }


        textarea.addEventListener('keydown', handleKeyDown);
        textarea.addEventListener('input', handleInput);
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
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

