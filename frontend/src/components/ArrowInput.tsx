import React, { useState } from 'react';
import clsx from 'clsx'; // On utilise clsx pour gérer les classes conditionnelles proprement

// On définit les props que le composant accepte.
// On ajoute `className` pour pouvoir le styler depuis l'extérieur.
interface ArrowInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export default function ArrowInput({ value, onChange, placeholder, className }: ArrowInputProps) {
    // On ajoute un état pour savoir si le champ est "actif" (en train d'attendre une touche)
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // On empêche le comportement par défaut (ex: la flèche qui bouge le curseur)
        e.preventDefault(); 
        
        // On accepte les flèches, les lettres, les chiffres et l'espace
        if (e.key.startsWith('Arrow') || /^[a-zA-Z0-9 ]$/.test(e.key)) {
            onChange(e.key);
            // Une fois la touche capturée, on retire le focus du champ (meilleure UX)
            e.currentTarget.blur();
        }
    };

    return (
        <input
            type="text"
            value={value}
            // Le placeholder change pour guider l'utilisateur
            placeholder={isFocused ? "Appuyez sur une touche..." : placeholder}
            readOnly // L'utilisateur ne peut pas taper de texte, seulement presser une touche
            onFocus={() => setIsFocused(true)}   // On active le mode "attente"
            onBlur={() => setIsFocused(false)}    // On désactive le mode "attente"
            onKeyDown={handleKeyDown}           // On gère la pression de touche
            // On combine les classes par défaut avec celles passées en props
            className={clsx(
                'w-full text-center border rounded-md px-2 py-1 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400',
                'cursor-pointer text-black font-inter',
                className // On applique les classes passées depuis le parent
            )}
        />
    );
}
