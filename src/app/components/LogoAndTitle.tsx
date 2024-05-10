import Image from 'next/image';
import React from 'react';

const LogoAndTitle: React.FC = () => {
  return (
    <div className="flex-col">
      <Image src="/Logo.jpeg" alt="Company Logo" width={64} height={64} className="mr-2 rounded" />
      <h1 className="text-xl font-bold">Dezure Technical Test</h1>
    </div>
  );
};

export default LogoAndTitle;
