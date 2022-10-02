const fs = require('fs');
const axios = require('axios');

/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url,image_path='') =>
  {
    const filePath = image_path===''? `./images/image-${Date.now()}.png`:image_path
    axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(filePath))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  ).catch(err=>{
    console.log(err)
    console.log(`Unable to download data for ${url}`)
    // throw err
  });
  }

module.exports={
    download_image
}
