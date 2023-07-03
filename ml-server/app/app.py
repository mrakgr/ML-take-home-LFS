import io
import time
from typing import List

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from app.models.response import ResponseModel
from app.services.classifier import ImageClassifier

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
Classifier = ImageClassifier()


@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": f"Welcome to the image classifier server!!, servertime {time.time()}"
    }


@app.post("/classify", tags=["Image Classification"])
async def classify(files: List[UploadFile] = []):
    # Note: If literally nothing gets sent in the form data, without running this endpoint 
    # it will give 400 error: Did not find CR at end of boundary (40).
    if len(files) == 0: 
        return ResponseModel(message="No file sent", success=False)

    result = []
    for file in files:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        result.append(Classifier.predict(image))

    return ResponseModel(data=result, message="Successful classification")