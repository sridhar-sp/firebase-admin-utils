#!/usr/bin/env node

import { Command, OptionValues } from 'commander';
import process from 'process';
import csv from 'csvtojson'
import fs from "fs-extra"
import config from './config'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp({ credential: cert(config.firebaseConfig) });
const firestore = getFirestore();

const readCommandLineArguments = (): OptionValues => {
    const program = new Command();

    program
        .option('-d, --document <path>', 'Upload a document to this path, path can be nested (ex. rooms/roomA/messages/message1...) .')
        .option('-c, --collection', 'Indicate this utlity should upload a collection .')
        .option('-f, --filePath <path>', 'File path can either be .json or csv .')
        .parse(process.argv);

    return program.opts();
}

const validateArguments = (options: OptionValues): Promise<void> => {

    return new Promise((resolve, reject) => {
        if (options.document) {
            const documentPathLength = options.document.split('/').length
            if (documentPathLength < 2) reject("Document path should contain collection and document information (ex. cities/chennai).")
            if (documentPathLength % 2 != 0) reject("Invalid document path.")
            if (options.filePath == null) reject("File path is required.")

            resolve()
        }

        reject("Invalid arguments passed.")
    })

}

const processOptions = (options: OptionValues) => {
    if (options.document) {
        uploadDocument(options.document, options.filePath)
    } else if (options.collection) {
        console.log("Collection processing is yet to be done.")
    } else {
        console.log("Unknown command.")
    }
}

const uploadDocument = (documentPath: string, filePath: string) => {
    console.log(`Begin document upload from ${filePath} to ${documentPath} .`)

    const documentPaths = documentPath.split('/')

    let collectionRef = firestore.collection(documentPaths[0])
    let docRef = collectionRef.doc(documentPaths[1])

    for (let i = 2; i < documentPaths.length; i++) {
        if (i % 2 == 0)
            collectionRef = docRef.collection(documentPaths[i])
        else
            docRef = collectionRef?.doc(documentPaths[i])
    }

    fileToJson(filePath)
        .then(json => {
            docRef
                .set(json)
                .then(response => { console.log(`Document upload to firestore success. ${response.writeTime} .`) })
                .catch(e => console.error(`Document upload to firestore failed with exception ${e} .`));
        })
}

const fileToJson = (filePath: string): Promise<any> => {

    return new Promise((resolve, reject) => {
        if (filePath.endsWith(".csv")) {
            csv().fromFile(filePath).then((jsonObj) => {
                resolve(jsonObj)
            })
        } else if (filePath.endsWith(".json")) {
            fs.readJson(filePath).then((jsonObj) => {
                resolve(jsonObj)
            }).catch(reject);

        } else {
            reject(`File extension not supported`)
        }
    })
}

const main = () => {
    const options = readCommandLineArguments()
    validateArguments(options)
        .then(() => processOptions(options))
        .catch(e => console.error(e))

}

main()