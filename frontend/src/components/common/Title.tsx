import type { FC } from 'react';

interface TitleProps {
  title: string;
}
export const Title: FC<TitleProps> = ({ title }) => {
  return <h1 className="text-3xl capitalize py-5">{title}</h1>;
};
