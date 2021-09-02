import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEventHandler, ReactElement, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { database, storage } from '../../firebase';
import { FolderInterface } from './Folder';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from 'react-dom';
import { ProgressBar, Toast } from 'react-bootstrap';

interface Props {
    currentFolder: FolderInterface;
}

interface UploadingFile {
    id: string;
    name: string;
    progress: number;
    error: boolean;
}

export default function AddFileButton({ currentFolder }: Props): ReactElement {
    const { currentUser } = useAuth();
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    
    const handleUpload: ChangeEventHandler<HTMLInputElement> = (e: any): void => {
        const file = e.target.files[0]
        if (!currentUser || !currentFolder || !file) return;

        const id: string = uuidv4();
        setUploadingFiles( prevUploadingFiles => [
            ...prevUploadingFiles,
            {id: id, name: file.name, progress: 0, error: false}
        ])

        const filePath = 
            currentFolder.id === "0"
                ? file.name
                :`${`${[...(currentFolder.path.map(folder => folder.name)), ""].join('/')}`}${currentFolder.name}/${file.name}`;
        
        const fileRef = `files/${currentUser.uid}/${filePath}`;

        const uploadTask = storage.ref(fileRef).put(file);

        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes;
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map( file => {
                        if (file.id === id) {
                            return {...file, progress: progress}
                        }
                        return file
                    })
                })
            },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map( file => {
                        if (file.id === id) {
                            return {...file, error: true}
                        }
                        return file
                    })
                })
            },
            () => {
                window.setInterval( () => {
                    setUploadingFiles(prevUploadingFiles => {
                        return prevUploadingFiles.filter( 
                            file => (file.id !== id)
                        )
                    })
                }
                , 1000);

                uploadTask.snapshot.ref.getDownloadURL()
                .then(url => {
                    database.files
                        .where("name", "==", file.name)
                        .where("folderId", "==", currentFolder.id)
                        .where("userId", "==", currentUser.uid)
                        .get()
                        .then(existingFiles => {
                            const existingFile = existingFiles.docs[0];
                            if (existingFile) {
                                existingFile.ref.update({url: url})
                            } else {
                                database.files.add({
                                    url,
                                    name: file.name,
                                    createdAt: database.getCurrentTimestamp(),
                                    folderId: currentFolder.id,
                                    userId: currentUser.uid,
                                    ref: fileRef
                                })
                            }
                        })
                })
            }
        )
    }

    return (
        <>
            <label className="btn btn-outline-success btn-sm me-2">
                <FontAwesomeIcon icon={faFileUpload} />
                <input type="file" onChange={handleUpload} style={{ opacity: 0, position: "absolute", left: "-9999px"}}/>
            </label>

            {uploadingFiles.length > 0 && (
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            maxWidth: "250px"
                        }}
                    >
                        { uploadingFiles.map(file => (
                            <Toast key={file.id} onClose={() => {
                                setUploadingFiles(prevUploadingFiles => {
                                    return prevUploadingFiles.filter( uploadingFile => (uploadingFile.id !== file.id))
                                })
                            }}>
                                <Toast.Header closeButton={file.error} className="text-truncate d-block w-100">
                                    {file.name}
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        animated={!file.error}
                                        variant={file.error ? "danger" : "primary"}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={file.error ? "Error" : `${Math.round(file.progress*100)}%`}
                                    />
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>,
                    document.body
                )
            )}
        </>
    )
}
