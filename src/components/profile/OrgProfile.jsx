import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import MapDraggable from "../map/MapDraggable";
import { useEffect, useState } from "react";

function OrgProfile({ email, charity = false, onChildData }) {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = (d) => {
    setLoading(true);
    onChildData(d);
  };
  const [position, setPosition] = useState({
    lat: 5.354669283327304,
    lng: 100.3015388795525,
  });

  useEffect(() => {
    if (position) {
      console.log(position);
    }
  }, [position]);

  return (
    <>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            disabled
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Organization Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            required
            {...register("orgName")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">
              {charity ? "JPPM" : "SSM"} Number
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={charity ? "PPM-001-01-00000001" : "200201000001"}
            required
            {...register("orgNum")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            required
            {...register("fullName")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            placeholder="012-345 6789"
            className="input input-bordered w-full"
            required
            {...register("phoneNumber")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Full Address</span>
          </label>
          <textarea
            className="textarea h-24 textarea-bordered w-full"
            placeholder="Address"
            required
            {...register("address")}
          />
        </div>
        {!charity && (
          <div className="my-3">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <MapDraggable position={position} setPosition={setPosition} />
            <div className="label">
              <span className="label-text-alt">
                Drag marker to your vendor&apos;s location
              </span>
            </div>
            <div className="label">
              <span className="label-text">Latitude</span>
              <span className="label-text">Longitude</span>
            </div>
            <div className="join">
              <input
                type="number"
                className="input input-bordered w-full join-item"
                required
                {...register("latitude")}
                value={position.lat}
                onChange={(e) =>
                  setPosition({ ...position, lat: Number(e.target.value) })
                }
              />
              <input
                type="number"
                className="input input-bordered w-full join-item"
                required
                {...register("longitude")}
                value={position.lng}
                onChange={(e) =>
                  setPosition({ ...position, lng: Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        <div className="my-3">
          <label className="label">
            <span className="label-text">
              Proof of Ownership ({charity ? "JPPM" : "SSM"} Documents)
            </span>
          </label>
          <label className="form-control w-full join-item max-w-xs">
            <input
              type="file"
              className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
              accept="image/*,.pdf"
              required
              {...register("proofOfOwnership")}
            />
            <div className="label">
              <span className="label-text-alt">Accepts PDF and images</span>
              <span className="label-text-alt">10MB max</span>
            </div>
          </label>
        </div>

        {!loading ? (
          <button
            type="submit"
            className="btn btn-primary text-neutral-50 mx-auto text-lg px-8"
          >
            Submit
          </button>
        ) : (
          <progress className="progress w-56 mx-auto progress-primary" />
        )}
      </form>
    </>
  );
}

OrgProfile.propTypes = {
  email: PropTypes.string,
  charity: PropTypes.bool,
  onChildData: PropTypes.func,
};

export default OrgProfile;
