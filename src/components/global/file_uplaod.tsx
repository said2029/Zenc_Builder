"use client";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { CldImage, CldUploadButton, CldUploadWidget } from "next-cloudinary";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange?: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button variant="ghost" type="button">
          <X className="h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30 z-[9999]">
      {/* <UploadButton
        endpoint="imageUploader" // Corrected endpoint prop
        onClientUploadComplete={(res) => {
          if (res) {
            console.log(res);
            // Do something with the response
            // onChange(res?.[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          // Handle the error
          console.error(error);
          // You can display an error message or take any necessary action
        }}
      /> */}
      <CldUploadButton
        options={{
          multiple: false,
        }}
        className="w-full p-3 bg-blue-500 rounded-lg mt-2"
        onSuccess={(res: any) => {
          console.log("success", res?.info?.secure_url);
          if (res) {
            if (onChange) onChange(res?.info?.secure_url ?? undefined);
          }
        }}
        onError={(error) => {
          // Handle the error
          console.error(error);
          // You can display an error message or take any necessary action
        }}
        uploadPreset="cloudinary_next"
      />
    </div>
  );
};

export default FileUpload;
