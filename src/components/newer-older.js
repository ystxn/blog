import React from "react"
import { Link } from "gatsby"
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

const NewerOlder = ({ newerLink, olderLink }) => {
    if (!newerLink && !olderLink) {
        return <></>
    }

    const newer = !newerLink ? <span></span> : (
        <Link to={newerLink}>
            <FaArrowCircleLeft /> Newer
        </Link>
    )
    const older = !olderLink ? "" : (
        <Link to={olderLink}>
            Older <FaArrowCircleRight />
        </Link>
    )
    return (
        <div class="newer-older">
            {newer}
            {older}
        </div>
    )
}
export default NewerOlder
