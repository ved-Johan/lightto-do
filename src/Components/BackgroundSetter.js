import '../App.css';
import Cropper from 'react-easy-crop'
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
}  

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
})

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export default function BackgroundSetter(props){
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    
    async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
    ) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(URL.createObjectURL(file))
        }, 'image/png')
    })
    }

    const showCroppedImage = useCallback(async () => {
        try {
          const croppedImage = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
          )
          //console.log(croppedImage);
          let blob = await fetch(croppedImage).then(r => r.blob())
          //console.log(props.imgUrl);
          await window.api.saveImg(blob, props.imgUrl);
          props.toggleChangeBackground();
        } catch (e) {
          console.error(e)
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [imageSrc, croppedAreaPixels])
    

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])


    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let imageDataUrl = await readFile(file)
    
          setImageSrc(imageDataUrl)
        }
    }
    
    return (
        <motion.div className='h-full w-full absolute top-0 left-0 z-20 flex flex-col bg-slate-800'
            initial={{x:"-100%"}}
            animate={{x:"0%"}}
            exit={{x:"-100%"}}
            transition={{ ease: "easeIn" }}
        >
            <div className='h-20 w-full flex flex-row justify-center items-center shadow-lg'>
                <label htmlFor='imageInput' className='text-white text-2xl h-fit m-2 cursor-pointer'>Upload Image
                    <input type="file" className='hidden h-0' id='imageInput' name="imageInput" onChange={onFileChange} accept="image/*" />
                </label>
            </div>
            <div className='w-full flex-auto relative flex justify-center items-center bg-slate-900'>
            {imageSrc ? (
                <React.Fragment>
                <div >
                    <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1.3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    />
                </div>
                    {//<ImgDialog img={croppedImage} onClose={onClose} />
                    }
                </React.Fragment>
            ) : (
                <p className='text-white'>Upload an image</p>
            )}
            </div>
            <div className='w-full h-20 flex flex-row items-center justify-center'>
                <button className='p-2 mx-2 text-slate-800 bg-slate-300 rounded-2xl hover:text-black hover:bg-slate-200 transition' onClick={props.toggleChangeBackground}>Cancel</button>
                <button className='p-2 mx-2 text-slate-100 bg-teal-700 rounded-2xl hover:text-white hover:bg-teal-600 transition' onClick={showCroppedImage}>Save</button>
            </div>
        </motion.div>
    ); 
}