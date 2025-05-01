import React, { useState } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Checkbox, FormControlLabel,
  Card, CardContent, Divider, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import api from "../api.js";
import Navbar from "../components/Navbar"; // Adjust path if needed
import Footer from "../components/Footer"; // Adjust path if needed
import FolderOpenIcon from '@mui/icons-material/FolderOpen';




const DockerPage = () => {
  const [imgName, setImgName] = useState('');
  const [contName, setContName] = useState('');
  const [portNum, setPortNum] = useState('');

  const [contName2, setContName2] = useState('');

  const [contName3, setContName3] = useState('');

  const [imgName2, setImgName2] = useState('');
  const [imgName3, setImgName3] = useState('');
  const [imgName4, setImgName4] = useState('');
  const [imgName5, setImgName5] = useState('');
  const [tag, setTag] = useState('');
  const [searchResult, setSearchResult] = useState(null); // Add this at the top with other useStates
  const [hubSearchResult, setHubSearchResult] = useState(null);
  const [dockerfileContent, setDockerfileContent] = useState("");

  const [showRunningOnly, setShowRunningOnly] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [remove, setRemove] = useState(false);
  const [dockerFilePath, setDockerFilePath] = useState('');
  const [browseTarget, setBrowseTarget] = useState('');
  const isLoading = false;

  const [containers, setContainers] = useState([]);
  const [images, setImages] = useState([]);

  const fetchContainers = async () => {
    console.log("Fetching containers...");
    try {
      const response = await api.get('/containers/list',{params :{allCont: !showRunningOnly}});
      setContainers(response.data.status);
      console.log(response);
    } catch (error) {
      console.error("Error fetching containers", error);
    }
  };

  const runContainer = async (imgName,contName,portNum,remove,interactive) => {
    console.log("Running container... ",imgName, contName, portNum, remove, interactive);
    try {
      await api.post(`/containers/run?image=${imgName}&remove=${remove}&interactive=${interactive}&port=${portNum}&name=${contName}`);
    } catch (error) {
      console.error("Error running the container", error);
    }
  };

  const handleRunContainerClick = () => {
    runContainer(imgName, contName, portNum, interactive, remove);
  };

  const stopContainer = async (contName) => {
    console.log("stoping container... ",contName);
    try {
      await api.post(`/containers/stop?name=${contName}`);
    } catch (error) {
      console.error("Error stoping the container", error);
    }
  };

  const handleStopContainerClick = () => {
    stopContainer(contName2);
  };

  const deleteContainer = async (contName) => {
    console.log("Deleting container... ",contName);
    try {
      await api.delete(`/containers/remove?name=${contName}`);
    } catch (error) {
      console.error("Error Deleting the container", error);
    }
  };

  const handleDeleteContainerClick = () => {
    deleteContainer(contName3);
  };

  const fetchImages = async () => {
    console.log("Fetching Images...");
    try {
      const response = await api.get('/images/list');
      setImages(response.data.status);
      console.log(response);
    } catch (error) {
      console.error("Error fetching Images", error);
    }
  };

  const pullImage = async (imgName) => {
    console.log("pulling the Image... ",imgName);
    try {
      await api.post(`/images/pull?image=${imgName}`);
    } catch (error) {
      console.error("Error pulling the image", error);
    }
  };

  const handlePullImageClick = () => {
    pullImage(imgName2);
  };

  const createDockerFile = async () => {
    console.log("creating a Dockerfile... ",browseTarget, dockerfileContent);
    try {
      resp = await api.post('/dockerfile/create',{
        path: browseTarget,
        content: dockerfileContent,
      });
      console.log(resp.data);
    } catch (error) {
      console.error("Error creating Dockerfile", error);
    }
  };

  const buildImage = async (imgName,tag,dockerFilePath) => {
    console.log("building the Image... ",imgName);
    try {
      await api.post(`/images/build?dockerFilePath=${dockerFilePath}&image_name=${imgName}&tag=${tag}`);
    } catch (error) {
      console.error("Error building the image", error);
    }
  };

  const handleBuildImageClick = () => {
    buildImage(imgName3, tag, dockerFilePath);
  };

  const searchImage = async (imgName) => {
    console.log("searching for the Image... ",imgName);
    try {
      const res = await api.post(`/images/search?imageName=${imgName}`);
      console.log(res)
      setSearchResult(res.data.status);
    } catch (error) {
      console.error("Error building the image", error);
    }
  };

  const handleSearchImageClick = () => {
    searchImage(imgName4);
  };

  const searchDockerHubImage = async (imgName) => {
    console.log("searching for the Image on dockerhub... ",imgName);
    try {
      const res = await api.post(`/dockerhub/search?imageName=${imgName}`);
      console.log(res)

      // Format result if it's an array of objects
    if (Array.isArray(res.data.status)) {
      const formatted = res.data.status
        .map(img => `- ${img.name || img.repo || JSON.stringify(img)}`) // Fallbacks
        .join("\n");
      setHubSearchResult(`Found ${res.data.status.length} DockerHub images:\n${formatted}`);
    } else {
      setHubSearchResult(String(res.data.status));
    }
    } catch (error) {
      console.error("Error finding the image on dockerhub", error);
    }
  };

  const handleSearchDockerHubImageClick = () => {
    searchDockerHubImage(imgName5);
  };

  const handleBrowse = (targetSetter) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const path = e.target.files[0].path;
      targetSetter(path);
    };
    input.click();
  };

  return (
    <>
    <Navbar />
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <img src="/dockerlogo.svg" alt="Docker Logo" style={{ height: 70 }} />
        <Typography variant="h4">Docker Manager</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Container Operations */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <img src="/container.svg" alt="Container Icon" style={{ height: 40 }} />
                <Typography variant="h6">Container Operations</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={<Checkbox checked={showRunningOnly} onChange={e => setShowRunningOnly(e.target.checked)} />}
                label="Show Running Only"
              />

              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchContainers}
                  size="small"
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  fullWidth
                >
                  List Containers
                </Button>
              </Box>

              <TextField
              label="Available Containers"
              multiline
              fullWidth
              minRows={6}
              maxRows={20}
              value={containers}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />

              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField label="Image Name (required)" fullWidth size="small" value={imgName} onChange={(e)=>setImgName(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Container Name (optional)" fullWidth size="small" value={contName} onChange={(e)=>setContName(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Port Number (optional)" fullWidth size="small" value={portNum} onChange={(e)=>setPortNum(e.target.value)}/>
              </Box>

              <FormControlLabel control={<Checkbox checked={interactive} onChange={e => setInteractive(e.target.checked)} />} label="interactive" />
              <FormControlLabel control={<Checkbox checked={remove} onChange={e => setRemove(e.target.checked)} />} label="Remove when stopped" />

              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleRunContainerClick}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  fullWidth
                >
                  Run Container
                </Button>
              </Box>

              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField label="Container Name to Stop" fullWidth size="small" value={contName2} onChange={(e)=>setContName2(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleStopContainerClick}
                  fullWidth
                >
                  Stop Container
                </Button>
              </Box>

              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField label="Container Name to Remove" fullWidth size="small" value={contName3} onChange={(e)=>setContName3(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteContainerClick}
                  fullWidth
                >
                  Remove Container
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Operations */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <img src="/imgicon.png" alt="Image Icon" style={{ height: 62 }} />
                <Typography variant="h6">Image Operations</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ maxWidth: 300 }}>
                <Button variant="contained" fullWidth size="small" onClick={fetchImages}>List Images</Button>
              </Box>

              <TextField
              label="Available Images"
              multiline
              fullWidth
              minRows={6}
              maxRows={20}
              value={images}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />

              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Image Name to Pull" fullWidth size="small" value={imgName2} onChange={(e)=>setImgName2(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 1 }}>
                <Button variant="contained" color="primary" fullWidth size="small" onClick={handlePullImageClick}>Pull Image</Button>
              </Box>

              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField
                  label="Dockerfile Content"
                  multiline
                  minRows={4}
                  fullWidth
                  size="small"
                  value={dockerfileContent}
                  onChange={(e) => setDockerfileContent(e.target.value)}
                />
              </Box>

              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField
                  label="Path"
                  value={browseTarget}
                  onChange={(e) => setBrowseTarget(e.target.value)}           
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleBrowse(setBrowseTarget)}>
                          <FolderOpenIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box sx={{ maxWidth: 300, mt: 1 }}>
                <Button variant="outlined" color="secondary" fullWidth size="small" onClick={createDockerFile}>Create Dockerfile</Button>
              </Box>

              
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Dockerfile Path" fullWidth size="small" value={dockerFilePath} onChange={(e)=>setDockerFilePath(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Image Name" fullWidth size="small" value={imgName3} onChange={(e)=>setImgName3(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <TextField label="Image Tag" fullWidth size="small" value={tag} onChange={(e)=>setTag(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 2 }}>
                <Button variant="contained" color="success" fullWidth size="small" onClick={handleBuildImageClick}>Build Image</Button>
              </Box>

              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField label="Search Local Image" fullWidth size="small" value={imgName4} onChange={(e)=>setImgName4(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 1 }}>
                <Button variant="outlined" fullWidth size="small" onClick={handleSearchImageClick}>Search</Button>
              </Box>

              <TextField
              label="Search Result"
              multiline
              fullWidth
              minRows={6}
              maxRows={20}
              value={searchResult}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />


              <Box sx={{ maxWidth: 300, mt: 3 }}>
                <TextField label="Search DockerHub" fullWidth size="small" value={imgName5} onChange={(e)=>setImgName5(e.target.value)}/>
              </Box>
              <Box sx={{ maxWidth: 300, mt: 1 }}>
                <Button variant="outlined" fullWidth size="small" onClick={handleSearchDockerHubImageClick}>Search DockerHub</Button>
              </Box>

              <TextField
              label="Dockerhub Search Result"
              multiline
              fullWidth
              minRows={6}
              maxRows={20}
              value={hubSearchResult}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    <Footer />
    </>
  );
};

export default DockerPage;
