import Sigma from "sigma";
import { Graph } from "graphology";
import Papa from "papaparse";

// Create a Graphology graph
const graph = new Graph();
graph.addNode("node1", { label: "Node 1", x: 0, y: 0, size: 10, color: "red" });
graph.addNode("node2", { label: "Node 2", x: 1, y: 1, size: 10, color: "blue" });
graph.addEdge("node1", "node2");

// Attach the graph to a Sigma instance
const container = document.getElementById("graph-container");
const sigma = new Sigma(graph, container);

// Example usage of PapaParse
const csvData = `
name,age
Alice,30
Bob,25
`;

Papa.parse(csvData, {
  header: true,
  complete: (results) => {
    console.log("Parsed CSV Data:", results.data);
  },
});