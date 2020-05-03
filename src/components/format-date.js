import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"

const formatDate = (inputDate) => {
    const format = 'MMM Do YYYY, h:mma'
    const unpublished = '<Unpublished Post />'
    dayjs.extend(advancedFormat)
    return inputDate ? dayjs(inputDate).format(format) : unpublished
}
export default formatDate
