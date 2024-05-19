import React, { useState } from 'react';

interface Packages {
  amount: number;
  price: string;
  weekTurnaround: number;
}

export interface Props {
  service: {
    title: string;
    description: string;
    type: string;
    packages: Packages[];
  };
}

const PriceCard = ({ service }: Props) => {
  const [chosenPackage, setChosenPackage] = useState(service.packages[0]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAmount = parseInt(e.target.value);
    const selectedPackage = service.packages.find(
      (option) => option.amount === selectedAmount,
    );
    if (selectedPackage) {
      setChosenPackage(selectedPackage);
    }
  };

  return (
    <li className="box flow prose border border-gray-600">
      <h3 className="mt-zero">{service.title}</h3>
      <p>{service.description}</p>
      <div className="flex divide-x divide-gray-600 border border-gray-600 text-center justify-center">
        <div className="flex flex-col grow justify-between items-center p-2xs">
          <div className="flex justify-center items-center font-semibold">
            <select onChange={handleOptionChange} className="px-3xs">
              {service.packages.map((option) => (
                <option key={option.amount} value={option.amount}>
                  {option.amount}
                </option>
              ))}
            </select>
          </div>
          <p className="text-step-000 font-semibold mt-zero">
            {service.type}(s)
          </p>
        </div>
        <div className="flex flex-col justify-center items-center p-2xs">
          <div>
            <h4 className="mt-zero text-step-1 font-semibold">
              {
                service.packages.find(
                  (option) => option.amount === chosenPackage.amount,
                )?.weekTurnaround
              }
            </h4>
            <p className="text-step-000 font-semibold mt-zero">
              Week turnaround
            </p>
          </div>
        </div>
      </div>
      <h4 className="text-center font-semibold text-step-4">
        {
          service.packages.find(
            (option) => option.amount === chosenPackage.amount,
          )?.price
        }
      </h4>
    </li>
  );
};

export default PriceCard;
