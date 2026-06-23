import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#d4c7a5',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3d4035',
          borderRadius: '20%',
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        N
      </div>
    ),
    {
      ...size,
    }
  );
}
