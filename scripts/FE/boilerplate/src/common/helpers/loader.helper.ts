import { message } from 'antd';

export function getBase64(img: Blob, callback: { (): void; (arg0: string | ArrayBuffer | null): any }) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function checkImage(file: { type: string; size: number }) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Only JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 15;
  if (!isLt2M) {
    message.error('Size should be less than 15MB!');
  }
  return isJpgOrPng && isLt2M;
}
