import './AuthorAvatar.scss'
import { Avatar } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { avatarFromString, say } from '@/helpers'
import { FC } from 'react'

const DEFAULT_SIZE = 42

interface Props {
    id: string
    name: string
    email: string
    profilePicture: string
    size?: number
    disableClick?: boolean
}

const AuthorAvatar: FC<Props> = ({ id, name, email, profilePicture, size = DEFAULT_SIZE, disableClick = false }) => {
    const styles = disableClick ? 'author-avatar' : 'author-avatar author-avatar--hoverable'

    const navigate = useNavigate()

    const handleClick = () => {
        if (disableClick) return

        say(`Ouh, hi ${name}`)
        navigate(`/user/${id}`)
    }

    return (
        <div className={styles} onClick={handleClick}>
            {profilePicture ?
                <Avatar
                    alt='avatar'
                    src={`/images/avatars/${profilePicture}`}
                    sx={{
                        width: size,
                        height: size
                    }} /> :
                <Avatar {...avatarFromString(`${name.toUpperCase()} ${email.toUpperCase()}`, size)}
                />
            }
        </div>
    )
}

export default AuthorAvatar