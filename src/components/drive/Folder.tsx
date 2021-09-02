import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DeleteButton from './DeleteButton'
import { deleteFolder } from './Deletion'

export interface FolderInterface {
    name: string;
    id: string,
    userId?: string;
    parentId?: string | null;
    createdAt?: any;
    path: { id: string, name: string }[];
}

interface Props {
    folder: FolderInterface;
}

export default function Folder({ folder }: Props): ReactElement {
    const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false)
    const [position, setPosition] = useState<{xPosition: string; yPosition: string}>({xPosition: '0px', yPosition: '0px'})
    const { currentUser } = useAuth();

    function handleDelete() {
        if (!currentUser) return;
        
        deleteFolder(currentUser, folder.id)
    }

    return (
        <>
        <Button 
            to={{
                pathname: `/folder/${folder.id}`,
                state: {
                    folder: {...folder, path: folder.path}
                }}} 
            variant="outline-dark" 
            className="text-truncate w-100" 
            as={Link}
            onContextMenu={(e) => {
                e.preventDefault();
                setPosition({xPosition: `${e.pageX}px`, yPosition: `${e.pageY}px`})
                setShowDeleteButton(true);
            }}
        >
            <FontAwesomeIcon icon={faFolder} className="me-2" />
            {folder.name}
        </Button>
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
