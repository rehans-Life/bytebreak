import { storage } from '../../../firebase'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  getBlob,
} from 'firebase/storage'

export const uploadFile = async function (file: File, path: string) {
  try {
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
  } catch (err) {
    console.log(err)
    return ''
  }
}

export const getFileFromURL = async function (path: string, name: string) {
  try {
    const fileRef = ref(storage, path)
    const blob = await getBlob(fileRef)

    return new File([blob], name)
  } catch (err) {
    console.log(err)
  }
}

export const deleteFile = async function (path: string) {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
