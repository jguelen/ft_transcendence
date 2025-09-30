import React, { useState } from 'react';
import clsx from 'clsx';

interface ArrowInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export default function ArrowInput({ value, onChange, placeholder, className }: ArrowInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault(); 
        
        if (e.key.startsWith('Arrow') || /^[a-zA-Z0-9 ]$/.test(e.key)) {
            onChange(e.key);
            e.currentTarget.blur();
        }
    };

    return (
        <input
            type="text"
            value={value}
            placeholder={isFocused ? "Appuyez sur une touche..." : placeholder}
            readOnly
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={clsx(
                'w-full text-center border rounded-md px-2 py-1 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400',
                'cursor-pointer text-black font-inter',
                className
            )}
        />
    );
}
