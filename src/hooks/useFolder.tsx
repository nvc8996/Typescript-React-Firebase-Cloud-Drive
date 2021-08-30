import { useEffect, useReducer } from "react";
import { database } from "../firebase";
import { FolderInterface } from "../components/drive/Folder";
import { useAuth } from "../contexts/AuthContext";

interface UseFolderData {
    folderId: string | null;
    folder: FolderInterface;
    childFolders: FolderInterface[];
    childFiles: any[];
}

type ACTIONTYPE = { type: string, payload: any}

const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder',
    SET_CHILD_FOLDERS: 'set-child-folders',
    SET_CHILD_FILES:'set-child-files'
}

export const ROOT_FOLDER: FolderInterface = {
    name: 'Root',
    id: "0",
    path: []
}

function reducer(state: UseFolderData, { type, payload}: ACTIONTYPE) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            const select_state: UseFolderData = {
                folderId: payload.folderId,
                folder: payload.folder,
                childFolders: [],
                childFiles: []
            }
            return select_state;
        
        case ACTIONS.UPDATE_FOLDER:
            const update_state: UseFolderData = {
                ...state,
                folder: payload.folder
            }
            return update_state;

        case ACTIONS.SET_CHILD_FOLDERS:
            const set_child_folders_state: UseFolderData = {
                ...state,
                childFolders: payload.childFolders
            }
            return set_child_folders_state;

        case ACTIONS.SET_CHILD_FILES:
            const set_child_files_state: UseFolderData = {
                ...state,
                childFiles: payload.childFiles
            }
            return set_child_files_state;
    
        default:
            return state;
    }
}

export function useFolder(folderId: string = "0", folder: FolderInterface = ROOT_FOLDER) {
    const initialState: UseFolderData = {folderId, folder, childFolders: [], childFiles: []};
    const [state, dispatch] = useReducer(reducer, initialState);
    const { currentUser } = useAuth();

    useEffect(() => {
        return dispatch({ type: ACTIONS.SELECT_FOLDER, payload: {folderId, folder}});
    }, [folderId, folder]);

    useEffect(() => {
        if (folderId === "0") {
            return dispatch({ type: ACTIONS.UPDATE_FOLDER, payload: {folder: ROOT_FOLDER} });
        }

        database.folders.doc(folderId).get().then(doc => {
            return dispatch({ type: ACTIONS.UPDATE_FOLDER, payload: {folder: database.formatDoc(doc)} });
        })
        .catch(() => {
            return dispatch({ type: ACTIONS.SELECT_FOLDER, payload: {folderId: "0", folder: ROOT_FOLDER}});
        })
    }, [folderId]);

    useEffect(() => {
        return database.folders.where("parentId", "==", folderId)
            .where("userId", "==", currentUser?.uid)
            // .orderBy("createdAt")
            .onSnapshot( snapshot => {
                dispatch({
                    type: ACTIONS.SET_CHILD_FOLDERS,
                    payload: {
                        childFolders: snapshot.docs.map(database.formatDoc)
                    }
                })
            })
    }, [folderId, currentUser]);

    useEffect(() => {
        return database.files.where("folderId", "==", folderId)
            .where("userId", "==", currentUser?.uid)
            // .orderBy("createdAt")
            .onSnapshot( snapshot => {
                dispatch({
                    type: ACTIONS.SET_CHILD_FILES,
                    payload: {
                        childFiles: snapshot.docs.map(database.formatDoc)
                    }
                })
            })
    }, [folderId, currentUser]);

    return state;
}

