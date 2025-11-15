import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Museum Walkthrough | 3D Gallery',
  description: 'Interactive 3D museum experience with smooth camera navigation',
};

export default function MuseumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
