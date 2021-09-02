import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { database } from '../../firebase'
import DeleteButton from './DeleteButton'
import { deleteFile } from './Deletion'

export interface FileInterface {
    url: string;
    id: string;
    name: string;
    userId: string;
    folderId: string;
    createdAt: string;
}

interface Props {
    file: FileInterface;
}

export default function File({ file }: Props): ReactElement {
    const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false)
    const [position, setPosition] = useState<{xPosition: string; yPosition: string}>({xPosition: '0px', yPosition: '0px'})
    const { currentUser } = useAuth();

    function handleDelete() {
        if (!currentUser) return;

        database.files
            .where("name", "==", file.name)
            .where("folderId", "==", file.folderId)
            .where("userId", "==", currentUser.uid)
            .onSnapshot( snapshot => {
                snapshot.docs.forEach(file => {
                    deleteFile(file)
                })
            })
    }

    return (
        <>
            <a 
                href={file.url} 
                target="_blank" 
                className="btn btn-outline-dark text-truncate w-100"
                onContextMenu={(e) => {
                    e.preventDefault();
                    setPosition({xPosition: `${e.pageX}px`, yPosition: `${e.pageY}px`})
                    setShowDeleteButton(true);
                }}
            >
                <FontAwesomeIcon icon={faFile} className="me-2" />
                {file.name}
            </a>
            
            {showDeleteButton &&
            <DeleteButton
                position={position}
                toggle={() => setShowDeleteButton(false)}
                showDeleteButton={showDeleteButton}
                deleteFunction={handleDelete}
            />
        }
        </>
    )
}
