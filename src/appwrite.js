import { Client, Databases, Query, ID } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const appwriteApiEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(appwriteApiEndpoint)
    .setProject(projectId)

const Database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // 1. Use Appwrite SDK to check if the search term exists in the database
    try {

        const result = await Database.listDocuments(databaseId, collectionId, [
            Query.equal('searchTerm', searchTerm)
        ]);

        // 2. If it does, update the count
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await Database.updateDocument(databaseId, collectionId, doc.$id, {
                count: doc.count + 1
            });
        }
        // 3. If it doesn't, create a new document with the search term add count as 1
        else {
            await Database.createDocument(databaseId, collectionId, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            });
        }


    } catch (error) {
        console.log(`Error on fetching the appwrite data check the appwrite.js: ${error}`)
    }
    
}

export const getTrendingMovies = async () => {
    try {
        
        const result = await Database.listDocuments(databaseId, collectionId, [
            Query.limit(5),
            Query.orderDesc('count')
        ]);

        return result.documents

    } catch (error) {
        console.log(`Error on fetching the appwrite data check the appwrite.js: ${error}`)
    }
}