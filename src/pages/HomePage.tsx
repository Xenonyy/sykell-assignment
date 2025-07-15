import { DefaultLayout } from '../components/layouts/DefaultLayout';
import { UrlDashboard } from '../components/UrlDashboard/UrlDashboard';

export const HomePage = () => {
  return (
    <DefaultLayout>
      <UrlDashboard />
    </DefaultLayout>
  );
};
