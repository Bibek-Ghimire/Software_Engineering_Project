import { useEffect, useState } from "react";
import { User } from "lucide-react";

const dummyStudents = [
  { id: 1, name: "Bibek Ghimire", email: "bibek@example.com", courses: 2 },
  { id: 2, name: "Sita Sharma", email: "sita@example.com", courses: 1 },
];

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // TODO: Fetch students from backend
    setStudents(dummyStudents);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <User className="w-6 h-6 mr-2 text-blue-500" /> Students
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Courses</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.courses}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-500 hover:underline">Message</button>
                  <button className="text-green-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
