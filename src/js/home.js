// Import the CSS file for this page
import '../CSS/home.css';

import Sigma from "sigma";
import { Graph } from "graphology";
import { parse } from "papaparse";
import forceAtlas2 from "graphology-layout-forceatlas2"; // Import ForceAtlas2 layout

// Create a graphology graph
const graph = new Graph();

// Function to load and parse the CSV file

/*
function loadCSV(csvPath) {
  fetch(csvPath)
    .then((response) => response.text())
    .then((csvData) => {
      // Parse the CSV data
      parse(csvData, {
        header: true,
        complete: function (results) {
          const data = results.data;
          console.log("Parsed CSV Data:", data);

          // Add nodes and edges from the CSV
          data.forEach((row) => {
            const edgeThickness = parseFloat(row.Value) || 1;
            const targetlink = row.TargetLink;
            const sourcelink = row.SourceLink;

            // Add nodes with updated styling
            if (!graph.hasNode(row.Source)) {
              graph.addNode(row.Source, {
                label: row.Source,
                size: 15,
                color: "#1f77b4", // Custom blue color
                x: Math.random(),
                y: Math.random(),
                link: sourcelink,
              });
            }

            if (!graph.hasNode(row.Target)) {
              graph.addNode(row.Target, {
                label: row.Target,
                size: 15,
                color: "#ff7f0e", // Orange color
                x: Math.random(),
                y: Math.random(),
                link: targetlink,
              });
            }

            // Add edges with styles
            graph.addEdge(row.Source, row.Target, {
              size: edgeThickness,
              color: "#888", // Gray edges
            });
          });

          graph.forEachNode((node, attributes) => {
            console.log("Node: ", node, "Attributes:", attributes)
          })

          // Apply ForceAtlas2 layout
          const layoutSettings = {
            iterations: 10,
            gravity: 5,
            scalingRatio: 2,
          };
          forceAtlas2.assign(graph, layoutSettings);

          console.log("Nodes in graph:", graph.nodes());

          // Render the graph using Sigma.js
          const sigmaInstance = new Sigma(graph, document.getElementById("graph"), {
            // Set the label color for nodes (applied to all node labels)
            labelColor: { attribute: "labelColor", color: "white" },
            renderEdgeLabels: true, // Show edge labels
          });

          // Force a refresh to apply styles
          sigmaInstance.refresh();

          // Add event listener for node click
          sigmaInstance.on("clickNode", function (event) {
            const nodeId = event.node;
            const nodeData = graph.getNodeAttributes(nodeId);

            console.log("Node data:", nodeData);

            if (nodeData.link) {
              console.log("Link:", nodeData.link);
            }
          });
        },
      });
    })
    .catch((error) => console.error("Error loading CSV file:", error));


}

// Load the CSV file
loadCSV("/assets/Links.csv");
*/