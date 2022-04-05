export default function handler(req, res) {
  res
    .status(200)
    .json({ priorityList: { 1: "  Trivial", 2: "Regular", 3: "Urgent" } });
}
