import Sigma from "sigma";
import { Graph } from "graphology";
import { parse } from "papaparse";
import forceAtlas2 from "graphology-layout-forceatlas2"; // Import ForceAtlas2 layout

// Create a graphology graph
const graph = new Graph();

// Function to load and parse the CSV file
function loadCSV(csvPath) {
  fetch(csvPath)
    .then((response) => response.text())
    .then((csvData) => {
      // Parse the CSV data
      parse(csvData, {
        header: true, // Use the first row as headers
        complete: function (results) {


        
          const data = results.data;

          console.log("Parsed CSV Data:", data);

          // Add nodes and edges from the CSV
          data.forEach((row) => {
            const edgeThickness = parseFloat(row.Value) || 1;
            const targetlink = row.TargetLink;
            const sourcelink = row.SourceLink;

            // Add nodes if they don't exist
            if (!graph.hasNode(row.Source)) {
              graph.addNode(row.Source, {
                label: row.Source,
                size: 15, // Larger node
                color: "#1f77b4", // Custom blue color
                labelColor: "#ffffff", // White text
                font: "Arial",
                x: Math.random(),
                y: Math.random(),
                link: sourcelink,
              });
            }
            if (!graph.hasNode(row.Target)) {
              graph.addNode(row.Target, {
                label: row.Source,
                size: 15, // Larger node
                color: "#1f77b4", // Custom blue color
                labelColor: "#ffffff", // White text
                font: "Arial",
                x: Math.random(),
                y: Math.random(),
                link: sourcelink,
              });
            }

            // Add edges
            graph.addEdge(row.Source, row.Target, {
              size: edgeThickness,
              color: "gray",
            });
          });

          // Apply ForceAtlas2 layout to calculate positions
          const layoutSettings = {
            iterations: 5, // Number of iterations
            gravity: 10, // Strength of gravity
            scalingRatio: 1, // Scaling factor
          };
          forceAtlas2.assign(graph, layoutSettings);

            // Log all node IDs after adding them
        console.log("Nodes in graph:", graph.nodes());




          // Render the graph using Sigma.js
          const sigmaInstance = new Sigma(graph, document.getElementById("graph"),{
            renderEdgeLabels: true, // Show edge labels
            labelFont: "Arial",
            labelSize: 110, // Default label size
            labelColor: { color: "#000" }, // Default label color
            defaultNodeType: "square",
          });

        // Add event listener for node click
            sigmaInstance.on('clickNode', function(event) {
                // Get the node ID
            const nodeId = event.node;

        // Access the full node data from the graph using the node ID
        const nodeData = graph.getNodeAttributes(nodeId);

        // Log the node data
        console.log('Node data:', nodeData);

        // If you have a 'link' attribute, you can access it here
        if (nodeData.link) {
            console.log('Link:', nodeData.link);
        }
      });
        },
      });
    })
    .catch((error) => console.error("Error loading CSV file:", error));
}

// Load the CSV file (update the path to your file)
loadCSV("/assets/Links.csv");