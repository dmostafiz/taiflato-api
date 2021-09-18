const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.upload = async (asset, folder = '') => {
    try {
        return await cloudinary.uploader.upload(asset,{
            upload_preset:'leaverage',
            folder:folder,
            // background_removal: "cloudinary_ai",
        })
    } catch (error) {
        return error
    }
}

exports.destroy = async (asset, splt = '') => {

    try {

        let public_id = asset;

        
        if(splt !== '')
        {
           console.log('Spl: ',splt)

           const arr = asset.split('/')
           const last_1 = arr.slice(-1)[0]

           
           const nameArray = last_1.split('.')

           console.log('Name Arr: ',nameArray)

           const nameWithoutExtension = nameArray[0]

           public_id = splt + '/' + nameWithoutExtension

           console.log('Public ID: ',public_id)
        }
        else{
            const arr = asset.split('/')
            const last_1 = arr.slice(-1)[0]
            
            const nameArray = last_1.split('.')
 
            const nameWithoutExtension = nameArray[0]
            
            public_id = nameWithoutExtension 

            console.log('Name Arr: ',public_id)
        }
        
        const dest = await cloudinary.uploader.destroy(public_id)
       
        console.log('Destroy: ',dest)

    } catch (error) {
        return error
    }
}