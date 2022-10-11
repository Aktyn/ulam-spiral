import { useEffect, useRef } from "react"
import { isPrime } from "~/utils/math"

const RESOLUTION = 1024

function getSpiralIndex(x: number, y: number) {
  let index = 0

  if (x * x >= y * y) {
    index = 4 * x * x - x - y
    if (x < y) {
      index -= 2 * (x - y)
    }
  } else {
    index = 4 * y * y - x - y
    if (x < y) {
      index += 2 * (x - y)
    }
  }

  return index
}

export const UlamSpiral = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Could not get canvas context")
    }

    canvas.width = canvas.height = RESOLUTION

    const halfResolution = (RESOLUTION / 2) | 0
    const quoterResolution = (RESOLUTION / 4) | 0

    let done = false,
      scale = 1, // Power of 2
      x = 0,
      y = 0,
      dirX = 1,
      dirY = 1,
      lenX = 0,
      lenY = 1,
      stepX = 0,
      stepY = 0,
      horizontal = false,
      primesPerPixelBuffer = new Uint32Array(RESOLUTION * RESOLUTION)

    const rescale = () => {
      console.log("Rescaling to:", scale * 2)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const newPrimesPerPixelBuffer = new Uint32Array(
        primesPerPixelBuffer.length,
      )

      for (let y2 = 0; y2 < halfResolution; y2++) {
        for (let x2 = 0; x2 < halfResolution; x2++) {
          let value = 0
          const newBufferIndex = x2 + y2 * halfResolution
          for (let yi = 0; yi < 2; yi++) {
            for (let xi = 0; xi < 2; xi++) {
              const n = getSpiralIndex(
                x2 * 2 + xi - halfResolution,
                y2 * 2 + yi - halfResolution,
              )
              if (isNaN(n)) {
                continue
              }
              value += primesPerPixelBuffer[n]
              newPrimesPerPixelBuffer[newBufferIndex] += primesPerPixelBuffer[n]
            }
          }

          const pixelIndex =
            x2 + quoterResolution + (y2 + quoterResolution) * RESOLUTION
          if (value) {
            for (let i = 0; i < 3; i++) {
              imageData.data[pixelIndex * 4 + i] = 255
            }
            imageData.data[pixelIndex * 4 + 3] = Math.round(
              255 *
                Math.pow(value / (scale * 2) ** 2, 1 / Math.sqrt(scale * 2)),
            )
          }
        }
      }
      ctx.putImageData(imageData, 0, 0)

      primesPerPixelBuffer = newPrimesPerPixelBuffer
      scale *= 2
      x = y = -quoterResolution
      y++
      lenY = halfResolution - 1
      lenX = halfResolution - 1
      dirX = dirY = 1
      stepX = stepY = 0
      horizontal = false
      tick()
    }

    const tick = () => {
      if (done) {
        return
      }

      const now = performance.now()
      do {
        const pixelIndex = getSpiralIndex(x, y)
        for (let yi = 0; yi < scale; yi++) {
          for (let xi = 0; xi < scale; xi++) {
            const n = getSpiralIndex(x * scale + xi, y * scale + yi)
            const prime = isPrime(n)
            if (prime) {
              primesPerPixelBuffer[pixelIndex]++
            }
          }
        }
        if (primesPerPixelBuffer[pixelIndex] > 0) {
          const alpha = Math.round(
            255 *
              Math.pow(
                primesPerPixelBuffer[pixelIndex] / scale ** 2,
                1 / Math.sqrt(scale),
              ),
          )
            .toString(16)
            .padStart(2, "0")
          ctx.fillStyle = `#ffffff${alpha}`
          ctx.fillRect((halfResolution + x) | 0, (halfResolution + y) | 0, 1, 1)
        }

        if (horizontal) {
          x += dirX
          stepX++
          if (stepX >= lenX) {
            stepX = 0
            dirX *= -1
            horizontal = false
            lenY++
          }
        } else {
          y += dirY
          stepY++
          if (stepY >= lenY) {
            stepY = 0
            dirY *= -1
            horizontal = true
            lenX++
          }
        }

        if (
          x < -halfResolution ||
          x >= halfResolution ||
          y < -halfResolution ||
          y >= halfResolution
        ) {
          rescale()
          return
        }
      } while (performance.now() - now < 32)

      window.requestAnimationFrame(tick)
    }
    tick()

    return () => {
      done = true
    }
  }, [])

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          backgroundColor: "#263238",
          boxShadow: "0 0 32px 8px #263238",
        }}
      ></canvas>
    </div>
  )
}
