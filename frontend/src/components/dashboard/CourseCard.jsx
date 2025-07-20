import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

export default CourseCard;