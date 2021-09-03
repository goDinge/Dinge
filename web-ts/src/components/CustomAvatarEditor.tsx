import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import xMark from '../assets/x-mark.png';

interface CompletedCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
  aspect: number;
}

type TgenerateDownload = (
  canvas: HTMLCanvasElement,
  crop: CompletedCrop
) => void;

//type TonSelectFile = (evt: React.ChangeEvent<HTMLInputElement>) => void;

const CustomAvatarEditor = (props: {
  avatarUrl: string;
  getCroppedUrl: any;
  onClose: () => void;
}) => {
  const { avatarUrl, getCroppedUrl, onClose } = props;

  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [completedCrop, setCompletedCrop] = useState<CompletedCrop>();
  const [crop, setCrop] = useState<Crop>({
    x: 1,
    y: 1,
    width: 250,
    height: 250,
    unit: 'px',
    aspect: 1 / 1,
  });

  const generateDownload: TgenerateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
        console.log('previewUrl: ', previewUrl);
        getCroppedUrl(previewUrl);

        // const anchor = document.createElement('a');
        // anchor.download = 'cropPreview.png';
        // anchor.href = URL.createObjectURL(blob);
        // anchor.click();

        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pixelRatio = window.devicePixelRatio;

    const width = crop.width || 0;
    const height = crop.height || 0;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropC = crop as CompletedCrop;

    ctx.drawImage(
      image,
      cropC.x * scaleX,
      cropC.y * scaleY,
      cropC.width * scaleX,
      cropC.height * scaleY,
      0,
      0,
      cropC.width,
      cropC.width
    );
  }, [crop, completedCrop]);

  const getGenerateDownload = () => {
    const canvas = previewCanvasRef.current as HTMLCanvasElement;
    const cropObject = completedCrop as CompletedCrop;
    return generateDownload(canvas, cropObject);
  };

  return (
    <div className="error-events-calendar-overlay" style={{ zIndex: 20000 }}>
      <div className="close-ding" onClick={onClose}>
        <img alt="close" src={xMark} />
      </div>
      <div className="avatar-crop-container">
        <ReactCrop
          src={avatarUrl}
          crop={crop}
          onImageLoaded={onLoad}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c as CompletedCrop)}
        />
        <div>
          <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            // style={{
            //   width: Math.round(completedCrop?.width ?? 0),
            //   height: Math.round(completedCrop?.height ?? 0),
            // }}
            style={{
              width: 200,
              height: 200,
            }}
          />
        </div>
        <button
          type="button"
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={getGenerateDownload}
        >
          Download cropped image
        </button>
      </div>
    </div>
  );
};

export default CustomAvatarEditor;
