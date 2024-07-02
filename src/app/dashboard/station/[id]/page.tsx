"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { StationInterface } from "@/interfaces/station";
import { stationApi } from "@/services/station-api";
import { storage } from "@/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Station({ params }: { params: { id: string } }) {
  const [station, setStation] = useState<StationInterface>();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const getStation = async () => {
    const res = await stationApi.getStation(params.id);
    if (res.status === 200) {
      setStation(res.data);
      setLatitude(res.data.latitude.toString());
      setLongitude(res.data.longitude.toString());
    }
  };

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
  useEffect(() => {
    getStation();
  }, []);

  const updateImageStation = async () => {
    if (!image || !station) return;
    const downloadURL = await uploadImageAndGetUrl(image);

    const res = await stationApi.upadteImageStation(downloadURL, station._id);
    if (res.status === 200) {
      console.log("res", res.data?.imgae);
      setStation({ ...station, imgae: res.data?.imgae });
      setImage(null);
      setUploadProgress(0);
      toast.success("Cập nhật ảnh thành công");
    } else {
      toast.error("Cập nhật ảnh thất bại");
    }
  };
  const updateStation = async () => {
    if (!station) return;
    const res = await stationApi.updateStation(
      station._id,
      station.name,
      station.position,
      latitude,
      longitude
    );
    if (res.status === 200) {
      toast.success("Cập nhật trạm xe thành công");
    } else {
      toast.error("Cập nhật trạm xe thất bại");
    }
  };
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin trạm xe
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Tên trạm xe</div>
              <TextField
                fullWidth
                value={station?.name}
                onChange={(e) => {
                  station && setStation({ ...station, name: e.target.value });
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Mã trạm</div>
              <TextField disabled fullWidth value={station?.code} />
            </div>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <div className="text-sm font-semibold mb-2 mt-4">Địa chỉ</div>
            <TextField
              fullWidth
              value={station?.position}
              onChange={(e) => {
                station && setStation({ ...station, position: e.target.value });
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Kinh độ</div>

              <TextField
                fullWidth
                value={latitude}
                onChange={(e) => {
                  station && setLatitude(e.target.value);
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2 mt-4">Vĩ độ</div>
              <TextField
                fullWidth
                value={longitude}
                onChange={(e) => {
                  station && setLongitude(e.target.value);
                }}
              />
            </div>
          </Box>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm font-semibold mb-2 mt-4">Ảnh</div>
              <div className="flex gap-4">
                <Box
                  component="img"
                  alt="Widgets"
                  src={station?.imgae}
                  sx={{
                    height: 128,
                    width: 168,
                    borderRadius: 2,
                  }}
                />
                <div className="flex flex-col items-start">
                  <Box
                    sx={{
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
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
                    color="success"
                    sx={{ mt: 1 }}
                    size="small"
                    onClick={updateImageStation}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={updateStation}
            >
              Cập nhật
            </Button>
          </div>
        </Box>
      </Card>
    </div>
  );
}
