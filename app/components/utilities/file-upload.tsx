"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "listingImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  if (value) {
    return (
      <div className="relative w-[525px] h-[190px]">
        <Image fill src={value} alt="Upload" />
        <button
          onClick={() => onChange("")}
          className="bg-primary text-accent p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
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
