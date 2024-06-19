"use client";

import { ChangeEvent, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { stationApi } from "@/services/station-api"; // Assuming you have this service
import { toast } from "react-toastify";
import { storage } from "@/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function CreateStation() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const uploadImageAndGetUrl = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const imageRef = ref(storage, `stations/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error(error);
            reject(error);
          }
        }
      );
    });
  };

  const createStation = async () => {
    try {
      if (image) {
        const downloadURL = await uploadImageAndGetUrl(image);
        const res = await stationApi.createStation(
          name,
          code,
          position,
          latitude,
          longitude,
          downloadURL
        );

        console.log(res);
        if (res?.status === 200) {
          setName("");
          setCode("");
          setLatitude("");
          setLongitude("");
          setPosition("");
          setImage(null);
          toast.success("Create station successfully");
        } else {
          toast.error("Create station failed");
        }
      } else {
        toast.error("Please select an image to upload.");
      }
    } catch (error) {
      console.error("Error creating station:", error);
      toast.error("An error occurred while creating the station.");
    }
  };

  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Station
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Tên trạm"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Mã trạm"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Địa chỉ cụ thể"
              fullWidth
              margin="normal"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Vĩ độ"
              fullWidth
              margin="normal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <TextField
              label="Kinh độ"
              fullWidth
              margin="normal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <div className="font-bold">Chọn ảnh</div>
            <input onChange={handleFileChange} type="file" />
            {uploadProgress > 0 && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography>{uploadProgress}%</Typography>
              </Box>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={createStation}
          >
            Create
          </Button>
        </Box>
      </Card>
    </div>
  );
}
