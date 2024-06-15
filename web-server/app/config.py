from google.cloud import secretmanager

class Config:
    PROJECT_NAME = "Image Search Engine"
    API_V1_STR = "/api/v1"
    GOOGLE_CLOUD_STORAGE_BUCKET = "jetrr-images"
    GOOGLE_CLOUD_PROJECT_ID = "jetrr-haider-ali-1"
    SECRET_KEY = None
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS = 3
    PINECONE_API_KEY = None


    @staticmethod
    def get_secret(secret_name):
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{Config.GOOGLE_CLOUD_PROJECT_ID}/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(name=name)
        return response.payload.data.decode("UTF-8")

    @classmethod
    def initialize(cls):
        cls.SECRET_KEY = cls.get_secret("jwt-secret-key")
        cls.PINECONE_API_KEY = cls.get_secret("pinecone-api-key")