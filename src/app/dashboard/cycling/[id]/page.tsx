"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { cyclingApi } from "@/services/cycling-api";
import { CyclingInterface } from "@/interfaces/cycling";
import { toast } from "react-toastify";
import { convertCyclingStatus } from "@/utils/CyclingStatus";
import { storage } from "@/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Cycling({ params }: { params: { id: string } }) {
  const [cycling, setCycling] = useState<CyclingInterface>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

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

  const updateQrcode = async () => {
    if (!image || !cycling) return;
    const downloadURL = await uploadImageAndGetUrl(image);

    const res = await cyclingApi.updateQrCode(cycling._id, downloadURL);
    if (res?.status === 200) {
      setCycling({ ...cycling, qrcode: res.data?.qrcode });
      setImage(null);
      setUploadProgress(0);
      toast.success("Cập nhật QR code thành công");
    } else {
      toast.error("Cập nhật QR code thất bại");
    }
  };

  const updateCycling = async () => {
    if (!cycling) return;
    const res = await cyclingApi.updateCycling(params.id, cycling?.name);
    console.log("res", res);
    if (res?.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.error);
    }
  };

  const getCycling = async () => {
    const res = await cyclingApi.getCycling(params.id);
    if (res?.status === 200) {
      setCycling(res.data);
    }
  };
  useEffect(() => {
    getCycling();
  }, []);
  return (
    <div className="p-4">
      <Card sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin xe
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Tên xe</div>
              <TextField
                fullWidth
                value={cycling?.name}
                onChange={(e) =>
                  cycling && setCycling({ ...cycling, name: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Mã xe</div>
              <TextField disabled fullWidth value={cycling?.code} />
            </div>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Kinh độ</div>
              <TextField disabled fullWidth value={cycling?.latitude} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Vĩ độ</div>
              <TextField disabled fullWidth value={cycling?.longitude} />
            </div>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Trạng thái</div>
              <TextField
                fullWidth
                disabled
                value={cycling && convertCyclingStatus(cycling?.status)}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mt-4 mb-2">Thể loại xe</div>
              <TextField fullWidth disabled value={cycling?.category.name} />
            </div>
          </Box>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm font-semibold mb-2 mt-4">QR code</div>
              <div className="flex gap-4">
                <Box
                  component="img"
                  alt="Widgets"
                  src={cycling?.qrcode}
                  sx={{
                    width: 128,
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
                    onClick={updateQrcode}
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
              onClick={updateCycling}
            >
              Cập nhật
            </Button>
          </div>
        </Box>
      </Card>
    </div>
  );
}
