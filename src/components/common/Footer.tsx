import { ProjectDetails } from '../../enums/projectDetails';

export const Footer = () => {
  return (
    <footer className="h-16 bg-violet-400 justify-around items-center flex flex-row">
      <span className="text-white font-medium drop-shadow-md">&copy;{ProjectDetails.year} Gonda Armand</span>
      <span className="text-white font-medium drop-shadow-md">{`Version: ${ProjectDetails.version}`}</span>
    </footer>
  );
};
