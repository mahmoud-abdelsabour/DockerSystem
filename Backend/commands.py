import os
import subprocess
import docker
import requests

client = docker.from_env()  # Initialize the Docker client


def listImages():
    #os.system("docker images")
    res=""
    images = client.images.list()
    for img in images:
         res+= f"- {img.tag} - ID: {img.id}\n"
    return res

def listContainers(allCont=True):
    if allCont:
        containers = client.containers.list(all=True)
    else:
        containers = client.containers.list()
    
    output = ""
    for container in containers:
        output += f"{container.short_id} - {container.name} - {container.image.tags} - {container.status}\n"
    
    return output if output else "No running containers."

def dockerHub(image):
    output = client.images.pull(image)
    return str(output)

def dockerRun(image, interactive=False,remove=False,port=None,name=None):
    ports = {}
    if port:
        host_port, container_port = port.split(":")
        ports[container_port] = host_port

    container = client.containers.run(
        image=image,
        command="tail -f /dev/null",
        name=name if name else None,
        ports=ports if port else None,
        detach=True,
        tty=interactive,
        remove=remove
    )

    return f"Container {container.short_id} started."

def stopContainer(name):
    try:
        container = client.containers.get(name)
        container.stop()
        return f"Container {name} stopped successfully."
    except docker.errors.NotFound:
        return f"Container {name} not found."
    except Exception as e:
        return f"Error: {str(e)}"

def removeContainer(name):
    container = client.containers.get(name)
    output = container.remove()
    return output

def buildImage(dockerFilePath, image_name,tag):
    image, build_logs = client.images.build(path=dockerFilePath, tag=f"{image_name}:{tag}")
    logs = []
    for chunk in build_logs:
        if 'stream' in chunk:
            logs.append(chunk['stream'])
        elif 'error' in chunk:
            logs.append(chunk['error'])

    return {
        "image_id": image.id,
        "logs": logs
    }

def search_docker_image(imageName):
    try:
        images = client.images.list()
        found_images = []

        for img in images:
            for tag in img.tags:
                if imageName in tag:
                    found_images.append((tag, img.id))

        if found_images:
            res = f"Found {len(found_images)} matching images:\n"
            for tag, img_id in found_images:
                res += f"- {tag} - ID: {img_id}\n"
            return res
        else:
            return f"No images found matching '{imageName}'."

    except docker.errors.APIError as e:
        return f"API error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def search_docker_hub(image_name):
    url = f"https://hub.docker.com/v2/search/repositories/?query={image_name}"
    response = requests.get(url)
    if response.status_code == 200:
        results = response.json().get('results', [])
        #return [repo["repo_name"] for repo in results if "repo_name" in repo]
        return results
    else:
        return f"Error: {response.status_code} - {response.text}"
