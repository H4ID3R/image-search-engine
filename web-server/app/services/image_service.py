from datetime import datetime, timezone
import uuid
from google.cloud import storage, firestore
from fastapi import HTTPException, UploadFile
from app.config import Config
import requests
from PIL import Image as PILImage
import io
import base64
import vertexai
from vertexai.preview.vision_models import MultiModalEmbeddingModel, Image
from pinecone import Pinecone
import tempfile

class ImageService:
    def __init__(self):
        Config.initialize()
        self.pinecone = Pinecone(api_key=Config.PINECONE_API_KEY)
        self.index = self.pinecone.Index(host='https://image-search-u9dy5c0.svc.aped-4627-b74a.pinecone.io', name='image-search')
        self.vertex_ai_location = 'us-central1'  # Update with your actual location
        self.model_id = 'multimodalembedding'
        vertexai.init(project=Config.GOOGLE_CLOUD_PROJECT_ID, location=self.vertex_ai_location)
        self.model = MultiModalEmbeddingModel.from_pretrained(self.model_id)

    def _get_image_embedding(self, image_bytes):
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(image_bytes)
            temp_file.flush()
            image = Image.load_from_file(temp_file.name)
        embeddings = self.model.get_embeddings(image=image)
        return embeddings.image_embedding

    async def upload_image(self, file: UploadFile, user_id: str):
        try:
            image_bytes = await file.read()
            image = PILImage.open(io.BytesIO(image_bytes))

            storage_client = storage.Client() 
            bucket = storage_client.bucket(Config.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(f"{uuid.uuid4()}-{file.filename}")
            blob.upload_from_string(image_bytes, content_type=file.content_type)

            embedding = self._get_image_embedding(image_bytes) 

            image_id = str(uuid.uuid4())
            self.index.upsert(vectors=[{"id": image_id, "values": embedding}]) 

            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID) 
            doc_ref = firestore_client.collection("images").document(image_id)
            image_data = {
                "image_url": blob.public_url,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
                "filename": file.filename,
                "user_id": user_id,
                "embedding_id": image_id
            }
            doc_ref.set(image_data)

            user_ref = firestore_client.collection("users").document(user_id) 
            user_ref.update({
                "images": firestore.ArrayUnion([doc_ref.id])
            })

            return {
                "image_url": blob.public_url,
                "filename": file.filename,
                "uploaded_at": datetime.now(timezone.utc).isoformat()
            }

        except Exception as e:
            print(f"Error uploading file: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def list_images(self, user_id: str):
        try:
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            user_ref = firestore_client.collection("users").document(user_id)
            user = user_ref.get()
            if not user.exists:
                raise HTTPException(status_code=404, detail="User not found")

            user_data = user.to_dict()
            image_ids = user_data.get("images", [])
            images = []
            for image_id in image_ids:
                image_ref = firestore_client.collection("images").document(image_id)
                image = image_ref.get()
                if image.exists:
                    image_data = image.to_dict()
                    images.append({
                        "image_url": image_data.get("image_url"),
                        "filename": image_data.get("filename"),
                        "uploaded_at": image_data.get("uploaded_at")
                    })

            return images

        except Exception as e:
            print(f"Error listing images: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def search_images(self, file: UploadFile):
        try:
            
            image_bytes = await file.read()
            image = PILImage.open(io.BytesIO(image_bytes))

           
            query_embedding = self._get_image_embedding(image_bytes)

            
            result = self.index.query(vector=query_embedding, top_k=5, include_values=True)
            print("Pinecone search result:", result)

            
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            similar_images = []
            for match in result["matches"]:
                image_ref = firestore_client.collection("images").document(match["id"])
                image = image_ref.get()
                if image.exists:
                    image_data = image.to_dict()
                    similar_images.append({
                        "image_url": image_data.get("image_url"),
                        "filename": image_data.get("filename"),
                        "uploaded_at": image_data.get("uploaded_at")
                    })

            return similar_images

        except Exception as e:
            print(f"Error searching similar images: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
