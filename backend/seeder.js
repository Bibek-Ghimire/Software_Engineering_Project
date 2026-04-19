import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Resource from "./models/Resource.js";
import Group from "./models/Group.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

const seedData = async () => {
  try {
    // Create or find teacher
    let teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
      teacher = new User({
        name: "Dr. John Smith",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher",
        subject: "Python",
        department: "Computer Science",
        bio: "Expert in Python programming and web development",
        profilePicture: "",
        engagementScore: 4.8,
        coursesCreated: 5,
      });
      await teacher.save();
      console.log("Teacher created!");
    }

    // Create courses
    const coursesToCreate = [
      {
        title: "Python Programming Basics",
        description:
          "Learn Python from scratch. Cover fundamentals of Python programming language.",
        keywords: ["Python", "programming", "basics"],
        level: "Beginner",
        duration: "8 weeks",
        price: 49.99,
        teacher: teacher._id,
        enrollmentCount: 150,
        rating: 4.5,
      },
      {
        title: "Advanced Python for Data Science",
        description: "Master Python for data science and machine learning.",
        keywords: ["Python", "data science", "machine learning"],
        level: "Expert",
        duration: "10 weeks",
        price: 79.99,
        teacher: teacher._id,
        enrollmentCount: 80,
        rating: 4.7,
      },
      {
        title: "React.js Full Course",
        description:
          "Learn React from basics to advanced. Build interactive web applications.",
        keywords: ["React", "JavaScript", "web development"],
        level: "Intermediate",
        duration: "12 weeks",
        price: 59.99,
        teacher: teacher._id,
        enrollmentCount: 200,
        rating: 4.6,
      },
      {
        title: "React Hooks and State Management",
        description:
          "Deep dive into React hooks and state management patterns.",
        keywords: ["React", "hooks", "JavaScript"],
        level: "Expert",
        duration: "8 weeks",
        price: 69.99,
        teacher: teacher._id,
        enrollmentCount: 120,
        rating: 4.8,
      },
      {
        title: "Full Stack Web Development",
        description: "Learn full stack development with Python and JavaScript.",
        keywords: ["Python", "JavaScript", "React", "backend"],
        level: "Intermediate",
        duration: "16 weeks",
        price: 99.99,
        teacher: teacher._id,
        enrollmentCount: 180,
        rating: 4.9,
      },
    ];

    for (const courseData of coursesToCreate) {
      const exists = await Course.findOne({ title: courseData.title });
      if (!exists) {
        const course = new Course(courseData);
        await course.save();
        console.log(`Course created: ${course.title}`);
      }
    }

    // Create resources
    const resourcesToCreate = [
      {
        title: "Python Documentation Guide",
        description: "Complete guide to Python standard library.",
        keywords: ["Python", "documentation"],
        fileUrl: "/resources/python-guide.pdf",
        fileType: "PDF",
        teacher: teacher._id,
      },
      {
        title: "React Best Practices",
        description: "Best practices for writing React code.",
        keywords: ["React", "best practices", "JavaScript"],
        fileUrl: "/resources/react-best-practices.pdf",
        fileType: "PDF",
        teacher: teacher._id,
      },
      {
        title: "Python Code Examples Repository",
        description: "Repository of Python code examples and snippets.",
        keywords: ["Python", "code examples"],
        fileUrl: "/resources/python-examples.zip",
        fileType: "ZIP",
        teacher: teacher._id,
      },
    ];

    for (const resourceData of resourcesToCreate) {
      const exists = await Resource.findOne({ title: resourceData.title });
      if (!exists) {
        const resource = new Resource(resourceData);
        await resource.save();
        console.log(`Resource created: ${resource.title}`);
      }
    }

    // Create groups
    const groupsToCreate = [
      {
        name: "Python Learners Group",
        description:
          "Community for Python learners to share knowledge and projects.",
        keywords: ["Python", "learning", "community"],
        members: [],
      },
      {
        name: "React Developers Community",
        description: "Group for React and JavaScript developers.",
        keywords: ["React", "JavaScript", "development"],
        members: [],
      },
    ];

    for (const groupData of groupsToCreate) {
      const exists = await Group.findOne({ name: groupData.name });
      if (!exists) {
        const group = new Group(groupData);
        await group.save();
        console.log(`Group created: ${group.name}`);
      }
    }

    console.log("\n✅ All seed data created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
