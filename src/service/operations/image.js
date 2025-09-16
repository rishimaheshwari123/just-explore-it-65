import { apiConnector } from "../apiConnector";
import { image } from "../apis";
import { toast } from 'react-toastify';

const { IMAGE_UPLOAD } = image


export const imageUpload = async (data, token) => {
    let result = []
    console.log(data)
    const toastId = toast.loading("Uploading images...")
    try {

        const formData = new FormData();
        for (let i = 0; i < data.length; i++) {
            formData.append("thumbnail", data[i]);
        }
        const response = await apiConnector("POST", IMAGE_UPLOAD, formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("IMAGE UPLOAD API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Upload Images")
        }
        toast.success("Images Uploaded Successfully")
        
        // Extract direct URLs from the response
        result = response?.data?.images?.map(img => img.secure_url || img.url) || []

    } catch (error) {
        console.log("IMAGE UPLOAD API ERROR............", error)
        toast.error(error.message || "Image upload failed")
    }
    toast.dismiss(toastId)
    return result

}




