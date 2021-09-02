import firebase from "firebase";
import { database, storage } from "../../firebase";

type User = firebase.User;

async function deleteFolderData(folder: any) {
    await folder.delete();
}

export async function deleteFile(file: any) {
    await storage.ref(file.data().ref).delete()
    await file.ref.delete();
}

export function deleteFolder(currentUser: User, folderId: string) {
    database.folders
        .where("parentId", "==", folderId)
        .where("userId", "==", currentUser.uid)
        .onSnapshot( snapshot => {
            snapshot.docs.forEach(folder => {
                deleteFolder(currentUser, folder.id)
            })
        })
    
    database.files
        .where("folderId", "==", folderId)
        .where("userId", "==", currentUser.uid)
        .onSnapshot( snapshot => {
            snapshot.docs.forEach(file => {
                deleteFile(file)
            })
        })

    deleteFolderData(database.folders.doc(folderId))
}