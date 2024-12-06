import "@testing-library/jest-dom";
import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => React.createElement("img", props),
}));

jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "mock-token",
    },
    status: "authenticated",
  })),
}));
