import { Link, useNavigate } from "react-router-dom";
import VendorItem from "../../components/VendorItem";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { newListing } from "../../utils/firestore-listing";
import { toast } from "react-toastify";
import ScrollToTop from "../../utils/ScrollToTop";
import { useUserContext } from "../../context/UseUserContext";

const NewListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { authUser, loaded } = useUserContext();

  useEffect(() => {
    if (loaded && !authUser) {
      navigate("/dashboard", { reload: true });
    }
  }, [navigate, loaded, authUser]);

  const createNewListing = (formData) => {
    newListing(authUser.uid, formData, false)
      .then(() => {
        toast.success("New listing created!");
        navigate("/dashboard/listing");
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error creating new listing: ${error}`);
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
        <VendorItem
          loading={loading}
          setLoading={setLoading}
          onChildData={(f) => createNewListing(f)}
          editItem={false}
        />
      </div>
    </>
  );
};

export default NewListing;
