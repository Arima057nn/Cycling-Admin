"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { cyclingApi } from "@/services/cycling-api";
import { CyclingTypeInterface } from "@/interfaces/cycling";
import { CYCLING_STATUS } from "@/constants/cycling";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/FirebaseConfig";

export default function CreateCycling() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("default"); // Set default value for category
  const [categories, setCategories] = useState<CyclingTypeInterface[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getCategory = async () => {
    const res = await cyclingApi.getCategories();
    setCategories(res?.data);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  const createCycling = async () => {
    try {
      if (image) {
        const downloadURL = await uploadImageAndGetUrl(image);
        const res = await cyclingApi.createCycling(
          name,
          code,
          category,
          CYCLING_STATUS.READY,
          "123456",
          downloadURL
        );
        console.log(res);
        if (res?.status === 200) {
          setName("");
          setCode("");
          setCategory("default");
          setImage(null);
          toast.success("Tạo xe mới thành công");
        } else toast.error(res.data.error);
      } else toast.error("Bạn chưa chọn ảnh qrcode");
    } catch (error) {
      console.error("Error creating cycling:", error);
      toast.error("An error occurred while creating the cycling.");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const uploadImageAndGetUrl = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const imageRef = ref(storage, `qrcode/${image.name}`);
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

  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create New Cycling
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Tên xe"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Mã xe"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
            >
              <MenuItem value="default" disabled>
                Loại xe
              </MenuItem>
              {categories
                .filter((item) => item.value > 0)
                .map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              pt: 2,
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
            onClick={createCycling}
          >
            Create
          </Button>
        </Box>
      </Card>
    </div>
  );
}
