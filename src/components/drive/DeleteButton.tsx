import { useEffect } from "react";

interface DeleteButtonProps {
    position: {
        xPosition: string;
        yPosition: string;
    };
    toggle: EventListenerOrEventListenerObject;
    showDeleteButton: boolean;
    deleteFunction: any;
}

export default function DeleteButton( { position, toggle, showDeleteButton, deleteFunction }: DeleteButtonProps ) {

    useEffect(() => {
        if (showDeleteButton) {
            document.addEventListener("click", toggle);
        }

        return () => {
            document.removeEventListener("click", toggle);
        }
    })
    if (showDeleteButton)
        return (
            <button
                style={{
                    position: "absolute",
                    top: position.yPosition,
                    left: position.xPosition,
                }}
                className="btn btn-danger"
                onClick={deleteFunction}
            >Delete</button>
        )
    else
        return (
            <></>
        )
}