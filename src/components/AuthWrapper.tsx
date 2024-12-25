'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthWrapperProps {
	children: React.ReactNode;
	session: any | null;
}

const pathsWithoutSession = ['/login', '/signup'];

export default function AuthWrapper({ children, session }: AuthWrapperProps) {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!session && !pathsWithoutSession.includes(pathname)) {
			router.push('/login');
		}
	}, [session, pathname, router]);

	if (!session && !pathsWithoutSession.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
}
