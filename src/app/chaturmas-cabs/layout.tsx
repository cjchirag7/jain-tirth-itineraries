import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Negotiated Cabs & Tours - Chaturmas 2026',
  description: 'Special negotiated rates for cabs and tours for travelers arriving for Bengaluru Chaturmaas 2026.',
};

export default function ChaturmasCabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
