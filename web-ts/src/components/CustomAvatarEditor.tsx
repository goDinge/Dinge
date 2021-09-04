import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { AppState } from '../store/reducers/rootReducer';
import { AuthState } from '../store/interfaces';
import xMark from '../assets/x-mark.png';

import * as authActions from '../store/actions/auth';

interface CompletedCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
  aspect: number;
}

type TgenerateUpload = (canvas: HTMLCanvasElement, crop: CompletedCrop) => void;

const CustomAvatarEditor = (props: {
  avatarUrl: string;
  getCroppedUrl: any;
  onClose: () => void;
}) => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;

  const { avatarUrl, getCroppedUrl, onClose } = props;

  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [completedCrop, setCompletedCrop] = useState<CompletedCrop>();
  const [error, setError] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    x: 1,
    y: 1,
    width: 160,
    height: 160,
    unit: 'px',
    aspect: 1 / 1,
  });

  const dispatch = useDispatch<Dispatch<any>>();
  const lastModified = Date.now();

  const generateUpload: TgenerateUpload = async (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    let file;

    try {
      await canvas.toBlob(
        (blob) => {
          const croppedUrl = URL.createObjectURL(blob);
          getCroppedUrl(croppedUrl);
          if (blob && authUser) {
            file = new File([blob], `${authUser.name + '-' + lastModified}`, {
              lastModified,
            });
            dispatch(authActions.updateAuthAvatar(file));
          }
        },
        'image/JPEG',
        0.7
      );
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
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

  const getGenerateUpload = () => {
    const canvas = previewCanvasRef.current as HTMLCanvasElement;
    const cropObject = completedCrop as CompletedCrop;
    return generateUpload(canvas, cropObject);
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
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              border: '2px solid #FF5A5F',
            }}
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={getGenerateUpload}
        >
          Upload New Avatar
        </button>
      </div>
    </div>
  );
};

export default CustomAvatarEditor;
