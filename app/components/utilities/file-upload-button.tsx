"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "listingImage";
}

export const FileUploadButton = ({
  onChange,
  value,
  endpoint,
}: FileUploadProps) => {
  return (
    <UploadButton
      endpoint="listingImage"
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
