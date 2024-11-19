const cloudinary=require('cloudinary').v2

exports.uploadImageToCloudinary= async(file,folder,height,quality)=>{
    const options={folder};

    //this height and image is mainly for compression

    if(height)
    {
        options.height=height;
    }
    if(quality)
    {
        options.quality=quality;
    }
    options.resoure_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
    
exports.uploadVideoToCloudinary = async (file, folder) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "video",  // Ensure it knows you're uploading a video
        folder: folder,
      });
      return result;
    } catch (error) {
      throw new Error("Video upload failed");
    }
  };
  