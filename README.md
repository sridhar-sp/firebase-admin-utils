# Firebase admin utils
Utility project used to perform various operation on firebase backend resources

## Table of contents
- [Firebase admin utils](#firebase-admin-utils)
  - [Requirements](#requirements)
  - [Firestore utils](#firestore-utils)
    - [Upload document to firestore](#upload-document-to-firestore)


## Requirements
* [NodeJs](https://nodejs.org/en/)


## Firestore utils

#### Upload document to firestore
* Add json or csv file to the assets folder then run the below command with the document path (-d) and file path (-f)
* Document path can be nested path also (like rooms/roomA/messages/message1 ... )
```bash
 yarn setupEnv && fs-admin-firestore-upload -d cities/tamilnadu -f assets/cities.json
```
