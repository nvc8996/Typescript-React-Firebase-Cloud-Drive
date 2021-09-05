import React, { ReactElement } from 'react'
import { Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { useLocation, useParams } from 'react-router-dom'
import { ROOT_FOLDER, useFolder } from '../../hooks/useFolder'
import AddFileButton from './AddFileButton'
import AddFolderButton from './AddFolderButton'
import File from './File'
import Folder, { FolderInterface } from './Folder'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import NavBar from './NavBar'

interface Props {
    children: any;
}

interface ParamType {
    folderId: string;
}

interface StateInterface {
    folder: FolderInterface;
}

export default function DashBoard({ children }: Props): ReactElement {
    const { folderId } = useParams<ParamType>();
    const { state } = useLocation<StateInterface>();

    const set_state = state ? state : { folder: ROOT_FOLDER };

    const { folder, childFolders, childFiles } = useFolder(folderId, set_state.folder);
    return (
        <>
          <Helmet>
              <title>Dashboard | Google Drive Clone with Firebase</title>
          </Helmet>
          <NavBar/>
          <br/>
          <Container fluid>
              <div className="d-flex align-items-center">
                  <FolderBreadcrumbs currentFolder={folder}/>
                  <AddFileButton currentFolder={folder}/>
                  <AddFolderButton currentFolder={folder}/>
              </div>

              {childFolders.length > 0 && (
                  <div className="d-flex flex-wrap">
                      { childFolders.map(childFolder => {
                          return (
                              <div key={childFolder.id} style={{ maxWidth: "250px"}} className="p-2">
                                  <Folder folder={childFolder} />
                              </div>
                          )
                      })}
                  </div>
              )}

              {childFiles.length > 0 && (
                  <div className="d-flex flex-wrap">
                      { childFiles.map(childFile => {
                          return (
                              <div key={childFile.id} style={{ maxWidth: "250px"}} className="p-2">
                                  <File file={childFile} />
                              </div>
                          )
                      })}
                  </div>
              )}

          </Container>
        </>
    )
}
