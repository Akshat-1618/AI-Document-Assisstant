import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

function MindMap({ points }) {
  if (!points || points.length === 0) {
    return <p>No summary available</p>;
  }

  const centerX = 400;
  const centerY = 200;
  const radius = 250;

  // Create circular layout (mind‑map style)
  const nodes = points.map((point, index) => {
    const angle = (index / points.length) * 2 * Math.PI;

    return {
      id: String(index + 1),
      data: { label: point },

      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },

      style: {
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "12px",
        background: "#ffffff",
        width: 220,
        textAlign: "center",
        fontSize: "14px",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
      },
    };
  });

  // Connect all nodes to center node
  const edges = points.map((_, index) => ({
    id: `edge-${index}`,
    source: "center",
    target: String(index + 1),
    animated: true,
  }));

  // Add center node
  nodes.push({
    id: "center",
    data: { label: "Document Summary" },
    position: { x: centerX, y: centerY },
    style: {
      border: "2px solid #000",
      borderRadius: "15px",
      padding: "14px",
      background: "#f0f0f0",
      fontWeight: "bold",
      width: 240,
      textAlign: "center",
    },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        background: "#fafafa",
        borderRadius: "12px",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default MindMap;