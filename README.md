# Image-Based Search Engine - Module 1

This document provides a comprehensive overview of the implementation details of the image-based search engine project, focusing on the architecture, technology stack, and how each component was integrated and deployed.

## Deployed Application Links

- **Frontend**: [Image-Based Search Engine Frontend](https://frontend-36xr6r7mca-uc.a.run.app/)
- **Backend**: [Image-Based Search Engine Backend](https://backend-36xr6r7mca-uc.a.run.app)


## Architecture

### High-Level Architecture

The project is divided into two main components: the frontend and the backend. Each component is built using modern frameworks and deployed on Google Cloud Run. The overall architecture leverages various Google Cloud services for storage, database, and secret management.


#### Frontend

- **Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Deployment**: Google Cloud Run

#### Backend

- **Framework**: FastAPI with Python
- **Deployment**: Google Cloud Run
- **Database**: Firestore for metadata storage
- **Storage**: Google Cloud Storage (GCS) for image storage
- **Vector Database**: Pinecone for storing and querying image embeddings
- **Secret Management**: Google Secret Manager for secure storage of API keys
- **Image Embeddings**: Managed API from Vertex AI that uses the "multimodalembedding" model


## Implementation Details

### Frontend

- **Framework**: React
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Deployment**: Dockerized and deployed on Google Cloud Run

#### Key Details

1. **Development Environment**:
   - Set up the React application using Vite for fast builds and hot module replacement.
   - Styled the application using TailwindCSS for utility-first CSS styling.

2. **CI/CD Pipeline**:
   - Configured GitHub Actions to automate the build and deployment process.
   - Used Docker to containerize the application.
   - Deployed the Docker container to Google Cloud Run.

3. **Deployment**:
   - The `Dockerfile` was set up to build the production version of the React app and serve it using Nginx.
   - Configured Cloud Run to automatically scale the application based on demand.

### Backend

- **Framework**: FastAPI
- **Language**: Python
- **Deployment**: Dockerized and deployed on Google Cloud Run
- **Database**: Firestore for metadata storage
- **Storage**: Google Cloud Storage (GCS) for image storage
- **Vector Database**: Pinecone for storing and querying image embeddings
- **Secret Management**: Google Secret Manager for secure storage of API keys

#### Key Details

1. **API Development**:
   - Developed RESTful API endpoints using FastAPI to handle image uploads, retrieval, and similarity search.
   - Used Google Cloud Storage (GCS) for storing uploaded images.
   - Stored image metadata in Firestore, ensuring fast and scalable database operations.

2. **Vector Database**:
   - Integrated Pinecone for managing and querying image embeddings, enabling efficient similarity searches.

3. **Image Embeddings**:
   - Utilized a managed API from Vertex AI to obtain image embeddings using the `multimodalembedding` model.
   - This approach provides low latency and high availability benefits over hosting a machine learning model directly.
   - When a user searches for an image, the image embeddings are generated via the managed API, which are then used for similarity search in Pinecone.

4. **Artifact Storage**:
   - Used Google Artifact Registry (GAR) for storing and managing Docker images of the backend and frontend services.
   - Configured CI/CD pipelines to push Docker images to GAR before deploying to Cloud Run.

5. **Secret Management**:
   - Used Google Secret Manager to securely store and manage API keys and sensitive information.
   - Configured the application to access secrets at runtime, enhancing security.

6. **CI/CD Pipeline**:
   - Configured GitHub Actions to automate the build, test, and deployment process.
   - Dockerized the FastAPI application.
   - Deployed the Docker container to Google Cloud Run.

7. **Authentication and Authorization**:
   - Implemented JWT-based authentication to secure API endpoints.
   - Ensured that users can only access their own data through proper authorization mechanisms as well protected routes.

## Assumptions and Limitations

### Assumptions

- The deployment assumes that the necessary Google Cloud services (Firestore, GCS, Pinecone, Secret Manager) are accessible.
- Users are expected to have valid authentication tokens to interact with the backend APIs.

### Limitations

- The current UI is minimalistic and just good enough to use the app. It can be improved a lot
- The system's performance and availability are dependent on the underlying Google Cloud services.
- The Cloud Project has a limitation of a $100 budget monthly, which can fall quite short if this app were to scale
