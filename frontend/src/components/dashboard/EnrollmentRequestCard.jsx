const EnrollmentRequestCard = ({ request, onApprove, onReject, onWithdraw }) => {
    return (
      <li className="border p-4 rounded-md shadow-sm">
        <h3 className="font-semibold">{request.course.title}</h3>
        <p><strong>Student:</strong> {request.student.username}</p>
        <p><strong>Status:</strong> <span className={`${request.status === "pending" ? "text-yellow-600" : request.status === "approved" ? "text-green-600" : "text-red-600"}`}>{request.status}</span></p>
        <p><strong>Message:</strong> {request.message || "No message provided."}</p>
        {request.status === "pending" && (
          <div className="mt-2">
            {onApprove && (
              <button
                onClick={() => onApprove(request.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
              >
                Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(request.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Reject
              </button>
            )}
            {onWithdraw && (
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
  
  export default EnrollmentRequestCard;