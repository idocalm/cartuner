import React, {
  useRef,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

export interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

const drawImageScaled = (
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D
) => {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / image.width;
  const vRatio = canvas.height / image.height;
  const ratio = Math.min(hRatio, vRatio);
  const centerShiftX = (canvas.width - image.width * ratio) / 2;
  const centerShiftY = (canvas.height - image.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    centerShiftX,
    centerShiftY,
    image.width * ratio,
    image.height * ratio
  );
};

interface VehicleSketchSelectorProps {
  setSelection?: (selection: Selection) => void;
  selection: Selection;
}

const VehicleSketchSelector: React.FC<VehicleSketchSelectorProps> = ({
  setSelection,
  selection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      // Load and draw vehicle sketch
      const vehicleImage = new Image();
      vehicleImage.src = "/vehicle.svg"; // Replace with your vehicle sketch image path
      vehicleImage.onload = () => {
        drawImageScaled(vehicleImage, context);

        // Draw selection if it exists
        if (selection) {
          // Create red dots pattern
          const patternCanvas = document.createElement("canvas");
          patternCanvas.width = 10; // Adjust the size of dots and spacing
          patternCanvas.height = 10;

          // Draw dashed border
          context.setLineDash([5, 5]);
          context.strokeStyle = "#D0FD3E";
          context.lineWidth = 2;
          context.strokeRect(
            selection.x,
            selection.y,
            selection.width,
            selection.height
          );
        }
      };
    }
  }, [selection]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && startPoint) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentPoint = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        const width = currentPoint.x - startPoint.x;
        const height = currentPoint.y - startPoint.y;
        if (setSelection) {
          setSelection({
            x: startPoint.x,
            y: startPoint.y,
            width,
            height,
          });
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  if (!setSelection) {
    return (
      <div>
        <canvas ref={canvasRef} width={200} height={200} />
      </div>
    );
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={200}
        height={300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default VehicleSketchSelector;
