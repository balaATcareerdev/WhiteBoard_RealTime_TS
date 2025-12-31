import { useBoardStore } from "../../Store/BoardStore";
import Header from "../CommonComponent/Header";
import PropertiesAction from "./PropertiesAction";
import PropertiesButton from "./PropertiesButton";
import { GoDuplicate } from "react-icons/go";
import { MdDelete } from "react-icons/md";

interface PropertiesProps {
  id: string;
}

const Properties = ({ id }: PropertiesProps) => {
  const node = useBoardStore((state) =>
    id ? state.allShapes.nodes[id] : null
  );
  if (!node) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 p-2">
      <Header title="Properties" />

      <div className="flex gap-1 mt-5">
        <PropertiesButton Icon={GoDuplicate} text="Duplicate" color="#289947" />
        <PropertiesButton Icon={MdDelete} text="Delete" color="#ff0033" />
      </div>

      <div className="mt-2">
        <PropertiesAction text="Name" />
        <input
          type="text"
          className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
          value={node.name}
          name="name"
        />
      </div>

      <div className="mt-2">
        <PropertiesAction text="Position" />
        <div className="flex gap-1 justify-between">
          <div>
            <span className="text-gray-600">x</span>
            <input
              type="text"
              className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
              value={node.props.x}
              name="x"
            />
          </div>

          <div>
            <span className="text-gray-600">y</span>
            <input
              type="text"
              className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
              value={node.props.y}
              name="y"
            />
          </div>
        </div>
      </div>

      {/* Width and Height for Rectangle */}
      {node.type === "shape" && node.shapeType === "Rectangle" && (
        <div className="mt-2">
          <PropertiesAction text="Size" />
          <div className="flex gap-1">
            <div>
              <span className="text-gray-600">w</span>
              <input
                type="text"
                className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                value={node.props.width}
                name="width"
              />
            </div>

            <div>
              <span className="text-gray-600">h</span>
              <input
                type="text"
                className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                value={node.props.height}
                name="height"
              />
            </div>
          </div>
        </div>
      )}

      {node.type === "shape" && node.shapeType === "Circle" && (
        <div className="mt-2">
          <PropertiesAction text="Radius" />
          <input
            type="text"
            className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
            name="radius"
            value={node.props.radius}
          />
        </div>
      )}

      {node.type === "shape" && node.shapeType === "Line" && (
        <div className="mt-2">
          <PropertiesAction text="Points" />

          <div className="mt-5">
            <PropertiesAction text="Starting" />
            <div className="flex gap-1">
              {node?.props?.points?.slice(0, 2).map((point, index) => (
                <div>
                  <span className="text-gray-600">{`${
                    index % 2 === 0 ? "x" : "y"
                  }`}</span>
                  <input
                    name={`point${index}`}
                    key={index}
                    className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                    type="text"
                    value={point.toFixed(2)}
                  />
                </div>
              ))}
            </div>

            <PropertiesAction text="Ending" />
            <div className="flex gap-1">
              {node?.props?.points?.slice(2, 4).map((point, index) => (
                <div>
                  <span className="text-gray-600">{`${
                    index % 2 === 0 ? "x" : "y"
                  }`}</span>
                  <input
                    name={`point${index}`}
                    key={index}
                    className="bg-gray-200 box-border w-full outline-none p-1 font-outfit rounded-md"
                    type="text"
                    value={point.toFixed(2)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
