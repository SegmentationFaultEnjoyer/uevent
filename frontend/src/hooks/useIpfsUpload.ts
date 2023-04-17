import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import axios from 'axios'
import { config } from '@/config'

const HOST = 'ipfs.infura.io'

export function useIpfsUpload() {
    const projectId = config.INFURA_PROJECT_ID
    const projectSecret = config.INFURA_API_KEY

    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = create({
        host: HOST,
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        }
    })

    const upload = async (file: File) => {
        const uploadedFile = await client.add(file)

        return uploadedFile.path
    }

    const uploadBase64 = async (b64Json: string) => {
        // Decode the Base64-encoded data and convert it to a Buffer object
        const imageData = Buffer.from(b64Json, 'base64');

        // Add the image to IPFS
        const uploadedFile = await client.add(imageData)

        return uploadedFile.path
    }

    const uploadMetaData = async (metadata: {
        name: string
        description: string
        image: string
        properties: {
            contractAddress: string
        }
        external_url?: string
    }) => {
        const metadataJson = JSON.stringify(metadata)

        const uploaded = await client.add(metadataJson)

        return uploaded.path
    }


    return {
        upload,
        uploadBase64,
        uploadMetaData
    }

}