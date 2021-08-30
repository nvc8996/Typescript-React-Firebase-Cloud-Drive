# Typescript Cloud Drive React App

## Description
A Cloud Drive React project written in Typescript which allows:
* Sign Up - using email and password
* Log In - using email and password
* Log Out
* Update email and/or password
* Reset password using email
* Create folder
* Upload file


## Guide

To run the project, follow the instruction below:

### Preparation
* Createa new project and a new web app (with Sign-in method `Email/Password`) at Google Firebase
* Change `.env.local.example` into `.env.local`
* Fill the fields in `.env.local` with your Firebase credential
* Update Firestore rules as following:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      function authenticated() {
      	return request.auth != null
      }
      
      function own(data) {
      	return request.auth.uid == data.userId
      }
      
      function notUpdate(field) {
      	return !(field in request.resource.data) || (request.resource.data[field] == resource.data[field])
      }
          
      allow read: if authenticated() && own(resource.data)
      
      allow write: if authenticated() && own(request.resource.data)
      
      allow update: if authenticated() && own(resource.data) && notUpdate("userId")
    }
  }
}
```

### Run the app

#### Command
    yarn start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Info
This project is based on the tutorial of Web Dev Simplified.\
The tutorial: [How To Build A Google Drive Clone With Firebase](https://www.youtube.com/watch?v=6XTRElVAZ9Y) \
Original project: [WebDevSimplified Firebase Google Drive Clone](https://github.com/WebDevSimplified/firebase-google-drive-clone)

