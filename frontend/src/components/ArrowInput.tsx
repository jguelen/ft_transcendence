export default function ArrowInput({value, onChange, placeholder = "Appuie sur une touche"}: {
        value: string; onChange: (val: string) => void; placeholder?: string;}) {
    return (
        <input
        type="text"
        value={value}
        readOnly
        onKeyDown={e => {
            if (
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                onChange(e.key);
            } else if (e.key.length === 1) {
                onChange(e.key);
            }
        }}
        placeholder={placeholder}
        style={{ width: "8em", textAlign: "center" }}
        />
    );
}