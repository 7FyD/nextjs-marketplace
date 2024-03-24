"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "listingImage" | "profilePicture";
  className?: string;
}

export const FileUploadButton = ({
  onChange,
  value,
  endpoint,
  className,
}: FileUploadProps) => {
  return (
    <UploadButton
      className={className}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
