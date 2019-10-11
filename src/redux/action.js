export const setUserInformation=(userInformation)=>({
    type:'userInformation',
    data:userInformation
})
export const setBridalInformation=(bridalInformation)=>({
    type:'bridalInformation',
    data:bridalInformation
})
export const newEstateId=(estateId)=>({
    type:'estateId',
    data:estateId
})
export const getFileList=(fileList,index)=>({
    type:'fileList',
    index:index,
    data:fileList
})
export const setHousingPictures=(housingPictures)=>({
    type:'housingPictures',
    data:housingPictures
})