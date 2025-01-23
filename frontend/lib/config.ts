import config from '../config.json'

interface Config {

    GOOGLE_PLACES_API_KEY: string;
    BACKEND_URL: string;

}

const environment = process.env.NODE_ENV || 'development'

export const getConfig = (): Config => {
    return config[environment as keyof typeof config]
}