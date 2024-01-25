import { Link, useNavigate } from "react-router-dom";
import { useAdminContext } from "../../context/UseAdminContext";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { verification, reports, loaded, error } = useAdminContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error === "Not authorized.") navigate("/login");
    }
  })

  return (
    <>
      <div className="m-8">
        <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
        <hr className="mt-2 mb-4" />
        {loaded && verification && reports ? (
          <div>
            <h2 className="text-xl font-bold">Vendor Verification</h2>
            {Object.keys(verification).length === 0 ? (
              <>
                <p>No new vendor verification</p>
                <br />
              </>
            ) : (
              Object.keys(verification).map((id) => {
                const { email, orgName, firstName, phoneNumber, avatar } =
                  verification[id];
                return (
                  <div key={id} className="card bg-base-100 shadow-md mb-8">
                    <div className="card-body pb-4">
                      <div className="flex flex-row items-center gap-4">
                        <div className="avatar w-16">
                          <img src={avatar} className="mx-auto" />
                        </div>
                        <div>
                          <h2 className="card-title">{orgName}</h2>
                          <a
                            href={`mailto:${email}`}
                            className="hover:underline"
                          >
                            {email}
                          </a>
                          <p>
                            {firstName} ({phoneNumber})
                          </p>
                        </div>
                      </div>
                      <div className="card-actions justify-end">
                        <Link
                          to={`verify/${id}`}
                          className="btn btn-sm btn-primary text-white"
                        >
                          Verify
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <h2 className="text-xl font-bold">Users/Vendors Reports</h2>
            {Object.keys(reports).length === 0 ? (
              <p>No new reports</p>
            ) : (
              Object.keys(reports).map((id) => {
                const {
                  comments,
                  createdAt,
                  listing,
                  reason,
                  reasonByType,
                  user,
                  vendor,
                } = reports[id];
                return (
                  <div key={id} className="card bg-base-100 shadow-lg mb-4">
                    <div className="card-body">
                      <div className="">
                        <div>
                          {reasonByType === "user" ? (
                            <>
                              <div>
                                Complainant: User{" "}
                                <code>
                                  {user.substring(0, 6).toUpperCase()}
                                </code>
                              </div>
                              <div>
                                Reported vendor:{" "}
                                <code>
                                  {vendor.substring(0, 6).toUpperCase()}
                                </code>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                Complainant: Vendor{" "}
                                <code>
                                  {vendor.substring(0, 6).toUpperCase()}
                                </code>
                              </div>
                              <div>
                                Reported user:{" "}
                                <code>
                                  {user.substring(0, 6).toUpperCase()}
                                </code>
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          Reported listing:{" "}
                          <code>{listing.substring(0, 6).toUpperCase()}</code>
                        </div>
                        <hr className="my-2" />
                        <div>
                          Reserved at{" "}
                          {format(createdAt.toDate(), "dd/MM/yyyy h:mm:ssa")}
                        </div>
                        <div>
                          Reason: <span>{reason}</span>
                        </div>
                        <div>
                          Comments: <span>{comments}</span>
                        </div>
                      </div>
                      <div className="card-actions justify-end">
                        <div
                          className="btn btn-sm btn-primary text-white"
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You are dismissing the reports.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, dismiss it!",
                              cancelButtonText: "No, cancel!",
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                updateDoc(doc(db, "reservations", id), {
                                  reported: false,
                                });
                              }
                            });
                          }}
                        >
                          Dismiss
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex justify-center my-8">
            <progress className="progress w-56 mx-auto progress-primary" />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
