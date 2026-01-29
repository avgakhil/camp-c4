function dijkstra(graph, start, end, accessibleOnly = false) {
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const node in graph) {
    dist[node] = Infinity;
    prev[node] = null;
  }

  if (!graph[start] || !graph[end]) {
    return { path: [], distance: Infinity };
  }

  dist[start] = 0;

  while (true) {
    let curr = null;
    let min = Infinity;

    for (const node in dist) {
      if (!visited.has(node) && dist[node] < min) {
        min = dist[node];
        curr = node;
      }
    }

    // No more reachable nodes
    if (curr === null) break;

    // Destination finalized (safe to stop)
    if (curr === end) break;

    visited.add(curr);

    for (const edge of graph[curr]) {
      // STRICT accessibility check
      if (accessibleOnly && edge.accessible === false) continue;

      const nd = dist[curr] + Number(edge.distance);

      if (nd < dist[edge.to]) {
        dist[edge.to] = nd;
        prev[edge.to] = curr;
      }
    }
  }

  // Reconstruct path
  if (dist[end] === Infinity) {
    return { path: [], distance: Infinity };
  }

  const path = [];
  let p = end;
  while (p !== null) {
    path.unshift(p);
    p = prev[p];
  }

  return { path, distance: dist[end] };
}

module.exports = dijkstra;
