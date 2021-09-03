import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FormEventHandler, ReactElement, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../firebase';
import { FolderInterface } from './Folder';

interface Props {
    currentFolder: FolderInterface;
}

export default function AddFolderButton({ currentFolder }: Props): ReactElement {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const { currentUser } = useAuth();
    const inputRef = useRef<HTMLInputElement|null>(null)

    function openModal() {
        setOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    }

    function closeModal() {
        setOpen(false);
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!currentFolder) return;

        let path: { id: string, name: string }[] = 
            currentFolder.id === "0"
                ? []
                : [...currentFolder.path, { id: currentFolder.id, name: currentFolder.name }];

        // Create folder in database
        database.folders.add({
            name: name,
            userId: currentUser?.uid,
            parentId: currentFolder.id ? currentFolder.id : null,
            createdAt: database.getCurrentTimestamp(),
            path: path
        });

        setName('');
        closeModal();
    }

    return (
        <>
            <Button onClick={openModal} variant='outline-success' size='sm'>
                <FontAwesomeIcon icon={faFolderPlus} />
            </Button>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Folder name</Form.Label>
                            <Form.Control
                                type='text'
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                ref={inputRef}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant='success' type='submit'>
                            Add Folder
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
