import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img
          className="h-12"
          src="https://www.pngall.com/wp-content/uploads/8/Driver-PNG-Images.png"
          alt="Driver"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.captain?.fullname?.firstname || "N/A"}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {props.ride?.captain?.vehicle?.plate || "N/A"}
          </h4>
          <p className="text-sm text-gray-600">
            {props.ride?.captain?.vehicle?.vehicleType || "N/A"}
          </p>
          <h1 className="text-lg font-semibold">{props.ride?.otp}</h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup?.address || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination?.address || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>

            <div>
              <h3 className="text-lg font-medium">
                {props.ride?.fare || "N/A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
