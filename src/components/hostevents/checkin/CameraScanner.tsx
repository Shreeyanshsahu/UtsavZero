
"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface CameraScannerProps {
  onScan: (value: string) => void;
  disabled?: boolean;
}

export default function CameraScanner({
  onScan,
  disabled = false,
}: CameraScannerProps) {
  const { isDarkMode } = useTheme();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const onScanRef = useRef(onScan);
  const scannedRef = useRef(false);

  const [starting, setStarting] = useState(true);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (disabled) return;

    let cancelled = false;
    let localStream: MediaStream | null = null;
    let localControls: { stop: () => void } | null = null;

    const reader = new BrowserQRCodeReader();

    async function startCamera() {
      try {
        setStarting(true);
        setError("");
        scannedRef.current = false;

        // Request camera access directly.
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          localStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = localStream;

        const video = videoRef.current;

        if (!video) {
          throw new Error("Camera preview element not found.");
        }

        // Attach the camera stream to the video element.
        video.srcObject = localStream;
        video.muted = true;
        video.playsInline = true;

        await video.play();

        if (cancelled) return;

        // Camera is now running independently of QR decoding.
        setActive(true);
        setStarting(false);

        // Start QR decoding without blocking camera startup.
        void reader
          .decodeFromVideoElement(video, (result) => {
            if (!result || scannedRef.current || cancelled) return;

            const token = result.getText().trim();
            if (!token) return;

            scannedRef.current = true;

            localControls?.stop();
            localStream?.getTracks().forEach((track) => track.stop());

            if (streamRef.current === localStream) {
              streamRef.current = null;
            }

            setActive(false);
            onScanRef.current(token);
          })
          .then((controls) => {
            localControls = controls;

            if (cancelled || scannedRef.current) {
              controls.stop();
              return;
            }

            controlsRef.current = controls;
          })
          .catch((err) => {
            if (!cancelled && !scannedRef.current) {
              setError(
                err instanceof Error
                  ? `QR decoder error: ${err.message}`
                  : "Unable to start QR decoding."
              );
            }
          });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to start camera."
          );
          setStarting(false);
          setActive(false);
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;

      localControls?.stop();

      if (controlsRef.current === localControls) {
        controlsRef.current = null;
      }

      localStream?.getTracks().forEach((track) => track.stop());

      if (streamRef.current === localStream) {
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [disabled]);

  const panel = isDarkMode
    ? "border-[#343B36] bg-[#202522]"
    : "border-[#EADCC9] bg-white";

  const muted = isDarkMode
    ? "text-[#B7B0A5]"
    : "text-[#806B5D]";

  return (
    <section className={`overflow-hidden rounded-2xl border ${panel}`}>
      <div className="relative aspect-video min-h-[240px] overflow-hidden bg-[#111411] sm:min-h-[360px]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!active && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-5 text-center text-white">
            {starting ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <CameraOff size={32} />
            )}

            <p className="text-sm">
              {starting
                ? "Starting camera..."
                : disabled
                  ? "Scanner paused"
                  : "Camera unavailable"}
            </p>
          </div>
        )}

        {active && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-48 w-48 max-h-[65%] max-w-[65%] rounded-2xl border-2 border-[#FFBE45] shadow-[0_0_0_999px_rgba(0,0,0,0.28)] sm:h-56 sm:w-56" />
          </div>
        )}
      </div>

      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 ${muted}`}>
        <div className="flex items-center gap-2 text-sm">
          <Camera size={17} />
          <span>Align the ticket QR inside the frame</span>
        </div>

        {active && (
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Camera active
          </span>
        )}
      </div>

      {error && (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/40">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
