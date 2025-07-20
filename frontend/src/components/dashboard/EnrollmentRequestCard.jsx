import useUserData from "./useUserData"; // Import custom hook
import PropTypes from "prop-types";

const EnrollmentRequestCard = ({ request, onApprove, onReject, onWithdraw }) => {
  const { userData } = useUserData();
  const role = userData.profile?.role;

  return (
    <li className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="font-semibold">{request.course.title}</h3>
      <p><strong>Student:</strong> {request.student.username}</p>
      <p><strong>Status:</strong> <span className={`${request.status === "pending" ? "text-yellow-600" : request.status === "approved" ? "text-green-600" : "text-red-600"}`}>{request.status}</span></p>
      <p><strong>Message:</strong> {request.message || "No message provided."}</p>

      {/* Actions based on role */}
      {request.status === "pending" && (
        <div className="mt-2">
          {/* Approve and Reject buttons for Instructor and Admin */}
          {(role === "instructor" || role === "admin") && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Reject
              </button>
            </>
          )}

          {/* Withdraw button for Student */}
          {role === "student" && (
            <button
              onClick={() => onWithdraw(request.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Withdraw Request
            </button>
          )}
        </div>
      )}
    </li>
  );
};

EnrollmentRequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    course: PropTypes.shape({
      title: PropTypes.string,
    }),
    student: PropTypes.shape({
      username: PropTypes.string,
    }),
    status: PropTypes.string.isRequired,
    message: PropTypes.string,
  }).isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onWithdraw: PropTypes.func,
};

export default EnrollmentRequestCard;