import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <li className="border p-4 rounded-md shadow-sm">
      <h3 className="font-semibold">{course.title}</h3>
      <p>{course.description}</p>
      <p className="text-sm text-gray-500">
        Category: {course.category ? course.category : "Uncategorized"}
      </p>
      <Link
        to={`/courses/${course.id}`}
        className="text-blue-500 hover:text-blue-700"
      >
        View Details
      </Link>
    </li>
  );
};

export default CourseCard;