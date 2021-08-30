import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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
    return (
        <Button 
            to={{
                pathname: `/folder/${folder.id}`,
                state: {
                    folder: {...folder, path: folder.path}
                }}} 
            variant="outline-dark" 
            className="text-truncate w-100" 
            as={Link}
        >
            <FontAwesomeIcon icon={faFolder} className="me-2" />
            {folder.name}
        </Button>
    )
}
