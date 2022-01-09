import dotenv from 'dotenv'
import process from 'process';

dotenv.config()


class Config {

    firebaseConfig: string

    constructor() {
        const fsConfig = JSON.parse(process.env.FIREBASE_CONFIG ? process.env.FIREBASE_CONFIG : "")
        this.firebaseConfig = fsConfig
    }
}

const config = new Config()

export default config