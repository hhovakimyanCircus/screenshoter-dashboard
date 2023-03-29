import Link from 'next/link';

import GoogleAuth from '@/components/GoogleAuth';

const Header = () => {
  return (
    <header className="fixed top-0 z-30 py-4 px-6 w-screen bg-white border-b">
      <div className="flex justify-between items-center px-4">
        <div>
          <Link href="/" className="font-mono text-xl">
            My ScreenShot
          </Link>
        </div>
        <GoogleAuth />
      </div>
    </header>
  );
};

export default Header;
