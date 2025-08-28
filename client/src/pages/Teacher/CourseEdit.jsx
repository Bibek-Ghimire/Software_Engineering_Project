import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    duration: "",
    price: "",
  });

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.teacher._id !== user._id) {
        alert("You are not authorized to edit this course");
        navigate("/courses");
        return;
      }

      setFormData({
        title: res.data.title,
        description: res.data.description,
        level: res.data.level,
        duration: res.data.duration,
        price: res.data.price,
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching course");
      navigate("/courses");
    }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course updated successfully!");
      navigate(`/courses/view/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error updating course");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Edit Course</h1>
      <div className="grid grid-cols-1 gap-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
        <select name="level" value={formData.level} onChange={handleChange} className="input">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="input" />
        <input name="price" type="number" placeholder="Price $" value={formData.price} onChange={handleChange} className="input" />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
          Update Course
        </button>
        <button onClick={() => navigate(`/courses/view/${id}`)} className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CourseEdit;
