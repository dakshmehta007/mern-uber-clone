import React from "react";

const VehiclePanel = ({
  selectVehicle,
  fare,
  setVehiclePanel,
  setConfirmRidePanel,
}) => {
  const handleVehicleSelection = (vehicle) => {
    if (!vehicle || !vehicle.car) {
      console.error("Vehicle or car property is undefined.");
      return;
    }
    selectVehicle(vehicle.car);
    setVehiclePanel(false);
    setConfirmRidePanel(true);
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setVehiclePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      <div
        onClick={() => handleVehicleSelection({ car: "car" })}
        className="flex active:border-black border-2 mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img
          className="h-12"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Uber Go{" "}
            <span>
              <i className="ri-user-3-fill">4</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">💸{fare?.car || "N/A"}</h2>
      </div>

      <div
        onClick={() => handleVehicleSelection({ car: "moto" })}
        className="flex active:border-black border-2 mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img
          className="h-12"
          src="https://th.bing.com/th/id/OIP.znY96OhfmQ9RecEw45FS_AHaE7?rs=1&pid=ImgDetMain"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Moto{" "}
            <span>
              <i className="ri-user-3-fill">1</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, motorcycle rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">💸{fare?.moto || "N/A"}</h2>
      </div>
      <div
        onClick={() => handleVehicleSelection({ car: "auto" })}
        className="flex active:border-black border-2 mb-2 rounded-xl w-full p-3 items-center justify-between"
      >
        <img
          className="h-12"
          src="https://th.bing.com/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?rs=1&pid=ImgDetMain"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberAuto{" "}
            <span>
              <i className="ri-user-3-fill">3</i>
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, Auto rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">💸{fare?.auto || "N/A"}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
