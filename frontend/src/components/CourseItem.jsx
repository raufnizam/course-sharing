import { Link } from "react-router-dom";

const CourseItem = ({ course }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{course.title}</h2>
      <p className="text-gray-600">{course.description}</p>
      <p className="text-sm text-gray-500">
        Instructor: {course.instructor || "Unknown Instructor"}
      </p>
      <p className="text-sm text-gray-500">
        Category: {course.category ? course.category.name : "Uncategorized"}
      </p>
      <div className="flex items-center justify-between mt-2">
        <Link
          to={`/courses/${course.id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseItem;