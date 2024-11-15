'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from 'sonner';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
      <ProgressBar
        height="4px"
        color="#0A2FFF"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
