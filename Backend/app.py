from fastapi import FastAPI
from commands import listImages, listContainers, dockerHub, search_docker_hub,dockerRun, stopContainer, removeContainer,buildImage,search_docker_image
import os 
from fastapi import HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # React app URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class DockerfileRequest(BaseModel):
    path: str
    content: str


@app.get("/images/list")
def list_images():
    output = listImages()
    return {"status": output}

@app.get("/containers/list")
def running_containers(allCont: bool):
    output = listContainers(allCont)
    return {"status": output}

@app.post("/images/pull")
def pull_from_dockerhub(image: str):
    output= dockerHub(image)
    return {"status": output}

@app.post("/containers/run")
def run_container(image: str,remove: bool, interactive: bool ,  port: str = None, name: str = None):
    output =dockerRun(image, interactive, remove, port, name)
    return {"status": output}

@app.post("/containers/stop")
def stop_container(name: str):
    output = stopContainer(name)
    return {"status": output}

@app.delete("/containers/remove")
def remove_container(name: str):
    output =removeContainer(name)
    return {"status": f"Successfully removed Container {name} {output}"}


@app.post("/dockerfile/create")
def createDockerFile(request: DockerfileRequest):
    try:
        directory = os.path.dirname(request.path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory)

        # Write the Dockerfile
        with open(request.path, "w") as file:
            file.write(request.content)

        return {"status": "Dockerfile created", "path": request.path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/images/build")
def build_image(dockerFilePath: str, image_name: str, tag: str):
    try:
        # Check if the Dockerfile exists
        if not os.path.exists(dockerFilePath):
            raise HTTPException(status_code=404, detail="Dockerfile not found")

        # Build the Docker image
        output = buildImage(dockerFilePath, image_name, tag)
        return {"status": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/images/search")
def search_image(imageName: str):
    res = search_docker_image(imageName)
    return {"status": res}

@app.post("/dockerhub/search")
def searchDokcerHub(imageName: str):
    res = search_docker_hub(imageName)
    return {"status": res}
