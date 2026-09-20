export const dailyDrills = [
  { topic: "Arrays", prompt: "Given an array of integers, return the length of the longest subarray with sum equal to k." },
  { topic: "Binary Search", prompt: "Implement binary search on the answer for allocating books so that the maximum pages assigned to a student is minimized." },
  { topic: "Linked List", prompt: "Detect and remove a cycle in a singly linked list. Explain Floyd's algorithm in one paragraph." },
  { topic: "Stacks", prompt: "Find the next greater element for every index in O(n) using a monotonic stack." },
  { topic: "Trees", prompt: "Compute the diameter of a binary tree and prove why two DFS/BFS passes (or a single DFS with heights) suffice." },
  { topic: "Graphs", prompt: "Write Dijkstra from scratch. State when it fails and what to use instead." },
  { topic: "DP", prompt: "Solve 0/1 knapsack, then convert the 2D table into a 1D rolling array." },
  { topic: "SQL", prompt: "Write a query that returns departments whose average salary is higher than the company average." },
  { topic: "OS", prompt: "Explain deadlock with the four Coffman conditions and one prevention strategy used in practice." },
  { topic: "System Design", prompt: "Sketch a URL shortener: API, storage, uniqueness, and how you would handle 10k writes/sec." }
];

export function getTodaysDrill() {
  const day = Math.floor(Date.now() / 86400000);
  return dailyDrills[day % dailyDrills.length];
}
