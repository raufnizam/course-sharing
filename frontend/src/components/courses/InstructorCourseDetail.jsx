import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InstructorCourseDetail = ({ course, handleDeleteCourse, user }) => {
  const navigate = useNavigate();
  const isCourseOwner = user && user.username === course.instructor;

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this course?")) {
        await handleDeleteCourse();
        toast.success("Course deleted successfully!");
        navigate("/courses"); // Redirect to courses page after deletion
      }
    } catch (error) {
      toast.error("Error deleting course. Please try again.");
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Course Details (Instructor View)</h1>

      <button
        onClick={() => navigate("/courses")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-4"
      >
        Back to Course List
      </button>

      <div className="space-y-4">
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Instructor:</strong> {course.instructor}</p>
        <p><strong>Category:</strong> {course.category || "Uncategorized"}</p>
        <p><strong>Created At:</strong> {new Date(course.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(course.updated_at).toLocaleString()}</p>
      </div>

      {isCourseOwner && (
        <div className="mt-6">
          <button
            onClick={() => navigate(`/courses/${course.id}/add-lesson`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Lesson
          </button>

          <button
            onClick={() => navigate(`/courses/${course.id}/edit`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 ml-4"
          >
            Edit Course
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
          >
            Delete Course
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Lessons</h2>
        {course.lessons?.length === 0 ? (
          <p>No lessons added yet.</p>
        ) : (
          <div className="space-y-6">
            {course.lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <p className="text-gray-600">{lesson.description}</p>

                {lesson.videos?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Videos</h4>
                    {lesson.videos.map((video) => (
                      <div key={video.id} className="mt-2">
                        <p className="font-medium">{video.title}</p>
                        <video controls className="w-full mt-1">
                          <source src={video.video_file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                )}

                {lesson.pdfs?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">PDFs</h4>
                    {lesson.pdfs.map((pdf) => (
                      <div key={pdf.id} className="mt-2">
                        <p className="font-medium">{pdf.title}</p>
                        <a
                          href={pdf.pdf_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View PDF
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourseDetail;