import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

function UserProfile({
  email,
  defaultObj = {},
  loading = false,
  setLoading,
  onChildData,
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: defaultObj,
  });
  const onSubmit = (d) => {
    setLoading(true);
    onChildData(d);
  };
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
            placeholder="012-3456789"
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
  defaultObj: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default UserProfile;
