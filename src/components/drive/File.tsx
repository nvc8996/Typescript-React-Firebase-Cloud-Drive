import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'

interface FileInterface {
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
    return (
        <a href={file.url} target="_blank" className="btn btn-outline-dark text-truncate w-100">
            <FontAwesomeIcon icon={faFile} className="me-2" />
            {file.name}
        </a>
    )
}
