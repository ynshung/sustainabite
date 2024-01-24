import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrgProfile from "../../components/profile/OrgProfile";
import { toast } from "react-toastify";
import _ from "underscore";
import { FaAngleLeft } from "react-icons/fa6";
import {
  uploadFirestore,
  uploadProfileFiles,
} from "../../utils/firestore-upload";
import ScrollToTop from "../../utils/ScrollToTop";
import { useAdminContext } from "../../context/UseAdminContext";

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
              toast.success("Verification complete!");
              setLoading(false);
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
            <div className="flex justify-center mt-8">
              <a
                href={verification[id].proofOfOwnership}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary text-white"
              >
                View Proof of Ownership
              </a>
            </div>
            <OrgProfile
              email={verification[id].email}
              onChildData={setFormData}
              defaultObj={verification[id]}
              loading={loading}
              setLoading={setLoading}
              editProfile
            />
          </>
        )}
      </div>
    </>
  );
};

export default VerifyOrgs;
