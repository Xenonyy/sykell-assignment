import { Title } from '../components/common/Title';
import { DefaultLayout } from '../components/layouts/DefaultLayout';
import UrlDashboard from '../components/UrlDashboard/UrlDashboard';

export const HomePage = () => {
  return (
    <DefaultLayout>
      <Title title="Home Page" />
      <UrlDashboard />
    </DefaultLayout>
  );
};
