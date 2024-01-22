import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import _ from "underscore";

const VendorItem = ({
  defaultObj = {active: true},
  loading = false,
  setLoading,
  onChildData,
  editItem = false,
}) => {
  const { register, handleSubmit, getValues, watch } = useForm({
    defaultValues: defaultObj,
  });

  const onSubmit = (d) => {
    setLoading(true);
    onChildData(d);
  };

  watch("img");

  return (
    <>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <div className="bg-theme3-900 text-white">
            {getValues("img") instanceof FileList &&
            getValues("img").length >= 1 ? (
              <img
                src={URL.createObjectURL(getValues("img")[0])}
                className="object-cover w-full h-48"
              />
            ) : _.isString(getValues("img")) ? (
              <img
                src={getValues("img")}
                className="object-cover w-full h-48"
              />
            ) : (
              <div className="text-center py-4">Image Preview</div>
            )}
          </div>

          <label className="label">
            <span className="label-text">Item Image</span>
            <span className="label-text-alt">5MB max</span>
          </label>
          <label className="form-control w-full join-item max-w-xs">
            <input
              type="file"
              className="file-input file-input-bordered file-input-sm file-input-secondary w-full max-w-xs"
              accept="image/*"
              required={editItem ? false : true}
              {...register("img")}
            />
          </label>
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Item Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            required
            {...register("name")}
          />
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            type="text"
            className="textarea h-24 textarea-bordered w-full"
            required
            {...register("desc")}
          />
        </div>
        <div className="my-3 flex flex-row gap-4 justify-between flex-wrap">
          <div>
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <div className="join">
              <div className="btn btn-disabled join-item">
                <span className="text-gray-600">RM</span>
              </div>
              <input
                type="number"
                className="input input-bordered w-24 join-item"
                placeholder="2.50"
                step="0.01"
                min="1.00"
                required
                {...register("price")}
              />
            </div>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-20"
              placeholder="3"
              min="1"
              step="1"
              required
              {...register("qty")}
            />
          </div>
        </div>
        <div className="my-3">
          <label className="label">
            <span className="label-text">Active?</span>
          </label>

          <input
            type="checkbox"
            className="toggle toggle-primary"
            {...register("active")}
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
};

VendorItem.propTypes = {
  defaultObj: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onChildData: PropTypes.func,
  editItem: PropTypes.bool,
};

export default VendorItem;
