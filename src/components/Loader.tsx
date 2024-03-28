import { ReactElement } from 'react';

type TextAlign = 'center' | 'unset';

type LoaderType = {
  textAlign?: TextAlign;
};

const Loader = ({ textAlign = 'unset' }: LoaderType) => {
  return (
    <section style={{ textAlign, fontSize: '1rem' }} className="loader">
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
}

export const Skeleton = ({
  width = 'unset',
  height,
  length = 3,
  children,
  bgColor
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
    <div className="skeleton-loader" style={{ width }}>
      {skeletonShapes}
    </div>
  );
};
export default Loader;
