"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Scan } from "lucide-react"
import { toast } from "sonner"

interface BarcodeScannerProps {
  onScan: (result: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let quagga: any = null

    const initScanner = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const QuaggaModule = await import("quagga")
        quagga = QuaggaModule.default

        if (videoRef.current) {
          quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
                constraints: {
                  width: 640,
                  height: 480,
                  facingMode: "environment",
                },
              },
              decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"],
              },
            },
            (err: any) => {
              if (err) {
                console.error("Barcode scanner initialization failed:", err)
                toast.error("Failed to initialize camera")
                return
              }
              quagga.start()
              setIsScanning(true)
            },
          )

          quagga.onDetected((result: any) => {
            const code = result.codeResult.code
            if (code) {
              onScan(code)
              stopScanner()
            }
          })
        }
      } catch (error) {
        console.error("Failed to load barcode scanner:", error)
        toast.error("Barcode scanner not supported on this device")
      }
    }

    const stopScanner = () => {
      if (quagga) {
        quagga.stop()
        setIsScanning(false)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    }

    initScanner()

    return () => {
      stopScanner()
    }
  }, [onScan, stream])

  const handleManualClose = () => {
    setIsScanning(false)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    onClose()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Scan Barcode</CardTitle>
          <CardDescription>Point your camera at the barcode on your invoice</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={handleManualClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-64 object-cover" autoPlay muted playsInline />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: "none" }} />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Initializing camera...</p>
              </div>
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-green-500 w-64 h-16 rounded-lg">
                <div className="absolute inset-0 border-t-2 border-green-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Scan className="h-4 w-4" />
          <span>Position the barcode within the frame</span>
        </div>
      </CardContent>
    </Card>
  )
}
