import Header from "../CommonComponent/Header";
import PropertiesAction from "./PropertiesAction";
import PropertiesButton from "./PropertiesPanelButtons/PropertiesButton";
import { GoDuplicate } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { FaRegObjectUngroup } from "react-icons/fa";
import type { LayerNode } from "../../features/layers/type";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import SaveColorButton from "./PropertiesPanelButtons/SaveColorButton";
import RemoveColorButton from "./PropertiesPanelButtons/RemoveColorButton";
import { FaTurnUp } from "react-icons/fa6";
import { FaTurnDown } from "react-icons/fa6";
import useLayerMenuHandlers from "../../hooks/useLayerMenuHandlers";
import { Tools } from "../../features/tools/tools";
import { useSelectionStore } from "../../features/selection/selectionStores";
import type { UpdateAction } from "../../features/history/type";
import { useStyleStore } from "../../features/styles/styleStore";
import { useHistoryStore } from "../../features/history/historyStore";
import { useLayerStore } from "../../features/layers/layerStore";

interface PropertiesProps {
  node: LayerNode;
}

const Properties = ({ node }: PropertiesProps) => {
  const updateProps = useLayerStore((state) => state.updateProps);

  // local typing
  const [localTemp, setLocalTemp] = useState(() => {
    if (!node) return;
    const temp: any = {
      name: node.name,
      x: node.props.x,
      y: node.props.y,
      rotation: node.props.rotation,
    };

    if (node.type === "shape") {
      temp.width = node.props.width;
      temp.height = node.props.height;
      temp.radius = node.props.radius;
      temp.points = node.props.points;
      temp.fill = node.props.fill;
      temp.stroke = node.props.stroke;
      temp.strokeWidth = node.props.strokeWidth;
    }

    return temp;
  });

  const allShapes = useLayerStore((state) => state.allShapes);

  useEffect(() => {
    console.log("Shapes", allShapes);
  }, [allShapes]);

  useEffect(() => {
    if (!node) return;
    const temp: any = {
      name: node.name,
      x: node.props.x,
      y: node.props.y,
      rotation: node.props.rotation,
    };

    if (node.type === "shape") {
      temp.width = node.props.width;
      temp.height = node.props.height;
      temp.radius = node.props.radius;
      temp.points = node.props.points;
      temp.fill = node.props.fill;
      temp.stroke = node.props.stroke;
      temp.strokeWidth = node.props.strokeWidth;
    }

    setLocalTemp(temp);
    setFillColorPaletVisible(false);
  }, [node.id, node?.name, node]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  function inputValueUpdate(id: string, name: string, value) {
    updateProps(id, name, value);
  }

  const [fillColorPaletVisible, setFillColorPaletVisible] = useState(false);
  const [strokeColorPaletVisible, setStrokeColorPaletVisible] = useState(false);
  const deleteShapeGroup = useLayerStore((state) => state.deleteShapeGroup);
  const duplicateLayer = useLayerStore((state) => state.duplicateLayer);
  const { handleUpDown } = useLayerMenuHandlers();
  const unGroup = useLayerStore((state) => state.unGroup);

  const activeId = useSelectionStore((state) => state.activeId);

  const [currentUpdateAction, setCurrentUpdateAction] =
    useState<UpdateAction | null>(null);

  const addNewUndo = useHistoryStore((state) => state.addNewUndo);

  const setStrokeWidth = useStyleStore((state) => state.setStrokeWidth);

  useEffect(() => {
    if (currentUpdateAction) {
      console.log(currentUpdateAction);

      addNewUndo(currentUpdateAction);
    }
  }, [currentUpdateAction, addNewUndo]);

  return (
    <div className="border-t border-gray-200 p-2">
      <Header title="Properties" />
      <div className="flex gap-1 mt-5">
        <PropertiesButton
          Icon={GoDuplicate}
          text="Duplicate"
          color="#289947"
          funct={() => {
            duplicateLayer(node.id);
          }}
        />
        <PropertiesButton
          Icon={MdDelete}
          text="Delete"
          color="#ff0033"
          funct={() => deleteShapeGroup(node.id)}
        />
        {node.type === "group" && (
          <PropertiesButton
            Icon={FaRegObjectUngroup}
            text="Ungroup"
            color="#FFA500"
            funct={() => unGroup(activeId)}
          />
        )}
        <PropertiesButton
          Icon={FaTurnUp}
          text="Up"
          color="#0078D4"
          funct={() => {
            console.log("Up Button Click");
            handleUpDown("Up");
          }}
          disabled={node.lock}
        />
        <PropertiesButton
          Icon={FaTurnDown}
          text="Down"
          color="#0078D4"
          funct={() => handleUpDown("Down")}
          disabled={node.lock}
        />
      </div>
      {/* Name */}
      <div className="mt-2">
        <PropertiesAction text="Name" />
        <input
          type="text"
          className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
          value={localTemp.name ?? undefined}
          name="name"
          onChange={(e) => setLocalTemp({ ...localTemp, name: e.target.value })}
          onBlur={() =>
            updateProps(
              node.id,
              "name",
              localTemp.name ? localTemp.name : "No Name",
            )
          }
        />
      </div>
      {/* Position */}
      {node.type === "shape" &&
        node.shapeType !== "Line" &&
        node.shapeType !== "Scribble" && (
          <div className="mt-2">
            <PropertiesAction text="Position" />
            <div className="flex gap-1 justify-between">
              <div>
                <span className="text-gray-600">x</span>
                <input
                  type="text"
                  className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                  value={localTemp.x}
                  name="x"
                  onChange={(e) =>
                    setLocalTemp({
                      ...localTemp,
                      x: isNaN(Number(e.target.value))
                        ? node.props.x
                        : Number(e.target.value),
                    })
                  }
                  onBlur={(e) => {
                    const prevValue = node.props.x;
                    const newValue = Number(localTemp.x);
                    inputValueUpdate(node.id, e.target.name, newValue);
                    setCurrentUpdateAction({
                      type: "Update",
                      id: node.id,
                      parentId: node.parentId,
                      prev: { x: prevValue },
                      next: { x: newValue },
                    });
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <span className="text-gray-600">y</span>
                <input
                  type="text"
                  className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                  value={localTemp.y}
                  name="y"
                  onChange={(e) =>
                    setLocalTemp({
                      ...localTemp,
                      y: isNaN(Number(e.target.value))
                        ? node.props.y
                        : Number(e.target.value),
                    })
                  }
                  onBlur={(e) => {
                    const prevValue = node.props.y;
                    const newValue = Number(localTemp.y);
                    inputValueUpdate(node.id, e.target.name, newValue);
                    setCurrentUpdateAction({
                      type: "Update",
                      id: node.id,
                      parentId: node.parentId,
                      prev: { y: prevValue },
                      next: { y: newValue },
                    });
                  }}
                  onKeyDown={handleKeyDown}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
      {/* Width and Height for Rectangle */}{" "}
      {node.type === "shape" && node.shapeType === "Rectangle" && (
        <div className="mt-2">
          {" "}
          <PropertiesAction text="Size" />{" "}
          <div className="flex gap-1">
            {" "}
            <div>
              {" "}
              <span className="text-gray-600">w</span>{" "}
              <input
                type="text"
                className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                value={localTemp.width}
                name="width"
                onChange={(e) =>
                  setLocalTemp({
                    ...localTemp,
                    width: isNaN(Number(e.target.value))
                      ? node.props.width
                      : Number(e.target.value),
                  })
                }
                onBlur={(e) => {
                  const prevValue = node.props.width;
                  const newValue = Number(localTemp.width);
                  inputValueUpdate(node.id, e.target.name, newValue);
                  setCurrentUpdateAction({
                    type: "Update",
                    id: node.id,
                    parentId: node.parentId,
                    prev: { width: prevValue },
                    next: { width: newValue },
                  });
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <span className="text-gray-600">h</span>
              <input
                type="text"
                className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                value={localTemp.height}
                name="height"
                onChange={(e) =>
                  setLocalTemp({
                    ...localTemp,
                    height: isNaN(Number(e.target.value))
                      ? node.props.height
                      : Number(e.target.value),
                  })
                }
                onBlur={(e) => {
                  const prevValue = node.props.height;
                  const newValue = Number(localTemp.height);
                  inputValueUpdate(node.id, e.target.name, newValue);
                  setCurrentUpdateAction({
                    type: "Update",
                    id: node.id,
                    parentId: node.parentId,
                    prev: { height: prevValue },
                    next: { height: Number(localTemp.height) },
                  });
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      )}
      {/* Radius */}
      {node.type === "shape" && node.shapeType === "Circle" && (
        <div className="mt-2">
          <PropertiesAction text="Radius" />
          <input
            type="text"
            className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
            name="radius"
            value={localTemp.radius}
            onChange={(e) =>
              setLocalTemp({
                ...localTemp,
                radius: isNaN(Number(e.target.value))
                  ? node.props.radius
                  : Number(e.target.value),
              })
            }
            onBlur={(e) => {
              const prevValue = node.props.radius;
              const newValue = Number(localTemp.radius);
              inputValueUpdate(node.id, e.target.name, newValue);
              setCurrentUpdateAction({
                type: "Update",
                id: node.id,
                parentId: node.parentId,
                prev: { radius: prevValue },
                next: { radius: newValue },
              });
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      {/* Points */}
      {node.type === "shape" && node.shapeType === "Line" && (
        <div className="mt-2">
          <PropertiesAction text="Points" />

          <div className="mt-5">
            <PropertiesAction text="Starting" />
            <div className="flex gap-1">
              {localTemp.points &&
                localTemp.points
                  ?.slice(0, 2)
                  .map((point: number, index: number) => (
                    <div key={index}>
                      <span className="text-gray-600">{`${
                        index % 2 === 0 ? "x" : "y"
                      }`}</span>
                      <input
                        name={"points"}
                        key={index}
                        className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...localTemp.points];
                          newPoints[index] = isNaN(Number(e.target.value))
                            ? (node.props.points ?? [])
                            : Number(e.target.value);
                          setLocalTemp({
                            ...localTemp,
                            points: newPoints,
                          });
                        }}
                        onBlur={(e) => {
                          const prevValue = node.props.points;
                          const newValue = localTemp.points;
                          inputValueUpdate(node.id, e.target.name, newValue);
                          setCurrentUpdateAction({
                            type: "Update",
                            id: node.id,
                            parentId: node.parentId,
                            prev: { points: prevValue },
                            next: { points: newValue },
                          });
                        }}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  ))}
            </div>

            <PropertiesAction text="Ending" />
            <div className="flex gap-1">
              {localTemp.points
                ?.slice(2, 4)
                .map((point: number, index: number) => (
                  <div key={index}>
                    <span className="text-gray-600">{`${
                      index % 2 === 0 ? "x" : "y"
                    }`}</span>
                    <input
                      name={"points"}
                      key={index}
                      className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...localTemp.points];
                        newPoints[index + 2] = isNaN(Number(e.target.value))
                          ? (node.props.points ?? [])
                          : Number(e.target.value);

                        setLocalTemp({
                          ...localTemp,
                          points: newPoints,
                        });
                      }}
                      onBlur={(e) => {
                        const prevValue = node.props.points;
                        const newValue = localTemp.points;
                        inputValueUpdate(node.id, e.target.name, newValue);
                        setCurrentUpdateAction({
                          type: "Update",
                          id: node.id,
                          parentId: node.parentId,
                          prev: { points: prevValue },
                          next: { points: newValue },
                        });
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Rotation */}
      {node.type === "shape" && (
        <div className="mt-2">
          <PropertiesAction text="Rotation" />
          <input
            type="text"
            className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
            value={localTemp.rotation}
            name="rotation"
            onChange={(e) => {
              setLocalTemp({
                ...localTemp,
                rotation: isNaN(Number(e.target.value))
                  ? node.props.rotation
                  : Number(e.target.value),
              });
            }}
            onBlur={(e) => {
              const prevValue = node.props.rotation;
              const newValue = Number(localTemp.rotation);
              inputValueUpdate(
                node.id,
                e.target.name,
                Number(localTemp.rotation),
              );
              setCurrentUpdateAction({
                type: "Update",
                id: node.id,
                parentId: node.parentId,
                prev: { rotation: prevValue },
                next: { rotation: newValue },
              });
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      {/* Fill Color */}
      {node.type === "shape" && (
        <div>
          {node.shapeType !== Tools.Line &&
            node.shapeType !== Tools.Scribble && (
              <div className="mt-2">
                <PropertiesAction text="Fill Color" />
                <div className="flex gap-1 justify-between items-center relative">
                  {fillColorPaletVisible && (
                    <div className="absolute z-100 left-10 top-10">
                      <HexColorPicker
                        color={localTemp.fill}
                        onChange={(newColor) =>
                          setLocalTemp({
                            ...localTemp,
                            fill: newColor,
                          })
                        }
                      />
                    </div>
                  )}
                  <div
                    onClick={() => setFillColorPaletVisible(true)}
                    style={
                      localTemp.fill
                        ? {
                            backgroundColor: `${localTemp.fill}`,
                          }
                        : undefined
                    }
                    className={`w-15 rounded-md cursor-pointer h-7 ${
                      !localTemp.fill ? "border-2 border-red-500" : ""
                    }`}
                  ></div>
                  <input
                    type="text"
                    className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                    value={
                      localTemp.fill ? localTemp.fill.toString() : "No Fill"
                    }
                    name="fill"
                    onFocus={() => setFillColorPaletVisible(true)}
                  />
                  {node.props.fill !== localTemp.fill && (
                    <button
                      onClick={() => {
                        setFillColorPaletVisible(false);
                        setLocalTemp({
                          ...localTemp,
                          fill: node.props.fill,
                        });
                      }}
                      className="py-1 px-2 cursor-pointer text-lg text-blue-500 rounded-md border border-blue-500 hover:text-white hover:bg-blue-500  transition-all duration-150 active:scale-95"
                    >
                      Cancel
                    </button>
                  )}

                  <RemoveColorButton
                    setFunc={setFillColorPaletVisible}
                    inputValueUpdate={inputValueUpdate}
                    id={node.id}
                    name="fill"
                  />
                  <SaveColorButton
                    setFunc={setFillColorPaletVisible}
                    inputValueUpdate={inputValueUpdate}
                    value={localTemp.fill}
                    setCurrentUpdateAction={setCurrentUpdateAction}
                    node={node}
                    propertyType="Fill"
                  />
                </div>
              </div>
            )}

          {/* //!Stroke Color */}
          <div className="mt-2">
            <PropertiesAction text="Stroke Color" />
            <div className="flex gap-1 justify-between items-center relative">
              {strokeColorPaletVisible && (
                <div className="absolute z-100 left-10 top-10">
                  <HexColorPicker
                    color={localTemp.stroke}
                    onChange={(newColor) =>
                      setLocalTemp({
                        ...localTemp,
                        stroke: newColor,
                      })
                    }
                  />
                </div>
              )}
              <div
                onClick={() => setStrokeColorPaletVisible(true)}
                style={
                  localTemp.stroke
                    ? {
                        backgroundColor: `${localTemp.stroke}`,
                      }
                    : undefined
                }
                className={`w-15 rounded-md cursor-pointer h-7 ${
                  !localTemp.stroke ? "border-2 border-red-500" : ""
                }`}
              ></div>
              <input
                type="text"
                className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                value={
                  localTemp.stroke ? localTemp.stroke.toString() : "No Stroke"
                }
                name="stroke"
              />
              {node.props.stroke !== localTemp.stroke && (
                <button
                  onClick={() => {
                    setStrokeColorPaletVisible(false);
                    setLocalTemp({
                      ...localTemp,
                      stroke: node.props.stroke,
                    });
                  }}
                  className="py-1 px-2 cursor-pointer text-lg text-blue-500 rounded-md border border-blue-500 hover:text-white hover:bg-blue-500  transition-all duration-150 active:scale-95"
                >
                  Cancel
                </button>
              )}

              <RemoveColorButton
                setFunc={setStrokeColorPaletVisible}
                inputValueUpdate={inputValueUpdate}
                id={node.id}
                name="stroke"
              />
              <SaveColorButton
                setFunc={setStrokeColorPaletVisible}
                inputValueUpdate={inputValueUpdate}
                value={localTemp.stroke}
                setCurrentUpdateAction={setCurrentUpdateAction}
                node={node}
                propertyType="Stroke"
              />
            </div>
          </div>
        </div>
      )}
      {/* Stroke Width */}
      {node.type === "shape" && (
        <div className="mt-5">
          <PropertiesAction text="Stroke Width" />
          <div className="flex flex-col items-center justify-between">
            <span className="text-sm text-gray-600 text-center px-2 py-1 mb-1 border rounded-full">
              {localTemp.strokeWidth}
            </span>
            <input
              className="w-full"
              type="range"
              min={4}
              max={20}
              value={localTemp.strokeWidth}
              onChange={(e) => {
                setLocalTemp({
                  ...localTemp,
                  strokeWidth: isNaN(Number(e.target.value))
                    ? node.props.strokeWidth
                    : Number(e.target.value),
                });
              }}
              onMouseUp={(e) => {
                const prevValue = node.props.strokeWidth;
                const newValue = Number(localTemp.strokeWidth);
                setStrokeWidth(Number(e.currentTarget.value));
                inputValueUpdate(node.id, "strokeWidth", newValue);
                setCurrentUpdateAction({
                  type: "Update",
                  id: node.id,
                  parentId: node.parentId,
                  prev: { strokeWidth: prevValue },
                  next: { strokeWidth: newValue },
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
