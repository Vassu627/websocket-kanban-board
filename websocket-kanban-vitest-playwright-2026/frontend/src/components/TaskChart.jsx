import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function TaskChart({ tasks }) {
  const data = [
    {
      name: "To Do",
      value: tasks.filter((t) => t.column === "To Do").length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (t) => t.column === "In Progress"
      ).length,
    },
    {
      name: "Done",
      value: tasks.filter((t) => t.column === "Done").length,
    },
  ];

  return (
    <BarChart width={300} height={200} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" />
    </BarChart>
  );
}
