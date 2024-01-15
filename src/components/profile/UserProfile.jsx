import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useState } from "react";

function UserProfile({ email, onChildData }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (d) => {
    setLoading(true);
    onChildData(d);
  };
  const [loading, setLoading] = useState(false);

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

UserProfile.propTypes = {
  email: PropTypes.string,
  onChildData: PropTypes.func,
};

export default UserProfile;
