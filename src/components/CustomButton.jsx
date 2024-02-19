export default function CustomButton({ text, color, action }) {
    return(
        <button 
            className={`btn btn-${color}`}
            onClick={() => action}
        >
            {text}
        </button>
    )
}