import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

function MindMap({ summary }) {
  if (!summary) {
    return <p>No summary available</p>;
  }

  const points = summary
    .split("\n")
    .map((p) => p.replace(/^\d+\.\s*/, "").trim())
    .filter((p) => p !== "");

  // spacing between nodes
  const spacing = 250;

  const nodes = points.map((point, index) => ({
    id: String(index + 1),
    data: { label: point },

    position: {
      x: index * spacing,
      y: 150,
    },

    style: {
      border: "1px solid #333",
      borderRadius: "10px",
      padding: "10px",
      background: "#ffffff",
      width: "220px",
      textAlign: "center",
      fontSize: "14px",
    },
  }));

  const edges = points.slice(1).map((_, index) => ({
    id: `e${index}`,
    source: String(index + 1),
    target: String(index + 2),
    animated: true,
  }));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
      />
    </div>
  );
}

export default MindMap;
