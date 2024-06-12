from datetime import datetime, timezone
import uuid
from google.cloud import storage, firestore
from fastapi import HTTPException, UploadFile
from app.config import Config

class ImageService:
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str):

        try:
            #upload image to gcs
            storage_client = storage.Client()
            bucket = storage_client.bucket(Config.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(f"{uuid.uuid4()}-{file.filename}")
            blob.upload_from_file(file.file)

            #store metadata in firestore
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            doc_ref = firestore_client.collection("images").document()
            image_data = {
                "image_url": blob.public_url,
                "uploaded_at": datetime.now(timezone.utc),
                "filename": file.filename,
                "user_id": user_id,
            }
            doc_ref.set(image_data)

            #add image to user's images list
            user_ref = firestore_client.collection("users").document(user_id)
            user_ref.update({
                "images": firestore.ArrayUnion([doc_ref.id])
            })

            return blob.public_url
        
        except Exception as e:
            print(f"Error uploading file to Google Cloud Storage: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")