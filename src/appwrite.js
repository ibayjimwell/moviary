import { Client, Databases } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const appwriteApiEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(appwriteApiEndpoint)
    .setProject(projectId)

const Database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {

}