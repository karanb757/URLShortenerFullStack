import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors={false}
      toastOptions={{
        duration: 2000, // 2 seconds
        style: {
          background: "white",
          color: "black",
          fontWeight: 500,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // subtle shadow
          borderRadius: "8px", // rounded corners
          padding: "10px 16px",
        },
      }}
    />
  );
}
