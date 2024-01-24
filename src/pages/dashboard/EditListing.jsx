import { Link, useNavigate, useParams } from "react-router-dom";
import VendorItem from "../../components/VendorItem";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { newListing } from "../../utils/firestore-listing";
import { toast } from "react-toastify";
import ScrollToTop from "../../utils/ScrollToTop";
import { useUserContext } from "../../context/UseUserContext";
import PropTypes from "prop-types";
import { getSpecificListing } from "../../utils/firestore-vendor-listing";

const EditListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { authUser, loaded } = useUserContext();

  const { id } = useParams();

  let [listing, setListing] = useState(null);

  useEffect(() => {
    console.log(id);
    if (loaded) {
      console.log(id);
      if (!authUser || !id) {
        navigate("/dashboard/listing");
      } else {
        // Get doc from db firestore
        getSpecificListing(id)
          .then((res) => {
            setListing(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error(`Error getting listing: ${err}`);
            navigate("/dashboard/listing");
          });
      }
    }
  }, [navigate, loaded, authUser, id]);

  const editListing = (formData) => {
    newListing(authUser.uid, formData, id)
      .then(() => {
        toast.success("Listing edited successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error editing listing: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="m-8">
        <ScrollToTop />
        <div>
          <Link
            to="/dashboard/listing"
            className="flex flex-row items-center gap-2 cursor-pointer mb-6"
          >
            <FaChevronLeft className="inline" size={18} /> Go back to Listing
          </Link>
          <h1 className="font-bold text-xl">New Item</h1>
        </div>
        {listing ? (
          <VendorItem
            loading={loading}
            setLoading={setLoading}
            onChildData={(f) => editListing(f)}
            editItem={true}
            defaultObj={listing}
          />
        ) : (
          <div className="flex">
            <progress className="progress w-56 mx-auto progress-primary my-24" />
          </div>
        )}
      </div>
    </>
  );
};

EditListing.propTypes = {
  listingID: PropTypes.string,
};

export default EditListing;
