import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrgProfile from "../../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { FaAngleLeft, FaCircleXmark, FaFileArrowDown } from "react-icons/fa6";
import {
  uploadFirestore,
  uploadProfileFiles,
} from "../../utils/firestore-upload";
import ScrollToTop from "../../utils/ScrollToTop";
import { useAdminContext } from "../../context/UseAdminContext";
import Swal from "sweetalert2";
import { rejectVendor } from "../../utils/firestore-vendors";

const VerifyOrgs = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const { verification } = useAdminContext();

  useEffect(() => {
    if (formData && !_.isEmpty(formData)) {
      let obj = {
        ...formData,
        approved: true,
      };

      uploadProfileFiles(obj, id)
        .then((res) => {
          uploadFirestore(res, id, "vendors", true)
            .then(() => {
              setTimeout(() => {
                toast.success("Verification complete!");
                setLoading(false);
                navigate("/admin");
              }, 1000);
            })
            .catch((err) => {
              toast.error(err.message);
              console.log("Error while updating data: " + err.message);
            });
        })
        .catch((err) => {
          toast.error(err.message);
          console.log("Error while uploading file: " + err.message);
        });
    }
  }, [formData, navigate, id, verification]);

  const rejectOrg = () => {
    // Ask for reason in textarea
    Swal.fire({
      title: "Reason for rejection",
      input: "textarea",
      inputPlaceholder: "Enter reason here...",
      inputAttributes: {
        "aria-label": "Enter reason here",
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        if (reason) {
          rejectVendor(id, reason).then(() => {
            toast.success("Submitted!");
            navigate("/admin");
          });
        } else {
          Swal.showValidationMessage("Please enter a reason!");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <>
      <ScrollToTop />
      <div className="m-6">
        <div className="flex flex-row gap-3 items-center">
          <Link to="/admin">
            <FaAngleLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-xl">Verify Organizations</h1>
            <p className="text-neutral-600">
              Make sure all information is correct, edit if necessary.
            </p>
          </div>
        </div>

        {loading && !verification && (
          <div className="flex justify-center">
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          </div>
        )}

        {verification && (
          <>
            <OrgProfile
              email={verification[id].email}
              onChildData={setFormData}
              defaultObj={verification[id]}
              loading={loading}
              setLoading={setLoading}
              editProfile
            >
              <div className="flex flex-col gap-2 items-center justify-center my-4">
                <a
                  href={verification[id].proofOfOwnership}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-outline"
                >
                  <FaFileArrowDown />
                  View Proof of Ownership
                </a>
                <button
                  type="button"
                  onClick={() => rejectOrg()}
                  className="btn btn-warning"
                >
                  <FaCircleXmark />
                  Reject Application
                </button>
              </div>
            </OrgProfile>
          </>
        )}
      </div>
    </>
  );
};

export default VerifyOrgs;
