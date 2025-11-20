import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { type LayerData } from "../../Data/LayerData";
import RenderNode from "./RenderNode";

interface WorkBoardProps {
  layerData: LayerData;
}

const WorkBoard = ({ layerData }: WorkBoardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spaceDown, setSpaceDown] = useState(false);

  // Measure container size dynamically
  useLayoutEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }

    updateSize(); // initial size
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Listen for spacebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setSpaceDown(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        setSpaceDown(false);
        document.body.style.cursor = "default";
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Wheel Zoom
  function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const stagePos = stage.position();
    const newX = pointer.x - (pointer.x - stagePos.x) * (newScale / oldScale);
    const newY = pointer.y - (pointer.y - stagePos.y) * (newScale / oldScale);

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }

  const childNodes = [...layerData.root.children].sort(
    (a, b) => layerData.nodes[a].pos - layerData.nodes[b].pos
  );

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${
        spaceDown ? "cursor-grab" : "cursor-default"
      }`}
    >
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        ref={stageRef}
        draggable={spaceDown} // ✅ Only draggable when space is pressed
        onWheel={handleWheel}
        onDragStart={() => {
          if (spaceDown) {
            document.body.style.cursor = "grabbing";
          }
        }}
        onDragEnd={() => {
          document.body.style.cursor = "grab";
        }}
      >
        <Layer>
          {childNodes.map((childId) => (
            <RenderNode key={childId} nodeId={childId} layerData={layerData} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WorkBoard;
