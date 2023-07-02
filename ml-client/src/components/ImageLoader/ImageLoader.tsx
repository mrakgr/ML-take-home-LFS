import React from "react";
import "./imageLoader.scss";
import { createFinalizedObjectUrl } from "../../utils";

interface ImageResultProps {
  images: Blob[];
  setImages: (fun: ((images: Blob[]) => Blob[])) => void;
  setMessage: (message: string) => void;
}

const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

async function getImageFromClipboard() {
  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read" as any
    });
    if (permission.state === "denied") {
      throw new Error("Not allowed to read clipboard.");
    }

    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      for (const type of item.types) {
        if (type === "text/plain") {
          const urlBlob = await item.getType(type)
          const data = await fetch(new URL(await urlBlob.text()))
          const dataType = data.headers.get("Content-Type")
          if (dataType && validImageTypes.includes(dataType)) {
            return data.blob()
          } else {
            throw new Error("The fetched URL data is not a valid image type.")
          }
        }
        else if (validImageTypes.includes(type)) {
          return item.getType(type)
        }
        else {
          throw new Error("The clipboard contents are neither a plain text URL nor a valid image type.")
        }
      }
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

const ImageLoader = (props: ImageResultProps) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const file = e?.target?.files;
    file && props.setImages(images => [...images, ...file]) // Had to change the target to ES2015 for `[...file]` to work.
  };

  const removeImage = (image: Blob) => {
    props.setImages(images => images.filter((x: Blob) => x !== image));
  };

  async function copyFromClipboard() {
    const file = await getImageFromClipboard()
    file && props.setImages(images => [...images, file])
  }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-4xl mt-2 mb-5 text-slate-600 ">Upload image</h2>
      <div className="flex items-center justify-center">
        <label className="flex cursor-pointer flex-col w-full border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
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

      <button className="flex justify-center rounded-md bg-slate-300 hover:bg-slate-100 active:hover:bg-slate-400 p-3 font-bold"
        onClick={copyFromClipboard}
      >
        Copy From Clipboard
      </button>

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
