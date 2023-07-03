import React, { useCallback, useState } from "react";
import Results from "../Results/Results";
import ImageLoader from "../ImageLoader/ImageLoader";
import Loader from "../Loader/Loader";
import "./classifier.scss";

interface IClassifier {
  score: number;
  label: string;
}

function Classifier() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [files, setFiles] = useState<Blob []>([]);
  const [results, setResults] = useState<IClassifier [] []>([]);

  const uploadImage = useCallback(async () => {
    setLoading(true);
    let formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      const response =  await fetch("http://localhost:8001/classify", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        })
      const json = await response.json()
      setResults(json.data);
      setLoading(false);
      setMessage(json.message);
    } catch (error : any) {
        setResults([]);
        setLoading(false);
        setMessage(error.message);
    }
  }, [files]);

  const handleTryAgain = () => {
    setLoading(false);
    setResults([]);
    setMessage("");
    setFiles([]);
  };

  if (loading) {
    return (
      <div className="classifier-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="classifier-container">
      {message && (
        <div className="message-container">
          <p>{message}</p>
        </div>
      )}

      {(!results || results.length === 0) && (
        <div className="classifier-group">
          <ImageLoader
            images={files}
            setImages={setFiles}
            setMessage={setMessage}
          />

          {files.length > 0 && (
            <button onClick={uploadImage} className="button-submit">
              Classify
            </button>
          )}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="classifier-group">
          {
            files.map((file, i) => <Results key={i} image={file} results={results[i]} />)
          }
          <button onClick={handleTryAgain} className="button-submit">
            Try other
          </button>
        </div>
      )}
    </div>
  );
}

export default Classifier;
