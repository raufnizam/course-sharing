import { Link } from "react-router-dom";

const CourseItem = ({ course }) => {
  return (
  
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* {console.log(course)} */}
      <h2 className="text-xl font-semibold">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        <strong>Instructor:</strong> {course.instructor || "Unknown Instructor"}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        <strong>Category:</strong> {course.category || "Uncategorized"}
      </p>
      <div className="flex items-center justify-between mt-4">
        <Link
          to={`/courses/${course.id}`}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseItem;