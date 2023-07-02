import React from "react";
import "./imageLoader.scss";
import { createFinalizedObjectUrl } from "../../utils";

interface ImageResultProps {
  images: File[];
  setImages: (fun: ((images: File[]) => File[])) => void;
  setMessage: (message: string) => void;
}

const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

const ImageLoader = (props: ImageResultProps) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const file = e?.target?.files;
    file && props.setImages(images => [...images, ...file]) // Had to change the target to ES2015 for `[...file]` to work.
  };

  const removeImage = (image: File) => {
    props.setImages(images => images.filter((x: File) => x !== image));
  };

  return (
    <div>
      <h2 className="text-4xl mt-2 mb-5 text-slate-600 ">Upload image</h2>
      <div className="flex items-center justify-center w-full">
        <label className="flex cursor-pointer flex-col w-full h-100 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
          <div className="flex flex-col items-center justify-center pt-7">
            <span className="material-icons image-icon">image</span>

            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
              Select a photo
            </p>
          </div>

          <input
            type="file"
            accept={validImageTypes.join(",")}
            onChange={handleFile}
            className="opacity-0"
            name="files[]"
            multiple
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {props.images.map((image, i) => (
          <div key={i} className="relative image-remove">
            <span
              onClick={() => removeImage(image)}
              className="remove-icon"
            >
              <span className="material-icons">delete</span>
            </span>

            <img
              className="image-remove"
              src={createFinalizedObjectUrl(image)}
              alt="classify leaves"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLoader;
