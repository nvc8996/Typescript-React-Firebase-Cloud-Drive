import React, { ReactElement } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { FolderInterface } from './Folder'

interface Props {
    currentFolder: FolderInterface;
}

const ROOT_PATH = {
    id: "0",
    name: "Root"
}

export default function FolderBreadcrumbs({ currentFolder }: Props): ReactElement {
    const path = currentFolder.id === "0" ? [] : [ROOT_PATH, ...currentFolder.path];

    return (
        <Breadcrumb listProps={{ className: "bg-white pl-0 m-0" }} className="flex-grow-1">
            {path.map((folder, index) => {
                return (
                    <Breadcrumb.Item
                        key={folder.id}
                        linkAs={Link}
                        linkProps = {{
                            to: {
                                pathname: `/folder/${folder.id}`,
                                state: { folder: {...folder, path: path.slice(1, index)}}
                            }
                        }}
                        className="text-truncate d-inline-block"
                        style= {{ maxWidth: "150px"}}
                    >
                        {folder.name}
                    </Breadcrumb.Item>
                )
            })}
            {(currentFolder) && (
                <Breadcrumb.Item
                    key={currentFolder.id}
                    className="text-truncate d-inline-block"
                    style= {{ maxWidth: "150px"}}
                    active
                >
                    {currentFolder.name}
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}
