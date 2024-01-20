import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import MapDraggable from "../map/MapDraggable";
import { useEffect, useState } from "react";
import _ from "underscore";

function OrgProfile({
  email,
  defaultObj = {},
  charity = false,
  editProfile = false,
  loading = false,
  setLoading,
  onChildData,
}) {
  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: defaultObj,
  });
  const onSubmit = (d) => {
    setLoading(true);
    onChildData(d);
  };
  const [position, setPosition] = useState({
    lat: defaultObj.latitude || 5.35465899118135,
    lng: defaultObj.longitude || 100.30122756958009,
  });

  useEffect(() => {
    setValue("latitude", position.lat);
    setValue("longitude", position.lng);
  }, [position.lat, position.lng, setValue]);

  watch("avatar");

  return (
    <>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <div
            className={
              "avatar w-full mx-auto" +
              (!(
                (getValues("avatar") instanceof FileList &&
                  getValues("avatar").length >= 1) ||
                getValues("avatar") instanceof String
              ) && " placeholder")
            }
          >
            <div className="mx-auto bg-theme3-900 text-white rounded-full w-32">
              {getValues("avatar") instanceof FileList &&
              getValues("avatar").length >= 1 ? (
                <img
                  src={URL.createObjectURL(getValues("avatar")[0])}
                  className="mx-auto"
                />
              ) : _.isString(getValues("avatar")) ? (
                <img src={getValues("avatar")} className="mx-auto" />
              ) : (
                <span>Avatar</span>
              )}
            </div>
          </div>

          <label className="label">
            <span className="label-text">Organisation Image</span>
            <span className="label-text-alt">2MB max</span>
          </label>
          <label className="form-control w-full join-item max-w-xs">
            <input
              type="file"
              className="file-input file-input-bordered file-input-sm file-input-secondary w-full max-w-xs"
              accept="image/*"
              required={editProfile ? false : true}
              {...register("avatar")}
            />
          </label>
        </div>
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
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            required
            {...register("firstName")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            required
            {...register("lastName")}
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
            <MapDraggable
              position={position}
              setPosition={setPosition}
              locate={!editProfile}
              initalSetCurrLoc={!editProfile}
            />
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
                step="any"
                className="input input-bordered w-full join-item"
                required
                {...register("latitude")}
                onChange={(e) => {
                  setPosition({ ...position, lat: Number(e.target.value) });
                }}
              />
              <input
                type="number"
                step="any"
                className="input input-bordered w-full join-item"
                required
                {...register("longitude")}
                onChange={(e) => {
                  setPosition({ ...position, lng: Number(e.target.value) });
                }}
              />
            </div>
          </div>
        )}

        {!editProfile && (
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
                required={editProfile ? false : true}
                {...register("proofOfOwnership")}
              />
              <div className="label">
                <span className="label-text-alt">
                  Accepts single PDF and image
                </span>
                <span className="label-text-alt">10MB max</span>
              </div>
            </label>
          </div>
        )}

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
  defaultObj: PropTypes.object,
  charity: PropTypes.bool,
  onChildData: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  editProfile: PropTypes.bool,
};

export default OrgProfile;
