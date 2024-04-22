import { Client,Account,ID, Avatars, Databases, Query } from 'react-native-appwrite';
const client = new Client(); 

export const appwriteConfig = {
  endpoint:         'https://cloud.appwrite.io/v1',
  platform:         'com.xiela.aora',
  projectId:        '66262db1e8732b9dbbd3',
  databaseId:       '66263123dde4aad2b7eb',
  userCollectionId: '6626315257d91108f8e5',
  videoCollectionId:'6626318536c09920d460',
  storageId:        '662633178038161fd153'
}

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform)


const account   = new Account(client)
const avatars   = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
 try {
     const newAccount = await account.create(ID.unique(),email,password, username)
     if(!newAccount) throw Error
     const avatarUrl = avatars.getInitials(username)
     await logIn(email, password)

     const newUser = await databases.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       ID.unique(),
       {
         accountId: newAccount.$id,
         email,
         username,
         avatar: avatarUrl
       }
     )

     return newUser
     
 } catch (error) {
  console.log(error);
  throw new Error(error)
 }
}

export const logIn = async (email, password )=> {
 try {
   return await account.createEmailSession(email, password)
 } catch (error) {
  console.log(error);
  throw new Error(error)
 }
}


export const getCurrentUser = async ()=> {
 try {
  const currentAccount = await account.get()

  if(!currentAccount) throw Error

  const currentlyLoggedInUser =  await databases.listDocuments(
   appwriteConfig.databaseId,
   appwriteConfig.userCollectionId,
   [Query.equal('accountId', currentAccount.$id)]
  )

  if(!currentlyLoggedInUser) throw Error
  
  return currentlyLoggedInUser.documents[0]
  
 } catch (error) {
  console.log(error);
 }
}
