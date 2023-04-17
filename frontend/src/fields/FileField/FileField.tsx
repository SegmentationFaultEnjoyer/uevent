import './FileField.scss'

import { FC, Dispatch, SetStateAction, useRef, ChangeEvent, useMemo } from 'react'
import {
    CloudUploadOutlined as UploadIcon,
    ClearOutlined as ClearIcon,
} from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Notificator } from '@/common';

function formatFileSize(sizeInBytes: number) {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;

    if (sizeInBytes > megabyte) {
        return (sizeInBytes / megabyte).toFixed(2) + ' MB';
    } else if (sizeInBytes > kilobyte) {
        return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
    } else {
        return sizeInBytes + ' bytes';
    }
}

const MIME_TYPES = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/webp'
]

const defaultMaxSize = 5242880 // bytes  5 mb

interface Props {
    file: File | null
    setFile: Dispatch<SetStateAction<File | null>>
    label?: string
    sublabel?: string
    maxSize?: number
    mimeTypes?: Array<string>
}

const FileField: FC<Props> = ({ file, setFile, label, sublabel, maxSize = defaultMaxSize, mimeTypes = MIME_TYPES }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const fileFieldClasses = useMemo(() => {
        return file ? 'file-field' : 'file-field file-field--hoverable'
    }, [file])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event?.target.files || event.target.files.length < 1) return

        const selectedFile = event.target.files[0]

        // MIME TYPE validation 
        if (!mimeTypes.includes(selectedFile.type)) {
            Notificator.warning(`File type "${selectedFile.type}" is not supported.`)
            return
        }

        // SIZE Validation
        if (selectedFile.size > maxSize) {
            Notificator.warning(`File size exceeds ${formatFileSize(maxSize)}.`)
            return
        }

        setFile(selectedFile)
    }

    const clearInput = () => {
        setFile(null)
    }

    return (

        <div className={fileFieldClasses} >
            {!file ? <div className='file-field__wrapper' onClick={() => inputRef.current?.click()}>
                <input
                    ref={inputRef}
                    hidden accept="image/*"
                    type="file"
                    onChange={handleFileChange} />
                <UploadIcon color='primary_light' fontSize='large' />
                {label && <p className='file-field__label'>{label}</p>}
                {sublabel && <p className='file-field__sublabel'>{sublabel}</p>}
            </div>
                :
                <div className='file-field__wrapper'>
                    <p className='file-field__label'>{file.name}</p>
                    <p className='file-field__sublabel'>{formatFileSize(file.size)}</p>
                    <div className='file-field__clear'>
                        <IconButton onClick={clearInput} color='primary_light'>
                            <ClearIcon />
                        </IconButton>
                    </div>

                </div>
            }
        </div>

    )
}

export default FileField