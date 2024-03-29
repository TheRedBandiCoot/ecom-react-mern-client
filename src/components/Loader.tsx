import { ReactElement } from 'react';

type TextAlign = 'center' | 'unset';

type LoaderType = {
  textAlign?: TextAlign;
  fontSize?: string;
  clsName?: string;
};

const Loader = ({
  textAlign = 'unset',
  fontSize = '1rem',
  clsName
}: LoaderType) => {
  return (
    <section
      style={{ textAlign, fontSize }}
      className={`loader ${clsName || ''}`}
    >
      <div></div>
    </section>
  );
};

interface SkeletonProps {
  width?: string;
  length?: number;
  height?: string;
  children?: ReactElement;
  bgColor?: string;
  marginTop?: string;
}

export const Skeleton = ({
  width = 'unset',
  height,
  length = 3,
  children,
  bgColor,
  marginTop = '1rem'
}: SkeletonProps) => {
  const skeletonShapes = Array.from({ length }, (_, idx) => (
    <div
      key={idx}
      className="skeleton-shape"
      style={{ height, backgroundColor: bgColor }}
    >
      {children}
    </div>
  ));
  return (
    <div className="skeleton-loader" style={{ width, marginTop }}>
      {skeletonShapes}
    </div>
  );
};
export default Loader;
