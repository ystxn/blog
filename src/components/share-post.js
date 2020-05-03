import React from "react"
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    WhatsappIcon
} from "react-share";

const SharePost = ({ title, source, summary, hashtags, url }) => {
    const shareProps = { title, summary, hashtags, url, source }
    const iconProps = {
        size: 32,
        round: true,
        iconFillColor: 'black'
    }
    return (
        <>
            <h4>Share this post:</h4>
            <FacebookShareButton {...shareProps}>
                <FacebookIcon {...iconProps} />
            </FacebookShareButton>
            <LinkedinShareButton {...shareProps}>
                <LinkedinIcon {...iconProps} />
            </LinkedinShareButton>
            <TwitterShareButton {...shareProps}>
                <TwitterIcon {...iconProps} />
            </TwitterShareButton>
            <WhatsappShareButton {...shareProps}>
                <WhatsappIcon {...iconProps} />
            </WhatsappShareButton>
        </>
    )
}
export default SharePost
